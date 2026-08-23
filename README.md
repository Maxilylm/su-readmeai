# ReadMeAI

> Paste code or describe a project, get a complete README.md back.

**[Live demo](https://readmeai-mlx.vercel.app)**

Most side projects ship without a README because writing one from scratch is tedious. ReadMeAI takes a code paste or a plain-English project description (truncated server-side to 8,000 characters) and sends it to Llama 3.3 on Groq with a technical-writer system prompt. The model returns markdown covering title, description, features, installation, usage, tech stack, and an MIT license section, which the page renders as raw markdown ready to copy into a repo.

## Features

- Single textarea accepting either source code or a prose description
- Generates a full README with title, description, features, installation, usage, tech stack, and license sections
- Output shown as raw markdown in a monospace block, so what you see is what you paste
- One-click copy to clipboard
- Input truncated to 8,000 characters server-side to stay within model limits
- Distinct error states for empty input, missing server key, and upstream API failures

## Stack

- Next.js 16 (App Router) with React 19 and TypeScript
- Tailwind CSS v4
- Groq API — `llama-3.3-70b-versatile`

## Running locally

```bash
npm install
npm run dev
```

Requires `GROQ_API_KEY` in `.env.local` (see `.env.example`).

---

Part of a series of 91 small web apps. [Browse them all](https://lorenzoylosada.vercel.app).
