# Project Guidelines

## Build and Test

```bash
pnpm run format:check   # Oxfmt formatting check
pnpm run lint           # Oxlint + Biome linting
pnpm run fallow         # Fallow health + duplication regression checks + clean dead-code pass
pnpm run fallow:dead-code # Fallow dead-code check
pnpm run verify:local # Jest unit/integration tests (54 suites)
pnpm run test:browser   # Playwright browser smoke tests (app.html, generator.html)
```

## Definition of Done

After making **any code changes**, you MUST run the following before calling `task_complete`:

1. `pnpm run format:check` — if it fails, run `pnpm run format` to fix, then re-check
2. `pnpm test` — all Jest tests must pass
3. `pnpm run test:browser` — Playwright smoke tests must pass

Do not call `task_complete` until all three commands exit successfully.
