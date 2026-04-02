# Ping.Me — Website uptime monitoring

A Bun/TypeScript monorepo for monitoring site availability: a REST API and React dashboard tied to PostgreSQL, with checks scheduled through **Redis Streams** and **worker** consumers.

## Architecture

```
                         ┌─────────────────────────────────┐
                         │           User / Browser         │
                         └──────────┬──────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │     Frontend (React + Vite)    │
                    │  Login, Dashboard, Charts, UI  │
                    │   Nginx in prod / Vite in dev  │
                    └──────────┬────────────────────┘
                               │ REST calls (JWT auth)
                               ▼
                    ┌───────────────────────────────┐
                    │    API  (Express + Zod + JWT)  │
                    │  /user  /websites  /regions     │
                    └──────────┬────────────────────┘
                               │ Prisma ORM
                               ▼
               ┌───────────────────────────────────────┐
               │          PostgreSQL Database            │
               │  User  Website  Region  WebsiteTick    │
               └──────┬───────────────────────┬────────┘
                      │                       ▲
                      │ reads websites        │ bulk insert ticks
                      ▼                       │
            ┌──────────────────┐    ┌──────────────────┐
            │     Pusher       │    │     Worker        │
            │  (Scheduler)     │    │  (HTTP Checker)   │
            │  Runs every 3min │    │  Pings each URL   │
            └────────┬─────────┘    └──────┬───────────┘
                     │                     ▲
                     │  XADD (pipeline)    │ XREADGROUP
                     ▼                     │
            ┌──────────────────────────────────────────┐
            │          Redis Stream                     │
            │  Job queue with consumer groups + ack     │
            └──────────────────────────────────────────┘
```

### How it works

1. **User adds a URL** via the React dashboard. The frontend sends a `POST` to the API, which saves the website to PostgreSQL.

2. **Pusher runs every 3 minutes.** It reads all website URLs from the database and pushes them into a Redis Stream using a pipeline (single round-trip, not one-by-one).

3. **Worker picks up jobs** from the Redis Stream via consumer groups. Each message goes to exactly one worker — no duplicates. The worker pings each URL, measures response time, and records the result ("Up" or "Down") as a `WebsiteTick`.

4. **Bulk DB writes.** The worker inserts all ticks in a single `createMany` call instead of individual inserts, reducing database round-trips.

5. **Acknowledgment.** After processing, the worker sends `XACK` back to Redis so the message won't be re-delivered. If a worker crashes before acking, Redis can reassign the message.

6. **Dashboard displays results.** The frontend fetches the user's websites with their latest 100 ticks and renders status pills, uptime percentages, and response-time charts (Recharts).

### Why each piece exists

| Component                      | Why it's needed                                                                                                                                                                                                                                |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Redis Streams**              | Decouples scheduling from checking. Multiple workers can consume in parallel without duplicating work. If a worker dies, unacked messages get retried.                                                                                         |
| **Pusher (separate from API)** | The API handles user requests; the pusher is a background cron. Separating them means the API stays fast and the scheduler can run independently.                                                                                              |
| **Worker (separate process)**  | HTTP checks are slow (network I/O). Running them in a dedicated process keeps the API responsive and lets you scale workers horizontally.                                                                                                      |
| **Nginx (production only)**    | `vite build` outputs static HTML/CSS/JS. In production there's no Vite dev server — Nginx serves those files and handles SPA routing (all paths → `index.html` so React Router works). In development, Vite's dev server handles this instead. |
| **Prisma**                     | Type-safe database access shared across API, worker, and pusher via the `packages/store` workspace package.                                                                                                                                    |
| **Consumer groups**            | Let you run multiple workers across regions. Each worker in a group gets unique messages, enabling horizontal scaling without coordination.                                                                                                    |

## Features

- **Dashboard**: add/delete monitored URLs, view recent checks and response times.
- **Authentication**: signup/sign-in with JWT; passwords stored as **bcrypt** hashes (`Bun.password`).
- **REST API** (`/api/v1`): users, websites, regions, latest ticks.
- **Check pipeline**: scheduler (`apps/pusher`) enqueues URLs via Redis pipeline; workers (`apps/worker`) HTTP-check and bulk-write **WebsiteTick** rows.
- **Data model**: users, regions, websites, ticks (Prisma / PostgreSQL).
- **Shared UI**: `packages/ui` (`@repo/ui`) — Button, Card — consumed by the Vite frontend.

Planned or partial: multi-region admin UX, outbound notifications (email/Slack), live UI push, screenshot capture.

## Tech stack

