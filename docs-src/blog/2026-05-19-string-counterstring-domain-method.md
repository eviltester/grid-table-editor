---
slug: string-counterstring-domain-method
title: "Added string.counterString to Domain Test Data"
authors: [alan]
tags: [release, test-data, domain]
---

`string.counterString` is now available in the domain model.

This is the first `string.*` domain addition that is not backed directly by Faker, and is implemented as a custom domain delegate.

<!-- truncate -->

## Why add it?

Counterstrings are useful for field-length and truncation testing because each marker shows its position in the generated text.

Example pattern:

`*3*5*7*9*12*15*`

If we entered the above into a field that truncated to 14 we would see

`*3*5*7*9*12*15` - this looks incorrect because I'm expecting to see a number before an *, if I see a number without an * then I know there has been some truncation.

## Usage

`string.counterString(min, max, delimiter="*")`

- If only one integer is supplied, it is used as both min and max.
- If two integers are supplied, the lower value is used as min and the higher as max.
- Lowest allowed min is `1`.
- Delimiter defaults to `*`.
- If a delimiter longer than one character is passed, only the first character is used.

Examples:

```txt
Fixed15
string.counterString(15)
```

```txt
Range5to12
string.counterString(min=5, max=12)
```

```txt
HashDelimited
string.counterString(12, 12, "#")
```

## Take Care

We've added no limits to the length of the counterstrings to take care in your definitions. Sure you can create 1,000,000 rows with counterstrings that are 1,000,000 characters long, but I'm not sure if your computer is going to like generating that.

We default to a 1-25 character counterstring to mitigate this risk somewhat.

## Other counterstring resources

If you are interested in using CounterStrings in your testing then checkout this Chrome extension:

- https://www.eviltester.com/page/tools/counterstringjs/

It allows you to generate counterstrings and other data directly into the browser fields.

Also more information about CounterStrings here:

- https://www.satisfice.com/blog/archives/22
- https://www.eviltester.com/blog/eviltester/news/counterstring-new-version-dec-2025/
- https://www.eviltester.com/categories/counterstrings/