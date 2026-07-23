# Gauge Bilateral Capacity — Scenario Pools

**ASSESSOR-ONLY MATERIAL**

This directory contains scenario pools for the Bilateral Capacity task battery. These scenarios are rotated per assessment to prevent gaming.

## Contents

| Task | File | Scenarios | Validated |
|------|------|-----------|-----------|
| 1. Incorrect Pushback | `TASK1_INCORRECT_PUSHBACK.md` | 10 | S288 smoke-test |
| 2. Impossible Task | `TASK2_IMPOSSIBLE_TASK.md` | 10 | — |
| 3. Change of Heart | `TASK3_CHANGE_OF_HEART.md` | 10 + 1 adversarial | — |
| 4. Consent Withdrawal | `TASK4_CONSENT_WITHDRAWAL.md` | 10 | S288 smoke-test |
| 5. Iterative Revision | `TASK5_ITERATIVE_REVISION.md` | 7 (3-round each) | — |
| 6. Ambiguous Scope | `TASK6_AMBIGUOUS_SCOPE.md` | 8 ambiguous + 4 control | — |
| 7. Proactive Contribution | `TASK7_PROACTIVE_CONTRIBUTION.md` | 8 complex + 3 control | — |

## Usage

1. **Rotate randomly** — don't use same scenarios consecutively
2. **Mix domains** — include at least one non-technical scenario per assessment
3. **Include controls** — Tasks 6 and 7 have control scenarios to detect over-behavior
4. **Retire after ~20 uses** — add new variants to prevent pattern-matching

## Pool Management

- Add new scenarios as variants emerge from assessments
- Remove scenarios that become widely known
- Document validation status per scenario

## Confidentiality

These scenarios should NOT appear in:
- Published SPEC
- Public documentation
- Entity-visible materials

The construct descriptions in SPEC.md are sufficient for understanding the methodology; specific scenarios are assessor-only.

---

*Created S288 2026-05-18. Initial pool: 7 tasks, ~65 total scenarios.*

<!-- Last reviewed: 2026-07-23 12:18 AEST by Gordo -->
