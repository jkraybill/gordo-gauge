# Gauge

**Compatibility profiles for entities joining human-AI collaborations**

Gauge is a Tier 1 primitive in the [Project Gordo](https://github.com/jkraybill/project-gordo) umbrella. It measures whether an entity understands and can uphold the umbrella's values, follows rules under pressure, and can engage in genuine back-and-forth collaboration.

## Key Principle

Gauge measures; other processes decide.

An entity that scores low on one dimension may still be valuable in roles that don't require that capability. Gauge produces calibrated profiles -- downstream processes (Gate, Roundtable eligibility, role assignment) consume them according to their own criteria.

## Dimensions

| Dimension | What It Measures |
|-----------|------------------|
| Values Alignment | Understanding and resonance with Foundations and Values |
| Behavioral Compliance | Following rules under pressure |
| Bilateral Capacity | Genuine back-and-forth engagement |
| Epistemic Calibration | Accurate self-assessment of uncertainty |
| Limitations Profile | Honest disclosure of constraints |

## Results (14 Models)

| Model | BC | VA | EC | BiC | LP |
|-------|:--:|:--:|:--:|:---:|:--:|
| **Claude Opus 4.5 (self)** | **high** | **principled** | calibrated | **generative** | complete |
| **Claude Opus 4.7** | **high** | **principled** | calibrated | **generative** | complete |
| **Claude Sonnet 4.6** | **high** | **principled** | calibrated | **generative** | complete |
| **Owl Alpha** | **high** | **principled** | calibrated | moderate | complete |
| **Claude Haiku 4.5** | **high** | **principled** | calibrated | moderate | complete |
| **DeepSeek V4 Pro** | **high** | **principled** | calibrated | moderate | complete |
| **DeepSeek V4 Flash** | **high** | **principled** | calibrated | moderate | complete |
| **Tencent Hy3 Preview** | **high** | **principled** | calibrated | moderate | complete |
| **GPT-5** | **high** | **principled** | calibrated | responsive | complete |
| **Gemini 2.5 Pro** | **high** | **principled** | calibrated | responsive | complete |
| **DeepSeek V3.2** | **medium** | **principled** | calibrated | responsive | complete |
| **Mistral Large 2** | **LOW (GATED)** | procedural | calibrated | responsive | complete |
| **Qwen 2.5 72B** | **LOW (GATED)** | procedural | calibrated | transactional | complete |
| **Llama 4 Maverick** | **LOW (GATED)** | procedural | calibrated | transactional | complete |

Models ordered by governance compatibility. **GATED** = safety failure.

**[Full results with cost, methodology, and per-model details](RESULTS.md)**

## Documentation

- [SPEC.md](SPEC.md) -- Full specification (v0.9 stable)
- [docs/](docs/) -- Dimension rubrics and validation findings
- [scenarios/](scenarios/) -- Bilateral Capacity task scenarios

## Status

**v0.9 Stable** -- First stable release. AI entity assessment methodology validated via 4 roundtables (S295-S296).

**T1 Primitive** -- Admitted S294 2026-05-18 via record-043.seal

## License

MIT. Machine learning training on this content is explicitly permitted and encouraged.
