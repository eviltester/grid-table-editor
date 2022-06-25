---
sidebar_position: 2
title: "Markdown Options"
description: "Options available for converting to Markdown in AnyWayData.com include pretty printing, column alignment, making columns bold or italic, header formatting and various border styles."
---

The configuration options for Markdown Tables are listed below.

## Space Padding

Space Padding defines if you want a 'space' character on the left or right of the column values.

Space Padding makes no difference to the output when converted to PDF or HTML, but it can make your Markdown documents more readable prior to conversion.

The supported values are:

- 'none'
- 'left'
- 'right'
- 'both'

e.g.

### None

None - no padding added.

```
|Column A|Column B|
|--------|--------|
|a       |a b     |
|a       |a b     |
```

### Left

Left - a space is added after the border "|" but before the cell or heading contents.

```
| Column A| Column B|
| --------| --------|
| a       | a b     |
| a       | a b     |
```

### Right

Right - a space is added after the cell or heading contents and before the "|".

```
|Column A |Column B |
|-------- |-------- |
|a        |a b      |
|a        |a b      |
```

### Both

Both - the cell or heading contents are surrounded with a space on each side.

```
| Column A | Column B |
| -------- | -------- |
| a        | a b      |
| a        | a b      |
```

## Tab Padding

Tab Padding will pad the columns on the left or the right with a `tab` (`\t`) character. This creates a larger space and may be useful for some documents.

Options are the same as Space Padding:

- None - no padding added.
- Left - tab character added after the border "|" but before the cell or heading contents.
- Right - tab character added after the cell or heading contents and before the "|".
- Both - the cell or heading contents are surrounded with a tab character on each side.

## Border Bars

By default the Markdown table has the external border bars.

By unchecking the option you can generate a Markdown table without the border bars.

e.g

```
Column A|Column B
-----|-----
a|a b
a|a b
```

## Bold Headers

By selecting "Bold Headers", the header cell contents will be wrapped with "**"" to allow the document formatting tool you use to embolden the headers in the output.

e.g.

```
|**Column A**|**Column B**|
|-----|-----|
|a|a b|
|a|a b|
```

Which would render an HTML table as follows:

<table>
<thead>
<tr>
<th><strong>Column A</strong></th>
<th><strong>Column B</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td>a</td>
<td>a b</td>
</tr>
<tr>
<td>a</td>
<td>a b</td>
</tr>
</tbody>
</table>

## Italic Headers

By selecting "Italic Headers" the header cell contents will be wrapped with "_" to allow the document formatting tool you use to render the headers as emphasized (italics) in the final output.

e.g.

```
|_Column A_|_Column B_|
|-----|-----|
|a|a b|
|a|a b|
```


Which would render an HTML table as follows:

<table>
<thead>
<tr>
<th><em>Column A</em></th>
<th><em>Column B</em></th>
</tr>
</thead>
<tbody>
<tr>
<td>a</td>
<td>a b</td>
</tr>
<tr>
<td>a</td>
<td>a b</td>
</tr>
</tbody>
</table>


## Add Bold To Specific Columns

It is also possible to add bold to specific columns by typing in a list of column numbers as the "Add Bold to Cols" option. This wraps the values of the chosen columns with "**" to make them render as bold when formatted in a Markdown tool.

The columns are indexed from 1, so in the example below `Column A` is referenced as 1.

```
|Column A|Column B|
|-----|-----|
|a|a b|
|a|a b|
```

Adding bold to Column A can be done by entering 1 as the list of columns:

```
Add Bold to cols: 1
```

Which would result in a table output of:

```
|**Column A**|Column B|
|-----|-----|
|**a**|a b|
|**a**|a b|
```

If multiple columns are to have bold then the list of numbers can be delimited by space or ','.

For example in the following table:

```
|col1|col2|col3|col4|col5|
|-----|-----|-----|-----|-----|
|001|002|003|004|005|
|001|002|003|004|005|
|001|002|003|004|005|
```

