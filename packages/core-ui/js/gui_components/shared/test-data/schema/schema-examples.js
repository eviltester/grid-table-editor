/*
 * Responsibilities:
 * - Stores reusable schema example text snippets for test-data UIs.
 * - Keeps app/grid and generator examples in a single source of truth.
 */

const TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT = `Literal Example
literal(Pending Review)
Enum Example
enum("Open","In Progress","Closed")
Enum Example 2
enum("High","Medium","Low")
Regex Example
[A-Z]{3}-\\d{4}
Domain Example
person.fullName`;

const GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT = `# Example schema
First Name
person.firstName

Last Name
person.lastName

Email
internet.email

Status
active,inactive,pending

Priority
high,medium,low

Created Date
date.recent`;

export { TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT, GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT };
