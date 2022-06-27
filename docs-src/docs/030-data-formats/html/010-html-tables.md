---
sidebar_position: 1
title: "HTML Tables"
description: "HTML Tables are a default way to represent tabular data on web pages, they offer no interactivity but can be styled via CSS to be more user friendly."
---

HTML Tables are a default way to represent tabular data on web pages, they offer no interactivity but can be styled via CSS to be more user friendly.

## What is an HTML Table

HTML tables are the default way to represent tabular data on web pages. They have a few minimal elements to react a table:

- parent `table` element
- each row in the table is a `tr` element
- column headers are child `th` elements
- each column in a data row is a `td` element

e.g.

```
<table>
   <tr>
      <th>Country</th>
      <th>Population</th>
      <th>World Share</th>
   </tr>
   <tr>
      <td>China</td>
      <td>1,439,323,776</td>
      <td>18.47 %</td>
   </tr>
   <tr>
      <td>India</td>
      <td>1,380,004,385</td>
      <td>17.70 %</td>
   </tr>
   <tr>
      <td>United States</td>
      <td>331,002,651</td>
      <td>4.25 %</td>
   </tr>
</table>
```

Would render as:

<table>
   <tr>
      <th>Country</th>
      <th>Population</th>
      <th>World Share</th>
   </tr>
   <tr>
      <td>China</td>
      <td>1,439,323,776</td>
      <td>18.47 %</td>
   </tr>
   <tr>
      <td>India</td>
      <td>1,380,004,385</td>
      <td>17.70 %</td>
   </tr>
   <tr>
      <td>United States</td>
      <td>331,002,651</td>
      <td>4.25 %</td>
   </tr>
</table>

Note that different browsers render HTML tables without any styling differently, some do not add borders, or embolden headers etc. Styling should be added to make HTML tables readable.

## thead and tbody

Additionally `thead` and `tbody` group elements can be used to represent the header and body section.

```
<table>
   <thead>
      <tr>
         <th>Country</th>
         <th>Population</th>
         <th>World Share</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td>China</td>
         <td>1,439,323,776</td>
         <td>18.47 %</td>
      </tr>
      <tr>
         <td>India</td>
         <td>1,380,004,385</td>
         <td>17.70 %</td>
      </tr>
      <tr>
         <td>United States</td>
         <td>331,002,651</td>
         <td>4.25 %</td>
      </tr>
   </tbody>
</table>
```

This can provide additional opportunities for styling via CSS and can make the HTML code easier to read.

<table>
   <thead>
      <tr>
         <th>Country</th>
         <th>Population</th>
         <th>World Share</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td>China</td>
         <td>1,439,323,776</td>
         <td>18.47 %</td>
      </tr>
      <tr>
         <td>India</td>
         <td>1,380,004,385</td>
         <td>17.70 %</td>
      </tr>
      <tr>
         <td>United States</td>
         <td>331,002,651</td>
         <td>4.25 %</td>
      </tr>
   </tbody>
</table>

## Support for Delimited Files

AnyWayData.com allows both import and export of HTML.

The import of HTML tables is particularly useful when testing because you may want to use data published on a web site

The HTML code representing the table can be pasted into AnyWayData.com and imported into the data grid to be converted into other formats or edited.

Styles and HTML controls are removed during the import process so the data grid will contain the raw data without any styling.

AnyWayData does not support cell spanning or row spanning e.g. `colspan` or `rowspan` attributes. Tables will still be imported but you may see some 'undefined' entries as values.


