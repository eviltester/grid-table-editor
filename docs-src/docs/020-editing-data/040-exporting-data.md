---
sidebar_position: 4
title: "Exporting Data"
---

# Exporting Data

Exporting Data is driven by the data in the Data Grid.

The Exported Data Format depends on the tab which has been selected e.g. `Markdown` or `CSV`.

## Exporting to File

When a tab has been selected the download button will change to match the format e.g. `.md download` or `.csv download`.

Pressing the download button will start a conversion of the data in the grid to the specific format.

### File transport settings

Downloads also support file-only transport settings:

- line endings: `LF` or `Windows (CR/LF)`
- optional UTF-8 `BOM`

These settings are useful when:

- a Windows tool expects `CR/LF`
- a spreadsheet or editor works better with BOM-prefixed UTF-8 files
- you want the downloaded file to match the target toolchain without changing the on-screen preview text

Example:

- preview text can stay normal `LF` text in the browser
- downloaded `.csv` can use `CR/LF` plus `Include BOM`

## Exporting to Clipboard

To export to clipboard either:

- select the data in the text area and use normal copy keyboard shortcuts or the right click context menu.
- press the `[Copy]` button to the right of the clipboard

> *NOTE:* if the data in the grid has been edited ensure you press the `v Set Text From Grid v` button before copying to the clipboard to make sure the data in the clipboard matches the data in the grid.
