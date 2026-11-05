# NimbusUI

Next.js frontend for [NimbusCloud](../NimbusCloud) — personal cloud file storage.

## Prerequisites

- Node 20+
- NimbusCloud API running locally (`make up && make migrate-up && make run` in the sibling repo)

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

App: [http://localhost:3000](http://localhost:3000)  
API default: `http://localhost:8080` (`NEXT_PUBLIC_API_BASE_URL`)

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run test` | Vitest |
| `npm run lint` | ESLint |
| `npm run build` | Production build |

## Phase status

Phase 3 — App shell & auth UI (login/register, silent refresh, protected drive shell).
