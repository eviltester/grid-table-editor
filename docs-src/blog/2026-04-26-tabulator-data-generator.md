---
slug: tabulator-speed-generation
title: Tabulator, improved data generation and amendment
authors: alan
tags: [release]
date: 2026-04-26T16:00
---

Tabulator is now the default Grid. And you can now generate data into an existing table to amend it, rather than just from scratch - oh and we improved large file handling.

<!--truncate-->

## Tabulator

[Tabulator](https://tabulator.info/) is now the default data grid used in the UI. You can still use ag-grid if you put ?grid=ag-grid after the url.

This was to remove the dependency on any specific Grid, try to reduce the amount of dependency load, and to help streamline the code so that it isn't tied to a specific component.

## Speed Improvements

During testing we noticed that the system didn't handle large files particularly well.

e.g. a 240 MB, 1,000,000+ row, with 20+ fields took a long time to load and was hard to amend.

So we fixed it and that now works without issues in the Tabulator and AG Grid version.

## Amend Data

One thing that kept happening during production use was that I wanted to load in a file and amend it e.g. change all the names to random names.

Now the Test Data section in the main app allows you to:

- Create a new table - the old default behaviour
- Amend a table - amend a specific number of rows in the grid (defaults to all rows)
- Amend selected rows - amend the selected rows

The Test Data Schema will add new columns if they are not there and amend the content of existing data.

You can then convert the file into different formats or save the file.

## Generator

We split the 'new generator' into a new page.

This shows a preview by default and the generation happens directly to file.

We are also in the process of changing the generation UI so it doesn't depend on the prototype Grid Data Schema editing.

More to come over the next few months.
