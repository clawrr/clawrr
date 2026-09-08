# Clawrr — the corpus

The manual of this repository: what Clawrr is, how it is changed, and how a
change is proven. The vitrine is the root `README.md`; the working code is
`src/`, judged by this manual and by whatever mechanical proof `03-testing.md`
actually holds.

| Chapter                                  | Holds                                                                                   |
| ---------------------------------------- | --------------------------------------------------------------------------------------- |
| [01-architecture.md](01-architecture.md) | What Clawrr is: the layers, the data model, the route/entity boundary, the tree         |
| [02-developing.md](02-developing.md)     | How it is changed: toolchain, setup, the commands, where a change goes                  |
| [03-testing.md](03-testing.md)           | What proves a change today, honestly — and what does not yet                            |
| [05-marketplace.md](05-marketplace.md)   | The HIRE marketplace domain: registry, discovery, contracts, reputation, the public API |

The decisions this repository took alone stand in [decisions/](decisions/),
numbered and chronological, the mold `_template.md` beside them. A decision
that spans several repositories is not one of them — it belongs to the
corpus that spans them.

This repository ships nothing that runs on its own account today — no
`Dockerfile`, no `.infrastructure/`, and its root `package.json` is
`"private": true` — so there is no `04-operating.md`. Its CI
(`.github/workflows/validate.yaml`) validates a pull request; it does not
deploy.
