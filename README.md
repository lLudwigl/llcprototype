# Schwarzkappler

Real-time ticket controller tracker for Vienna public transit (Wiener Linien).

---

## What This Is

Schwarzkappler surfaces controller sightings from a 20,000-member Telegram group,
structures the free-form text, and displays it as a searchable, line-filtered feed.
Reports expire automatically after 2 hours.

---

## Monorepo Structure

```
schwarzkappler/
├── apps/
│   ├── web/          React + Vite + TypeScript + Tailwind CSS (frontend)
│   └── api/          Node.js + Fastify + TypeScript (REST API)
├── packages/
│   └── parser/       Pure TS message parser — no side effects, fully tested
├── package.json      Workspace root — scripts, engine constraints
├── pnpm-workspace.yaml
└── tsconfig.json     Base TS config — all sub-packages extend this
```

### apps/web
The browser app. Deployed to Vercel.
- React 18 + Vite 5
- TanStack React Query for all server state
- Tailwind CSS for styling
- German UI only

### apps/api
The REST backend. Deployed to Railway.
- Fastify 4 on Node 20
- Connects to Supabase (PostgreSQL)
- All routes prefixed with `/api/`
- Health check at `GET /health`

### packages/parser
A pure function library — no database, no network, no side effects.
Input: raw Telegram message string → Output: structured `ParseResult` object.
Every change to parser logic must be accompanied by a new test.

---

## Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9

```bash
npm install -g pnpm
```

---

## Getting Started

```bash
# Install all workspace dependencies
pnpm install

# Start the frontend dev server
pnpm dev:web

# Start the API dev server
pnpm dev:api

# Run all package tests
pnpm test

# Run TypeScript type-checking across all packages
pnpm typecheck
```

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| Data fetching | TanStack React Query |
| Backend | Node.js + Fastify + TypeScript |
| Telegram bot | grammY |
| Database | Supabase (PostgreSQL) |
| Package manager | pnpm workspaces |
| Testing | Vitest |
| Frontend deploy | Vercel |
| Backend deploy | Railway |

---

## Environment Variables

Copy `.env.example` to `.env` in each app before running locally.
Never commit `.env` files — they are gitignored.
