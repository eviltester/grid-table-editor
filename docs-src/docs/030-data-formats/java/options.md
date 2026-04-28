---
sidebar_position: 2
title: "Java Options"
description: "Options available for converting to Java in AnyWayData.com. This includes collection and object style, variable assignment, number conversion, imports, and pretty print formatting."
---

The configuration options for Java are listed below.

## Collection Type

Choose whether the outer container is generated as:

- `List (ArrayList)`
- `Array [ ]`

## Assign to Variable

When enabled, output is assigned to a variable.

For example:

```java
List<Map<String, Object>> data = new ArrayList<>(List.of(
    Map.of("name", "Monica")
));
```

## Variable Name

Set the name used when `Assign to Variable` is enabled.

For example, using `records`:

```java
List<Map<String, Object>> records = new ArrayList<>(List.of(
    Map.of("name", "Monica")
));
```

## Number Convert (Quote Numbers)

When enabled, numeric-looking values are emitted as quoted strings.

When disabled, numeric-looking values are emitted as numeric literals.

## Use Anonymous Maps (Map.of)

When enabled, each row is output as a map.

When disabled, each row is output as an instance of a named Java class.

For larger row shapes (more than 10 columns), AnyWayData automatically uses `Map.ofEntries(...)`.

## Class Name

Used when `Use Anonymous Maps` is disabled to set the class name for generated row instances.

## Blank Values

Choose how blank values are exported:

- `null`
- `Empty String`

## Include Imports

When enabled, import statements are included at the top of the output.

Depending on selected options, imports can include:

```java
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
```

## Pretty Print

Controls whether output is formatted across multiple lines with indentation.

When disabled, output is compact (minified style).

## Delimiter

Controls indentation when `Pretty Print` is enabled.

Java supports:

- `Tab [\t]`
- `Space [ ]`
- `Custom Value`

## Custom Delimiter

Set a custom indentation value used for pretty print.

For Java output, indentation must be whitespace. Non-whitespace values automatically fall back to safe spaces.
