---
slug: html-import-dsv-options
title: HTML Table Import and CSV Delimiter Options
authors: alan
tags: [release]
date: 2022-06-11T12:00
---

Can now configure CSV and Generic Delimited Outputs, and added support for HTML Table input.

<!--truncate-->

## Refactoring

I've performed a lot of refactoring on the code to make adding more importers and exporters simpler.

## CSV Options

I'm introducing options to the export panes to aid configuration of the output.

The first export format to get this is the delimited output.

Specifically CSV, so it is now possible to add or remove quotes, export without a header and change the quote or escape character when exporting to CSV.

## DSV - Delimiter Separated Values

Internally CSV was always a special case of a Generic Delimiter Separated Value.

I've exposed this to the GUI now so it is possible to export as:

- tab delimited
- various hard coded formats like Hash, Colon, etc.
- custom delimiter to add your own delimiter

The custom delimiter supports multi character delimiters so if you want to output a CSV file with a space after each comma then you can set that up on the `Delmited` output tab.

## HTML Table Import

The first version of the HTML convertor only supported generating HTML.

Now I've added an importer to allow importing `<table>` formatted HTML tables for editing in the data table editor.

## More to come

I've added a lot of TODOs into the code to expand out the options and make notes on new import/export formats that the tool will support.