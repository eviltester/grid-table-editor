---
sidebar_position: 1
title: "Delimited"
description: "Delimited, DSV, or Delimiter Separated Values can refer to any set of data with a delimiter e.g. Tab Delimited, Pipe Delimited or even Comma Delimited. You can import, edit and export any delimited file and convert to Markdown and other formats."
---

Delimited, DSV, or Delimiter Separated Values can refer to any set of data with a delimiter e.g. Tab Delimited, Pipe Delimited or even Comma Delimited. You can import, edit and export any delimited file and convert to Markdown and other formats.

## What is a Delimited File

A Delimited file is one where the data values are separated by some sort of delimiter e.g. Tab Delimited, or Pipe Delimited. Comma Delimited files are the most common delimiter in use but they are really just a special case of a Delimited file.

CSV is one of the most common data interchange formats, but Tab delimited files are also frequently used.

Tab delimited is often the interchange format used when copy and pasting between spreadsheets. So if you want to copy data out of AnyWayData.com and into a spreadsheet or grid view in some other tool then a Tab Delimited output will likely do the job.

A delimited file consists of an optional header line followed by lines of data. Each column is separated by a chosen delimiter e.g. using `:`

```
"Country":"Population":"World Share"
"China":"1,439,323,776":"18.47 %"
"India":"1,380,004,385":"17.70 %"
"United States":"331,002,651":"4.25 %"
```

Because the values can themselves contain the delimiter the data values are often wrapped in quotes e.g. `"`

And because the quoted values can contain `"` there has to be a convention for 'escaping' the quote value and this is usually done by adding two quotes together e.g. `""`.

Because of the complexity around making sure all the values are quoted properly delimited files can be painful to create by hand.

## Support for Delimited Files

AnyWayData.com allows both import and export of delimited files.

Allowing you to convert from Tab Delimited or any custom delimiter to any of the supported output formats like Markdown, JSON, Ascii-Text, etc.

And you can edit any delimited file:

- change values
- re-order the columns
- delete columns
- delete rows

We use the open source [papa parse](https://www.papaparse.com/) library for our delimited file input and output processing.


