---
slug: markdown-tables-pretty-print
title: Pretty print option for Markdown Tables
authors: alan
tags: [release]
date: 2022-06-20T12:00
---

Can now pretty print Markdown table output to pad out the column width to the contents.

<!--truncate-->

## Markdown Options

I've added an option to the Markdown output now so it is possible to pretty print Markdown to pad out the cell widths in the same manner that AsciiTable markdown output and the Gherkin output does, but because it is combined with the other Markdown options it offers more output control.

Because the Markdown heading separator can have alignment identifiers (":---") this required a slightly different algorithm.


## Markdown Tables Without Pretty Print

The pretty print is purely cosmetic and if you are using the tables in a document to convert to HTML or PDF then you don't really need to print them.

```
|firstname|lastname|
|-----|-----|
|Elvis|Donnelly|
|Vella|Marks|
|Jacques|Gislason|
|Roxane|Okuneva|
```

## Markdown Tables With Pretty Print

But, if your Markdown serves a dual purpose where the `.md` file should also be readable then pretty print can help.

```
|firstname|lastname|
|---------|--------|
|Elvis    |Donnelly|
|Vella    |Marks   |
|Jacques  |Gislason|
|Roxane   |Okuneva |
```

## AnyWayData.com will import pretty printed tables

Because AnyWayData.com will import pretty printed tables it becomes a useful tool for maintaining the tables.

- Paste them in to the text area,
- click "Set Grid From Text"
- edit the data
- Regenerate with Pretty Print