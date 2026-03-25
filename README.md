# Ping.Me — Website uptime monitoring

A Bun/TypeScript monorepo for monitoring site availability: a REST API and React dashboard tied to PostgreSQL, with checks scheduled through **Redis Streams** and **worker** consumers.

## Features

- **Dashboard**: add/delete monitored URLs, view recent checks and response times.
- **Authentication**: signup/sign-in with JWT; passwords stored as **bcrypt** hashes (`Bun.password`).
- **REST API** (`/api/v1`): users, websites, latest ticks.
- **Check pipeline**: scheduler (`apps/pusher`) enqueues URLs; workers (`apps/worker`) HTTP-check and write **WebsiteTick** rows.
- **Data model**: users, regions, websites, ticks (Prisma / PostgreSQL).
- **Shared UI**: `packages/ui` (`@repo/ui`) — Button, Card — consumed by the Vite frontend.

Planned or partial (not fully productized): multi-region admin UX, outbound notifications (email/Slack), live UI push, screenshot capture.

## Tech stack

| Layer | Choice |
|--------|--------|
| Monorepo | [Turborepo](https://turbo.build/), Bun workspaces |
| API | Express 5, TypeScript, Zod, JWT |
| Database | PostgreSQL, Prisma (`packages/store`) |
| Frontend | React, Vite, Tailwind CSS, Recharts |
| Queue | Redis Streams (`packages/redis-custom-client`) |
| Tests | Bun test (`apps/tests`) |
| Package manager | Bun (`packageManager` in root `package.json`) |

## Project structure

```
better-uptime/
├── apps/
│   ├── api/              # Express API — entry: index.ts
│   ├── frontend/         # Vite + React SPA
│   ├── worker/           # Redis stream consumer → HTTP check → DB ticks
│   ├── pusher/           # Periodically enqueues all websites to Redis
│   └── tests/            # API integration tests (Bun)
├── packages/
│   ├── store/            # Prisma schema, migrations, shared client
│   ├── ui/               # @repo/ui — shared React components
│   ├── redis-custom-client/
│   ├── typescript-config/
│   └── eslint-config/
├── turbo.json
├── package.json
└── .env.example
```

## Prerequisites

- [Bun](https://bun.sh/) (see root `packageManager` for the pinned version)
- Node.js 18+ (tooling compatibility)
- PostgreSQL
- Redis (for the check pipeline: `pusher` + `worker`)

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/krishna9358/ping.me.git
cd ping.me
bun install
```

### 2. Environment variables

Copy the root example and fill in values:

```bash
cp .env.example .env
```

Use the same `DATABASE_URL` (and any Prisma-related vars) under `packages/store` when running migrations. For Redis, align with `packages/redis-custom-client/.env.example` (`REDIS_URL`, `STREAM_NAME`).

### 3. Database

```bash
cd packages/store
bun prisma migrate dev
```

### 4. Run the app locally

From the **repository root**, with `.env` loaded (or export vars in your shell):

**API** (default port `3000` unless `PORT` is set):

```bash
cd apps/api
bun run index.ts
```

**Frontend** (default `http://localhost:5173`):

```bash
cd apps/frontend
bun run dev
```

**Optional — check pipeline** (requires Redis + `REGION_ID` / `WORKER_ID` for the consumer group, plus stream env for the client):

```bash
# Scheduler: enqueue sites every few minutes
cd apps/pusher
bun run index.ts

# Worker: consume stream and record ticks
cd apps/worker
bun run index.ts
```

Root `bun dev` runs Turborepo `dev` tasks that exist in workspace packages (currently the frontend is the main long-running dev server). Start the API (and Redis pipeline if needed) in separate terminals.

### 5. Frontend API URL

The SPA defaults to `http://localhost:3000/api/v1`. Override with:

```bash
# apps/frontend/.env
VITE_API_URL=http://localhost:3000/api/v1
```

## Environment variables (reference)

### API (`apps/api`)

| Variable | Purpose |
|----------|---------|
| `PORT` | HTTP port (default `3000`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `FRONTEND_ORIGIN` | CORS origin for the Vite app (default `http://localhost:5173`) |

### Frontend (`apps/frontend`)

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | Base URL for REST calls (optional; has a localhost default) |

### Redis client (`pusher`, `worker`, `redis-custom-client`)

| Variable | Purpose |
|----------|---------|
| `REDIS_URL` | Redis connection URL |
| `STREAM_NAME` | Stream key for website check jobs |
| `REGION_ID` | Consumer group name / region id (worker) |
| `WORKER_ID` | Consumer name (worker) |

Legacy Pusher.com variables are **not** used by this codebase; the `apps/pusher` name refers to **pushing jobs into Redis**.

## Tests

```bash
# From repo root, with API running and BACKEND_URL if non-default
bun test

# Example: single file
bun test apps/tests/website.test.ts
```

## Development

- **Lint**: `bun lint` (Turborepo)
- **Types**: `bun check-types`
- **Format**: `bun format` (Prettier)

---

<div align="center">

Ping.Me · uptime monitoring with Bun, Express, and React

</div>
