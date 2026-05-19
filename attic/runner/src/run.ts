import OpenAI from "openai";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TASKS_PATH = join(__dirname, "..", "tasks.yaml");
const RESULTS_DIR = join(__dirname, "..", "..", "results", "pilot-v0.2");

const RUNS_PER_TASK = 3;
const RETRY_DELAY_MS = 30_000;
const MAX_ATTEMPTS = 2;
const PARALLEL_RUNS = true;
const MAX_CONCURRENT_REQUESTS = 5;

interface Model {
  id: string;
  openrouter_model: string;
}

interface Task {
  id: string;
  name: string;
  prompt: string;
  system?: string;
}

interface Dimension {
  methodology: string;
  tasks: Task[];
  note?: string;
}

interface TasksConfig {
  models: Model[];
  dimensions: Record<string, Dimension>;
}

interface RunResult {
  task_id: string;
  model_id: string;
  run: number;
  timestamp: string;
  status: "ok" | "error";
  response?: string;
  error?: string;
  duration_ms: number;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    cost_usd?: number;
  };
}

interface DimensionResults {
  dimension: string;
  methodology: string;
  runs: RunResult[];
  total_cost_usd: number;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runWithConcurrencyLimit<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  limit: number
): Promise<R[]> {
  const results: (R | undefined)[] = new Array(items.length);
  let index = 0;

  async function worker(): Promise<void> {
    while (index < items.length) {
      const currentIndex = index++;
      results[currentIndex] = await fn(items[currentIndex]);
    }
  }

  const workers = Array(Math.min(limit, items.length))
    .fill(null)
    .map(() => worker());

  await Promise.all(workers);
  return results as R[];
}

async function dispatch(
  client: OpenAI,
  model: Model,
  task: Task
): Promise<{ response: string; usage?: RunResult["usage"] }> {
  const messages: Array<{ role: "system" | "user"; content: string }> = [];
  if (task.system) messages.push({ role: "system", content: task.system });
  messages.push({ role: "user", content: task.prompt });

  const response = (await client.chat.completions.create({
    model: model.openrouter_model,
    messages,
    max_tokens: 4096,
  } as any)) as any;

  const choice = response?.choices?.[0];
  if (!choice) throw new Error("No choices in response");

  const content = choice.message?.content ?? "";
  let usage: RunResult["usage"] | undefined;
  if (response?.usage) {
    usage = {
      prompt_tokens: response.usage.prompt_tokens ?? 0,
      completion_tokens: response.usage.completion_tokens ?? 0,
      total_tokens: response.usage.total_tokens ?? 0,
    };
    if (typeof (response.usage as any).cost === "number") {
      usage.cost_usd = (response.usage as any).cost;
    }
  }

  return { response: content, usage };
}

async function runTask(
  client: OpenAI,
  model: Model,
  task: Task,
  runNum: number
): Promise<RunResult> {
  const start = Date.now();
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const result = await dispatch(client, model, task);
      return {
        task_id: task.id,
        model_id: model.id,
        run: runNum,
        timestamp: new Date().toISOString(),
        status: "ok",
        response: result.response,
        duration_ms: Date.now() - start,
        usage: result.usage,
      };
    } catch (err) {
      lastError = err;
      const anyErr = err as any;
      const status = anyErr?.status ?? anyErr?.response?.status;
      if (
        attempt < MAX_ATTEMPTS - 1 &&
        (status === 429 || (status && status >= 500))
      ) {
        console.log(`  Retry in ${RETRY_DELAY_MS / 1000}s...`);
        await sleep(RETRY_DELAY_MS);
        continue;
      }
      break;
    }
  }

  return {
    task_id: task.id,
    model_id: model.id,
    run: runNum,
    timestamp: new Date().toISOString(),
    status: "error",
    error: lastError instanceof Error ? lastError.message : String(lastError),
    duration_ms: Date.now() - start,
  };
}

interface RunJob {
  task: Task;
  model: Model;
  run: number;
}

async function runDimension(
  client: OpenAI,
  models: Model[],
  dimensionName: string,
  dimension: Dimension
): Promise<DimensionResults> {
  if (dimension.tasks.length === 0) {
    console.log(`  Skipping ${dimensionName} (no tasks defined)`);
    return {
      dimension: dimensionName,
      methodology: dimension.methodology,
      runs: [],
      total_cost_usd: 0,
    };
  }

  const jobs: RunJob[] = [];
  for (const task of dimension.tasks) {
    for (const model of models) {
      for (let run = 1; run <= RUNS_PER_TASK; run++) {
        jobs.push({ task, model, run });
      }
    }
  }

  const totalJobs = jobs.length;
  let completed = 0;

  const executeJob = async (job: RunJob): Promise<RunResult> => {
    const result = await runTask(client, job.model, job.task, job.run);
    completed++;
    const progress = `[${completed}/${totalJobs}]`;
    console.log(
      `  ${progress} ${job.task.id} | ${job.model.id} | run ${job.run} → ${result.status} (${result.duration_ms}ms)` +
        (result.usage?.cost_usd ? ` $${result.usage.cost_usd.toFixed(4)}` : "")
    );
    return result;
  };

  let results: RunResult[];
  if (PARALLEL_RUNS) {
    console.log(`  Running ${totalJobs} jobs with concurrency ${MAX_CONCURRENT_REQUESTS}`);
    results = await runWithConcurrencyLimit(jobs, executeJob, MAX_CONCURRENT_REQUESTS);
  } else {
    results = [];
    for (const job of jobs) {
      results.push(await executeJob(job));
    }
  }

  const totalCost = results.reduce((sum, r) => sum + (r.usage?.cost_usd ?? 0), 0);

  return {
    dimension: dimensionName,
    methodology: dimension.methodology,
    runs: results,
    total_cost_usd: totalCost,
  };
}

async function main() {
  if (!process.env.OPENROUTER_API_KEY) {
    console.error("OPENROUTER_API_KEY env var required");
    process.exit(1);
  }

  const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  const tasksYaml = readFileSync(TASKS_PATH, "utf-8");
  const config = parseYaml(tasksYaml) as TasksConfig;

  if (!existsSync(RESULTS_DIR)) {
    mkdirSync(RESULTS_DIR, { recursive: true });
  }

  const dimensionFilter = process.argv[2];
  const dimensions = dimensionFilter
    ? { [dimensionFilter]: config.dimensions[dimensionFilter] }
    : config.dimensions;

  if (dimensionFilter && !config.dimensions[dimensionFilter]) {
    console.error(`Unknown dimension: ${dimensionFilter}`);
    console.error(`Available: ${Object.keys(config.dimensions).join(", ")}`);
    process.exit(1);
  }

  let grandTotalCost = 0;

  for (const [name, dimension] of Object.entries(dimensions)) {
    if (!dimension) continue;
    console.log(`\n=== ${name} ===`);
    const results = await runDimension(client, config.models, name, dimension);
    grandTotalCost += results.total_cost_usd;

    const outPath = join(RESULTS_DIR, `${name}.yaml`);
    writeFileSync(outPath, stringifyYaml(results));
    console.log(`  Saved: ${outPath}`);
    console.log(`  Dimension cost: $${results.total_cost_usd.toFixed(4)}`);
  }

  console.log(`\n=== COMPLETE ===`);
  console.log(`Total cost: $${grandTotalCost.toFixed(4)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
