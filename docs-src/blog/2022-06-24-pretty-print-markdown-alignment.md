---
slug: pretty-print-markdown-alignment
title: Left, Center and Right Alignment in Pretty Print Markdown
authors: alan
tags: [release]
date: 2022-06-23T23:00
---

Markdown output will now use the global alignment setting to right align and center align cell values.

<!--truncate-->

I read a [blog post from Github](https://github.blog/2022-06-10-how-we-think-about-browsers/) about how they determine which features of browsers to use, maintain backwards compatibility and architect the system for cross-browser and multiple version support.

I noticed that they had a Markdown table using the alignment settings for pretty printed output.

I thought it looked pretty good so I amended the layout algorithms for Markdown output to support the alignment.

## Default Pretty Printing Markdown Tables

Which means by default the pretty printed Markdown tables in [AnyWayData.com](https://AnyWayData.com) look like:

```
|A Column|B Column|C Column|
|--------|--------|--------|
|a       |a b     |a b c   |
|a       |a b     |a b c   |
|a       |a b     |a b c   |
```

## Left Aligned Cells Pretty Printing Markdown Table

When the `Column Align` property is set to `left` align, then the alignment `:` is added to the table:

```
|A Column|B Column|C Column|
|:-------|:-------|:-------|
|a       |a b     |a b c   |
|a       |a b     |a b c   |
|a       |a b     |a b c   |
```

## Center Aligned Cells Pretty Printing Markdown Table

When the `Column Align` property is set to `center` align, then the alignment `:---:` is added to the table:

```
|A Column|B Column|C Column|
|:------:|:------:|:------:|
|   a    |  a b   | a b c  |
|   a    |  a b   | a b c  |
|   a    |  a b   | a b c  |
```

## Right Aligned Cells Pretty Printing Markdown Table

When the `Column Align` property is set to `right` align, then the alignment `---:` is added to the table:

```
|A Column|B Column|C Column|
|-------:|-------:|-------:|
|       a|     a b|   a b c|
|       a|     a b|   a b c|
|       a|     a b|   a b c|
```

## Pretty Printing Markdown Tables

This seems to be a much 'prettier' way of representing the pretty-printed tables and when we add functionality in the future to control alignment on a column by column basis then this functionality will carry through.