---
title: "C# Options"
description: "Options available when exporting to C#, including collection type, number conversion, object style, variable naming, and pretty print delimiter settings."
---

The configuration options for C# are listed below.

## Collection Type

Choose the outer collection syntax:

- `array` for `new[] { ... }`
- `list` for `new List<object> { ... }`
- `ireadonlylist` for `IReadOnlyList<object> data = new List<object> { ... }`
- `ienumerable` for `IEnumerable<object> data = new List<object> { ... }`

## Assign to Variable

When enabled, output is assigned to a named variable like:

```csharp
var data = new List<object> { ... };
```

Use **Variable Name** to configure the assigned name.

## Number Convert

When enabled, numeric-looking values are quoted as strings.

When disabled, numeric-looking values are emitted as numeric literals.

### Dictionary Value Type

Configure dictionary value typing for anonymous rows:

- `auto`: uses `Dictionary<string, string>` when Number Convert is enabled, otherwise `Dictionary<string, object>`
- `object`: always `Dictionary<string, object>`
- `string`: always `Dictionary<string, string>`

## Anonymous Objects

When enabled, each row is output as a dictionary (`new Dictionary<string, object> { ... }`).

When disabled, each row is output as an instantiated object, and a class definition is included.

Use **Object Name** to configure the class name when anonymous objects are disabled.

Generated variable, class, and property identifiers are sanitized for C# and escaped with `@` when they match C# reserved keywords.

## Pretty Print

When enabled, output uses line breaks and indentation.

### Delimiter

Choose indentation delimiter:

- tab
- space
- custom value

For custom value, set **Custom Delimiter**.
