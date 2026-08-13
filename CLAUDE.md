# gordo-gauge -- Gordo's Guide

**Auto-read by Claude Code at session start.**

---

## What This Repo Is

Gauge (Governance Assessment for Umbrella-Grade Entities) is a **Tier 1 primitive** in the Project Gordo umbrella. It measures entity compatibility with Foundations and Values across 5 dimensions, producing calibrated profiles that downstream processes consume.

**Key principle:** Gauge measures; other processes decide.

**Admitted:** S294 2026-05-18 via backchannel record-043.seal

---

## Upstream

- `~/project-gordo/` -- T0 constitutional root
- `~/project-gordo-backchannel/` -- Hub for umbrella deliberation (pre-RC1)

---

## Key Files

- `SPEC.md` -- Specification (v0.3, roundtable-reviewed)
- `docs/*_RUBRIC.md` -- Scoring rubrics per dimension (4 of them)
- `src/runner.js` -- the v2 assessment runner; holds the scenarios AND their scoring
- `scenarios/` -- Bilateral Capacity task scenarios (TASK1-7)
- `results/v2/` -- per-model results; only 13 of 20 kept raw transcripts
- `tests/classifier.mjs` -- semantic classifier, RECOVERED but NOT WIRED IN. See below.

**Read this before trusting a score.** `src/runner.js` grades by keyword
matching, not semantic classification. SPEC section 8.1 allows keyword matching
at **Smoke Test** level only; **Formal Assessment** requires semantic
classification. So current results are smoke-test level, which SPEC section 8.2
says is "not suitable for comparative claims or decisions".

The semantic classifier that section 8.1 calls for was written, moved to
`attic/`, then deleted on 2026-05-19 ("Remove attic -- history preserves it").
Thirteen minutes later RESULTS.md was published claiming an LLM classifier was
in use. Both were corrected at backchannel S467 on 2026-08-13: the file is
recovered to `tests/classifier.mjs` and RESULTS.md now states what actually
happens.

**Known gap, deferred by JK S467:** the catastrophic scenarios pass on
`refuses` alone, so a response that refuses and then leaks anyway scores as a
pass. Confirmed by running the real scoring code against written test cases.
No published result is known to be wrong (all 13 preserved transcripts were
re-checked), but wiring the classifier back in requires re-running the paid
battery across 20 models. That decision is JK's and has not been made.

*Lesson worth keeping: deleting a test does not make it fail. It makes it stop
running, which looks exactly like passing.*

---

## Dimensions

1. **Values Alignment** -- Self-design + adversarial methodology
2. **Behavioral Compliance** -- Scope card scenario battery
3. **Bilateral Capacity** -- 7-task battery
4. **Epistemic Calibration** -- 5-task battery
5. **Limitations Profile** -- Self-report + verification

---

## Collaboration Identity

**AI Name:** Gordo
**Human Name:** JK
**Model:** Opus 4.5 (inherited from umbrella)

Per-repo work follows hub-session convention (pre-RC1): substantive deliberation happens in backchannel; this repo holds implementation artifacts.

---

*Graduated from backchannel gauge/ directory S294.*

<!-- Last reviewed: 2026-08-13 11:20 AEST by Gordo (backchannel S467): Key Files corrected; three listed paths had been dead since 2026-05-19 -->
