# Task Management

A TypeScript monorepo for a task management product, built with [Turborepo](https://turborepo.com) and pnpm workspaces.

```
apps/
  api/                  Express REST API for tasks (Postgres, Prisma, Zod)
  web/                  TanStack Start web app (SSR, Tailwind CSS, TanStack Query)
packages/
  typescript-config/    Shared tsconfig
  eslint-config/        Shared ESLint rules
  prettier-config/      Shared Prettier options
docker-compose.yml      Production-style stack: Postgres + API + web
```

- `apps/` holds applications. Each one can use its own stack.
- `packages/` holds config shared between applications.
- The web app and the API are independent. The web app knows the API only through its OpenAPI contract.

## Requirements

| Tool                | Version            |
| ------------------- | ------------------ |
| Node.js             | 24 or newer        |
| pnpm                | 12.21.0            |
| Docker with Compose | any recent release |

## Setup

1. Install dependencies. This also installs the git hooks.

    ```sh
    pnpm install
    ```

2. Create the env files.

    ```sh
    cp .env.example .env
    cp apps/api/.env.example apps/api/.env
    cp apps/web/.env.example apps/web/.env
    ```

    The root `.env` configures Postgres and the published ports. Each app's `.env` configures that app. The defaults work as they are for local use.

## Run the full stack

This builds both images, starts Postgres, applies database migrations, then starts the built API and the built web app.

```sh
pnpm run up
```

`pnpm up` without `run` is pnpm's own update command, so keep the `run`.

| URL                                | What                 |
| ---------------------------------- | -------------------- |
| http://localhost:3001              | Web app              |
| http://localhost:3000/api/v1/tasks | Tasks API            |
| http://localhost:3000/docs         | Swagger UI           |
| http://localhost:3000/openapi.json | OpenAPI 3.1 document |
| http://localhost:3000/health       | Health check         |

Stop the stack with `pnpm run down`. Add `--volumes` to also delete the database data.

## Develop

Run both apps in watch mode against the Postgres container.

```sh
docker compose up --detach postgres
pnpm --filter api db:deploy
pnpm dev
```

The dev servers use the same ports as the containers (API 3000, web 3001). Stop the containers first with `docker compose stop api web`.

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

App-specific commands:

| Command                                      | What it does                                             |
| -------------------------------------------- | -------------------------------------------------------- |
| `pnpm --filter api db:migrate --name <name>` | Create and apply a migration after a schema change       |
| `pnpm --filter api db:deploy`                | Apply pending migrations                                 |
| `pnpm --filter api db:generate`              | Regenerate the Prisma client                             |
| `pnpm --filter web api:types`                | Regenerate the web app's API types (API must be running) |

## Git hooks

Every commit runs `pnpm lint`, `pnpm format:check` and `pnpm test`. A lint warning, a formatting difference or a failing test blocks the commit. Run `pnpm format` to fix formatting.

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
- Format with 4 spaces. Prettier enforces it.
- Write functions, not classes. ESLint rejects classes.
- Put a test file beside every source file.
- Keep the two apps independent. Design API endpoints as general REST resources, never for one screen.

### API (`apps/api`)

Each directory under `src/` has one job and its files carry a matching suffix.

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

- Treat every request as hostile: validate it with a strict schema before it reaches a controller.
- Database tables and columns use snake_case (`tasks`, `due_date`). Application code uses `Task` and `dueDate`.

### Web (`apps/web`)

| Directory     | File names                      | Job                                                        |
| ------------- | ------------------------------- | ---------------------------------------------------------- |
| `routes/`     | TanStack file-based names       | Routes: loaders, head tags, the page component             |
| `components/` | `PascalCase.tsx`                | Presentational components                                  |
| `hooks/`      | `useCamelCase.ts`               | State, effects, queries, mutations                         |
| `server/`     | `*.functions.ts`, `*.server.ts` | Server functions and server-only API calls                 |
| `validators/` | `*.validator.ts`                | Zod schemas for forms and URL search                       |
| `utils/`      | `*.util.ts`                     | Small pure helpers                                         |
| `types/`      | `*.type.ts`, `*.gen.ts`         | Types. `api.gen.ts` is generated from the OpenAPI document |
| `lib/`        | plain names                     | One file per dedicated need, such as env or SEO            |

- A component renders what it is given. Logic that is not presentation goes in a hook.
- Validate forms in the browser, show each error under its field, and report outcomes with toasts.
- Build for everyone: native elements, a label on every field, 44px touch targets, a visible focus ring, and no meaning carried by colour alone.
- Layouts must work from 300px wide to ultrawide, with touch and with a mouse.
