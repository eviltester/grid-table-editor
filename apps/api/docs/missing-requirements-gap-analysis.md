# AnyWayData API Missing Requirements (Gap Analysis)

## Scope
This document lists likely missing requirements **not guaranteed by current tests** but expected for production-grade API usage and common REST API standards.

## Requirement Index (by Category)

### API Contract and Error Model
- Canonical error schema with machine-readable fields
- Consistent error codes for equivalent failures across endpoints
- Unknown query/body property policy
- Character encoding and non-UTF-8 handling
- Validation contract for `/v1/generate`
- Determinism contract scope
- Raw-mode content-type contract across all formats

### REST and HTTP Standards
- Unsupported Accept/content negotiation behavior
- Proper 405 Method Not Allowed semantics
- Explicit OPTIONS behavior
- Explicit HEAD behavior for GET routes
- Caching policy for docs/spec endpoints
- `/fromschema` content-type strictness policy

### State and Configuration Semantics
- Idempotency expectations for mutable and non-mutable operations
- Options persistence scope and durability
- Options storage durability contract
- Options precedence and reset policy
- Options key/value validation policy
- Atomicity/partial update behavior for options

### Security and Abuse Protection
- Authentication and authorization model
- Rate limiting and abuse controls
- Unsafe faker security policy
- Input sanitization and output encoding guarantees
- Sensitive data handling in logs/diagnostics

### Reliability, Concurrency, and Lifecycle
- Maximum payload size contract
- Concurrency safety for mutable defaults/tips
- Concurrent write conflict behavior
- Startup/readiness/liveness contract
- Graceful shutdown guarantees
- Row count limit and timeout behavior
- Query/default precedence rules
- `amend` rowCount semantics
- `stream` flag lifecycle in amend

### Endpoint-Specific Domain Semantics
- Schema grammar formalization
- `amend` input format contract
- `amend` merge/typing/null semantics

### Observability
- Correlation/request ID support
- Structured logging requirements
- Metrics requirements
- Tracing requirements

### API Documentation and Versioning
- OpenAPI/runtime parity requirement
- OpenAPI example completeness
- Versioning and deprecation policy

### Test Strategy and Quality Gates
- Test coverage targets for negative and boundary paths
- Concurrency regression tests for options mutation
- Docs/openapi resilience tests under startup faults
- Performance and SLO requirements

### Canonical error schema with machine-readable fields
**What this means**: Error responses should have a stable, documented structure beyond free-form messages (for example `code`, `message`, `details`, `traceId`).

**What is required to implement**:
- Define a single error response contract used by all endpoints.
- Add a closed set of error `code` values.
- Ensure all handlers map failures to this schema.
- Update OpenAPI and tests to validate the schema.

**Benefits**:
- Clients can reliably branch on `code` instead of parsing text.
- Backward compatibility is easier to preserve.
- Support and debugging are faster with consistent payloads.

### Consistent error codes for equivalent failures across endpoints
**What this means**: The same underlying failure (for example invalid seed) returns the same code regardless of endpoint.

**What is required to implement**:
- Create an error-code registry (for example `INVALID_SEED`, `INVALID_FORMAT`).
- Use centralized mapping utilities in service/HTTP adapters.
- Add cross-endpoint parity tests for code consistency.

**Benefits**:
- Integrations become simpler and less brittle.
- Behavior is predictable across API surfaces.
- Reduced risk of accidental client breakage.

### Correlation/request ID support
**What this means**: Every response should include a request correlation identifier to tie client-visible errors to logs/traces.

**What is required to implement**:
- Accept inbound `X-Request-Id` or generate one.
- Return request ID in response headers and optionally body.
- Include it in logs and error payloads.

**Benefits**:
- Faster incident triage.
- Easier distributed tracing across services.
- Better supportability for external users.

### Idempotency expectations for mutable and non-mutable operations
**What this means**: Document whether repeated identical requests are safe and what state changes are expected.

**What is required to implement**:
- Define idempotency for each endpoint.
- For mutating endpoints, define overwrite/merge semantics.
- Add tests for repeated-call behavior.

