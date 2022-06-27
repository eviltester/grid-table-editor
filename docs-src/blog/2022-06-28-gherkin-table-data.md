---
slug: gherkin-tables
title: Added Gherkin Documentation
authors: alan
tags: [release]
date: 2022-06-27T18:00
---

We now have documentation for [Gherkin](/docs/data-formats/gherkin/gherkin) and [Options](/docs/data-formats/gherkin/options)

<!--truncate-->

## Gherkin

Gherkin is a simple human readable format for executable specifications.

It is written in a `Given`, `When`, `Then` format and data tables are used to repeat the specification with different values.

This makes it easy to specify lots of combinations of data for execution in a very readable manner.

One of the most popular tools to implement Gherkin is [Cucumber](https://cucumber.io/docs/gherkin/reference/)

For Example:

```
Scenario Outline: Calculate World Population Share
  Given we know the stats for a Country named <Country>
  When we account for a specific <Population> count
  Then the calculated world populate percentage is <Share>

  Examples:
     | Country       | Population    | Share   |
     | China         | 1,439,323,776 | 18.47 % |
     | India         | 1,380,004,385 | 17.70 % |
     | United States | 331,002,651   | 4.25 %  |
```

This is a human readable specification and you an imagine the `<Country>`, `<Population>` and `<Share>` values being picked up by repeating the specification for each value in the table.

A programmer writes the code to execute for each of the `Given`, `When` and `Then` statements to allow the specification to be executed against an application to check if the functionality matches the specification and behaves as expected.

AnyWayData offers support for both import and export of  [Gherkin](/docs/data-formats/gherkin/gherkin) tables.

