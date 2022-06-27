---
sidebar_position: 2
title: "HTML Table Options"
description: "Options available for generating HTML Tables: Pretty Printing, compact output, adding thead and tbody."
---

The options for HTML are all output options.

## Compact

The `Compact` checkbox allows you to remove all new lines from the generated HTML to create a very compact representation of the HTML Table.

## Pretty Print

Pretty Print will indent the HTML lines using the `Delimiter` option as the first character in the line.

## Delimiter

`Delimiter` allows you to choose the spacing at the start of a line for pretty printing.

- Tab
- Space
- Custom Value

When `Custom Value` is chosen, the string entered in the `Custom` field is used at the start of a line.

## Custom

The `Custom` text entry is the string added at the front of each HTML output line e.g. to add three spaces instead of one `   `.

This is only used when `Pretty Print` is selected and the `Delimiter` is `Custom Value`.

## Add `<thead>`

This will add the `thead` element to the output as the parent for the header row.

## Add `<tbody>`

This will add the `tbody` element to the output as the parent for the main table data rows.
