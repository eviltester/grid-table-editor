[![Node.js CI](https://github.com/eviltester/grid-table-editor/actions/workflows/node.js.yml/badge.svg)](https://github.com/eviltester/grid-table-editor/actions/workflows/node.js.yml)

[![Wallaby.js](https://img.shields.io/badge/wallaby.js-powered-blue.svg?style=flat&logo=github)](https://wallabyjs.com/oss/)

# Data Grid Table Editor and Data Generator

A simple Data Table Editor that generates Markdown, CSV or JSON. It can also be used to interchange data between the formats, supporting editing in the grid.

- Grid interface
- drag and drop rows to re-order
- drag and drop columns to re-order
- import csv from file
- import csv, markdown, and json from editor
- generate csv, markdown, json and javascript from grid
- export csv, markdown and json files
- add and delete columns
- add and delete rows
- randomly fill data with Test Data
- configure export options

---

## Use The Editor

The application is live at [AnyWayData.com](https://anywaydata.com)

- Or clone and run locally by opening index.html in a browser after starting a web server in the folder e.g. `python3 -m http.server`

### Select Grid Engine

The editor can run with AG Grid or Tabulator using the same import/export and toolbar processing layer.

- Query string: `?grid=ag-grid` or `?grid=tabulator`
- Global override before app load: `window.ANYWAYDATA_GRID_ENGINE = "ag-grid"`
- Persisted setting key: `localStorage["anywaydata:grid-engine"]`

Default is Tabulator.

## To Generate Test Data

Use the Generator to create test data rules using a nicer UI.

You can preview the data prior to generating.

You can copy the schema into the editor UI and use it to populate existing tables.

## To Generate Test Data in an Grid

You can add data to an existing data table e.g. you import a CSV file and want to a new column of dates, or you want to amend an entire column (perhaps to obfuscate PII Data)

Expand the "> Test Data" section.

Choose the Data fields to add or amend in the table or enter a spec.

You can then create a new table, or amend the existing table or selected rows.

## Test Data Text Spec

The spec is a paragraph of text where each line is either a 'name' or a 'rule':

```
name
rule
name
rule
```

- `name` will be used as a column name
- `rule` will be used to generate the data

A `rule` can be a regex string e.g.

- `(connie|bob)` which would generate 'connie' or 'bob'
- `[1-9][0-9]{0,4}` which would generate number between 1 and 99999

A `rule` can also be a faker API call.

Faker API can be found here: https://fakerjs.dev/api/

e.g.

- `faker.person.firstName`
- `faker.hacker.noun`

The `faker` prefix is optional:

e.g.

- `person.firstName`
- `hacker.noun`

The `fake` method is also supported, which takes a mustache template style string combining api methods e.g.

- `helpers.fake("{{name.lastName}}, {{name.firstName}}")`

So a sample test data spec might look like:

```
name
helpers.fake("{{name.lastName}}, {{name.firstName}}")
desc
faker.lorem.paragraph
collects
hacker.noun
prefers
(Connie|Bob)
```

## Similar Apps

Looking for similar apps to compare features sets and functionality?

There is a maintained list in the documentation:

- [Related Tools](https://anywaydata.com/docs/misc/related_tools)

## References

- [Markdown Tables Extended Syntax](https://www.markdownguide.org/extended-syntax/#tables)

## Libraries Used

- [Faker.js](http://marak.github.io/faker.js) for domain api
  - http://marak.github.io/faker.js
- [RandExp.js](http://fent.github.io/randexp.js/) for regular expression based random data generation
  - http://fent.github.io/randexp.js/
- [Tabulator](https://tabulator.info/) for light weight tables
- [PapaParse](https://www.papaparse.com/) for csv processing

## Tool Categories

This tool falls in to the categories:

- online markdown editor
- markdown table generator
- markdown table editor
- Online Test Data Generation
- Online CSV Editor

## Building

Test - `npm test`

Coverage - `npm run testcoverage`

Preview Docs - `npm run previewdocs`

Build for release - `npm run anywaydata:win`

## Monorepo Workspaces

This repository now uses npm workspaces:

- `packages/core` -> shared generation engine (`@anywaydata/core`)
- `packages/core-ui` -> browser UI modules (`@anywaydata/core-ui`)
- `packages/cli` -> CLI wrapper (`@anywaydata/cli`)
- `apps/api` -> REST API (`@anywaydata/api`)
- `apps/mcp` -> MCP server (`@anywaydata/mcp`)

Imports now resolve directly from package sources.
Use `packages/core/js/*` and `packages/core-ui/js/*` paths in local runtime/test code.

Install all dependencies from the repo root:

`npm install`

Run workspace build/test orchestration from root:

- `npm run build:workspaces`
- `npm run test:workspaces`

Run an individual workspace command:

- `npm run test --workspace @anywaydata/core`
- `npm run test --workspace @anywaydata/core-ui`
- `npm run start --workspace @anywaydata/api`
- `npm run start --workspace @anywaydata/mcp`

## npm CLI Usage (`@anywaydata/cli`)

The npm CLI package is the workspace package `@anywaydata/cli` (separate from the Bun CLI in `cli/`).

Install globally from npm:

`npm install -g @anywaydata/cli`

Or run without installing:

`npx @anywaydata/cli --help`

Run a one-off generation command with `npx`:

`npx @anywaydata/cli generate -i input.txt -n 10 -f csv`

Show CLI help:

`anywaydata --help`

Generate output to console:

`anywaydata generate -i input.txt -n 10 -f csv`

Generate output to a file:

`anywaydata generate -i input.txt -n 10 -f json -o output.json`

Run in test mode (forces a single generated row and prints diagnostics):

`anywaydata generate -i input.txt -n 10 -f markdown -t`

Supported options:

- `-i, --inputfile` path to the input text spec (required)
- `-n, --numberOfLines` number of rows to generate (default `1`)
- `-f, --format` output format (default `csv`)
- `-o, --outputfile` write output to file instead of stdout
- `-t, --testMode` enable diagnostics mode and generate one row
- `--unsafe-faker-expressions` allow expression-style faker args (disabled by default)

## REST API Quick Start

Start the API:

`npm run start --workspace @anywaydata/api`

Run the published API package directly with `npx`:

`npx -y @anywaydata/api`

Note: If `npx` fails on Windows, use direct execution instead:

`npm install -g @anywaydata/api && anywaydata-api`

For interactive local development (foreground process with `Ctrl+C` stop), prefer:

- `npm run start --workspace @anywaydata/api -- --port 3001`
- `node apps/api/src/index.js --port 3001`

Use `npx` primarily for consumer-style package execution/testing.

Choose a specific port:

- `npm run start --workspace @anywaydata/api -- --port 3001`
- PowerShell: `$env:PORT=3001; npm run start --workspace @anywaydata/api`

Port behavior:

- `--port` overrides `PORT`
- if a port is explicitly provided (`--port` or `PORT`) and is in use, startup fails with a short message
- if no explicit port is provided, API starts at `3000` and auto-tries `3001..3020` when needed

Health check:

`GET http://localhost:3000/v1/health`

Generate data:

`POST http://localhost:3000/v1/generate`

`/v1/generate` request supports optional `responseFormat` mode:

- `responseFormat: "rows"` (default) returns `headers` + `rows`
- `responseFormat: "rendered"` returns only rendered text in JSON payload
- `responseFormat: "all"` returns `headers` + `rows` + `rendered`
- `responseFormat: "raw"` returns rendered payload directly with content-type matching output format
- `outputFormat` is optional and defaults to `csv`
- `outputFormat` supports: `csv`, `dsv`, `markdown`, `json`, `jsonl`, `javascript`, `python`, `java`, `typescript`, `xml`, `sql`, `gherkin`, `html`, `asciitable`

Raw multiline schema/spec endpoint:

`POST http://localhost:3000/v1/generate/fromschema?rowCount=10&outputFormat=csv&responseFormat=rows`

- `Content-Type` must be `text/plain`
- request body is the full multiline spec
- query params: `rowCount` (required), `outputFormat` (optional), `seed` (optional), `responseFormat` (optional: `rows|rendered|all|raw`)

Set format default options:

`POST http://localhost:3000/v1/generate/options/<format>`

Get current format default options:

`GET http://localhost:3000/v1/generate/options/<format>`

Reset format default options:

`POST http://localhost:3000/v1/generate/options/<format>/default`

Notes:

- option defaults set for a format are used when `options` are not provided to `/v1/generate` or `/v1/generate/fromschema`
- payload for `/v1/generate/options/<format>` is the same options object normally sent as `options` in generation requests

Notes:

- for JSON requests, newline characters inside string literals must be escaped as `\\n`
- use `/v1/generate/fromschema` when you want to paste raw multiline text directly

OpenAPI spec:

`GET http://localhost:3000/v1/openapi.json`

Swagger UI:

`GET http://localhost:3000/v1/docs`

Example request body:

```json
{
  "textSpec": "Name\nBob",
  "rowCount": 3,
  "outputFormat": "json"
}
```

## Security: Unsafe Faker Expressions

For security, complex faker expressions that use `eval`-like functionality are disabled by default. The API uses a hybrid approach that tries safe method calls first, then falls back to secure execution when needed.

### Enable Unsafe Expressions Globally

Start the API with unsafe expressions enabled for all requests:

```bash
# Via command line flag
node apps/api/src/index.js --unsafe-faker

# Or via npm workspace
npm run start --workspace @anywaydata/api -- --unsafe-faker

# Or via npx
npx -y @anywaydata/api --unsafe-faker
```

### Enable Unsafe Expressions Per Request

Add `unsafeFakerExpressions: true` to individual requests:

```json
{
  "textSpec": "Name\nperson.firstName\nScore\nnumber.int({\"min\": 18, \"max\": 65})",
  "rowCount": 5,
  "outputFormat": "json",
  "unsafeFakerExpressions": true
}
```

For `/fromschema` endpoint, use the query parameter:

```
POST /v1/generate/fromschema?rowCount=10&unsafeFakerExpressions=true
```

### Security Details

- **Safe by default**: Most faker expressions use direct method calls without eval
- **Hybrid approach**: Tries safe `.apply()` method first, falls back to `Function()` constructor with security filtering
- **Expression patterns blocked**: `process`, `require`, `import`, `eval`, `__`, `constructor`, `prototype`
- **Granular control**: Enable globally via CLI or per-request via parameter

Examples of expressions that work safely without the flag:

- `person.firstName` or `person.firstName()`
- `number.int({"min": 10, "max": 100})`
- `helpers.arrayElement(["red", "green", "blue"])`

Examples that require the unsafe flag:

- `() => this.person.firstName()` (arrow functions with `this`)
- `{count: () => \`${this.number.int()}\`}` (template literals)

## MCP Quick Start

Start the MCP server:

`npm run start --workspace @anywaydata/mcp`

Note: MCP runs over stdio in this version and does not bind to a TCP port.
OpenAPI/Swagger routes are available on the REST API only.

The server exposes tools:

- `generate_data_from_spec`
- `get_output_format_options_schema`

Inputs:

- `textSpec` (required string)
- `rowCount` (required integer, >= 0)
- `outputFormat` (required string e.g. `csv`, `json`, `jsonl`, `xml`, `sql`)
- `options` (optional object)
- `seed` (optional number)

Discoverability support:

- `tools/list` publishes typed `inputSchema` and `outputSchema`
- `get_output_format_options_schema` returns per-format defaults and typed option schema
- `resources/list` and `resources/read` expose:
  - `anywaydata://schemas/output-format-options`
  - `anywaydata://install/config-examples`

Security note:

- MCP input validation restricts faker rule arguments to literals only (string/number/boolean/null) or no args.
- Expression-style faker arguments (e.g. arrow functions, `this`, template expressions) are rejected in MCP mode.
- Node and Bun CLIs are also safe-by-default with the same rule; use `--unsafe-faker-expressions` to opt in.

Error conventions:

- Tool-level validation/safety failures return `result.isError=true`
- Tool payload shape for failures is:
  - `{ "ok": false, "error": { "code": "...", "message": "...", "details": ... } }`
- Common `error.code` values:
  - `invalid_output_format`
  - `unsafe_faker_rule`
  - `text_spec_too_large`
  - `row_count_too_large`
  - `generation_failed`

### Using MCP With Codex

Codex connects to this server as an MCP tool provider over `stdio` (not HTTP).

1. Ensure dependencies are installed from repo root:
   - `npm install`
2. Start MCP server (or let your MCP host launch it):
   - `npm run start --workspace @anywaydata/mcp`
3. Configure your MCP host/Codex to launch the server command.

Example MCP server config (published package via `npx`):

```json
{
  "mcpServers": {
    "anywaydata": {
      "command": "npx",
      "args": ["-y", "@anywaydata/mcp"]
    }
  }
}
```

Example MCP server config (Claude Desktop style):

```json
{
  "mcpServers": {
    "anywaydata": {
      "command": "npx",
      "args": ["-y", "@anywaydata/mcp"]
    }
  }
}
```

Example MCP server config (Cursor/Cline-style local repo command):

```json
{
  "mcpServers": {
    "anywaydata-local": {
      "command": "node",
      "args": ["apps/mcp/src/index.js"],
      "cwd": "D:/github/grid-table-editor"
    }
  }
}
```

Windows-safe alternative (avoids `npx` bin resolution issues in some shells):

```json
{
  "mcpServers": {
    "anywaydata": {
      "command": "node",
      "args": ["-e", "import('@anywaydata/mcp')"]
    }
  }
}
```

Example MCP server config (local repo):

```json
{
  "mcpServers": {
    "anywaydata": {
      "command": "node",
      "args": ["apps/mcp/src/index.js"],
      "cwd": "D:/github/grid-table-editor"
    }
  }
}
```

For MCP hosts, prefer direct `node` execution or `npx` as shown above. `npm run` can emit non-JSON stdout lines, which may interfere with `stdio` MCP message parsing in some clients.

Notes:

- Transport is `stdio`, so `PORT` / `--port` do not apply to MCP.
- Use REST API (`@anywaydata/api`) for HTTP/OpenAPI/Swagger use cases.
- MCP tool name exposed is `generate_data_from_spec`.

## Publishing to npm

Packages are configured with `publishConfig.access=public`.

- `npm login`
- `npm install`
- `npm run verify:local`

Versioning and release notes are managed with Changesets:

- Create new changeset
- `npx changeset`
- Commit the generated changeset file
- Bump version
- `npx changeset version`
- publish package
- `npx changeset publish`

## npm adhoc publish

For manual one-off publish, set the version in that package’s `package.json` first, then publish.

Bump version:

- `npm version patch --workspace @anywaydata/cli`

or minor / major / exact like 1.2.3

Publish a single workspace package manually:

- `npm publish --workspace @anywaydata/core`
- `npm publish --workspace @anywaydata/core-ui`
- `npm publish --workspace @anywaydata/cli`

## Docker API

Build images from repo root:

- `docker build -f apps/api/Dockerfile -t anywaydata-api .`

Run the API container:

`docker run --rm -p 8082:3000 anywaydata-api`

Then sent requests to:

`localhost:8082`

e.g.

- `GET http://localhost:8082/v1/health`
- `GET http://localhost:8082/v1/generate/options/csv`

Notes:

- `docker run`: starts a new container from an image.
- `--rm`: automatically removes the container when it stops.
- `-p 8082:3000`: maps host port `8082` to container port `3000`.
- `anywaydata-api`: the image name to run.
- Connect from your machine at `http://localhost:8082`.
- Inside the container, the app still listens on port `3000`.

## Docker Web App

Build the browser app image from repo root:

- `docker build -f apps/web/Dockerfile -t anywaydata-web .`

Run the browser app container:

- `docker run --rm -p 8080:80 anywaydata-web`

Then open:

- `http://localhost:8080/`
- `http://localhost:8080/app.html`
- `http://localhost:8080/generator.html`

Notes:

- This image serves the static browser app assets only.
- It does not build or include Docusaurus (`docs-src` pipeline).

## Docker MCP

Build images from repo root:

- `docker build -f apps/mcp/Dockerfile -t anywaydata-mcp .`

Configure MCP with stdio for Docker

Example MCP config:

```json
{
  "mcpServers": {
    "anywaydata-docker": {
      "command": "docker",
      "args": ["run", "--rm", "-i", "anywaydata-mcp"]
    }
  }
}
```

Notes:

- Build first: `d`ocker build -f apps/mcp/Dockerfile -t anywaydata-mcp .`
- `-i` is required for stdio transport.
- No `-p` mapping is needed for MCP.

If you need local files available inside the container, add a bind mount, e.g. `-v /host/path:/workspace`.

## Docker Compose

Start both services with Compose:

`docker compose up --build`

## CI Coverage Artifacts

GitHub Actions runs linting and tests for pushes and pull requests to `master`.

The workflow also publishes coverage output as build artifacts on each run:

- `coverage-report-node-20.x` contains the full `coverage/` directory
- `coverage-html-report-node-20.x` contains the HTML report from `coverage/lcov-report/`

Open the workflow run in the Actions tab and download the artifact from the run summary page.

## Probable TODO:

- TODO: convert all JS to TypeScript
  - https://blog.logrocket.com/a-simple-guide-for-migrating-from-javascript-to-typescript/
- TODO: improve and expand the test data generation - written in TypeScript, don't use faker directly - create a full semantic abstraction
- TODO: create a DSL for the test data generation... probably just JSON initially
- TODO: convert UI to use React?

## Useful Data Sources

Large sources of data:

- https://catalog.data.gov/ca
