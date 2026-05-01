---
title: "Perl Options"
description: "Options available when exporting to Perl, including collection type, number conversion, object style, variable naming, and pretty print delimiter settings."
---

The configuration options for Perl are listed below.

## Collection Type

Choose the outer collection syntax:

- `array` for array reference `[ ... ]`
- `list` for list assignment `(... )`

## Assign to Variable

When enabled, output is assigned to a named variable like:

```perl
my $data = [
  ...
];
```

Use **Variable Name** to configure the assigned name.

## Number Convert

When enabled, numeric-looking values are quoted as strings.

When disabled, numeric-looking values are emitted as numeric literals.

## Hash Key Style

Choose whether hash keys are emitted as:

- `quoted` keys: `'name' => ...`
- `bareword` keys: `name => ...`

## Anonymous Objects

When enabled, each row is output as an anonymous hash.

When disabled, each row is output as a blessed object instance.

Use **Object Name** to configure the class name when anonymous objects are disabled.

### Object Instantiation

When object output is enabled, choose:

- `bless(... )` style
- constructor style: `Class->new(... )`

## Pretty Print

When enabled, output uses line breaks and indentation.

### Delimiter

Choose indentation delimiter:

- tab
- space
- custom value

For custom value, set **Custom Delimiter**.
