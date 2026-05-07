---
sidebar_position: 1
title: "Java"
description: "Java is a programming language with collection and object models that can represent tabular data as maps, arrays, lists, and class instances. You can export grid data as Java-ready source in AnyWayData.com."
---

Java is a programming language and the AnyWayData Java option is most useful when you want copy/paste-ready data for tests, fixtures, demos, and prototypes.

## What is Java Data Output?

Java can represent table-like data using collections of maps or collections of objects.

For example, a list of maps:

```java
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

List<Map<String, Object>> data = new ArrayList<>(List.of(
    Map.of("user", "Jesse.Bradtke97", "name", "Corine"),
    Map.of("user", "Cielo.Little", "name", "Zander")
));
```

In the example above:

- each row is represented as a map using key/value pairs
- map keys come from the column headers
- row maps are collected in a Java list

AnyWayData can also generate class-instance output where each row is represented as a named Java object.

## How is Java Output different from JSON and Javascript?

JSON is a language-independent data format and JavaScript object arrays are JavaScript syntax.

Java output uses Java syntax and Java concepts:

- rows can be emitted as `Map<String, Object>` values or named class instances
- output can be generated as `List` or array collections
- values can be emitted as quoted strings or numeric literals
- output can be assigned to a named Java variable

Unlike JSON, Java output is designed to be used directly in Java source code.

## AnyWayData Support for Java

AnyWayData currently supports **exporting** data to Java format.

You can configure output options such as:

- collection type (`List` or array)
- variable assignment and naming
- number conversion (quoted vs unquoted)
- map vs class-instance output
- pretty print indentation and custom delimiter
- import inclusion

Java output can be generated from the same grid data used for the other supported export formats.


## Unit Test Code Generation

You can also generate data-driven test scaffolding for Java using frameworks: `junit4`, `junit5`, `junit6`, `testng`.

For more information, see [Unit Test Code Generation](/docs/data-formats/unit-test-code).

