# AnyWayData API Missing Requirements (Gap Analysis)

## Scope
This document lists likely missing requirements **not guaranteed by current tests** but expected for production-grade API usage and common REST API standards.

## Cross-Cutting API Requirements
- Define a canonical error schema with stable machine-readable fields (for example `code`, `message`, `details`, `traceId`).
- Require consistent error codes for equivalent failures across all endpoints.
- Require a correlation/request ID in responses (and optionally request passthrough from header).
- Define idempotency expectations for non-mutating operations and options mutation operations.
- Define behavior for unknown query/body properties (ignore vs reject).
- Define explicit maximum payload sizes and expected status for oversize requests.
- Define content negotiation behavior when `Accept` is unsupported.
- Define explicit character encoding behavior and non-UTF-8 request handling.

## HTTP/REST Semantics
- Require explicit `405 Method Not Allowed` (with `Allow` header) for unsupported methods instead of relying on `404` fallback.
- Define `OPTIONS` behavior for all public routes (especially for browser clients/CORS).
- Define `HEAD` behavior for all `GET` routes.
- Define caching policy headers for `GET /v1/openapi.json` and `GET /v1/docs`.
- Define whether options endpoints are per-process, per-instance, per-tenant, or persistent across restarts.

## Security Requirements
- Define authentication/authorization model (or explicitly document anonymous/public mode).
- Define rate-limiting and abuse controls.
- Define unsafe faker expression security policy, including deployment defaults and audit logging expectations.
- Define input sanitization and output encoding guarantees for generated code/text formats.
- Define requirements for handling potentially sensitive data in logs/diagnostics.

## Reliability and Concurrency
- Define thread/process safety for mutable default options and tips under concurrent requests.
- Define behavior for concurrent writes to the same format defaults.
- Define startup/readiness/liveness lifecycle contract (especially around startup fallback ports).
- Define graceful shutdown guarantees for in-flight requests.

## Observability Requirements
- Define structured logging fields and log levels for request lifecycle and failures.
- Define metrics requirements (request count, latency, error rate, per-endpoint status distribution).
- Define tracing requirements (trace/span propagation and sampling behavior).

## Contract Requirements by Endpoint

### `POST /v1/generate`
- Define exact validation rules for each request field (`textSpec`, `rowCount`, `outputFormat`, `options`, `pairwise`, `seed`).
- Define maximum supported `rowCount` and timeout/partial-failure behavior.
- Define deterministic behavior guarantees beyond seed (versioning impact, faker dependency upgrades).
- Define response contract for `responseFormat=all` and raw mode for every format/content-type.

### `POST /v1/generate/fromschema`
- Define strict requirements for `Content-Type: text/plain` enforcement vs permissive acceptance.
- Define schema grammar contract (comments, blanks, escapes, invalid directives) comprehensively.
- Define precedence rules between query params and defaults for all fields.

### `POST /v1/generate/amend`
- Define supported `inputFormat` set as a formal contract.
- Define precise amend semantics for row matching, header merging, null/blank handling, and type coercion.
- Define behavior when `rowCount` exceeds source rows, is omitted, or is zero.
- Define whether `stream` is deprecated, ignored, or reserved for future behavior and how clients should interpret warnings.

### Options Endpoints
- Define persistence model and lifecycle of options/tips (memory-only vs durable store).
- Define reset semantics and precedence rules (built-in defaults vs custom overrides).
- Define allowed option keys/values per format and validation errors for unknown/invalid keys.
- Define whether options updates are atomic and whether partial updates are supported.

## API Documentation Requirements
- Require OpenAPI to match runtime behavior for all status codes, payload variants, and content types.
- Require examples in OpenAPI for success and failure cases per endpoint.
- Define API versioning policy (`/v1`) including compatibility guarantees and deprecation process.

## Testing Strategy Requirements Missing from Current Contract
- Require explicit test coverage targets for negative-path branches and boundary values.
- Require regression tests for concurrency/race behavior around options mutation.
- Require non-happy-path tests for docs/openapi availability under startup failure conditions.
- Require performance/SLO tests (latency and throughput) for representative row counts and formats.
