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
- [AG Grid](https://ag-grid.com) for the data table
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

## CI Coverage Artifacts

GitHub Actions runs linting and tests for pushes and pull requests to `master`.

The workflow also publishes coverage output as build artifacts on each run:

- `coverage-report-node-18.x` contains the full `coverage/` directory
- `coverage-html-report-node-18.x` contains the HTML report from `coverage/lcov-report/`

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