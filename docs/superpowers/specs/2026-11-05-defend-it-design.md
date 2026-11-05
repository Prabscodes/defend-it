# Defend It: approved direction

User authorized building the student presentation defence coach through submission readiness, leaving personal voice-over to them. Preserve Test Evidence separately.

## Product
Public browser tool for class-project and capstone presenters. Paste outline and optional rubric, choose examiner perspective/difficulty, extract and confirm claims, answer a grounded question, receive specific quote-backed feedback and a follow-up, retry the same question, compare attempts, and export a preparation sheet. No invented evidence, performance claims, numeric grades or simulated inference presented as real.

## Architecture
Dependency-light Node server serving static HTML/CSS/ES modules and same-origin JSON endpoints. Server-only OpenAI-compatible credentials, configurable model/base URL, fetch timeout, bounded input/output and per-client request limits. Separate prompt, validation, provider, and HTTP modules. Browser stores session locally with explicit notice and clear action; uploaded/pasted content goes to configured model provider. No required account. Typed interaction first; file text import optional, PDF out of scope for core MVP.

## Interaction contract
Stages: setup, confirm extracted claims, practice, feedback and retry, preparation sheet. Every AI stage must be genuinely requested from provider. No API configured => actionable unavailable state, not fake fallback. Bundled example is clearly labelled fictional presentation input. Retried answers retain the same question and original answer. Claims and quoted feedback validated against supplied content where practical; malformed output gets one bounded repair attempt then a readable error. User text remains data and is rendered safely.

## Prompt evidence
Persona separates examiner from coach. Few-shot demonstrates grounded questions and quote-backed, actionable feedback. Iterative refinement compares answer versions without automatically praising changes. Expose exact templates in a readable prompt-engineering view. Provide baseline comparison evaluation cases and record actual results only.

## Acceptance
Complete setup-to-export browser flow; missing configuration, timeout, malformed response and empty input work; no credentials in frontend; meaningful Node tests. Real provider smoke/evaluation and public URL verification required before claiming submission readiness. Responsive accessible UI, keyboard controls and loading states. GitHub code/setup docs, rubric checklist (10/30/20/10/30), live-demo runbook, <120-second video narration/shot list and recording support. Voice-over, actual presentation, external authentication/payment and any unavailable deployment remain explicitly pending until completed.
