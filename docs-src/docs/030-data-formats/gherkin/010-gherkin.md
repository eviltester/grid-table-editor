---
sidebar_position: 1
title: "Gherkin"
description: "The Gherkin data format is a tabular format for feeding data values into an executable specification or BDD style scenario."
---

The Gherkin data format is a tabular format for feeding data values into an executable specification or BDD style scenario.

## What is Gherkin

Gherkin is a tabular ascii format, much like the Markdown table format, used in BDD style tools like [Cucumber](https://cucumber.io/).

One of the main difference with Markdown is that there is no delimiter row to separate the heading from the data rows.

The table is embedded within a scenario description either in the main text for a Given, When, or Then statement. Or as a set of Examples.

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

A few Gherkin References:

- [Cucumber Gherkin Reference](https://cucumber.io/docs/gherkin/reference/)
- [Data Table Code Examples in Java](https://www.tutorialspoint.com/cucumber/cucumber_data_tables.htm)
- [More Data Table Examples in Java](https://www.ontestautomation.com/using-data-tables-in-cucumber-jvm-for-better-readable-specifications/)

## Support For Gherkin

AnyWayData supports importing and exporting Gherkin tables.

These can then be converted to other formats. More likely you will convert HTML table data or CSV data to Gherkin for use in a BDD executable specification.