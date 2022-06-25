---
sidebar_position: 1
title: "Markdown Tables"
description: "Markdown is a popular format for converting to HTML or PDF, Markdown tables are not easy to edit or format in a normal text editor, but AnyWayData.com makes working with Markdown tables simple."
---

## What is Markdown

Markdown is a text representation which can be easily read and created by humans, and is easy to convert to other formats for publication like pdf or html.

For example, the following text is a simple Markdown document with headings and text in bold.

```
# This is a Heading 1

This is a paragraph of text.

## This is a Sub Heading

And **this text is in bold.**
```

Markdown supports:

- links `[link text](url to link to)`
- italics `_italics_`
- horizontal rules `---`
- images `![caption or alt](url of the image)`

For a full description of Markdown format and syntax we recommend using [MarkdownGuide.org](https://www.markdownguide.org/).

## Markdown Tables

Most of the syntax for a Markdown document is very simple, the challenge comes with you want to create a table of data.

For example, a simple Markdown table would look like:

```
|Column A|Column B|Column C|
|-----|-----|-----|
|a|a b|a b c|
|a|a b|a b c|
|a|a b|a b c|
```

There is a Heading row, the heading delimiter row, followed by rows of data.

This is often difficult to work with because of the need to add "|" symbols to represent columns.

With a large table this becomes very tricky.

Also, since Markdown is supposed to be human readable, we would ideally want the Markdown Tables to be well formatted, but this is difficult to do by hand.

e.g. a pretty printed and well formatted Markdown Table.

```
| Column A | Column B | Column C |
| -------- | -------- | -------- |
| a        | a b      | a b c    |
| a        | a b      | a b c    |
| a        | a b      | a b c    |
```

## Converting Markdown to HTML

There are many tools available to convert Markdown to HTML.

Online tools we recommend for working online with Markdown, to convert to other formats are:

- [MarkdownLivePreview.com](https://markdowntohtml.com/) to quickly convert Markdown into a reviewable format.
- [MarkdownToHtml.com](https://markdowntohtml.com/) to quickly convert to HTML

We have a list of other tools for working with Markdown in our [Markdown Previewers and Editors](/docs/misc/related_tools#markdown-previewers-and-editors) reference section.

## Working With Markdown in AnyWayData.com

AnyWayData.com supports importing from, and exporting to, Markdown formatted tables.
