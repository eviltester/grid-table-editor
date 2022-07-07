---
sidebar_position: 1
title: "JSON"
description: "JSON is a data representation which is easy for humans to manage and can be processed as Javascript or as data for other languages. You can import, edit and export JSON object arrays and convert to CSV and other formats."
---

JSON is a data object transformation standard based on Javascript but it is a language independent data format supported by multiple languages.

## What is JSON?

JSON stands for Javascript Object Notation and is a human readable data format.

e.g.

```
[
	{
		"user": "Jesse.Bradtke97",
		"name": "Corine"
	},
	{
		"user": "Cielo.Little",
		"name": "Zander"
	}
]
```

In the example above we can see two objects, these are collections of named properties and delimited by "{}"

The objects have the properties 'user' and 'name'.

The properties are key value pairs separated by ":".

Each property key/value pair is separated by ","

All the values in JSON are quoted either with single quotes or double quotes as used in the example.

Multiple objects are collected in an array, represented by "[]" and each value in the array is separated by ",".

Rather than having a 'header' with the column names, each property key becomes a header name.

## How is JSON different from Javascript?

A JSON object is actually a subset of Javascript so can be used directly in a Javascript application.

The main difference between JSON and Javascript is that the keys in JSON must be in double quotes, in Javascript they don't need to be double quotes, but then they must be valid Javascript identifiers i.e. they only use characters supported by Javascript.

Also JSON is an object representation, not a programming language so it can not have functions, where as the 'value' in Javascript can be a function.

JSON itself is a subset of Javascript so each valid JSON value is a valid Javascript object.

## AnyWayData Support for JSON

AnyWayData can import and export JSON, and can then convert JSON to any of the supported formats e.g. Markdown, CSV, Delimited, Javascript, Gherkin and HTML.

AnyWayData expects the JSON to be well formed and for each object in the imported array to have the same property names.

The first object in the array is used to define the column headers so if later objects have additional properties they will be ignored.