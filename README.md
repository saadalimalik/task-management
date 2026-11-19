# Task Management

A TypeScript monorepo for a task management product, built with [Turborepo](https://turborepo.com) and pnpm workspaces.

```
apps/
  api/                  Express REST API for tasks (Postgres, Prisma, Zod)
packages/
  typescript-config/    Shared tsconfig
  eslint-config/        Shared ESLint rules
  prettier-config/      Shared Prettier options
docker-compose.yml      Production-style stack: Postgres + API
```

- `apps/` holds applications. Each one can use its own stack.
- `packages/` holds code shared between applications.

## Requirements

| Tool                | Version            |
| ------------------- | ------------------ |
| Node.js             | 24 or newer        |
| pnpm                | 12.21.0            |
| Docker with Compose | any recent release |

## Setup

1. Install dependencies.

   ```sh
   pnpm install
   ```

2. Create the env files.

   ```sh
   cp .env.example .env
   cp apps/api/.env.example apps/api/.env
   ```

   The root `.env` configures Postgres and the published ports. `apps/api/.env` configures the API. The defaults work as they are for local use.

## Run the full stack

This builds the API image and starts Postgres, applies database migrations, and starts the built API.

```sh
pnpm run up
```

`pnpm up` without `run` is pnpm's own update command, so keep the `run`.

| URL                                | What                 |
| ---------------------------------- | -------------------- |
| http://localhost:3000/api/v1/tasks | Tasks API            |
| http://localhost:3000/docs         | Swagger UI           |
| http://localhost:3000/openapi.json | OpenAPI 3.1 document |
| http://localhost:3000/health       | Health check         |

Stop the stack with `pnpm run down`. Add `--volumes` to also delete the database data.

## Develop

Run the API in watch mode against the Postgres container.

```sh
docker compose up --detach postgres
pnpm --filter api db:deploy
pnpm dev
```

The dev server and the `api` container both use port 3000. Stop the container first with `docker compose stop api`, or set another `PORT` in `apps/api/.env`.

## Commands

Run these from the repo root. Turborepo caches the results.

| Command             | What it does                     |
| ------------------- | -------------------------------- |
| `pnpm build`        | Build every app and package      |
| `pnpm dev`          | Start dev servers in watch mode  |
| `pnpm test`         | Run the tests                    |
| `pnpm check-types`  | Type-check without emitting      |
| `pnpm lint`         | Lint with ESLint                 |
| `pnpm format`       | Format every file with Prettier  |
| `pnpm format:check` | Check formatting without writing |
| `pnpm run up`       | Start the production-style stack |
| `pnpm run down`     | Stop the stack                   |

Database commands for the API:

| Command                                      | What it does                                       |
| -------------------------------------------- | -------------------------------------------------- |
| `pnpm --filter api db:migrate --name <name>` | Create and apply a migration after a schema change |
| `pnpm --filter api db:deploy`                | Apply pending migrations                           |
| `pnpm --filter api db:generate`              | Regenerate the Prisma client                       |

## Try the API

```sh
curl -X POST http://localhost:3000/api/v1/tasks \
  -H 'content-type: application/json' \
  -d '{"title": "Write docs", "priority": "high"}'

curl 'http://localhost:3000/api/v1/tasks?status=todo&limit=10'
```

A task has `title`, `description`, `status` (`todo`, `in_progress`, `done`), `priority` (`low`, `medium`, `high`) and `dueDate`. Swagger UI lists every endpoint and schema.

## Guidelines

- Pin exact versions for npm packages and Docker images. No `latest` tags and no version ranges.
- Never commit `.env` files. Update the matching `.env.example` when you add a variable.
- In `apps/api`, each directory under `src/` has one job and its files carry a matching suffix:

  | Directory        | Suffix             | Job                                                    |
  | ---------------- | ------------------ | ------------------------------------------------------ |
  | `routes/`        | `.route.ts`        | Map paths to validators and controller handlers        |
  | `validators/`    | `.validator.ts`    | Zod schemas and request validation                     |
  | `controllers/`   | `.controller.ts`   | Call services and shape the HTTP response              |
  | `services/`      | `.service.ts`      | Business logic and data access                         |
  | `middlewares/`   | `.middleware.ts`   | Middleware that is not a validator or rate limiter     |
  | `rate-limiters/` | `.rate-limiter.ts` | Rate limiting                                          |
  | `utils/`         | `.util.ts`         | Small pure helpers                                     |
  | `types/`         | `.type.ts`         | Shared types                                           |
  | `lib/`           | none               | One file per dedicated need, such as env, logger or db |

- Write functions, not classes. ESLint rejects classes in `apps/api`.
- Run `pnpm lint` and `pnpm format` before you commit.
- Put a `.test.ts` file beside every source file.
- Database tables and columns use snake_case (`tasks`, `due_date`). Application code uses `Task` and `dueDate`.
