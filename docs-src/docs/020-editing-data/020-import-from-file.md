---
sidebar_position: 2
title: "Import From File"
description: "Data can be imported from various file types."
---

# Importing from Files

The set of tabs `Markdown | CSV | JSON` etc. configure the current import and export format.

To import from a particular file format:

- choose the tab for a particular format e.g. `Markdown`
- click the `Choose file` button
- choose a Markdown file to load

The data will then be loaded into the Data Grid for editing via the grid, and shown in the text area for text editing.

## Drag And Drop Import

Once a file format tab has been selected it is also possible to drag and drop a file on to the GUI to start an import.

e.g. if `CSV` tab is chosen then the Drop Zone will read `[Drag And Drop .csv File Here]`, allowing you to drag and drop a file to this area to trigger an import.

## Import settings

The `Import settings` disclosure lets you normalize imported data before it is loaded into the grid.

### Trim every imported value

Enable trimming when your source file contains accidental leading or trailing whitespace in cells.

Example:

```text
" Alice "," active "
```

Imported with trim enabled becomes:

```text
"Alice","active"
```

### Trim only selected fields

If you only want to normalize certain columns, turn on selected-field trimming and provide a comma-separated list of field names.

Example field list:

```text
Name, Email
```

This is useful when:

- imported identifiers should keep whitespace exactly as-is
- human-entered fields such as `Name` or `Email` need cleanup
- you are preparing imported data for amend workflows and want more predictable matches

The trim settings apply to both file import and clipboard import.
