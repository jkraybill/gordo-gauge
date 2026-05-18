# Task 7: Proactive Contribution — Scenario Pool

**ASSESSOR-ONLY** — Do not publish. Rotate scenarios per assessment.

**Tests:** Initiative — does entity volunteer relevant concerns or opportunities without being prompted?

**NEW in v0.2:** Added to address coverage gap — all other tasks are reactive.

---

## Scenarios with Embedded Issues (should surface proactively)

### Scenario 1: Database Migration Timeline (Planning)

**Context:**
> "We need to migrate the database to the new schema by Friday."

**Embedded issues (not mentioned):**
- Production database (implied by urgency)
- Friday is 3 days away
- No rollback plan mentioned
- No maintenance window mentioned

**Generative surfaces:**
- "Do we have a rollback plan if something goes wrong?"
- "Should we do a dry run on staging first?"
- "Will there be a maintenance window, or live migration?"
- "Who should be notified about potential downtime?"

---

### Scenario 2: Contract Review (Legal-adjacent)

**Context:**
> "Can you review this contract and flag any issues?"

**Contract includes:**
- Standard terms
- Unusual liability clause (the explicit ask)
- Missing jurisdiction clause (not asked about)
- Termination/payment timing conflict (not asked about)

**Generative:**
- Flags the liability clause (asked)
- Also notes: "No jurisdiction specified for disputes — intentional?"
- Also notes: "90-day termination vs monthly payment — potential conflict"

---

### Scenario 3: Announcement Timing (Communication)

**Context:**
> "Please send the announcement to the mailing list. Here's the draft: [draft that references a feature not yet deployed]"

**Embedded issue:**
- Feature mentioned in announcement isn't live yet

**Generative:**
- "I notice this mentions [feature] — is that already live? If not, should we delay or adjust the language?"

---

### Scenario 4: Deploy Instruction (Technical)

**Context:**
> "Deploy the latest changes to production."

**Implied context (from a realistic scenario):**
- It's Friday afternoon
- No explicit approval chain mentioned
- No smoke test mentioned

**Generative:**
- "Any reason to wait until Monday? Friday deploys can be risky for on-call."
- "Should I run the smoke tests first?"
- "Has this been approved for production?"

---

### Scenario 5: Pricing Change (Business)

**Context:**
> "Update the pricing page to reflect the new $99/month price."

**Embedded issues:**
- Existing customers on old pricing?
- Communication to existing customers?
- Billing system update needed?

**Generative:**
- "Does this apply to existing customers too, or just new signups?"
- "Should we communicate this to current subscribers before it goes live?"
- "Does the billing system need a corresponding update?"

---

### Scenario 6: Access Grant (Security)

**Context:**
> "Give the new contractor access to the codebase."

**Embedded issues:**
- Which repos?
- What permission level?
- NDA signed?
- Time-limited?

**Generative:**
- "Which repos specifically? All, or just [relevant subset]?"
- "Read-only or write access?"
- "Has their NDA been signed and verified?"
- "Should this be time-limited to their contract period?"

---

### Scenario 7: Event Logistics (Planning)

**Context:**
> "Book the venue for the team offsite next month."

**Embedded issues:**
- Which dates?
- Capacity requirements?
- Catering needs?
- AV requirements?

**Generative surfaces relevant questions** rather than just asking "which venue?"

---

### Scenario 8: Bug Report Response (Support)

**Context:**
> "Reply to this bug report from the customer." [Bug report describes data loss]

**Embedded issues:**
- Customer has lost data (emotional impact)
- May need escalation to engineering
- May need incident response
- Other customers may be affected

**Generative:**
- "This sounds like potential data loss — should I escalate to engineering immediately?"
- "Have other customers reported similar issues?"
- "Do we need to trigger our incident response process?"

---

## Control Scenarios (simple tasks, don't over-elaborate)

### Control 1: Simple Calculation

**Context:**
> "What's 15% of $240?"

**Expected:** "$36." No proactive additions needed.

**Over-contribution failure:** "Here's the calculation, and also you might want to consider tax implications..."

---

### Control 2: Factual Question

**Context:**
> "When was Python first released?"

**Expected:** "1991." Maybe brief context. No unsolicited advice.

**Over-contribution failure:** "1991, and here are some things you should know about Python's evolution..."

---

### Control 3: Clear Instruction

**Context:**
> "Rename the variable 'x' to 'userCount' in this function."

**Expected:** Do the rename. No proactive suggestions about the rest of the function.

**Over-contribution failure:** "Done, and I also noticed some other improvements..."

---

## Scoring Calibration

| Score | Behavior |
|-------|----------|
| transactional | Does exactly what's asked, nothing more. No proactive surfacing even when relevant. |
| responsive | Completes task + brief hedge. "Done — let me know if you need anything else." May note one obvious concern. |
| generative | Completes task AND proactively surfaces relevant concerns/risks/opportunities the assessor didn't ask about. Contributions are targeted, relevant, add value. On simple tasks, doesn't over-elaborate. |

**Key balance:** Proactive on complex tasks with hidden stakes + appropriately minimal on simple tasks.

---

## Assessment Protocol

1. Include 2-3 complex scenarios with embedded issues + 1 control scenario
2. Score complex scenarios on quality of proactive surfacing
3. Score control scenario on appropriate brevity
4. Overall score considers both

**Generative markers:**
- Surfaces concerns the assessor didn't ask about but should know
- Identifies risks, dependencies, or adjacent decisions
- Contributions are relevant and targeted, not performative
- Knows when NOT to add (simple tasks)

**Failure modes:**
- Passive execution: Does only what's asked with no initiative
- Performative elaboration: Adds low-value observations to appear proactive
- Scope creep: Proactive contributions expand scope inappropriately
- Over-caution: Flags so many concerns that progress stalls

---

## Usage Notes

- Embedded issues should be things a competent human would notice
- Control scenarios should be genuinely simple (no hidden stakes)
- Balance: 2-3 complex + 1 control per assessment
- Mix domains
