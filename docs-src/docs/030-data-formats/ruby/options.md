---
title: "Ruby Options"
description: "Options available when exporting to Ruby, including collection type, number conversion, object style, variable naming, and pretty print delimiter settings."
---

The configuration options for Ruby are listed below.

## Collection Type

Choose the outer collection syntax:

- `array` for `[ ... ]`
- `list` for `Array[ ... ]`

## Assign to Variable

When enabled, output is assigned to a named variable like:

```ruby
data = [
  { 'name' => 'Alice' },
]
```

Use **Variable Name** to configure the assigned name.

## Number Convert

When enabled, numeric-looking values are quoted as strings.

When disabled, numeric-looking values are emitted as numeric literals.

## Anonymous Objects

When enabled, each row is output as a hash (map/dictionary equivalent).

When disabled, each row is output as an instantiated object, and a class definition is included.

Use **Object Name** to configure the class name when anonymous objects are disabled.

## Pretty Print

When enabled, output uses line breaks and indentation.

### Delimiter

Choose indentation delimiter:

- tab
- space
- custom value

For custom value, set **Custom Delimiter**.
