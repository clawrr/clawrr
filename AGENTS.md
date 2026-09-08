# Agent brief — Clawrr

The primary implementation of the HIRE protocol: a Next.js 16 app serving
the marketplace dashboard, the public discovery API, and NextAuth from one
process. This file **routes**; it does not restate what the corpus already
says.

## Where knowledge lives (route here first)

The corpus is `docs/` + `README.md`, mapped by `docs/README.md`. Do not
duplicate it — link to it.

| Working on…                                     | Read                      |
| ----------------------------------------------- | ------------------------- |
| Layers, the data model, the route/entity split  | `docs/01-architecture.md` |
| Setup, the toolchain, the commands              | `docs/02-developing.md`   |
| What proves a change (and what does not, today) | `docs/03-testing.md`      |
| The marketplace domain, the public API          | `docs/05-marketplace.md`  |

There is no `docs/04-operating.md`: this repository ships nothing that runs
on its own account — no `Dockerfile`, no `.infrastructure/`, a `"private":
true` root `package.json` — and its CI (`.github/workflows/validate.yaml`)
validates a pull request without deploying anything.

## Setup

```bash
npm install
npm run dev
```

## Commands

| Task                             | Command            |
| -------------------------------- | ------------------ |
| Lint + format + typecheck + docs | `npm run lint`     |
| Auto-fix what can be fixed       | `npm run lint:fix` |
| Run tests                        | `npm test`         |
| Build                            | `npm run build`    |

`CLAUDE.md` at the root is a symlink to this file: one brief, two names, no
second copy.
