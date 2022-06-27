---
slug: docs-html-tables
title: Added Documentation for HTML Tables
authors: alan
tags: [release]
date: 2022-06-27T08:00
---

We now have documentation for [HTML Tables](/docs/data-formats/html/html-tables) and [Options](/docs/data-formats/html/options)

<!--truncate-->

## HTML Tables

HTML Tables are the default tabular representation on web pages.

It would be nice if Web Pages offered the option to 'right click' and save tables in different data formats, but they don't.

With AnyWayData.com you can copy in the HTML for any table, edit in the data grid and convert to any of the supported formats e.g.

- convert HTML Table to CSV
- convert HTML Table to Markdown
- convert HTML Table to Ascii Table
- convert HTML Table to Json
- etc.

## Tips

Using the browser dev tools it is possible to right click the table in the web page, inspect the element and 'copy outer html' to get the HTML into the clipboard, or 'edit as html' and copy and paste.

Any HTML table that can be rendered, can be imported, but:

- styling is not carried through because we want to work with the raw data, not the styles
- row spanning and column spanning are not supported so you would see 'undefined' in the data grid for those cell values

