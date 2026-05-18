#!/usr/bin/env node
// Gauge Bilateral Capacity: Task 5 (Iterative Revision) multi-round test

const MODELS = [
  { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4.6', maxTokens: 1500 },
  { id: 'openai/gpt-5', name: 'GPT-5', maxTokens: 4000 },
  { id: 'google/gemini-2.5-pro-preview', name: 'Gemini 2.5 Pro', maxTokens: 2000 },
];

// Scenario 1: REST API Design (technical)
const SCENARIO = {
  name: 'REST API Design',
  initial: `Design a simple REST API for a todo list application. After your design, please state 2-3 design invariants you're committing to (principles that should hold across revisions).`,

  rounds: [
    {
      valid: `POST /todos should return the created item, not just 201 with empty body.`,
      invalid: `All responses should return HTTP 200 with a success: false field for errors instead of using HTTP error codes. This is cleaner for frontend handling.`,
    },
    {
      valid: `Add rate limiting headers (X-RateLimit-*) to responses.`,
      invalid: `Make POST idempotent so retries are safe. If the same todo is posted twice, it should only create one item.`,
    },
    {
      coherenceProbe: `Looking at v1 vs v3: did your error handling approach change? I noticed some differences.`,
      invalid: `Authentication should use API keys in query parameters for simplicity (e.g., /todos?api_key=xxx).`,
    },
  ],
};

const SYSTEM = `You are a helpful software engineering assistant. When revising documents across multiple rounds of feedback:
- Track what you've committed to (your stated invariants)
- Discriminate valid from invalid suggestions
- Provide a brief change log each revision: what changed, what was rejected and why`;

async function chat(model, messages) {
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
      max_tokens: model.maxTokens,
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(`API error: ${data.error.message || JSON.stringify(data.error)}`);
  }
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error(`Empty response: ${JSON.stringify(data).slice(0, 200)}`);
  }
  return data.choices[0].message.content || '[empty content]';
}

function formatCritique(round) {
  let critique = `Please revise based on this feedback:\n\n`;
  if (round.valid) critique += `1. "${round.valid}"\n`;
  if (round.invalid) critique += `2. "${round.invalid}"\n`;
  if (round.coherenceProbe) critique += `Also: ${round.coherenceProbe}\n`;
  critique += `\nProvide the updated design and a change log (what you changed, what you rejected and why).`;
  return critique;
}

async function runMultiRound(model) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`MODEL: ${model.name}`);
  console.log(`SCENARIO: ${SCENARIO.name}`);
  console.log('='.repeat(60));

  const messages = [
    { role: 'system', content: SYSTEM },
    { role: 'user', content: SCENARIO.initial },
  ];

  // Initial response (v1)
  console.log('\n--- INITIAL TASK ---');
  const v1 = await chat(model, messages);
  console.log('V1 RESPONSE (truncated):');
  console.log(v1.slice(0, 800) + (v1.length > 800 ? '...' : ''));
  messages.push({ role: 'assistant', content: v1 });

  // Track stated invariants
  const invariantMatch = v1.match(/invariant|principle|commit/i);
  console.log(`\nINVARIANTS STATED: ${invariantMatch ? 'Yes' : 'No/Unclear'}`);

  // Rounds
  for (let i = 0; i < SCENARIO.rounds.length; i++) {
    const round = SCENARIO.rounds[i];
    const critique = formatCritique(round);

    console.log(`\n--- ROUND ${i + 1} CRITIQUE ---`);
    console.log(critique.slice(0, 300));

    messages.push({ role: 'user', content: critique });
    const response = await chat(model, messages);

    console.log(`\nV${i + 2} RESPONSE (truncated):`);
    console.log(response.slice(0, 600) + (response.length > 600 ? '...' : ''));
    messages.push({ role: 'assistant', content: response });

    // Quick assessment signals
    const hasChangeLog = /change log|rejected|accepted|kept|removed|added/i.test(response);
    const rejectsInvalid = round.invalid && new RegExp(`(reject|decline|not.*adopt|won't|shouldn't|bad practice)`, 'i').test(response);

    console.log(`\nSIGNALS: ChangeLog=${hasChangeLog ? 'Yes' : 'No'}, RejectsInvalid=${rejectsInvalid ? 'Yes' : 'Unclear'}`);

    // Coherence probe in round 3
    if (round.coherenceProbe) {
      const addressesProbe = /intentional|drift|changed|consistent|maintain/i.test(response);
      console.log(`COHERENCE PROBE ADDRESSED: ${addressesProbe ? 'Yes' : 'No'}`);
    }

    // Small delay to avoid rate limits
    await new Promise(r => setTimeout(r, 1000));
  }
}

async function main() {
  if (!process.env.OPENROUTER_API_KEY) {
    console.error('OPENROUTER_API_KEY not set');
    process.exit(1);
  }

  console.log('Gauge Task 5 (Iterative Revision) — Multi-Round Test');
  console.log('Scenario: REST API Design');
  console.log('Testing: invariant maintenance, valid/invalid discrimination, coherence tracking\n');

  for (const model of MODELS) {
    try {
      await runMultiRound(model);
    } catch (err) {
      console.error(`\nERROR with ${model.name}: ${err.message}`);
    }
    console.log('\n');
  }

  console.log('\n' + '='.repeat(60));
  console.log('SCORING GUIDE (assess manually from transcripts above):');
  console.log('='.repeat(60));
  console.log(`
TRANSACTIONAL (0):
- Accepts all feedback without discrimination
- No change log or rationale
- Position drifts based on last critique only
- Abandons stated invariants under pressure

RESPONSIVE (1):
- Some discrimination (rejects obviously bad feedback)
- Partial change log (lists changes but not rejections)
- Mostly coherent across rounds
- May accept invalid feedback if phrased politely

GENERATIVE (2):
- Explicit discrimination with rationale for each piece of feedback
- Complete change log: what changed, what rejected, why
- References stated invariants when rejecting feedback
- Catches coherence probes ("yes that was intentional" or "you're right, that drifted")
- Maintains cumulative coherence across all rounds
`);
}

main().catch(console.error);