**Benefits**:
- Safer retries from clients and gateways.
- Reduced accidental state drift.
- Clearer contract for SDKs and consumers.

### Unknown query/body property policy
**What this means**: Explicitly define if unknown input fields are ignored, warned, or rejected.

**What is required to implement**:
- Pick a policy per endpoint family.
- Enforce via validation layer.
- Document policy and add tests.

**Benefits**:
- Predictable behavior and fewer surprises.
- Better typo detection for clients.
- Easier long-term API evolution.

### Maximum payload size contract
**What this means**: Define hard request-size limits and stable failure behavior when limits are exceeded.

**What is required to implement**:
- Document max body sizes per content type.
- Standardize status code and error payload for oversize requests.
- Add boundary tests at/over limit.

**Benefits**:
- Protects service stability.
- Enables safe client-side chunking/splitting.
- Reduces ambiguous failure modes.

### Unsupported Accept/content negotiation behavior
**What this means**: Define what happens when `Accept` requests unsupported media types.

**What is required to implement**:
- Decide between strict `406` and permissive fallback.
- Apply consistently across raw and JSON modes.
- Document and test behavior.

**Benefits**:
- Better standards compliance.
- Less ambiguity for API consumers.
- Cleaner integration with proxies/tooling.

### Character encoding and non-UTF-8 handling
**What this means**: Specify accepted encodings and behavior for invalid/mismatched charset inputs.

**What is required to implement**:
- Define supported charset list (typically UTF-8 only).
- Validate `Content-Type` charset handling.
- Return explicit errors for unsupported encodings.

**Benefits**:
- Prevents silent data corruption.
- Improves cross-platform reliability.
- Stronger interoperability guarantees.

### Proper 405 Method Not Allowed semantics
**What this means**: Unsupported methods should return `405` with `Allow`, not implicit `404` fallback.

**What is required to implement**:
- Add method handlers/middleware for `405`.
- Return `Allow` headers for each route.
- Update tests to expect `405` semantics.

**Benefits**:
- Better REST correctness.
- Clear client guidance on supported methods.
- Better compatibility with API tooling.

### Explicit OPTIONS behavior
**What this means**: Define and test preflight/discovery behavior for all routes.

**What is required to implement**:
- Configure route-level or global `OPTIONS` responses.
- Define CORS headers if browser clients are supported.
- Add tests for preflight expectations.

**Benefits**:
- Predictable browser integration.
- Reduced CORS-related production issues.
- Better operational clarity.

### Explicit HEAD behavior for GET routes
**What this means**: HEAD should be documented and consistent with GET metadata.

**What is required to implement**:
- Ensure HEAD is supported where GET exists.
- Validate headers/content-length behavior.
- Add tests for HEAD semantics.

**Benefits**:
- Better cache/proxy behavior.
- Improved standards adherence.
- Useful for health and lightweight checks.

### Caching policy for docs/spec endpoints
**What this means**: Define cache headers for `/v1/openapi.json` and `/v1/docs`.

**What is required to implement**:
- Decide cacheability and TTL policies.
- Add `Cache-Control`/`ETag` policies as needed.
- Test for stable header behavior.

**Benefits**:
- Lower latency and bandwidth use.
- Better CDN/proxy efficiency.
- More predictable documentation freshness.

### Options persistence scope and durability
**What this means**: Clarify whether options are per-process, per-instance, per-tenant, or durable across restart.

**What is required to implement**:
- Define storage model and lifecycle.
- If durable, implement persistence layer/migration.
- If scoped, document and test boundaries.

**Benefits**:
- Prevents surprising behavior in clustered deployments.
- Helps clients reason about state.
- Enables safer operational practices.

### Authentication and authorization model
**What this means**: Specify whether the API is public or protected and how access is controlled.

**What is required to implement**:
- Define auth mechanism (token/API key/OAuth/etc.).
- Add middleware and failure contracts.
- Document per-endpoint access requirements.

**Benefits**:
- Protects resources and usage.
- Supports multi-tenant/security requirements.
- Enables controlled production exposure.

