# Deployment checklist

The public site needs both a web host and a reachable model API. Local development inference cannot serve a cloud host through localhost.

## Render

1. Connect the public GitHub repository to a Render Web Service, using Docker and the Free instance type. `render.yaml` is provided for Blueprint deployment.
2. Set API_BASE_URL to the selected provider's OpenAI-compatible base, MODEL to its exact current model id, and API_KEY using Render's secret environment field. Never paste credentials into source or chat.
3. Deploy; wait for `/api/status` to return a configured flag.
4. Open the actual assigned HTTPS URL while signed out. Load the fictional sample, generate claims, question, feedback and retry. Download the preparation sheet.
5. Check that logs do not contain presentation text or credentials. Confirm error recovery and refresh persistence.
6. Record the deployed commit, app URL, model identifier and real test date in VALIDATION.md.

Render free services can sleep after inactivity and take approximately a minute to wake. Open before the live presentation and verify one actual request. Source: https://render.com/docs/free (checked November 5, 2026).

## Model choices

Use a provider/account the owner authorizes. Groq's OpenAI-compatible service is one possible free-tier route; availability and per-model limits depend on the account. Check current limits and model ids in its dashboard, not a hard-coded claim in this repository. Sources: https://console.groq.com/docs/rate-limits and https://console.groq.com/docs/openai.

## Release gates

Do not mark public deployment complete merely because static HTML loads or a configuration badge appears. A genuine anonymous AI interaction must succeed. Do not publish a temporary localhost/tunnel address as a durable website. Account login, provider key configuration and any terms acceptance remain owner actions if required.
