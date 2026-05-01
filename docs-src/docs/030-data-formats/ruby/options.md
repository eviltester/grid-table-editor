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

## Output Wrapper

Choose how the generated collection is wrapped:

- `plain` for normal Ruby output (assignment if enabled)
- `rspec-let` for `let(:name) do ... end` output

## Number Convert

When enabled, numeric-looking values are quoted as strings.

When disabled, numeric-looking values are emitted as numeric literals.

## Hash Key Style

Controls hash key syntax when **Anonymous Objects** is enabled:

- `string` for `'name' => 'Alice'`
- `symbol` for `name: 'Alice'`

## Anonymous Objects

When enabled, each row is output as a hash (map/dictionary equivalent).

When disabled, each row is output as an instantiated object, and a class definition is included.

Use **Object Name** to configure the class name when anonymous objects are disabled.

## Object Representation

When **Anonymous Objects** is disabled, choose the row object style:

- `class` generates a class with `attr_accessor` and `initialize`
- `struct` generates `Struct.new(...)`
- `data` generates `Data.new(...)`

## Field Name Style

Controls how Ruby field names are generated for object fields and hash keys:

- `preserve` keeps source header style (sanitized for valid Ruby identifiers)
- `snake_case` converts names to `snake_case` before sanitization

## Pretty Print

When enabled, output uses line breaks and indentation.

## Hash Pretty Style

Controls formatting of anonymous hash rows when pretty print is enabled:

- `compact` keeps each hash on one line
- `aligned` renders multi-line hashes with aligned entries

### Delimiter

Choose indentation delimiter:

- tab
- space
- custom value

For custom value, set **Custom Delimiter**.