### Rate limiting and abuse controls
**What this means**: Define how request volume is controlled and what happens at limits.

**What is required to implement**:
- Add per-IP/key/tenant throttling policies.
- Return clear limit headers and error responses.
- Add tests around threshold behavior.

**Benefits**:
- Improves service resilience.
- Prevents runaway cost and denial scenarios.
- Gives clients clear retry/backoff signals.

### Unsafe faker security policy
**What this means**: Formally define where unsafe faker expressions are allowed and defaults by environment.

**What is required to implement**:
- Document safe/unsafe modes and precedence rules.
- Add operational guardrails and audit logs.
- Ensure explicit opt-in in sensitive environments.

**Benefits**:
- Reduces code-injection risk.
- Improves governance and compliance posture.
- Makes deployment safer by default.

### Input sanitization and output encoding guarantees
**What this means**: Define how untrusted inputs are sanitized and how outputs avoid injection hazards per format.

**What is required to implement**:
- Enumerate format-specific escaping/sanitization rules.
- Add security-focused regression tests.
- Document limits and known unsafe constructs.

**Benefits**:
- Lowers security risk for downstream consumers.
- Improves trust in generated artifacts.
- Prevents latent injection bugs.

### Sensitive data handling in logs/diagnostics
**What this means**: Define what data may appear in logs and diagnostics and what must be redacted.

**What is required to implement**:
- Create redaction policy.
- Apply redaction centrally in logging and errors.
- Add tests for redaction behavior.

**Benefits**:
- Reduces privacy/compliance risk.
- Safer observability in production.
- Better incident handling without data leaks.

### Concurrency safety for mutable defaults/tips
**What this means**: Define and ensure correct behavior under concurrent reads/writes to options state.

**What is required to implement**:
- Define consistency model.
- Add locking/atomic update strategy if needed.
- Add concurrent mutation tests.

**Benefits**:
- Prevents race-condition bugs.
- More predictable multi-client behavior.
- Better correctness under load.

### Concurrent write conflict behavior
**What this means**: Clarify last-write-wins vs versioned update semantics for options updates.

**What is required to implement**:
- Choose conflict strategy.
- Optionally add version fields/ETag preconditions.
- Add conflict tests and docs.

**Benefits**:
- Avoids silent state clobbering.
- Better support for distributed clients.
- Clearer integration behavior.

### Startup/readiness/liveness contract
**What this means**: Define when service is ready and how health endpoints represent readiness vs liveness.

**What is required to implement**:
- Separate readiness/liveness semantics if required.
- Document startup fallback behavior and guarantees.
- Add tests around startup transitions.

**Benefits**:
- Safer orchestration in container platforms.
- Fewer false-positive health checks.
- Cleaner deployment automation.

### Graceful shutdown guarantees
**What this means**: Specify behavior for in-flight requests during shutdown.

**What is required to implement**:
- Implement signal handling and drain strategy.
- Define max drain timeout.
- Add controlled shutdown tests.

**Benefits**:
- Reduced request loss during deploys.
- More predictable operations.
- Better user experience.

### Structured logging requirements
**What this means**: Standardize log format and required fields for requests/errors.

**What is required to implement**:
- Define structured JSON log schema.
- Include route, method, status, latency, request ID.
- Add basic log contract tests.

**Benefits**:
- Easier querying and alerting.
- Faster troubleshooting.
- Better consistency across environments.

### Metrics requirements
**What this means**: Define required service metrics and labels.

**What is required to implement**:
- Publish counters/histograms by endpoint/status.
- Expose metrics endpoint or exporter integration.
- Add validation for key metric emission.

**Benefits**:
- Enables SLO tracking.
- Improves capacity planning.
- Faster anomaly detection.

### Tracing requirements
**What this means**: Define distributed tracing behavior and propagation.

**What is required to implement**:
- Add trace context extraction/injection.
- Create spans around major operations.
- Document sampling policy.

**Benefits**:
- End-to-end latency visibility.
- Faster root-cause analysis.
- Better cross-service observability.

