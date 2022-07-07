---
sidebar_position: 1
title: "Javascript"
description: "Javascript is a programming language, a subset of which can be used to represent data objects and arrays. You can import, edit and export Javascript object arrays and convert to CSV and other formats."
---

Javascript is a programming language, the AnyWayData Javascript option is likely only to be of use to Javascript programmers.

## What is Javascript?

Javascript is a programming language, but a subset of Javascript can be used to represent data objects.

e.g.

```
[
	{
		user: "Jesse.Bradtke97",
		name: "Corine"
	},
	{
		user: "Cielo.Little",
		name: "Zander"
	}
]
```

In the example above we can see two objects, these are collections of named properties and delimited by "{}"

The objects have the properties 'user' and 'name'.

The properties are key value pairs separated by ":".

Each property key/value pair is separated by ","

In Javascript the key values do not need to be enclosed in quotes. Although it is perfectly valid to do that. When key values are enclosed in quotes we have actually written [JSON](/docs/data-formats/json/json)

Multiple objects are collected in an array, represented by "[]" and each value in the array is separated by ",".

Rather than having a 'header' with the column names, each property key becomes a header name.

## How is Javascript different from JSON?

A JSON object is actually a subset of Javascript so can be used directly in a Javascript application.

Javascript is a programming language so Javascript data objects are not used to exchange data between applications.

The main difference between JSON and Javascript is that the keys in JSON must be in double quotes, in Javascript they don't need to be double quotes, but then they must be valid Javascript identifiers i.e. they only use characters supported by Javascript.

In Javascript the values can be functions but importing function values is not supported by AnyWayData.

## AnyWayData Support for Javascript

AnyWayData can import and export Javascript, and can then convert Javascript to any of the supported formats e.g. Markdown, CSV, Delimited, Javascript, Gherkin and HTML.

AnyWayData expects the Javascript to be well formed and for each object in the imported array to have the same property names.

The first object in the array is used to define the column headers so if later objects have additional properties they will be ignored.

Not all formatting and spacing will be supported by AnyWayData so you may need to minimize the Javascript before importing.