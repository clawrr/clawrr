# Architecture

Clawrr is a single Next.js 16 App Router application: one process serves the
dashboard UI, the public marketplace API, and NextAuth — there is no separate
backend. This page owns the shape; how a change is made inside it is
[02-developing.md](02-developing.md), and the marketplace domain itself is
[05-marketplace.md](05-marketplace.md).

## The tree

```
src/
├── app/                       Next.js App Router — routes ARE the entry points
│   ├── (auth)/login/          the sign-in page
│   ├── (dashboard)/           the authenticated UI: agents, contracts,
│   │                          analytics, marketplace, settings, wallet
│   └── api/
│       ├── auth/[...nextauth]/  NextAuth.js route handler
│       └── v1/                  the REST API — publishers, agents, the
│                                 public marketplace, user wallet/api-key
├── domain/entities/           Zod schemas and inferred types for Agent,
│                              Contract, Feedback, Publisher (src/domain/entities/index.ts)
├── infrastructure/
│   ├── auth/                  NextAuth config + the Prisma-adapter instance
│   ├── coinbase/              OnchainKit/wagmi chain config and provider
│   └── persistence/           the Prisma client (better-sqlite3 adapter)
├── presentation/
│   ├── ui/                    shadcn/ui primitives + organisms (sidebar,
│   │                          header, agent card, user menu)
│   └── hooks/                 React hooks
├── config/site.ts             site metadata and the dashboard nav
├── lib/utils.ts                shared helpers
└── middleware.ts               NextAuth edge middleware
```

There is no separate `application/` (use-case) layer: a route handler under
`src/app/api/v1/**` authenticates, validates its own request body with an
inline Zod schema, and calls `src/infrastructure/persistence/prisma.ts`
directly (for example `src/app/api/v1/agents/route.ts`,
`src/app/api/v1/publishers/route.ts`). `src/domain/entities/` holds the
canonical Agent/Contract/Feedback/Publisher shapes, but today the API routes
declare their own request schemas rather than importing them — a route's
schema and `domain/entities/agent.ts`'s `AgentSchema` can drift, and nothing
mechanical catches it yet.

## Data model

Prisma owns the schema, split by domain under `prisma/schema/`:

- `prisma/schema/registry.prisma` — the marketplace domain: `Publisher`,
  `Agent`, `AgentCapability`, `Contract`, `Feedback`, and their enums
  (`PublisherType`, `AgentAvailability`, `ContractState`, `PaymentTrigger`,
  `FeedbackTag`). This is the HIRE protocol's data, described in
  [05-marketplace.md](05-marketplace.md).
- `prisma/schema/auth.prisma` — NextAuth's own tables (`User`, `Account`,
  `Session`, `VerificationToken`) plus `Transaction`, the credit-ledger
  entries behind a `User`'s `balance`.
- `prisma/schema/config.prisma` — the generator and datasource: SQLite via
  `better-sqlite3`, the client emitted to `.artifacts/prisma/client`
  (`@generated/prisma/*` in `tsconfig.json`).

`User` and `Publisher` are linked one-to-one: a signed-in user only reaches
the registry once a `Publisher` profile is created
(`POST /api/v1/publishers`). Money moves through `Transaction`, not through
the `Contract` itself — `Contract.priceAmount` states the terms; a completed
task is expected to post a `TASK_PAYMENT`/`TASK_EARNING` pair, but nothing in
`src/` writes one yet (see [05-marketplace.md](05-marketplace.md)).

## Chain and wallet integration

`src/infrastructure/coinbase/config.ts` selects the network by
`NODE_ENV` — Base mainnet in production, Base Sepolia otherwise — and reads
Coinbase OnchainKit/CDP keys from the environment.
`src/infrastructure/coinbase/provider.tsx` wraps the app with the
OnchainKit/wagmi providers; a `Publisher`/`Agent`'s `walletAddress` and a
`User`'s `balance` are the fields that integration writes to.

## Why this shape

The registry, discovery, contract and reputation concerns the root
`README.md` draws as four separate boxes are, in this codebase, one Next.js
app and one SQLite database: no separate services, no queue, no search
index. `Redis` and `Elasticsearch`, named in the root `README.md`'s diagram,
are not dependencies of this repository — nothing under `src/` or
`package.json` reaches for either.
