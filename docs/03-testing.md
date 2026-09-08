# Testing

What proves a change to Clawrr today: honestly, almost nothing mechanical
does.

## What exists

`vitest` is a declared devDependency and `npm test` runs `vitest --run`, but
no `*.test.*` or `*.spec.*` file exists anywhere under `src/` — the command
runs, finds nothing, and exits 0. The CI workflow
(`.github/workflows/validate.yaml`) does not pretend otherwise: its test step
is `echo "No tests yet"`, not `npm test`. The `Makefile`'s `test` target
matches it (`@echo "No tests yet"`).

There is no `specs/` directory and no dependency on `@jterrazz/test`, so the
Test Conventions pass of `typescript check` does not apply to this
repository (`docs/06-quality-checks.md` of `@jterrazz/typescript` — it only
runs for a package that depends on `@jterrazz/test` and owns a `specs/`).

## What is actually checked

A pull request is validated by `typescript check` alone: TypeScript,
Oxlint, Oxfmt, the artefact `.gitignore` convention, Knip and the Docs
(layout) pass — see [02-developing.md](02-developing.md). None of these
prove behaviour; they prove the code compiles, is styled consistently, and
carries no dead export. `npm run build` (`prisma generate && next build`)
additionally proves the app builds against the current Prisma schema.

## The gap

A capability described in [05-marketplace.md](05-marketplace.md) —
authentication, agent registration, marketplace search, a contract's
lifecycle, a feedback rating — has no automated test asserting it behaves as
written. A change to any route under `src/app/api/v1/**` or to a Prisma
schema is proven, today, only by manual verification and by the reviewer
reading the diff.
