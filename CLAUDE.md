# Engineering Standards: Log A Send

## Philosophy
Ship small changes daily, straight to production. Engineers own the full feature lifecycle — design, build, test, deploy, monitor. Production monitoring drives decisions; bugs are rare and fixed fast when they occur.

## 1. Architecture
Strictly separate concerns:
- **Handlers** — Next.js route handlers (`app/api/**/route.ts`). Validate input, call a service, return a response. No business logic.
- **Services** — Business logic only. No HTTP, no database access.
- **Repositories** — Database access only (via Prisma). No business logic.
- **`src/lib/types.ts`** — All shared Zod schemas and TypeScript types. Single source of truth.

Keep functions < 30 lines and files < 200 lines. Refactor proactively.

## 2. Testing
- **TDD is required.** Write the test first, then the implementation. No business logic without a Vitest unit test.
- **Handlers need tests too.** Every Lambda handler must have at least one integration-style test covering the happy path and validation errors.
- **Coverage gates are enforced in CI.** The pipeline will reject a PR that drops coverage.
- **Validation:** Use Zod for all API request validation. Fail fast, fail clearly.
- **Data Integrity:** Implement idempotency for all "Log" operations to prevent duplicate entries.

## 3. Deployment
- **Push to `main` = deploy to production.** No manual deploy steps.
- **The pipeline is the gatekeeper:** `test → typecheck → deploy`. If any step fails, nothing ships.
- **Feature branches + PRs** for all changes. Direct pushes to `main` are blocked.
- **Never skip CI** (`--no-verify`, force push to main, etc.). If CI is broken, fix it — don't bypass it.

## 4. Observability
- **Structured JSON logging** in all API route handlers via `src/lib/logger.ts`. Every request logs its input, outcome, and duration.
- **Log levels:** `INFO` for normal flow, `WARN` for recoverable issues, `ERROR` for failures. Vercel picks these up automatically.
- **Monitoring drives the roadmap.** Check Vercel logs after every deploy. Production errors are P1.

## 5. Tech Stack
- **Framework:** Next.js 15 App Router (TypeScript, Node 22, deployed on Vercel).
- **Database:** PostgreSQL via Prisma ORM, hosted on Neon. Schema lives in `prisma/schema.prisma`.
- **Media:** Vercel Blob for photo and video storage.
- **Frontend:** React 19 + Tailwind v4 + TanStack Query + Framer Motion.
- **State:** Server state via TanStack Query. UI state kept local and minimal.

## 6. Engineering Rigor
- **Type Safety:** Strict mode. `any` is banned. Use discriminated unions for complex states.
- **Commits:** Conventional Commits only (`feat:`, `fix:`, `test:`, `chore:`).
- **Local dev:** Run `npm install` then `npm run dev`. Copy `.env.example` to `.env` and fill in credentials before starting.
- **Diagrams:** Architecture changes require a Mermaid.js diagram update in the README.
