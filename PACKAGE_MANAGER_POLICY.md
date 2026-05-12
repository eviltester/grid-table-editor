# Package Manager Policy

This repository is **pnpm-first**.

## Default Rule

- Use `pnpm` for all local development, CI, Docker build steps, and repository automation.
- Do not introduce new `npm`/`npx` commands in executable repo paths unless explicitly allowed below.

## Allowed Exceptions

1. Published package consumer documentation/examples:

- `npm install -g ...`
- `npx ...`
- Reason: these are user-facing package-consumption flows, not repo build flows.

2. MCP host configuration examples:

- `command: "npx"` in JSON examples and generated examples.
- Reason: external MCP hosts commonly launch published tools this way.

3. Historical text:

- changelog references to npm remain as historical records.

4. `docs-src` transitional scope:

- Until Docusaurus migration is completed, `docs-src` may retain its own lockfile/tooling behavior.

## Disallowed Locations For `npm`/`npx`

- `.github/workflows/*`
- `apps/*/Dockerfile`
- root/project automation scripts
- `.husky/*`
- Playwright/Jest/Vite config commands executed as part of repo automation

## Audit Command

Use this command for sweeps:

```bash
rg -n "\bnpm\b|\bnpx\b|\byarn\b|package-lock\.json" .github apps packages .husky README.md docs-src -S
```

All matches must be classified as:

- `allowed`: matches one of the exceptions above
- `must-fix`: executable-path usage that should be migrated to pnpm
