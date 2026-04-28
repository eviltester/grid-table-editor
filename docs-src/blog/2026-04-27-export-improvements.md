---
slug: export-improvements
title: Export XML, SQL, JSONL
authors: alan
tags: [release]
date: 2026-04-27T19:00
---

New export features like XML, SQL and JSONL plus improved the speed for exporting large datasets and improved on screen tips.

<!--truncate-->

## Large File Exports

There is no point being able to upload and amend 1,000,000+ record files if they are painful to export.

So now they are not.

You'll see visual progress indicators and the page should not freeze, it should just export data well.

## XML, JSONL and SQL

Export all the L's, now you can export the data as:

- [XML](/docs/data-formats/xml/xml)
- [JSONL](/docs/data-formats/jsonl/jsonl)
- [SQL](/docs/data-formats/sql/sql)

There should be enough options on the XML and SQL to handle most common simple variants.

## Tips a-go-go

We've now added tips on all export option options so you can hover and see what the option does.

They are all documented in the docs, but this way you don't have to check.

And to make Faker a little easier we've added documentation of the faker methods in the tips (once you choose one), and linked off to the Faker documentation so you can read about the option in more detail.

## Bug Fixes for Faker

We hadn't mapped Faker internally properly so some of the options you could choose would render as `[object Object]` and as a sub-object in JSON.

But no longer.

Now you can choose `airline.airline.iataCode` instead of just `airline.airline`.
