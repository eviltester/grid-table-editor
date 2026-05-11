# AnyWayData API Requirements (Test-Derived)

## Scope
This document is derived only from automated tests under `apps/api/src` and `apps/api/src/tests` as of 2026-05-11.
Only behaviors explicitly asserted by tests are included.

## HTTP API Requirements

### Health and documentation endpoints
- `GET /v1/health` must return HTTP `200`.
- `GET /v1/health` must return JSON content type.
- `GET /v1/health` response body must equal `{ "ok": true, "service": "anywaydata-api" }`.
- `GET /v1/openapi.json` must return HTTP `200`.
- `GET /v1/openapi.json` response must contain `openapi: "3.0.3"`.
- `GET /v1/openapi.json` response must include path entries for `/v1/generate` and `/v1/generate/amend`.
- `GET /v1/openapi.json` must include path entries for `/v1/generate/options/{format}`.
- `GET /v1/docs` must return HTTP `200`.
- `GET /v1/docs` must return HTML content type.
- `GET /v1/docs` body must contain Swagger UI markers (`swagger` / `swagger-ui`).

### `POST /v1/generate`
- A valid JSON request must return HTTP `200`.
- Success payload in default mode must include `headers` array and `rows` array.
- Success payload must not include top-level `ok`.
- Invalid spec payloads must return HTTP `400` with `errors` array and `diagnostics` object.
- Malformed JSON request bodies must return HTTP `400` with JSON response content type and `errors` array.
- `responseFormat=rendered` must return HTTP `200` with string `rendered` and no `rows` field.
- `responseFormat=raw` with `outputFormat=csv` must return HTTP `200` and `text/csv` content type.
- For unit-test framework formats (`junit4`, `junit5`, `junit6`, `testng`, `pytest`, `jest`, `xunit`, `rspec`, `phpunit`, `kotest`, `test-more`), rendered REST output must match `@anywaydata/core` rendered output for the same input/options/seed.
- Pairwise generation must be supported via `pairwise=true` and produce expected pairwise rows for the tested two-column enum case.
- Pairwise generation must also work when request content type is `application/x-www-form-urlencoded`.

### `POST /v1/generate/fromschema`
- With `text/plain` body and valid query (`rowCount`), endpoint must return HTTP `200`.
- Default response mode must include `headers` and `rows` arrays.
- `responseFormat=rendered` must return string `rendered`.
- `responseFormat=all` must return `rows` and string `rendered`.
- `responseFormat=raw` with `outputFormat=csv` must return `text/csv` content type.
- Missing `rowCount` must return HTTP `400`.
- Invalid `responseFormat` must return HTTP `400`.
- Invalid `outputFormat` must return HTTP `400`.
- Invalid `seed` must return HTTP `400` and an error mentioning finite numeric seed.
- Repeated calls with same schema and seed must produce deterministic rows.
- Saved defaults from options endpoint (for `jest` includeSetup) must affect generated output (rendered output contains `beforeEach` and `expect(`).
- Pairwise query mode (`pairwise=true`) must be supported and produce expected pairwise rows for the tested enum case.
- Schema text may include comments and blank lines and still parse/generate correctly for the tested case.

### `POST /v1/generate/amend`
- Valid amend request must return HTTP `200`.
- For tested CSV amend scenario, returned rows must match expected amended rows.
- Success payload must include `diagnostics` object.
- Invalid amend payload must return HTTP `400` with `errors` array and `diagnostics` object.

### Options endpoints
- `GET /v1/generate/options/:format` for valid tested formats must return HTTP `200` with:
- `format` field matching requested format.
- `options` object.
- `tips` object.
- `source` in `{ "custom-default", "built-in-default" }`.
- For every returned option key, a non-empty string tip must be present.
- Framework-specific tips must include setup hints (`beforeEach` for `jest`, `setUp` for `phpunit`).
- Returned option keys must be restricted to tested UI-supported key sets per format.
- Invalid format on `GET /options/:format` must return HTTP `400` with `errors` array.
- CSV defaults after reset must include `header=true`, `quotes=true`, and exclude unrelated keys such as `delimiter`.
- `POST /v1/generate/options/:format` must accept options updates and return `source: "custom-default"`.
- `POST /v1/generate/options/:format` must accept custom tips and return them.
- Defaults set by `POST /options/:format` must persist to subsequent `GET /options/:format`.
- Saved defaults for `dsv` must be used by `/v1/generate` when request omits explicit options (tested via header omission in raw output).
- `POST /v1/generate/options/:format/default` must reset to built-in defaults and built-in tips (`source: "built-in-default"`).

## API Service-Level Requirements (non-HTTP)
These are asserted directly in `api-service.*.test.js`.

### Generate service behavior
- `handleGenerateRequest` must support all formats listed in `@anywaydata/core` `SUPPORTED_FORMATS`.
- `handleGenerateRequest` must support response shapes for `rows`, `rendered`, `all`, and `raw`.
- Seeded generation must be deterministic for tested faker schema.
- Large row counts (tested at 100) must be supported.
- Invalid `responseFormat`, `outputFormat`, `seed`, missing required fields, empty schema, and invalid `rowCount` must return HTTP-style `400` result objects.
- Injected global unsafe-faker setting must be honored.

### From-schema service behavior
- `handleFromSchemaRequest` must reject non-string body.
- `handleFromSchemaRequest` must support all `SUPPORTED_FORMATS` via query `outputFormat`.
- `handleFromSchemaRequest` must support `rows`, `rendered`, `all`, and `raw` modes.
- Seeded generation must be deterministic.
- Pairwise mode must produce expected tested rows.
- Complex tested schema must parse/generate expected headers and row count.
- Missing `rowCount`, invalid `rowCount`, invalid `outputFormat`, invalid `responseFormat`, invalid `seed`, and empty schema must return `400`.

### Amend service behavior
- `handleAmendRequest` must support default rows mode and include diagnostics.
- `handleAmendRequest` must support `all` mode with rendered output and diagnostics.
- `handleAmendRequest` must support tested JSON input format.
- `handleAmendRequest` must support `rows`, `rendered`, `all`, and `raw` response modes.
- `stream` flag must be accepted and return warning that stream is ignored.
- Tested invalid payload combinations must return `400`.
- Cross-format fixture parity must hold for tested cases:
- CSV input + schema + DSV output must match expected fixture output.
- DSV input + schema + CSV output must match expected fixture output.

### Options service behavior
- `handleGetOptionsRequest` must return defaults for all `SUPPORTED_FORMATS`.
- `handleSetOptionsRequest` must apply custom options and tips for tested cases.
- `handleResetOptionsRequest` must restore built-in defaults source.
- Format-specific option state must be isolated across different formats.
- Non-object payloads and invalid formats must return `400`.
- Saved options defaults must be consumed by generation when request options are omitted.

## Startup and port resolution requirements
- `parseCliPort` must parse `--port <value>` and `--port=<value>`.
- `parseCliPort` must return `undefined` when port flag is absent.
- `resolvePortConfiguration` must prioritize CLI `--port` over `PORT` env var.
- `resolvePortConfiguration` must use `PORT` env var when CLI port is absent.
- `resolvePortConfiguration` must reject invalid explicit ports.
- `startApiServer` must fail with `EADDRINUSE` and explanatory message when explicit requested port is in use.
- `startApiServer` must auto-fallback to next port when default/non-explicit port is busy.
