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

- Or clone and run locally with Vite:
- `pnpm install`
- `pnpm run dev:web`
- open `http://127.0.0.1:4173/app.html`, `http://127.0.0.1:4173/generator.html`, or `http://127.0.0.1:4173/webmcp.html`

Use `pnpm run build:web` to create a production build and `pnpm run preview:web` to preview the built output.
The old static-server flow (e.g. `python3 -m http.server`) is no longer the recommended local runtime path.

### Use Storybook

Storybook is available for isolated frontend development and UI review:

- `pnpm run storybook`
- open `http://127.0.0.1:6006`

Current story groups:

- `Test Data / Embedded Panel` for the in-app schema editor inside the main table editor
- `Test Data / Generator` for the standalone generator schema editor states
- `Export Formats / Previews` for export-preview flows such as Markdown, CSV, DSV, JSON, JSONL, XML, SQL, HTML, Gherkin, ASCII table, and code-oriented outputs

Useful workflows:

- use Storybook when iterating on schema-editor rendering, validation states, and text/schema mode transitions
- use Storybook when adjusting export-preview UI without needing the full app boot flow
- use `pnpm run test:storybook` to run Storybook smoke and interaction tests in CI-style mode
- use `pnpm run build-storybook` to create a static Storybook build in `storybook-static`

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

### Schema Formatting

- **Comments**: lines starting with `#` (optionally prefixed by whitespace) are treated as comments.
- **Blank lines**: blank lines are allowed and ignored, so you can separate column groups for readability.
- **Column definitions**: each column is defined as `name` followed by `rule` on the next logical content line.
- **Constraints**: optional `IF ... THEN ...` statements may appear in text mode after the field definitions, terminated by either `;` or `ENDIF`.

```
# optional comment

name
rule

# another comment
name
rule

IF [name] = "Bob" THEN [status] = "active" ENDIF
```

- `name` will be used as a column name
- `rule` will be used to generate the data
- constraint parameter references must use bracketed column names, e.g. `[Status]`
- constraints are currently text-mode only in the editor UI
- pairwise / n-wise generation with constraints supports only constraints that reference enum columns

A `rule` can be a regex string e.g.

- `(connie|bob)` which would generate 'connie' or 'bob'
- `[1-9][0-9]{0,4}` which would generate number between 1 and 99999

A `rule` can also be a domain mapped faker API call.

Faker API can be found here: https://fakerjs.dev/api/

e.g.

```
First Name
awd.domain.person.firstName

Noun
domain.hacker.noun
```

The `awd` and `domain` prefixes are optional:

e.g.

```
First Name
person.firstName

Noun
hacker.noun
```

The `fake` method on faker is also supported, which takes a mustache template style string combining api methods e.g.

- `helpers.fake("{{name.lastName}}, {{name.firstName}}")`

So a sample test data spec might look like:

```
# person details
name
helpers.fake("{{name.lastName}}, {{name.firstName}}")

# profile text
desc
lorem.paragraph

# preference data
collects
hacker.noun

# regex example
prefers
(Connie|Bob)
```

## Pairwise Combinatorial Test Data

When you have 2 or more enum fields (comma-separated values), you can generate pairwise combinatorial test data using a greedy approximation approach. This provides 100% pairwise coverage and typically reduces test cases substantially (often around 90-99% fewer) compared with full factorial testing.

For enum data, use comma-separated values in your spec:

```
# pairwise parameters
browser
chrome,firefox,safari,edge

# viewport class
device
desktop,tablet,mobile

# style variant
theme
light,dark
```

The "Generate Pairwise" button will appear automatically, creating a compact near-minimal set of combinations that tests every pair of values across all parameters.

## Similar Apps

Looking for similar apps to compare features sets and functionality?

There is a maintained list in the documentation:

