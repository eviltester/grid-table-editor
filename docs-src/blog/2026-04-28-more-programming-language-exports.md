---
slug: more-programming-language-exports
title: More Programming Language Exports
authors: alan
tags: [release]
date: 2026-04-28T19:00
draft: true
---

We've expanded export options for programming-language-style output so it is easier to move table data into application code.

This release builds on the existing JavaScript export and adds Python export support with configurable output options.

<!--truncate-->

## Why Programming Language Exports?

Sometimes you don't want to exchange data between tools in CSV or JSON.

Sometimes you need code-ready output to paste into tests, fixtures, scripts, notebooks, demos, or prototypes.

Programming language exports make that easier by producing output that is directly usable in source files.

## Python

Python export supports both dictionary-style and object-style output and includes options for quote styles, blank value handling, imports, pretty printing, and decimal handling.

Read the docs:

- [Python Data Format](/docs/data-formats/python/python)
- [Python Options](/docs/data-formats/python/options)

## JavaScript

JavaScript export continues to support object-array output with configurable formatting and conversion options.

Read the docs:

- [Javascript Data Format](/docs/data-formats/javascript/javascript)
- [Javascript Options](/docs/data-formats/javascript/options)

## What Next?

We'll continue adding language-oriented export options and improving formatting controls so generated output is easier to use directly in real projects.
