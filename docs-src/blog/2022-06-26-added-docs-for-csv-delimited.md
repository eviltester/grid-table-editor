---
slug: docs-csv-delimited
title: Added Documentation for CSV and Delimited Files
authors: alan
tags: [release]
date: 2022-06-26T13:00
---

We now have documentation for [CSV](/docs/data-formats/csv/csv) and [Delimited](/docs/data-formats/delimited/delimited)

<!--truncate-->

## Delimited Data

CSV, or Comma Separated Values, is a special case of a Delimited file, but we have separate support for CSV simply because it is the most popular delimited data format.

There are no formal standards for delimited data. The general conventions for delimited data are:

- option first line defines the header values
- every line after the header represents a line of data
- a delimiter character is used to separate fields e.g. "," in the case of CSV
- values are quoted when they contain a quote or a delimiter
- some delimiter files quote all fields

This is a very flexible input and output format and we support many configuration options:

- [CSV Configuration Options](/docs/data-formats/csv/options)
- [Delimited Configuration Options](/docs/data-formats/delimited/options)


## Tips

Most tools that handle data will be able to import CSV so this is the most flexible for data interchange using files.

I generally Use Quotes for all values so that they are wrapped with quotes as this provides the widest compatibility between tools.

When copy and pasting tabular data between tools, Tab delimited is a more common format and is likely to work best.

## Conversion

Because any of the data formats in AnyWayData.com can be converted to any other format you use AnyWayData.com to:

- import CSV and Delimited files
- export to CSV and Delimited files
- edit imported data
- re-order and delete columns from CSV or Tab delimited files
- delete rows from CSV or Delimited files

This makes AnyWayData.com a suitable tool for ad-hoc editing of data prior to importing into a Data Analysis tool or spreadsheet.

Also the conversion to Ascii Table formats, including Markdown, make it easy to create human readable versions of delimited tool output.

If you are testing and automating an application while using a BDD style tool, then you can easily import CSV or Tab delimited data, filter and edit it prior to exporting to Gherkin for use in your automated execution.