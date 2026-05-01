---
title: "PHP Options"
description: "Options available when exporting to PHP, including collection type, number conversion, object style, variable naming, and pretty print delimiter settings."
---

The configuration options for PHP are listed below.

## Include PHP Tag

Add `<?php` at the top of the generated output.

## Collection Type

Choose the outer collection syntax:

- `array` for `array(...)`
- `list` for `[ ... ]`

## Prefer Short Array Syntax

When enabled, arrays use `[ ... ]` syntax where possible.

## Assign to Variable

When enabled, output is assigned to a named variable like:

```php
$data = array(...);
```

Use **Variable Name** to configure the assigned name.

## Number Convert

When enabled, numeric-looking values are quoted as strings.

When disabled, numeric-looking values are emitted as numeric literals.

## Scalar Coercion

- Blank value behavior: `empty string` or `null`
- Coerce `"true"` / `"false"` to boolean literals
- Coerce `"null"` to `null`

## Anonymous Objects

Object representation supports:

- associative arrays
- `stdClass` via object cast
- named class instances with generated class definition

Use **Object Name** to configure the class name when anonymous objects are disabled.

## Array Key Quote Style

Choose quoted or unquoted array keys.

## Pretty Print

When enabled, output uses line breaks and indentation.

### Delimiter

Choose indentation delimiter:

- tab
- space
- custom value

For custom value, set **Custom Delimiter**.

## PHP Compatibility and Class Generation

- Compatibility target: `PHP 7+` or `PHP 8+`
- Class property typing: untyped or typed (`mixed`)
- Constructor promotion toggle (PHP 8+)
- Constructor args style: positional or named

Named constructor arguments require PHP 8+.