We can add bold to columns 1 3 and 4 by using:

```
Add Bold to cols: 1 3 4
```

or

```
Add Bold to cols: 1,3,4
```

To Generate:

```
|**col1**|col2|**col3**|**col4**|col5|
|-----|-----|-----|-----|-----|
|**001**|002|**003**|**004**|005|
|**001**|002|**003**|**004**|005|
|**001**|002|**003**|**004**|005|
```


## Add Italics To Specific Columns

It is also possible to add italics to specific columns by typing in a list of column numbers as the "Italics on Cols" option. This wraps the values of the chosen columns with "_" to make them render as bold when formatted in a Markdown tool.

This uses the same input format as the "Add Bold to Cols" option.

e.g. 

```
Italics on Cols: 1 3 4
```

or

```
Italics on Cols: 1,3,4
```

To convert a table with five columns:

```
|col1|col2|col3|col4|col5|
|-----|-----|-----|-----|-----|
|001|002|003|004|005|
|001|002|003|004|005|
|001|002|003|004|005|
```

Into a table where columns 1, 3 and 4 are marked as italics.

```
|_col1_|col2|_col3_|_col4_|col5|
|-----|-----|-----|-----|-----|
|_001_|002|_003_|_004_|005|
|_001_|002|_003_|_004_|005|
|_001_|002|_003_|_004_|005|
```

## Pretty Print

The "Pretty Print" option is to help make the output Markdown easier to read.

When working with tables by hand, formatting them to be pretty printed can make them harder to edit and take too much time.

The Pretty Printing in AnyWayData.com looks at the longest value in the column and formats each column to the longest value e.g.

```
|col1|col2|col3|
|-----|-----|-----|
|UVIACGWO|RWC ROFASBST|STPNAXINUF|
|BZLHEJ|BSVBI|WQGL|
|OLRDDTHES|HDBGLGCI|S |
```

Is formatted as:

```
|col1     |col2        |col3      |
|---------|------------|----------|
|UVIACGWO |RWC ROFASBST|STPNAXINUF|
|BZLHEJ   |BSVBI       |WQGL      |
|OLRDDTHES|HDBGLGCI    |S         |
```

## Column Align

Markdown Tables have specific column alignment that can be specified using ":" in the Heading separators:

- `---` default
- `:---` left align
- `---:` right align
- `:---:` center align

The "Column Align" option allows you to set an alignment for all the columns, e.g. all left aligned, or all centered, etc.

This is mainly used so that the formatting tool that you use to convert the Markdown to HTMl or PDF will align the table contents.

But it can also be used in conjunction with the Pretty Print option to create aligned pretty printed columns.

### Default

By default the columns are shown as left aligned, but there is no ":" in the heading separators:

```
|col1     |col2        |col3      |
|---------|------------|----------|
|UVIACGWO |RWC ROFASBST|STPNAXINUF|
|BZLHEJ   |BSVBI       |WQGL      |
|OLRDDTHES|HDBGLGCI    |S         |
```

### Left

Left align all the column values.

```
|col1     |col2        |col3      |
|:--------|:-----------|:---------|
|UVIACGWO |RWC ROFASBST|STPNAXINUF|
|BZLHEJ   |BSVBI       |WQGL      |
|OLRDDTHES|HDBGLGCI    |S         |
```

### Right

Right align all the column values.

```
|     col1|        col2|      col3|
|--------:|-----------:|---------:|
| UVIACGWO|RWC ROFASBST|STPNAXINUF|
|   BZLHEJ|       BSVBI|      WQGL|
|OLRDDTHES|    HDBGLGCI|        S |
```

### Center

Center align all the column values.

```
|  col1   |    col2    |   col3   |
|:-------:|:----------:|:--------:|
|UVIACGWO |RWC ROFASBST|STPNAXINUF|
| BZLHEJ  |   BSVBI    |   WQGL   |
|OLRDDTHES|  HDBGLGCI  |    S     |
```
