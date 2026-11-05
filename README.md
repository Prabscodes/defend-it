# Defend It

**Make your thinking stand up.** A presentation defence coach for class projects and capstones: confirm your claims, practise a question, receive specific feedback, and retry the same question before facing your audience.

This is a working course MVP, not an official grader or a factual verification service. It uses real model inference; unavailable providers produce an error rather than canned feedback. The built-in Campus Cup example is fictional.

## What you can do

1. Paste presentation notes (or import plain `.txt`) and optionally a grading rubric.
2. Choose Classmates, Instructor or Capstone panel, plus a challenge level.
3. Review source-linked claims and choose which to defend.
4. Answer a grounded question and inspect feedback with an exact answer excerpt.
5. Retry that question and compare both attempts, or move to another question.
6. Download a Markdown preparation sheet with questions, answers, gaps and next steps.

No account is required. A session is saved in your browser; use **Clear saved session** to remove that browser copy. Each AI request sends the supplied material through this server to the configured model provider. Avoid confidential material and check that provider's policy. Clearing local history does not erase provider records or downloaded files.

## Run locally

Requires Node.js 22.9+ (or a current Node 24 release). No npm dependencies or build step.

```sh
cp .env.example .env
# Edit .env privately: set API_BASE_URL, API_KEY and MODEL.
npm start
```

Open `http://localhost:3000`. Keep `.env` private; it is gitignored. The model must support OpenAI-compatible chat completions and JSON-object output. A configuration indicator is not proof of successful inference: generate a claim to test the connection.

To use an already-installed local Ollama model:

```sh
API_BASE_URL=http://127.0.0.1:11434/v1 MODEL=dolphin3:8b PORT=18767 node server.js
```

This does not download a model. Substitute a model you have installed. Loopback providers do not require API_KEY; hosted providers do. A public deployment must use a reachable hosted endpoint, not your computer's localhost URL.

## Tests and evaluation

```sh
npm test
python3 scripts/evaluate.py --app http://127.0.0.1:18767
```

Tests cover malformed inputs, exact quote validation, bounded response repair, provider errors, repeated questions and HTTP boundaries. The evaluation script uses fictional developer-created cases and requires real inference. These are not broad accuracy or learning-outcome measurements. See [evaluation plan](docs/EVALUATION_PLAN.md), [actual results and limitations](docs/EVALUATION_RESULTS.md), and saved responses in `evaluation/`.

## Prompt engineering

- **Persona:** a rigorous, respectful coach; audience and difficulty inform examiner questions.
- **Few-shot:** examples demonstrate extracting a claim, probing unsupported generalization and providing quote-backed actionable feedback.
- **Iterative refinement:** a revised answer is evaluated against the same question with quotations from both attempts. The coach is instructed not to reward revisions automatically.

The **How the coach thinks** panel displays actual runtime templates from `prompts.js`. Deterministic validators check response shape and quotation membership. They cannot prove that the interpretation is correct. See [API contract](docs/API.md).

## Deploy

Deploy as a Node web service or Docker container. `Dockerfile` runs as an unprivileged user. `render.yaml` defines a free Render web service; set its secret API_KEY and MODEL and override API_BASE_URL for your provider. Do not commit secrets or put them in browser JavaScript. Free hosting can cold-start and provider quotas can interrupt requests; verify an actual anonymous inference before a presentation. See [deployment checklist](docs/DEPLOYMENT.md).

## Submission materials

- [Assignment requirements and rubric evidence](docs/ASSIGNMENT.md)
- [110-second video narration and shot plan](docs/DEMO_SCRIPT.md)
- [Live presentation notes and anticipated questions](docs/PRESENTATION_NOTES.md)
- [Validation and remaining gates](docs/VALIDATION.md)

## Limitations

Typed practice only; PDF parsing, voice analysis and external source verification are not implemented. Quotes can be exact while feedback is still wrong. Sessions use browser storage, not cross-device accounts. The public endpoint has a simple per-socket-IP rate limit that may be shared behind a reverse proxy; it is an MVP control, not a full abuse-prevention system. The application does not claim improved grades, adoption, productivity or superiority over a general chatbot.
