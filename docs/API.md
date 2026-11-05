# Coaching API contract

Node 22+ server, no dependencies. JSON only. Provider-compatible Chat Completions endpoint `${API_BASE_URL}/chat/completions`; default base `https://api.openai.com/v1`. `MODEL` required. `API_KEY` required except bases whose hostname is localhost, 127.0.0.1 or ::1; local providers receive a dummy bearer value `local` if no key. `GET /api/status` returns `{configured:boolean,model:string|null}`; it indicates configuration presence, not a successful provider probe. `GET /api/prompts` returns the actual persona/action/repair templates.

## POST /api/coach

Base fields for all actions:

```json
{"action":"claims","presentation":"20 to 20000 characters","rubric":"optional, maximum 4000 characters","audience":"Classmates","difficulty":"Balanced"}
```

Audience enum: `Classmates`, `Instructor`, `Capstone panel`.
Difficulty enum: `Supportive`, `Balanced`, `Challenging`.
Success response always `{ "result": <action output> }`. Errors always `{ "error": "safe actionable message" }`.

### claims

Output:

```json
{"claims":[{"id":"c1","claim":"Summary of the argument","evidence":"exact nonempty presentation excerpt"}]}
```

1–6 claims, unique ids (1–40 characters), claim text 1–1000 characters, evidence 1–2000 characters. Evidence must be a literal substring of presentation. This is grounding, not verification that the claim is true. UI asks student to select claims before continuing.

### question

Input adds `claims`: selected claims in the same schema. Optional `previousQuestions`: array of at most 30 strings (1–2000 characters each).

Output:

```json
{"claimId":"c1","question":"One grounded question?","rationale":"Why it matters"}
```

claimId must belong to input claims. question/rationale are 1–2000 characters.

### feedback

Input adds `claims`, `question` (full question object), and `answer` (1–8000 characters).

Output:

```json
{"strength":"Specific observed strength or honest absence","quote":"exact nonempty substring of answer","gap":"Specific remaining limitation","nextStep":"Actionable improvement","followUp":"Probing question?"}
```

All fields 1–2000 characters. No numeric grades. Exact quote is mechanically validated; accuracy and pedagogical value still require human review.

### retry

Input matches feedback plus `previousAnswer` (1–8000 characters). UI retains the original question.
Output matches feedback plus:

```json
{"comparison":{"previousQuote":"exact substring of previousAnswer","currentQuote":"exact substring of answer","change":"Specific change, improvement or lack of improvement"}}
```

Each comparison field 1–2000 characters; both quotes validated literally.

## Limits and errors

400 invalid input/JSON; 403 cross-origin POST; 413 body above 100,000 bytes; 429 above 20 coaching requests per remote socket IP per minute; 503 configuration/provider/output errors. No proxy headers are trusted. A shared reverse proxy may share the limit across clients. Provider calls share a 45-second abort deadline, max_tokens=1800, temperature=0.4, response_format=json_object. One repair after malformed JSON/schema/quote failure, including a bounded validation diagnostic. No fallback inference. No application request-body logging or server session persistence. Browser localStorage stores the session; clearing it cannot remove provider retention or downloaded exports.

## Optional reasoning control

Set `REASONING_EFFORT` only when the selected provider/model supports the Chat Completions `reasoning_effort` parameter. A nonempty value is forwarded verbatim; when unset or empty the field is omitted, preserving provider defaults. For compatible local Ollama models, `REASONING_EFFORT=none` disables thinking so the output budget can be used for the requested JSON. Other providers and models accept different values and may reject unsupported ones. See [Ollama OpenAI compatibility](https://docs.ollama.com/api/openai-compatibility). This setting is server-side and does not change the coaching response schemas.