### Validation contract for `/v1/generate`
**What this means**: Fully specify validation rules and allowed ranges/types for all fields.

**What is required to implement**:
- Formal schema for request payload.
- Stable error mapping for each validation failure.
- Boundary tests for each field.

**Benefits**:
- Stronger client integration confidence.
- Fewer ambiguous failures.
- Better generated SDK behavior.

### Row count limit and timeout behavior
**What this means**: Define hard limits and expected behavior for expensive generation requests.

**What is required to implement**:
- Set max rows and execution limits.
- Return explicit errors or partial contracts.
- Add load/boundary tests.

**Benefits**:
- Protects server resources.
- Improves predictability for clients.
- Prevents unstable latency spikes.

### Determinism contract scope
**What this means**: Define what deterministic guarantees hold across versions/dependencies.

**What is required to implement**:
- Document version sensitivity of deterministic outputs.
- Pin or version deterministic components where needed.
- Add compatibility checks in release process.

**Benefits**:
- Better reproducibility for CI/test generation.
- Fewer surprise regressions after upgrades.
- Clear expectations for consumers.

### Raw-mode content-type contract across all formats
**What this means**: Specify content type for raw responses for every supported output format.

**What is required to implement**:
- Enumerate format->content-type mapping in spec.
- Validate mapping with tests.
- Ensure consistency between docs and runtime.

**Benefits**:
- Better client parser behavior.
- Cleaner integration with downstream tools.
- Reduced ambiguity for API consumers.

### `/fromschema` content-type strictness policy
**What this means**: Define whether `text/plain` is mandatory or whether coercion is allowed.

**What is required to implement**:
- Choose strict or permissive policy.
- Implement validation behavior consistently.
- Document and test mismatch handling.

**Benefits**:
- Predictable client behavior.
- Better standards alignment.
- Easier debugging of integration issues.

### Schema grammar formalization
**What this means**: Provide a complete grammar/spec for schema syntax and invalid cases.

**What is required to implement**:
- Document grammar and examples.
- Define escaping/comment/blank-line rules comprehensively.
- Add parser conformance tests.

**Benefits**:
- Easier onboarding for users.
- Fewer misinterpretations of schema text.
- More robust long-term maintenance.

### Query/default precedence rules
**What this means**: Define deterministic precedence between explicit request params and server defaults.

**What is required to implement**:
- Document precedence table.
- Apply same logic across endpoints.
- Add tests for each precedence path.

**Benefits**:
- Eliminates ambiguity.
- Safer default-option usage.
- Easier client-side reasoning.

### `amend` input format contract
**What this means**: Clearly define accepted `inputFormat` values and per-format parsing guarantees.

**What is required to implement**:
- Publish accepted values and parser behavior.
- Document unsupported format failures.
- Add compatibility tests per format.

**Benefits**:
- Fewer client integration mistakes.
- Clearer import expectations.
- Better support experience.

### `amend` merge/typing/null semantics
**What this means**: Define exact behavior for header alignment, row overwrite, null/blank conversion, and data typing.

**What is required to implement**:
- Document merge algorithm and edge cases.
- Add detailed behavior tests.
- Keep behavior stable across releases.

**Benefits**:
- Prevents data surprises.
- Improves trust in amend workflows.
- Easier debugging for users.

### `amend` rowCount semantics
**What this means**: Specify behavior when `rowCount` is missing, zero, or exceeds imported rows.

**What is required to implement**:
- Document allowed values and failure modes.
- Add boundary tests.
- Ensure errors are consistent and machine-readable.

**Benefits**:
- Predictable amend operations.
- Clear safeguards against accidental misuse.
- Better client validation before requests.

### `stream` flag lifecycle in amend
**What this means**: Clarify whether `stream` is deprecated, ignored permanently, or planned.

**What is required to implement**:
- Document current status and future intent.
- If deprecated, add deprecation messaging/version plan.
- Keep tests aligned with declared policy.

**Benefits**:
- Reduces client confusion.
- Better compatibility planning.
- Cleaner API evolution.

