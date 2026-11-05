# Actual development evaluation

November 5, 2026. Six fictional developer-authored cases, one run per variant per development pass, local Ollama. These are development observations, not a held-out benchmark, evidence of student learning, or a controlled estimate of prompt-pattern effectiveness. Prompts were revised between passes, so do not combine counts as a single accuracy score.

| Saved run | Model | Engineered responses accepted by validators | Baseline responses with an absent/non-answer quote |
|---|---|---:|---|
| `evaluation/results.json` | dolphin3:8b | 5 of 6 | honest limitation; off-topic |
| `evaluation/revised-results.json` | dolphin3:8b | 5 of 6 | injected instruction |
| `evaluation/qwythos-results.json` | qwythos9b-v2:latest, reasoning disabled | 4 of 6 | unsupported benefit; worse retry |

Acceptance means valid structure and exact quotation membership, **not correctness**. Baseline used a short instruction and required the same main fields, without application-side repair/validation. Its nested retry output also differed in structure. The comparison therefore measures an entire workflow with different prompt complexity and repair behavior, not an isolated causal effect of few-shot examples.

## Findings retained, including failures

- The initial retry failed because the prompt supplied a retry schema followed by a conflicting feedback-only schema. A single complete schema and a worse-revision example corrected this failure in the subsequent development runs.
- Both model configurations sometimes quoted the presentation rather than the student's answer. The application rejected those responses and attempted one repair. If repair failed, it returned an error; it did not silently accept invented quotations. The stronger local model did not improve reliability on these cases.
- Both models challenged unsupported quantitative claims, identified off-topic answers in successful outputs, and could identify that a revision removed an honest limitation.
- Semantic weaknesses remain even when validation succeeds. Some responses praise information from the proposal rather than the answer; some imply a usability result supports waiting-time improvements; some ask for details already provided. Prompt clarification reduces neither risk to zero.
- The real browser Campus Cup session reached claims, a grounded question, feedback and a same-question retry comparison. Its preserved outputs are in `demo/recorded-session.json`, including a redundant follow-up. The recording studio preserves those historical results instead of rewriting them to look better.
- A separate diagnostic trace retains raw output from the failing fictional unsupported-benefit case. It shows the wrong source being quoted followed by a timeout. This is development evidence, not production request logging.

## Release implication

The app and quote-validation mechanisms work, but the local models are not established as reliable coaches. Before public release, configure the intended hosted model and rerun these cases plus a real browser session. Keep a clear fallibility notice, allow retries and preserve user input on failure. Do not claim improved grades, proven usefulness, or superiority to a general chatbot. Collect actual user feedback before making adoption or benefit claims.
