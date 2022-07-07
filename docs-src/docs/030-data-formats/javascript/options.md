---
sidebar_position: 2
title: "Javascript Options"
description: "Options available for converting to Javascript in AnyWayData.com. This includes formatting numbers, pretty print control and representing as a named array property."
---

The configuration options for Javascript are listed below. These are similar to [JSON](/docs/data-formats/json/json).

## Number Convert

The `Number Convert` option detects if the 'value' is a number and if so will be output without quotes.

e.g. with `Number Convert` off

```
[
	{
		name: "Monica",
		age: "29"
	}
]
```

And with `Number Convert` on:

```
[
	{
		name: "Monica",
		age: 29
	}
]
```

## Pretty Print

The `Pretty Print` option controls the pretty printing of Javascript.

With no `Pretty Print` the Javascript will be minified:

```
[{name:"Monica",age:"29"}]
```

With `Pretty Print` enabled the Javascript will be generated with the chosen `Delimiter`.

e.g.

```
[
	{
		name: "Monica",
		age: "29"
	}
]
```

## Delimiter

The `Delmiter` is the value used to space out the Javascript indentation. This is only used when `Pretty Print` has been set to 'on'.

The `Delimiter` drop down allows you to choose some standard values:

- `Tab [\t]` - use tabs to indent the values
- `Space [ ]` - use a single space to indent the values
- `Custom Value` - use the value in the `Custom` Text box.

## Custom

The `Custom` text box allows you to add any indentation string to use during the `Pretty Print` formatting.

This would normally be used to add spaces e.g. `  ` two spaces or `   ` three spaces.

It is possible to use this text area with strings like "..." to generate:

```
[
...{
......name: "Monica",
......age: "29"
...}
]
```

This would generate invalid Javascript but might be useful for some publications or examples.

When the `Custom` value is a number e.g. `4` then the indentation will use four spaces i.e. `    `

## As Object

By default the Javascript is generated as an array containing objects with the properties (or keys) using the header names and the values as the cell values.

`As Object` allows you to generate the Javascript as an object with a named property as the array of data e.g.

```
{
   data: [
      {
         name: "Monica",
         age: "29"
      }
   ]
}
```

## Property Name

The `Property Name` text area can be used to change the name of the property representing the data array in the object.

By default this is `data` but you can amend it to whatever text you require.

e.g. using `my data` as the `Property Name`

```
{
   my_data: [
      {
         name: "Monica",
         age: "29"
      }
   ]
}
```