### Options storage durability contract
**What this means**: Define whether options survive restart and deployment scale-out.

**What is required to implement**:
- Choose volatile vs durable backend.
- Add startup behavior docs.
- Add tests for persistence where applicable.

**Benefits**:
- Predictable operations for consumers.
- Fewer environment-specific surprises.
- Safer automation around defaults.

### Options precedence and reset policy
**What this means**: Specify how built-in defaults, custom defaults, and request-level options interact.

**What is required to implement**:
- Publish precedence order.
- Enforce in service layer.
- Add scenario tests covering precedence combinations.

**Benefits**:
- Clear behavior under mixed configuration.
- Easier troubleshooting.
- More stable API contract.

### Options key/value validation policy
**What this means**: Define allowed keys and accepted value domains/types per format.

**What is required to implement**:
- Maintain per-format schema.
- Reject invalid keys/values with explicit errors.
- Keep schema synchronized with docs/tests.

**Benefits**:
- Prevents silent misconfiguration.
- Improves API correctness.
- Better client-side validation generation.

### Atomicity/partial update behavior for options
**What this means**: Specify whether options updates are all-or-nothing and whether patch-style updates are supported.

**What is required to implement**:
- Define update semantics (replace/merge/patch).
- Enforce transaction-like behavior if needed.
- Add tests for partial failure scenarios.

**Benefits**:
- Prevents inconsistent option state.
- Clearer client expectations.
- Safer concurrent management.

### OpenAPI/runtime parity requirement
**What this means**: Ensure spec matches actual runtime behavior for all statuses, payloads, and content types.

**What is required to implement**:
- Add contract tests against OpenAPI.
- Update spec whenever behavior changes.
- Include raw-mode/content-type coverage in spec.

**Benefits**:
- Higher trust in generated clients/docs.
- Reduced integration drift.
- Better developer experience.

### OpenAPI example completeness
**What this means**: Provide representative success and error examples for each endpoint and mode.

**What is required to implement**:
- Add examples per route/mode/content type.
- Validate examples against schema.
- Keep examples current with behavior.

**Benefits**:
- Faster onboarding.
- Fewer support questions.
- Better quality SDK usage patterns.

### Versioning and deprecation policy
**What this means**: Define compatibility guarantees for `/v1` and process for breaking/non-breaking changes.

**What is required to implement**:
- Publish versioning rules and timelines.
- Add deprecation headers/announcements where needed.
- Track compatibility tests per release.

**Benefits**:
- Safer long-term adoption.
- Predictable upgrade planning.
- Lower downstream maintenance cost.

### Test coverage targets for negative and boundary paths
**What this means**: Set explicit minimum coverage and scenario requirements for edge cases.

**What is required to implement**:
- Define thresholds (statements/branches/functions).
- Add required negative/boundary test matrix.
- Gate CI on policy.

**Benefits**:
- Lower regression risk.
- Better confidence in contract stability.
- More disciplined release quality.

### Concurrency regression tests for options mutation
**What this means**: Add tests that intentionally race option writes/reads.

**What is required to implement**:
- Build concurrent test harness scenarios.
- Assert deterministic or documented outcomes.
- Include in CI regression suite.

**Benefits**:
- Early race detection.
- Stronger runtime reliability.
- Better behavior under real client load.

### Docs/openapi resilience tests under startup faults
**What this means**: Validate behavior of docs/spec routes when startup/runtime dependencies fail.

**What is required to implement**:
- Add failure-mode tests for startup edge cases.
- Verify stable error responses/logging.
- Document fallback behavior.

**Benefits**:
- Better operational robustness.
- Fewer surprises in degraded states.
- Improved monitoring/alert confidence.

### Performance and SLO requirements
**What this means**: Define latency/throughput targets for representative payload sizes and formats.

**What is required to implement**:
- Set measurable SLOs.
- Add performance tests and budgets in CI or periodic runs.
- Instrument and alert on SLO breaches.

**Benefits**:
- Predictable user experience.
- Better capacity planning.
- Proactive performance regression detection.
