# Presenter notes

## 1. Problem and audience
Students often finish slides before testing whether they can explain their claims under questioning. Defend It is a browser-based practice space for class projects and capstones. Its value proposition is a guided practice loop with specific feedback and retry history. General-purpose chat can do related tasks; the proposed benefit is the focused workflow, not a unique model capability or proven superiority.

## 2. Product demonstration
Use the actual application: load the explicitly fictional sample, inspect extracted claims, confirm relevant claims, generate an examiner question, answer, inspect quote-backed feedback, retry and export. Explain that the model receives the supplied outline and answers; it does not independently verify studies or external facts.

## 3. Why the model is needed
The generative model identifies claims in free-form material, formulates context-dependent questions and interprets answers. Deterministic code manages the workflow, validates quote substrings and response shape, limits requests and exports notes. Avoid crediting an LLM with deterministic application behavior.

## 4. Prompt engineering
Persona: examiner perspective and difficulty control questioning; coach instructions require respectful, evidence-aware feedback. Few-shot: worked examples distinguish unsupported claims and exact quotations from invented evidence and vague advice. Iterative refinement: the original question and answer are retained when evaluating a revised answer; improvement is not guaranteed. Show the actual templates in `prompts.js` while explaining these patterns in the presentation.

## 5. Evaluation and limits
Distinguish software tests from model-quality evaluation. Report only saved real runs. Quote validation proves the words appeared, not that the coach interpreted them correctly. Generated feedback is not an official grade. Pasted content goes to the configured model provider. Small developer-created cases are not a general benchmark, and user benefit has not been established until real users provide feedback.

## 6. Impact and future work
Intended impact: surface unclear explanations and unsupported claims before the real presentation. Potential extensions: spoken answers, PDF/slide import, and longer mock panels. These are future applications, not existing features. Collect user feedback on which questions exposed gaps and whether the feedback helped them revise.

## Likely examiner questions
- **Why use this instead of ChatGPT?** A prepared workflow removes prompt setup, preserves source claims, keeps retries on the same question and exports preparation notes. We have not proven it outperforms general chat.
- **What prevents hallucinations?** Grounding instructions, exact quote validation, bounded structured outputs and visible limitations reduce some failures; they do not eliminate semantic mistakes.
- **How are prompt patterns evaluated?** Compare basic and engineered prompts on identical cases/model settings, review grounding/actionability and retain failure cases. Avoid general claims from small samples.
- **What happens when the model fails?** Preserve the user's work, display an actionable error, and allow retry; never present a canned response as live inference.
- **Is data private?** Session history stays in this browser unless exported, while requests are sent through the server to the configured model provider. Read its policy; avoid sensitive material. The app should not log presentation contents.
