---
sidebar_position: 2
title: "CSV Options"
description: "Options available for converting to CSV in AnyWayData.com"
---

The configuration options for CSV are listed below.

## Use Quotes

The `Use Quotes` options allows you to configure when quotes are added to the values:

- when checked, then every value in the CSV file will be wrapped with quotes
- when unchecked, the only values containing quotes or commas will be wrapped with quotes

## Use Header

`Use Header` configures if the row header will be added to the first line of the CSV file or not.

## Quote Char

The `Quote Char` option configures the quote character to use.

By default this will be `"` but some tools may prefer `'`, and if so you can reconfigure the output.

## Escape Char

The `Escape Char` option configures the character that will be used in front of the `Quote Char` when the `Quote Char` is present in the value.

Most of the time this will be the same as the `Quote Char` itself, but you may need to configure it to `\` or some other value for other tools.