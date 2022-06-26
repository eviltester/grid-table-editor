---
sidebar_position: 2
title: "Delimited Options"
description: "Options available for converting to Delimited files in AnyWayData.com. This could be tab delimited, pipe delimited or any other delimited file configuration required."
---

The configuration options for Delimited data sets are listed below. These are similar to [CSV](/docs/data-formats/csv/csv) but are more flexible because you can control the delimiter value.

## Delimiter

The `Delimiter` select option offers a choice of the most common delimiters. A Select drop down is used because some values like Tab can be hard to input in a form.

Choose from:

- Tab [\\t]
- Comma [,]
- Hash [#]
- Colon [:]
- Pipe [|]
- Space [ ]
- Semicolon [;]
- Slash [/]
- Slash [\\]
- Custom Value

The `Custom Value` option should be chosen when you want to use the value entered as the `Custom` input.

## Custom

The `Custom` text area allows you to enter any delimiter that you want. This can be a multi-character input, you are not restricted to a single character.

## Use Quotes

The `Use Quotes` options allows you to configure when quotes are added to the values:

- when checked, then every value in the delimited file will be wrapped with quotes
- when unchecked, the only values containing quotes or the delimiter will be wrapped with quotes

## Use Header

`Use Header` configures if the row header will be added to the first line of the delimited file or not.

## Quote Char

The `Quote Char` option configures the quote character to use.

By default this will be `"` but some tools may prefer `'`, and if so you can reconfigure the output.

## Escape Char

The `Escape Char` option configures the character that will be used in front of the `Quote Char` when the `Quote Char` is present in the value.

Most of the time this will be the same as the `Quote Char` itself, but you may need to configure it to `\` or some other value for other tools.