- [Related Tools](https://anywaydata.com/docs/misc/related_tools)

## References

- [Markdown Tables Extended Syntax](https://www.markdownguide.org/extended-syntax/#tables)

## Libraries Used

- [Faker.js](https://fakerjs.dev/) for backing the domain api
  - https://fakerjs.dev/
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

Test - `pnpm test`

Coverage - `pnpm run testcoverage`

Preview Docs - `pnpm run previewdocs`

Build for release - `pnpm run anywaydata:win`

## Monorepo Workspaces

This repository now uses pnpm workspaces:

- `packages/core` -> shared generation engine (`@anywaydata/core`)
- `packages/core-ui` -> browser UI modules (`@anywaydata/core-ui`)
- `apps/cli` -> npm CLI package (`@anywaydata/cli`)
- `apps/api` -> REST API (`@anywaydata/api`)
- `apps/mcp` -> MCP server (`@anywaydata/mcp`)

Imports now resolve directly from package sources.
Use `packages/core/js/*` and `packages/core-ui/js/*` paths in local runtime/test code.

Install all dependencies from the repo root:

`pnpm install`

Run workspace build/test orchestration from root:

- `pnpm run build:workspaces`
- `pnpm run test:workspaces`
- `pnpm run test:workspaces:all`

Notes:

- `pnpm run test:workspaces` runs only the non-duplicating workspace tests that are not already covered by the root Jest suite (`@anywaydata/api`, `@anywaydata/cli`, and `@anywaydata/mcp`).
- `pnpm run test:workspaces:all` preserves the old “run every workspace test script” behavior.

Run an individual workspace command:

- `pnpm --filter @anywaydata/core run test`
- `pnpm --filter @anywaydata/core-ui run test`
- `pnpm --filter @anywaydata/api run start`
- `pnpm --filter @anywaydata/mcp run start`

## npm CLI Usage (`@anywaydata/cli`)

The npm CLI package is the workspace app `apps/cli` (`@anywaydata/cli`), and Bun executable builds also use `apps/cli` as the source.

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
- `--pairwise` generate pairwise combinations for enum fields (requires at least 2 enum rules)
- `-f, --format` output format (default `csv`)
- `-o, --outputfile` write output to file instead of stdout
- `-t, --testMode` enable diagnostics mode and generate one row
- `--unsafe-faker-expressions` allow expression-style faker args (disabled by default)
- `--trim-input` trim whitespace from every imported field value before amend processing
- `--trim-input-fields` comma-separated imported field names to trim before amend processing

Amend existing data with a schema:

`anywaydata amend --schema-file schema.txt --data-file input.csv --input-format csv -f json -o amended.json`

Trim imported input values during amend:

`anywaydata amend --schema-file schema.txt --data-file input.csv --input-format csv --trim-input-fields Name,Email -f json`

Pairwise note:

- when `--pairwise` is enabled, `--numberOfLines` is accepted but ignored (the pairwise engine determines row count)

## REST API Quick Start

Start the API:

`pnpm --filter @anywaydata/api run start`

Run the published API package directly with `npx`:

`npx -y @anywaydata/api`

Note: If `npx` fails on Windows, use direct execution instead:

`npm install -g @anywaydata/api && anywaydata-api`

For interactive local development (foreground process with `Ctrl+C` stop), prefer:

- `pnpm --filter @anywaydata/api run start -- --port 3001`
- `node apps/api/src/index.js --port 3001`

Use `npx` primarily for consumer-style package execution/testing.

Choose a specific port:

- `pnpm --filter @anywaydata/api run start -- --port 3001`
- PowerShell: `$env:PORT=3001; pnpm --filter @anywaydata/api run start`

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
- query params: `rowCount` (required), `outputFormat` (optional), `seed` (optional), `pairwise` (optional), `responseFormat` (optional: `rows|rendered|all|raw`)
- pairwise note: when `pairwise=true`, `rowCount` is accepted for compatibility but ignored (pairwise output size is computed automatically)

Amend imported data endpoint:

`POST http://localhost:3000/v1/generate/amend`

- JSON body fields: `textSpec` (required), `inputData` (required raw text), `inputFormat` (required), `rowCount` (optional, defaults to input row count), `outputFormat` (optional), `responseFormat` (optional), `stream` (optional and ignored)
- amend trim controls: `trimInput` trims all imported field values; `trimInputFieldsCsv` trims only the listed imported field names
- `rowCount` must be `<=` imported row count
- response returns the full resulting dataset after amendment

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

Streaming notes for CLI/core generation:

- stream mode supports: `csv`, `jsonl`, `dsv`, `json`, `xml`
- `json` stream mode emits a valid JSON array payload
- incompatible format options in stream mode are warned and ignored where needed
- REST API generation endpoints currently run in buffered mode

OpenAPI spec:

`GET http://localhost:3000/v1/openapi.json`

Swagger UI:

`GET http://localhost:3000/v1/docs`

Example request body:

```json
{
  "textSpec": "# literal example\\n\\nName\\nBob",
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
pnpm --filter @anywaydata/api run start -- --unsafe-faker

# Or via npx
npx -y @anywaydata/api --unsafe-faker
```

### Enable Unsafe Expressions Per Request

Add `unsafeFakerExpressions: true` to individual requests:

```json
{
  "textSpec": "# faker + numeric range\\n\\nName\\nperson.firstName\\n\\nScore\\nnumber.int({\"min\": 18, \"max\": 65})",
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

`pnpm --filter @anywaydata/mcp run start`

Note: MCP runs over stdio in this version and does not bind to a TCP port.
OpenAPI/Swagger routes are available on the REST API only.

The server exposes tools:

- `generate_data_from_spec`
- `amend_data_from_spec`
- `get_output_format_options_schema`

Inputs:

- `textSpec` (required string)
- `rowCount` (required integer, >= 0)
- `pairwise` (optional boolean, default `false`; when `true`, `rowCount` is ignored)
- `outputFormat` (required string e.g. `csv`, `json`, `jsonl`, `xml`, `sql`)
- `options` (optional object)
- `seed` (optional number)
- `trimInput` (optional boolean for `amend_data_from_spec`)
- `trimInputFieldsCsv` (optional string for `amend_data_from_spec`)

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
   - `pnpm install`
2. Start MCP server (or let your MCP host launch it):
   - `pnpm --filter @anywaydata/mcp run start`
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
      "cwd": "/path/to/grid-table-editor"
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
      "cwd": "/path/to/grid-table-editor"
    }
  }
}
```

For MCP hosts, prefer direct `node` execution or `npx` as shown above. `pnpm run` can emit non-JSON stdout lines, which may interfere with `stdio` MCP message parsing in some clients.

Notes:

- Transport is `stdio`, so `PORT` / `--port` do not apply to MCP.
- Use REST API (`@anywaydata/api`) for HTTP/OpenAPI/Swagger use cases.
- MCP tool name exposed is `generate_data_from_spec`.

## Publishing to npm

Packages are configured with `publishConfig.access=public`.

- `npm login`
- `pnpm install`
- `pnpm run verify:local`

Versioning and release notes are managed with Changesets:

- Create new changeset
- `pnpm changeset`
- Commit the generated changeset file
- Bump version
- `pnpm changeset version`
- publish package
- `pnpm changeset publish`

## Refresh npm token

- Get/create a new token from npm (or your registry UI).
- Update your user .npmrc entry (Windows):

```
notepad $HOME\.npmrc
```

- Replace the auth line, e.g.:

```
//registry.npmjs.org/:_authToken=YOUR_NEW_TOKEN
```

If you use a project-level .npmrc, update/remove token there too.

Verify:

`npm whoami`

## npm adhoc publish

For manual one-off publish, set the version in that package’s `package.json` first, then publish.

Bump version:

- `pnpm --filter @anywaydata/cli version patch`

or minor / major / exact like 1.2.3

Publish a single workspace package manually:

- `pnpm --filter @anywaydata/core publish`
- `pnpm --filter @anywaydata/core-ui publish`
- `pnpm --filter @anywaydata/cli publish`

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
- `http://localhost:8080/webmcp.html`

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

- Build first: `docker build -f apps/mcp/Dockerfile -t anywaydata-mcp .`
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
