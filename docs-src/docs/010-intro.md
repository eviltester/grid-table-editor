---
sidebar_position: 1
title: About
---

# About Data Table Editor and Generator

A Simple Data Table Editor and Test Data Generator.

Free to use and Open source.

## Main Editor Features:

- Load Data into an editable Data Grid
- Sort and Filter Data in the grid
- Filter globally across all fields
- Edit data in the grid itself
- Add new columns
- Rename Columns
- Re-order columns
- Re-order rows
- Export Data to files
- Add new rows to the table
- Delete selected rows from the table
- Edit as text and import into the data grid

## Import/Output Features:

- Import Markdown Tables for editing
- Import CSV files for editing
- Import JSON files for editing
- Import Gherkin tables for editing
- Export Data Grid as Markdown
- Export Data Grid as CSV
- Export Data Grid as JSON
- Export Data Grid as Gherkin Table format
- Export Data Grid as HTML
- Export Data as File
- Export Data to Clipboard
- Drag and Drop files to import data

## Test Data Generation Features

- Define Columns in an editable Grid
- Define Test Data as Regular Expressions
- Define Test Data using Faker.js functions
- No limit to the number of rows you can generate


## CLI Version - Windows, Mac, Linux

An experimental CLI version is available to download from the [releases page on Github](https://github.com/eviltester/grid-table-editor/releases).

Currently this implements the Test Data Generation using the same Test Data Spec format as the web version and outputs to CSV format.

- [Downloads for Windows, Mac, Linux](https://github.com/eviltester/grid-table-editor/releases)

e.g. given an input file called `faker-regex.txt`

```
Company
company.name
Regex Generated Field
[A-Z]{3,6}[0-9]{0,6}
```

The following command would generate 3000 records into `output.txt`

```
./anywaydata generate –i ./company.txt -n 3000 –o output.txt 
```

Example output:

```
"Company","Regex Generated Field"
"Jones and Sons","QZRGC"
"Kunze, Morissette and Daniel","YMHV89"
"Cole, Padberg and Cronin","QGG"
```

### CLI on Mac

For Mac you will need to give the application permissions to run.

Allow it to run – either from `System Settings > Privacy & Security` 

Or:

```
xattr -dr com.apple.quarantine "/path/to/your/app.app/Contents/MacOS/executable" 
``` 

e.g. `xattr -dr com.apple.quarantine "$(pwd)/anywaydata"` 

Set as executable in command line: 

```
chmod +x anywaydata 
```

---

Built by [Alan Richardson](https://eviltester.com)

Using:

- [AG Grid](https://ag-grid.com) Community Edition
- [RandExp.js](http://fent.github.io/randexp.js/)
- [Faker.js](https://fakerjs.dev/)
- [PapaParse](https://www.papaparse.com/)

[[github source](https://github.com/eviltester/grid-table-editor)]