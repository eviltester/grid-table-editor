---
slug: gherkin-output-options
title: Gherkin Table Output Options
authors: alan
tags: [release]
date: 2022-06-19T12:00
---

Can now control Gherkin output.

<!--truncate-->

## Gherkin Options

I've added options to the Gherkin output now so it is possible to:

- pretty print gherkin to pad out the cell widths
- indent the table from the left
- add in cell padding to the left, right or both sides
- hide or show the heading

## Gherkin Data Tables

Gherkin is a literate Executable requirements format used in tools such as Cucumber.

The Gherkin syntax supports table format to make it easier to pass in a set of data to work from when executing the requirement spec.

Since these are designed for humans they need to be readable so adding spaces and indenting to aid readability is important, hence the options in Any Way Data.

e.g. an example Gherkin Data Table

```
Given the following user details are present:
  | name | email       |
  | Bob  | bob@bob.bob |
```

Tables are described in the [Cucumber documentation](https://cucumber.io/docs/gherkin/reference/#data-tables).