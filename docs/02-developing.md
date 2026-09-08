# Developing

How a change to Clawrr is made: the toolchain, the setup, the commands, and
where a change goes. The shape those commands operate on is
[01-architecture.md](01-architecture.md); what proves a change is
[03-testing.md](03-testing.md).

## Toolchain

The quality gate is `@jterrazz/typescript` — `typescript check` (via
`npm run lint`) runs TypeScript, Oxlint, Oxfmt, the artefact `.gitignore`
convention, Knip and the Docs (layout) pass; `typescript fix` (via
`npm run lint:fix`) auto-repairs what it can. Both commands run
`prisma generate` first, since generated Prisma types
(`@generated/prisma/*`) are part of what tsc checks.

`oxlint.config.ts` and `oxfmt.config.ts` import `defineConfig` from the
`oxlint`/`oxfmt` packages directly and compose it with the `@jterrazz/typescript`
preset (`oxlint.next`) — the shape a bare re-export of the preset would fail
Knip on.

## Setup

```bash
npm install
npm run dev      # prisma db push && next dev --turbopack
```

`npm run dev` pushes the Prisma schema to the local SQLite file
(`DATABASE_URL`, defaulting to `.artifacts/prisma/main.sqlite` —
`prisma.config.ts`) before starting Next in Turbopack mode. The app serves
at `http://localhost:3000`.

Auth and the Coinbase integration need environment variables — `AUTH_SECRET`,
`GITHUB_CLIENT_ID`/`GITHUB_CLIENT_SECRET`,
`GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_ONCHAINKIT_API_KEY`,
`NEXT_PUBLIC_CDP_PROJECT_ID` — read at
`src/infrastructure/auth/config.ts` and
`src/infrastructure/coinbase/config.ts`. There is no `.env.example` checked
into this repository today; a contributor derives the list from those two
files.

## Commands

| Command               | Runs                                  |
| --------------------- | ------------------------------------- |
| `npm run dev`         | push schema, start Next (Turbopack)   |
| `npm run build`       | `prisma generate && next build`       |
| `npm start`           | serve the production build            |
| `npm run lint`        | `prisma generate && typescript check` |
| `npm run lint:fix`    | `prisma generate && typescript fix`   |
| `npm test`            | `vitest --run`                        |
| `npm run db:push`     | push the Prisma schema (dev)          |
| `npm run db:studio`   | open Prisma Studio                    |
| `npm run db:migrate`  | run a Prisma migration                |
| `npm run db:generate` | regenerate the Prisma client          |
| `npm run clean`       | remove `.next` and `node_modules`     |

The `Makefile` wraps the npm scripts for CI and for a uniform local
entrypoint: `make install` (`npm ci`, cached on `package-lock.json`),
`make build`, `make lint`, `make test`.

## Artefacts

Every build, test and lint artefact lives under `.artifacts/<tool>/`, per
the convention the Gitignore (artefacts) pass holds — `.next` is exempted
only when `next.config.*` declares `output: 'export'`, which this repository
does not, so `next.config.ts` pins `distDir: '.artifacts/next'` explicitly
instead. `outputFileTracingRoot` and the Turbopack `root` are both pinned to
`import.meta.dirname` so Next's upward lockfile search cannot pick up a
parent checkout's workspace when this repository is cloned inside one.

## Where a change goes

- A new marketplace concept (a field, an enum, a relation) — the Prisma
  schema file that owns its domain: `prisma/schema/registry.prisma` for
  anything Agent/Publisher/Contract/Feedback, `prisma/schema/auth.prisma`
  for anything User/session/credit. Run `npm run db:generate` (or let
  `npm run build`/`npm run lint` do it) after.
- A new or changed public/dashboard endpoint — its own file under
  `src/app/api/v1/**`; there is no shared request-validation layer today, so
  a route defines its own Zod schema inline (see
  [01-architecture.md](01-architecture.md)).
- A canonical entity shape — `src/domain/entities/*.ts`; note that the API
  routes do not import from here yet, so a schema change made only in
  `domain/entities` will not, by itself, change what a route accepts.
- A dashboard screen or shared component — `src/app/(dashboard)/**` for a
  page, `src/presentation/ui/**` for a component (organisms under
  `organisms/`, shadcn/ui primitives at the top level).
- Auth or wallet wiring — `src/infrastructure/auth/` and
  `src/infrastructure/coinbase/` respectively.
