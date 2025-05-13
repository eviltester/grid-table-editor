---
sidebar_position: 1
title: "Random Data"
description: "Generate random data for the grid"
---

# Test Data Generation

By 'opening' the `Test Data` section in the GUI it is possible to Generate a Data Grid filled with Random Data.

## Test Data Grid

The Test Data Grid contains the 'schema' or 'template' to use to generate data for the grid.

Each row represents a Column in the final data grid.

Add a new column by pressing the `+ Add Column` button.

You can rename the column by double clicking on the `Column Name` field.

The Type is the `type` of data that will be generated in the column. This can be a `RegEx` (Regular Expression), or one of the predefined random data types e.g. `random.word` or `random.boolean` etc.

## Types

The Types of data available can be chosen from the drop down value.

The drop down is an `option` select so you can type in a filter e.g `email` and you will see any matching options for email.

## Number of Rows to Generate

Configure how many rows of data to generate by typing the numeric value in the `How Many?` text field.

e.g. to generate 1000 rows of data enter `1000` in the `How Many?` text input field.

## Generating Data

Press the `[Generate]` button to generate the data.

The schema in the Column Definition Data Grid will be used to generate the data.

All data generation happens in the browser so the amount of data you can generate is limited only by the performance and memory of your computer.

## Text Area

When you add rows using the data grid, you will see the information is also copied into the text area in the right. This allows you to copy and paste schema definitions for re-use.

The Schema format in the Text Area uses the format

```
column name
type value
```

e.g.

```
column 1
1234
```

When no type is present it is assumed to be a Regex e.g. `1234` is a Regex that represents the string "1234"