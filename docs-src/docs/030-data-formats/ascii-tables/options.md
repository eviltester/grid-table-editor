---
sidebar_position: 2
title: "Ascii Table Options"
description: "Options available for converting to Ascii table are a range of default styles."
---

AnyWayData.com uses the open-source library [Ascii Table 3](https://www.npmjs.com/package/ascii-table3) to generate the Ascii Tables and the table styles provided are the [styles](https://github.com/AllMightySauron/ascii-table3#styles) provided by that library.

## Style

Styles can be chosen from the drop down menu:

- `default` - uses "+" for corners.
- `blank` - spaces table but has no separators.
- `compact` - spaces to separate columns and header horizontal markers.
- `dot corner` - uses "." for the corners.
- `dotted` - uses "." for corners and horizontal and ":" for vertical lines.
- `clean` - uses horizontal markers for heading and footer and supplies inner column separators.
- `Markdown (github)` - a spaced and left aligned Markdown table.
- `Markdown (reddit)` - a spaced and left aligned Markdown table with no outer border.
- `reStructuredText` - is the table format used for Docutils
- `reStructuredText simple` - another representation with no inner delimiters.
- `rounded` - a rounder style using "." for internal corner markings.
- `unicode single` - uses unicode for more complete horizontal and vertical lines.
- `unicode double` - uses unicode double lines for horizontal and vertical lines.
- `unicode mix` - mixes the unicode double and single lines.


<!-- csv data

"Country","Population","World Share"
"China","1,439,323,776","18.47 %"
"India","1,380,004,385","17.70 %"
"United States","331,002,651","4.25 %"
-->

### Default

A simple style using "+" as the corner markers.

```
+---------------+---------------+-------------+
|    Country    |  Population   | World Share |
+---------------+---------------+-------------+
| China         | 1,439,323,776 | 18.47 %     |
| India         | 1,380,004,385 | 17.70 %     |
| United States | 331,002,651   | 4.25 %      |
+---------------+---------------+-------------+
```

### Blank

`blank` will add spaces to pad out the table but has no separators.

```
    Country       Population     World Share 
 China           1,439,323,776   18.47 %     
 India           1,380,004,385   17.70 %     
 United States   331,002,651     4.25 %      
```

### Compact

`compact` uses spaces to separate columns and adds "-" as horizontal markers for the headers.

```
---------------------------------------------
    Country       Population     World Share 
--------------- --------------- -------------
 China           1,439,323,776   18.47 %     
 India           1,380,004,385   17.70 %     
 United States   331,002,651     4.25 %      
```

### Dot Corner

`dot corner` uses "." for the corners, otherwise is the same as the `default` style.

```
.---------------------------------------------.
|    Country    |  Population   | World Share |
|---------------------------------------------|
| China         | 1,439,323,776 | 18.47 %     |
| India         | 1,380,004,385 | 17.70 %     |
| United States | 331,002,651   | 4.25 %      |
.---------------------------------------------.
```

### Dotted

`dotted` uses "." for corners and horizontal and ":" for vertical lines.

```
...............................................
:    Country    :  Population   : World Share :
:...............:...............:.............:
: China         : 1,439,323,776 : 18.47 %     :
: India         : 1,380,004,385 : 17.70 %     :
: United States : 331,002,651   : 4.25 %      :
:...............:...............:.............:
```

### Clean

`clean` has horizontal markers for heading and the table footer and only vertical markers for inner column separators.

```
---------------|---------------|-------------
    Country    |  Population   | World Share 
---------------|---------------|-------------
 China         | 1,439,323,776 | 18.47 %     
 India         | 1,380,004,385 | 17.70 %     
 United States | 331,002,651   | 4.25 %      
---------------|---------------|-------------
```

### Girder

`girder` is a more complicated and well spaced out set of borders that would be very time consuming to create by hand.

```
//===============[]===============[]=============\\
||    Country    ||  Population   || World Share ||
|]===============[]===============[]=============[|
|| China         || 1,439,323,776 || 18.47 %     ||
|| India         || 1,380,004,385 || 17.70 %     ||
|| United States || 331,002,651   || 4.25 %      ||
\\===============[]===============[]=============//
```

### Markdown (github)

`Markdown (github)` is a spaced and left aligned Markdown table.

```
|    Country    |  Population   | World Share |
|---------------|---------------|-------------|
| China         | 1,439,323,776 | 18.47 %     |
| India         | 1,380,004,385 | 17.70 %     |
| United States | 331,002,651   | 4.25 %      |
```

For more control over Markdown format check out the [Markdown Options](/docs/data-formats/markdown/options).

### Markdown (reddit)

`Markdown (reddit)` is a spaced and left aligned Markdown table with no outer border.

```
    Country    |  Population   | World Share 
---------------|---------------|-------------
 China         | 1,439,323,776 | 18.47 %     
 India         | 1,380,004,385 | 17.70 %     
 United States | 331,002,651   | 4.25 %      
```

For more control over Markdown format check out the [Markdown Options](/docs/data-formats/markdown/options).

### reStructuredText

`reStructuredText` is the table format used for [Docutils](https://docutils.sourceforge.io/rst.html) a documentation format that was popular prior to Markdown but is still widely used for text based documentation generation and is supported by [Sphinx](https://www.sphinx-doc.org/en/master/usage/restructuredtext/basics.html). See the wikipedia entry for [reStructuredText](https://en.wikipedia.org/wiki/ReStructuredText) for more historical information about the format.

```
+---------------+---------------+-------------+
|    Country    |  Population   | World Share |
+===============+===============+=============+
| China         | 1,439,323,776 | 18.47 %     |
| India         | 1,380,004,385 | 17.70 %     |
| United States | 331,002,651   | 4.25 %      |
+---------------+---------------+-------------+
```

### reStructuredText simple

`reStructuredText simple` is another representation suitable for parsing by [Docutils](https://docutils.sourceforge.io] and other tools.

```
================ =============== ==============
     Country       Population     World Share  
================ =============== ==============
  China           1,439,323,776   18.47 %      
  India           1,380,004,385   17.70 %      
  United States   331,002,651     4.25 %       
================ =============== ==============
```

### Rounded

`rounded` simulates a rounder style using "." for internal corner markings.

```
.---------------.---------------.-------------.
|    Country    |  Population   | World Share |
:---------------+---------------+-------------:
| China         | 1,439,323,776 | 18.47 %     |
| India         | 1,380,004,385 | 17.70 %     |
| United States | 331,002,651   | 4.25 %      |
'---------------'---------------'-------------'
```

### Unicode Single

`unicode single` uses unicode for more complete horizontal and vertical lines.

```
┌───────────────┬───────────────┬─────────────┐
│    Country    │  Population   │ World Share │
├───────────────┼───────────────┼─────────────┤
│ China         │ 1,439,323,776 │ 18.47 %     │
│ India         │ 1,380,004,385 │ 17.70 %     │
│ United States │ 331,002,651   │ 4.25 %      │
└───────────────┴───────────────┴─────────────┘
```

### Unicode Double

`unicode double` uses unicode double lines for horizontal and vertical lines.

```
╔═══════════════╦═══════════════╦═════════════╗
║    Country    ║  Population   ║ World Share ║
╠═══════════════╬═══════════════╬═════════════╣
║ China         ║ 1,439,323,776 ║ 18.47 %     ║
║ India         ║ 1,380,004,385 ║ 17.70 %     ║
║ United States ║ 331,002,651   ║ 4.25 %      ║
╚═══════════════╩═══════════════╩═════════════╝
```

### Unicode Mix

`unicode mix` mixes the unicode double and single lines.

```
╔═══════════════╤═══════════════╤═════════════╗
║    Country    │  Population   │ World Share ║
╟───────────────┼───────────────┼─────────────╢
║ China         │ 1,439,323,776 │ 18.47 %     ║
║ India         │ 1,380,004,385 │ 17.70 %     ║
║ United States │ 331,002,651   │ 4.25 %      ║
╚═══════════════╧═══════════════╧═════════════╝
```