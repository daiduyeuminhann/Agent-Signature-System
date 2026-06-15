# AI Router Runtime — Hybrid Architecture

```
User
 │
 ▼
Node.js (Fastify) :3000
 │  POST /plan
 │
 ├─► LLM fallback chain
 │    Groq → OpenRouter → Gemini
 │
 └─► Python (FastAPI) :8000
      POST /signature/create
      POST /signature/validate
      POST /signature/save
      POST /signature/merge
```

---

## Project Structure

```
.
├── python_service/
│   ├── main.py                  ← FastAPI micro-service
│   ├── signature_builder.py     ← SignatureBuilder class
│   ├── signature_schema.json    ← schema definition
│   └── requirements.txt
│
├── src/
│   ├── index.js                 ← Fastify entry-point
│   ├── llm/
│   │   ├── gemini.js
│   │   ├── groq.js
│   │   ├── openrouter.js
│   │   └── providerRouter.js    ← callGroq / callGemini / callOpenRouter
│   ├── planner/
│   │   ├── plannerService.js    ← runPlanner() + signature pipeline
│   │   └── prompt.js
│   ├── routes/
│   │   └── plannerRoute.js      ← POST /plan
│   ├── schemas/
│   │   └── plannerSchema.js     ← Zod schema
│   ├── signature/
│   │   └── signatureClient.js   ← HTTP client → Python service
│   └── utils/
│       └── parseJson.js
│
└── .env
```

---

## Quick Start

### 1. Python service

```bash
cd python_service
pip install -r requirements.txt
python main.py
# → http://localhost:8000
```

### 2. Node.js router

```bash
npm install
npm run dev
# → http://localhost:3000
```

---

## API

### `POST /plan`

```json
{
  "prompt": "Build chatbot AI with React, .NET API, vectorDB",
  "projectName": "My AI App",
  "save": true,
  "savePath": "output/my-app-signature.json"
}
```

**Response:**

```json
{
  "success": true,
  "data": { ...plannerResult (Zod-validated) },
  "signature": { ...signature (schema-validated) }
}
```

---

## Signature Schema Fields

| Field          | Type              | Description                        |
|----------------|-------------------|------------------------------------|
| `metadata`     | object            | project_name, confidence, dates    |
| `project`      | object            | summary, goals                     |
| `business`     | object            | actors, flows, constraints         |
| `architecture` | object            | style, domains, components         |
| `domain_model` | object            | entities, relationships            |
| `rules`        | string[]          | technical requirements             |
| `decisions`    | {id,decision,reason}[] | architectural decisions       |
| `risks`        | {name,impact}[]   | identified risks                   |
| `known_facts`  | string[]          | extracted technologies             |
| `unknowns`     | string[]          | open questions                     |
| `next_actions` | string[]          | recommended next steps             |

---

## Python SignatureBuilder Methods

| Method                    | Description                              |
|---------------------------|------------------------------------------|
| `create_empty_signature()` | Return blank signature (zero-values)    |
| `validate(signature)`     | Validate; raises `SignatureValidationError` if invalid |
| `save(signature, path)`   | Validate + write JSON to disk           |
| `merge(base, patch)`      | Merge patch into base, update `updated_at` |
