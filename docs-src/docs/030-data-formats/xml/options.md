---
sidebar_position: 2
title: "XML Options"
description: "Options available for converting to XML in AnyWayData.com. Configure root/item elements, attribute columns, XML header, and namespace."
---

The configuration options for XML are listed below.

## Root Element

`Root Element` sets the parent element name for the full document.

Example using `people`:

```xml
<people>
  ...
</people>
```

## Item Element

`Item Element` sets the element name used for each row.

Example using `person`:

```xml
<people>
  <person>...</person>
  <person>...</person>
</people>
```

## Attributes

`Attributes` accepts a comma-separated list of column names to render as attributes on each item element.

Example with `id,status`:

```xml
<person id="42" status="active">
  <name>Monica</name>
</person>
```

Unknown column names are ignored and reported as warnings.

## XML Header

`XML Header` controls whether the declaration line is added:

```xml
<?xml version="1.0" encoding="utf-8"?>
```

## XMLNS

`XMLNS` adds a namespace URI as the `xmlns` attribute on the root element.

Example:

```xml
<people xmlns="https://example.com/people">
  ...
</people>
```

## Name Safety and Auto-fixes

XML element and attribute names must follow XML naming rules.

If a provided name is invalid, AnyWayData auto-fixes it and reports a warning in the output workflow. This includes:

- replacing spaces/invalid characters
- ensuring the name starts with a valid character
- avoiding disallowed `xml` prefixes
- de-duplicating repeated names
