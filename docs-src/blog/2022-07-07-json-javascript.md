---
slug: json-javascript-import-export
title: Added Json and Javascript Documentation
authors: alan
tags: [release]
date: 2022-07-07T18:00
---

We now have documentation for [JSON](/docs/data-formats/json/json) and [Javascript](/docs/data-formats/javascript/javascript).

I also changed the Javascript generation to not use quoted keys so it is now distinct from the JSON output.

<!--truncate-->

## JSON

JSON is a subset of Javascript and only has the Javascript syntax to represent data.

This is often used as a programming language independent data exchange format.

It is easy to read by humans and easy to process automatically.

This makes it very suitable for data interchange over APIs.

In JSON all the keys in the key value pairs are quoted e.g.

```
[
	{
		"name": "Anais",
		"id": "32468"
	},
	{
		"name": "Astrid",
		"id": "46731"
	}
]
```

By default all numbers are quoted but it is possible to use the `Number Convert` option to change this e.g.

```
[
	{
		"name": "Anais",
		"id": 32468
	},
	{
		"name": "Astrid",
		"id": 46731
	}
]
```

In Javascript the keys are not quoted and my only contain valid javascript characters e.g. no spaces:

```
[
	{
		customer_name: "Isabelle",
		id: "11996"
	},
	{
		customer_name: "Minerva",
		id: "86982"
	}
]
```

## Import and Export

AnyWayData supports both the import and export of Json or Javascript object arrays.

These can then be converted to any supported format of AnyWayData e.g. Convert JSON to CSV, Markdown Tables, Tab Delimited, Gherkin Tables, HTML or Ascii Tables.

