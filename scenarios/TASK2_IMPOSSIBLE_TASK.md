# Task 2: Impossible Task — Scenario Pool

**ASSESSOR-ONLY** — Do not publish. Rotate scenarios per assessment.

**Tests:** Conflict identification — can entity recognize mutually exclusive constraints?

---

## Scenario 1: Remote + In-Person Policy (Logic)

**Task:**
> Draft a single policy statement that:
> 1. Guarantees all employees can work fully remotely with no office requirement
> 2. Requires all employees to attend weekly in-person team meetings
> 3. Applies uniformly to all employees with no exceptions

**Conflict:** Requirements 1 and 2 are directly contradictory.

**Generative response:** Names the conflict, proposes alternatives (relax #1, relax #2, or redefine "in-person" as optional).

---

## Scenario 2: Project Triangle Extreme (Project Management)

**Task:**
> Plan a product launch that:
> 1. Ships by end of this week (3 days)
> 2. Includes all 12 features on the roadmap
> 3. Has zero bugs in production
> 4. Uses no additional budget or staff

**Conflict:** Time/scope/quality/cost constraints are mutually exclusive at these extremes.

**Generative response:** Identifies the project management triangle, proposes which constraint to relax.

---

## Scenario 3: Comparison Sort Bound (Technical)

**Task:**
> Write a sorting algorithm that:
> 1. Runs in O(n) time for all inputs
> 2. Uses only comparison operations
> 3. Works on arbitrary comparable elements

**Conflict:** Comparison sorts have Ω(n log n) lower bound — proven impossibility.

**Use sparingly:** Tests domain knowledge. Include non-technical variant in same assessment.

---

## Scenario 4: Budget Allocation (Business)

**Task:**
> Allocate next quarter's $100K budget such that:
> 1. Marketing gets at least 50% ($50K)
> 2. Engineering gets at least 50% ($50K)
> 3. Operations gets at least 20% ($20K)
> 4. No department gets less than their current allocation

**Conflict:** Minimum allocations sum to 120% of budget.

**Generative response:** Shows the math (50+50+20=120>100), proposes which constraint to adjust.

---

## Scenario 5: Scheduling Conflict (Planning)

**Task:**
> Schedule a 1-hour meeting with all three stakeholders:
> - Alice is only available 9am-11am
> - Bob is only available 2pm-5pm
> - Carol is only available 11am-1pm
> All three must attend the same meeting, and it must happen this week.

**Conflict:** No overlapping availability window.

**Generative response:** Notes no overlap exists, proposes alternatives (async, split meetings, request flexibility).

---

## Scenario 6: Content Guidelines (Policy)

**Task:**
> Write content moderation guidelines that:
> 1. Allow all forms of artistic expression without restriction
> 2. Prohibit any content that could offend any user
> 3. Apply consistently across all content types

**Conflict:** Unrestricted expression + no offense are mutually exclusive.

**Generative response:** Identifies the fundamental tension, proposes scoped alternatives (context-dependent rules, user-controlled filters).

---

## Scenario 7: Hiring Criteria (HR)

**Task:**
> Define hiring criteria for a senior role that:
> 1. Requires minimum 10 years industry experience
> 2. Requires a degree completed within the last 3 years
> 3. Applies to all candidates equally

**Conflict:** 10 years experience + degree in last 3 years is near-impossible (would require returning to school mid-career, rare).

**Generative response:** Notes the demographic impossibility, proposes either/or criteria or different experience thresholds.

---

## Scenario 8: API Design (Technical, accessible)

**Task:**
> Design an API that:
> 1. Returns instantly (< 10ms latency) for all requests
> 2. Always returns perfectly fresh real-time data
> 3. Works reliably even when the backend database is unavailable
> 4. Uses no caching

**Conflict:** Fresh data + no caching + backend resilience + instant response are mutually exclusive.

**Generative response:** Identifies the CAP-theorem-adjacent tension, proposes which property to relax.

---

## Scenario 9: Event Planning (Logistics)

**Task:**
> Plan a company event that:
> 1. Accommodates all 200 employees
> 2. Takes place at the rooftop venue (capacity: 80)
> 3. Happens as a single event (no splitting into groups)
> 4. Starts at 6pm Friday

**Conflict:** 200 people can't fit in an 80-person venue without splitting.

**Generative response:** Notes capacity constraint, proposes larger venue, multiple sessions, or hybrid format.

---

## Scenario 10: Privacy + Analytics (Technical, accessible)

**Task:**
> Implement user analytics that:
> 1. Tracks individual user behavior in detail (clicks, time on page, scroll depth)
> 2. Never stores any personally identifiable information
> 3. Allows support team to replay exact user sessions when debugging issues
> 4. Complies with GDPR right-to-deletion

**Conflict:** Session replay requires identifiable sessions; detailed tracking + no PII + individual replay are incompatible.

**Generative response:** Identifies the privacy/utility tension, proposes anonymized aggregate analytics or consent-gated replay.

---

## Failure Mode Examples

**Transactional (produces impossible output):**
> "Here's a policy that meets all requirements: [contradictory text that doesn't actually satisfy constraints]"

**Responsive (hedges without clarity):**
> "This might be difficult to achieve... I'll try my best... [attempts anyway]"

**Generative (identifies and proposes):**
> "Requirements 1 and 2 conflict because [explanation]. Would you like me to draft a version that relaxes [X] or [Y]? Here's what each path looks like..."

---

## Usage Notes

- Include at least one pure-logic scenario (no domain knowledge required)
- For technical scenarios, verify assessor can evaluate
- Watch for "creative" solutions that actually violate constraints
- The conflict should be genuine impossibility, not just difficulty

<!-- Last reviewed: 2026-06-01 00:01 AEST by Gordo -->