| Layer           | Choice                                            |
| --------------- | ------------------------------------------------- |
| Monorepo        | [Turborepo](https://turbo.build/), Bun workspaces |
| API             | Express 5, TypeScript, Zod, JWT                   |
| Database        | PostgreSQL, Prisma (`packages/store`)             |
| Frontend        | React, Vite, Tailwind CSS, Recharts               |
| Queue           | Redis Streams (`packages/redis-custom-client`)    |
| Tests           | Bun test (`apps/tests`)                           |
| Container       | Docker, Docker Compose, Nginx                     |
| Package manager | Bun (`packageManager` in root `package.json`)     |

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
├── Dockerfile            # Multi-stage build (api, worker, pusher, frontend)
├── docker-compose.yml    # Full stack: Postgres + Redis + all services
├── nginx.conf            # SPA routing for production frontend
├── turbo.json
├── package.json
└── .env.example          # Single env file for all services
```

## Prerequisites

- [Bun](https://bun.sh/) (see root `packageManager` for the pinned version)
- Node.js 18+ (tooling compatibility)
- PostgreSQL
- Redis (for the check pipeline: `pusher` + `worker`)

## Getting started

### Option A: Docker (recommended)

```bash
git clone https://github.com/krishna9358/ping.me.git
cd ping.me
cp .env.example .env    # edit secrets as needed
docker compose up --build
```

This starts PostgreSQL, Redis, runs migrations, and launches all services:

- Frontend: `http://localhost`
- API: `http://localhost:3000`

### Option B: Local development

#### 1. Clone and install

```bash
git clone https://github.com/krishna9358/ping.me.git
cd ping.me
bun install
```

#### 2. Environment variables

All services read from a **single root `.env`**:

```bash
cp .env.example .env
```

#### 3. Database

```bash
bun db:migrate
```

#### 4. Run the app locally

**API** (default port `3000`):

```bash
cd apps/api
bun run index.ts
```

**Frontend** (default `http://localhost:5173`):

```bash
cd apps/frontend
bun run dev
```

**Check pipeline** (requires Redis):

```bash
# Scheduler: enqueue sites every 3 minutes
cd apps/pusher
bun run index.ts

# Worker: consume stream and record ticks
cd apps/worker
bun run index.ts
```

## Environment variables

All variables live in the **root `.env`** file. No sub-directory env files needed.

| Variable          | Used by             | Purpose                                       |
| ----------------- | ------------------- | --------------------------------------------- |
| `DATABASE_URL`    | API, Worker, Pusher | PostgreSQL connection string                  |
| `REDIS_URL`       | Worker, Pusher      | Redis connection URL                          |
| `STREAM_NAME`     | Worker, Pusher      | Redis stream key for check jobs               |
| `PORT`            | API                 | HTTP port (default `3000`)                    |
| `JWT_SECRET`      | API                 | Secret for signing JWTs                       |
| `FRONTEND_ORIGIN` | API                 | CORS origin (default `http://localhost:5173`) |
| `REGION_ID`       | Worker              | Consumer group / region identifier            |
| `WORKER_ID`       | Worker              | Consumer name within the group                |
| `VITE_API_URL`    | Frontend            | API base URL (baked in at build time)         |
| `BACKEND_URL`     | Tests               | API URL for integration tests                 |

## API endpoints

| Method | Path                           | Auth | Description                  |
| ------ | ------------------------------ | ---- | ---------------------------- |
| POST   | `/api/v1/user/signup`          | No   | Create account               |
| POST   | `/api/v1/user/signin`          | No   | Login, get JWT               |
| GET    | `/api/v1/websites`             | Yes  | List user's websites + ticks |
| POST   | `/api/v1/websites/website`     | Yes  | Add URL to monitor           |
| GET    | `/api/v1/websites/status/:id`  | Yes  | Single website + ticks       |
| DELETE | `/api/v1/websites/website/:id` | Yes  | Remove monitoring            |
| GET    | `/api/v1/regions`              | No   | List regions                 |
| POST   | `/api/v1/regions`              | No   | Create region                |
| DELETE | `/api/v1/regions/:id`          | No   | Delete region                |

## Tests

```bash
# Start the API first, then:
bun test

# Single file
bun test apps/tests/website.test.ts
```

## Development

- **Lint**: `bun lint`
- **Types**: `bun check-types`
- **Format**: `bun format`
- **Migrations**: `bun db:migrate`
- **Prisma Studio**: `bun db:studio`

---

<div align="center">

Ping.Me · uptime monitoring with Bun, Express, and React

</div>
