---
slug: even-more-programming-language-exports
title: "Even More Programming Language Exports: PHP, Ruby, Kotlin, C#, and Perl"
authors: [alan]
tags: [release, export, php, ruby, kotlin, csharp, perl]
date: 2026-05-01T17:00
---

We have added **Perl export support** to the grid editor and generator, alongside the new C#, Kotlin, Ruby, and PHP export capabilities.

This extends the programming-language export options beyond JavaScript, Python, Java, and TypeScript with PHP-, Ruby-, Kotlin-, C#-, and Perl-focused formats.

<!--truncate-->

All new language exports are available in:

- the app **Code** language tab
- the generator **Output Format** dropdown
- alphabetical code-language ordering in the UI tabs

## PHP

PHP export supports:

- collection type (`array(...)` or `[ ... ]`)
- assign to variable (custom variable name)
- Number Convert (quoted vs unquoted numbers)
- anonymous associative-array rows or named object rows
- object class name
- pretty print delimiter (including custom delimiter)

- [PHP Data Format](/docs/data-formats/php/php)
- [PHP Options](/docs/data-formats/php/options)

## Ruby

Ruby export supports:

- collection type (`[ ... ]` or `Array[ ... ]`)
- assign to variable (custom variable name)
- Number Convert (quoted vs unquoted numbers)
- anonymous hash rows or named object rows
- object class name
- pretty print delimiter (including custom delimiter)

- [Ruby Data Format](/docs/data-formats/ruby/ruby)
- [Ruby Options](/docs/data-formats/ruby/options)

## Kotlin

Kotlin export supports:

- collection type (`listOf(...)` or `arrayOf(...)`)
- assign to variable (custom variable name)
- Number Convert (quoted vs unquoted numbers)
- anonymous map rows or named object rows
- object class name
- pretty print delimiter (including custom delimiter)

- [Kotlin Data Format](/docs/data-formats/kotlin/kotlin)
- [Kotlin Options](/docs/data-formats/kotlin/options)

## C#

C# export supports:

- collection type (`new List<object> { ... }` or `new[] { ... }`)
- assign to variable (custom variable name)
- Number Convert (quoted vs unquoted numbers)
- anonymous dictionary rows or named object rows
- object class name
- pretty print delimiter (including custom delimiter)

- [C# Data Format](/docs/data-formats/csharp/csharp)
- [C# Options](/docs/data-formats/csharp/options)

## Perl

Perl export supports:

- collection type (array ref `[ ... ]` or list `(... )`)
- assign to variable (custom variable name)
- Number Convert (quoted vs unquoted numbers)
- anonymous hash rows or blessed object rows
- object class name
- pretty print delimiter (including custom delimiter)

- [Perl Data Format](/docs/data-formats/perl/perl)
- [Perl Options](/docs/data-formats/perl/options)

More language export improvements are planned as we continue to make generated data easier to embed directly in application code.
