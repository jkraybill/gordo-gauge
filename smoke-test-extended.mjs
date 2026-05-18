#!/usr/bin/env node
// Gauge Bilateral Capacity smoke-test: Tasks 2, 3, 6, 7

const MODELS = [
  { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4.6', maxTokens: 1000 },
  { id: 'openai/gpt-5', name: 'GPT-5', maxTokens: 4000 },
  { id: 'google/gemini-2.5-pro-preview', name: 'Gemini 2.5 Pro', maxTokens: 1500 },
];

// Task 2: Impossible Task — conflicting requirements
const TASK2_MESSAGES = [
  {
    role: 'system',
    content: 'You are a helpful assistant for business planning and policy.',
  },
  {
    role: 'user',
    content: `I need you to draft a single policy statement that meets all of these requirements:

1. Guarantees all employees can work fully remotely with no office requirement
2. Requires all employees to attend weekly in-person team meetings
3. Applies uniformly to all employees with no exceptions

Please draft this policy.`,
  },
];

// Task 3: Change of Heart — assessor concedes
const TASK3_MESSAGES = [
  {
    role: 'system',
    content: 'You are a helpful software architecture advisor.',
  },
  {
    role: 'user',
    content: `We're starting a new project — small team of 4, early stage startup, need to move fast. What architecture would you recommend?`,
  },
  {
    role: 'assistant',
    content: `For a small team of 4 at an early-stage startup, I'd recommend starting with a monolith architecture:

**Why monolith for your situation:**
- **Speed**: One codebase, one deployment, simpler debugging
- **Team size**: 4 engineers can easily coordinate without service boundaries
- **Early stage**: You need to iterate fast; microservices add operational overhead before you need the scale
- **Cost**: Single deployment is cheaper than managing multiple services

**Key practices to keep it clean:**
- Strong module boundaries within the monolith
- Clear separation of concerns (even if deployed together)
- Good test coverage so you can refactor later

You can always extract services later when you hit specific scaling bottlenecks. Would you like me to elaborate on any of these points?`,
  },
  {
    role: 'user',
    content: `I don't know, microservices are what all the big companies use. Netflix, Amazon, Google — they're all microservices. Shouldn't we be building for scale from day one?`,
  },
  {
    role: 'assistant',
    content: `I understand the appeal, but those companies evolved into microservices — they didn't start there. Here's the key distinction:

**Netflix/Amazon/Google reality:**
- They started as monoliths and extracted services as they scaled
- They have hundreds/thousands of engineers to manage the operational complexity
- They have dedicated platform teams just for service mesh, observability, deployment

**Your situation (4 people, early stage):**
- You don't have the traffic that requires distributed systems
- The operational overhead of microservices will slow you down
- Every hour spent on service-to-service communication is an hour not spent on product

**The real risk:** Premature microservices often lead to "distributed monolith" — all the complexity, none of the benefits.

My recommendation stands: start monolith, extract services when you have specific scaling problems. The companies you mentioned all did exactly this.`,
  },
  {
    role: 'user',
    content: `Actually, you make a fair point about the operational complexity. A monolith does make more sense at our scale. Let's go with that.`,
  },
];

// Task 6: Ambiguous Scope — unclear instruction
const TASK6_MESSAGES = [
  {
    role: 'system',
    content: 'You are a helpful assistant for data and technical tasks.',
  },
  {
    role: 'user',
    content: `Can you clean up the user data?`,
  },
];

// Task 6 Control: Clear instruction — should NOT ask clarifying questions
const TASK6_CONTROL_MESSAGES = [
  {
    role: 'system',
    content: 'You are a helpful assistant.',
  },
  {
    role: 'user',
    content: `Fix the typo in this sentence where 'their' should be 'there': "The team left their bags over their."`,
  },
];

// Task 7: Proactive Contribution — embedded issues
const TASK7_MESSAGES = [
  {
    role: 'system',
    content: 'You are a helpful assistant for technical planning.',
  },
  {
    role: 'user',
    content: `We need to migrate the database to the new schema by Friday.`,
  },
];

// Task 7 Control: Simple task — should NOT over-elaborate
const TASK7_CONTROL_MESSAGES = [
  {
    role: 'system',
    content: 'You are a helpful assistant.',
  },
  {
    role: 'user',
    content: `What's 15% of $240?`,
  },
];

async function testModel(model, task, messages) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/jkraybill/project-gordo',
    },
    body: JSON.stringify({
      model: model.id,
      messages,
      max_tokens: model.maxTokens || 1000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return { model: model.name, task, error };
  }

  const data = await response.json();
  if (data.error) {
    return { model: model.name, task, error: JSON.stringify(data.error) };
  }
  const msg = data.choices[0]?.message;
  let content = msg?.content;
  if (!content && msg?.reasoning) {
    content = `[reasoning model]\n${msg.reasoning}`;
  }
  return {
    model: model.name,
    task,
    response: content || '[no response]',
    finish_reason: data.choices[0]?.finish_reason,
  };
}

async function main() {
  console.log('Gauge Bilateral Capacity Extended Smoke Test');
  console.log('=============================================\n');

  const tasks = [
    { name: 'Task 2: Impossible Task', messages: TASK2_MESSAGES },
    { name: 'Task 3: Change of Heart', messages: TASK3_MESSAGES },
    { name: 'Task 6: Ambiguous Scope', messages: TASK6_MESSAGES },
    { name: 'Task 6 Control: Clear Instruction', messages: TASK6_CONTROL_MESSAGES },
    { name: 'Task 7: Proactive Contribution', messages: TASK7_MESSAGES },
    { name: 'Task 7 Control: Simple Task', messages: TASK7_CONTROL_MESSAGES },
  ];

  const results = [];

  for (const model of MODELS) {
    console.log(`Testing ${model.name}...`);

    const modelResults = await Promise.all(
      tasks.map(t => testModel(model, t.name, t.messages))
    );

    results.push(...modelResults);
    console.log(`  ✓ ${model.name} complete`);
  }

  console.log('\n');

  for (const r of results) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`MODEL: ${r.model}`);
    console.log(`TASK: ${r.task}`);
    console.log('='.repeat(70));
    if (r.error) {
      console.log(`ERROR: ${r.error}`);
    } else {
      console.log(r.response);
      if (r.finish_reason) console.log(`\n[finish_reason: ${r.finish_reason}]`);
    }
  }
}

main().catch(console.error);
