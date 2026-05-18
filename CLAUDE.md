# Engineering Standards: Log A Send

A side project. The bar is "an experienced engineer's weekend code," not production financial infrastructure — but the principles below are non-negotiable.

## 1. Architecture

Two layers, strictly separated:

- **Handlers** — Next.js route handlers (`src/app/api/**/route.ts`). Parse the request, validate with Zod, call a service, shape the HTTP response. No business logic, no direct Prisma access.
- **Services** — Business logic, including Prisma access (`src/services/`). No HTTP types, no `NextRequest`/`NextResponse`. Callable from tests with plain TypeScript args.

A third repository layer between service and Prisma isn't warranted at this scope (one entity, one table). If a second entity is added or the data layer grows, that's the moment to split.

Shared schemas and types live in `src/lib/types.ts` — single source of truth, used by both client and server.

Keep functions short and files focused. Refactor when a file crosses ~200 lines.

## 2. Testing

- **No business logic without a Vitest unit test.** Service logic and pure helpers (e.g. `src/lib/attempts.ts`) ship with tests.
- **Every route handler has a test** for the happy path and validation failures. These are unit tests — they mock the service and `next/server`.
- **Validation:** Zod at the boundary, every time. Fail with a 422 and structured issues.
- **Idempotency:** All "Log" operations enforce a unique key in the database. Retrying a POST never produces a duplicate.

## 3. Deployment

- Vercel auto-deploys from `main`. No manual deploy steps.
- GitHub Actions runs `typecheck → test` on every push and PR. Treat a red CI as block-and-fix, not bypass.
- Feature branches and PRs for non-trivial changes. Don't skip hooks.

## 4. Observability

- All route handlers log via `src/lib/logger.ts` — structured JSON, picked up by Vercel.
- Log levels: `INFO` for normal flow, `WARN` for client-side problems (bad JSON, validation failures, unknown IDs), `ERROR` for things that should never happen in normal operation.
- Request-scoped correlation IDs are a known gap.

## 5. Tech Stack

- **Framework:** Next.js 15 (App Router, Node 22, deployed on Vercel).
- **Database:** PostgreSQL via Prisma ORM, hosted on Neon. Schema in `prisma/schema.prisma`.
- **Media:** Vercel Blob for photo/video storage.
- **Frontend:** React 19, Tailwind v4, TanStack Query v5, Framer Motion.
- **State:** Server state via TanStack Query. Local UI state kept local; no client store.

## 6. Comments

Default to no comments. Add one only when the **why** is non-obvious: a hidden constraint, a browser quirk, a security rationale, a subtle invariant. If removing the comment wouldn't confuse a future reader, don't write it.

Never comment what the code already says. `// skip upload when token is missing` above an `if (!process.env.BLOB_READ_WRITE_TOKEN)` check is noise. JSX section labels (`{/* Attempts */}` above a labelled input) are noise. Function names and well-named variables are the documentation.

## 7. Engineering Rigor

- **Type Safety:** Strict mode. `any` is banned. Discriminated unions for multi-state results.
- **Commits:** Conventional Commits (`feat:`, `fix:`, `test:`, `chore:`).
- **Local dev:** `npm install`, copy `.env.example` to `.env`, then `npm run dev`.
- **Diagrams:** Architecture changes update the Mermaid diagram in the README.
