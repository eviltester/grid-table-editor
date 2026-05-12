# API Testing with Playwright

This directory contains REST API tests for the AnyWayData API using Playwright.

## Quick Start

### Run All API Tests
```bash
pnpm run test:api
```

### Run Specific Test Suites

Run these from the repository root (`D:\github\grid-table-editor`):

```bash
# Health and documentation endpoints
pnpm exec playwright test apps/api/src/tests/health/ --config=playwright-api.config.js

# Data generation endpoints
pnpm exec playwright test apps/api/src/tests/generate/ --config=playwright-api.config.js

# Schema-based generation endpoints
pnpm exec playwright test apps/api/src/tests/fromschema/ --config=playwright-api.config.js

# Options management endpoints
pnpm exec playwright test apps/api/src/tests/options/ --config=playwright-api.config.js
```

### Endpoint Structure
- **All endpoints are versioned under `/v1/`** for consistency
- **`/v1/generate/fromschema`** - Uses text/plain request bodies with URL query parameters
- **Options endpoints** - Manage default generation options for each output format

### Debug Tests
```bash
# Run with verbose output
pnpm run test:api:verbose

# Run in headed mode (for debugging)
pnpm run test:api:headed
```

## Configuration

The API tests use a separate Playwright configuration (`playwright-api.config.js`) optimized for API testing:

- **No browser UI** - Uses request context only
- **Faster execution** - No page loading overhead
- **Isolated environment** - Each spec file gets its own server instance, reused across tests in that file
- **Comprehensive reporting** - JSON and HTML reports
- **CI optimized** - Different settings for CI vs local development

## Integration with Build Pipeline

API tests are integrated into the build verification process:

```bash
# Local verification (includes API tests)
pnpm run verify:local

# CI verification (includes API tests)  
pnpm run verify:ci
```

## Test Data Examples

### Valid Text Specifications
```
# Simple single column
Name
Bob

# Multiple columns with faker expressions
Name
firstName
Email  
email
Age
datatype.number({"min": 18, "max": 65})
```

### API Request Examples
```javascript
// JSON request to /v1/generate
{
  "textSpec": "Name\nfirstName",
  "rowCount": 5,
  "outputFormat": "json",
  "responseFormat": "all",
  "seed": 12345
}

// Query parameters for /v1/generate/fromschema
?rowCount=10&outputFormat=csv&responseFormat=raw&seed=54321
```

## Debugging

### View Test Results
```bash
# Open HTML report (generated after local test runs)
pnpm exec playwright show-report test-results/api-report

# JSON results are generated in CI when the JSON reporter is enabled
# Local `pnpm run test:api` runs use the list and HTML reporters only
```
