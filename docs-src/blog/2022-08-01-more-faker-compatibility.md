---
slug: expanded-faker-compatibility
title: Improved Data Generation
authors: alan
tags: [release]
date: 2022-08-01T18:55
---

We have enhanced the faker compatibility for test data generation so it is now possible to parameterise the faker function calls.

<!--truncate-->

## Faker

[Faker](https://fakerjs.dev/guide/) is the test data generation library used by AnyWayData.

It has an extensive API of function calls. e.g. `location.buildingNumber` to generate a random building number.

In the test data type definition drop down you can find a list of faker function calls in the drop down used on the Test Data Generation data grid.

The items in the drop down are a subset of the function calls, without any parameters.

When you read through the API documentation for faker you will see a lot of options available for the API calls. These are now also available from AnyWayData by typing the data spec into the text area editor.

AnyWayData also implements most of the helper functionality to create templates and fake data.

e.g.

```
address
helpers.fake('{{location.buildingNumber}} {{location.streetAddress}}')
Sentence
helpers.mustache('I found {{count}} instances of "{{word}}".', {count: () => `${this.number.int()}`,word: "this word",}) 
```

Could generate:

```
"address","Sentence"
"333 798 N Main Avenue","I found 4485653369866095 instances of ""this word""."
"2065 866 Theodora Corners","I found 6979689506928155 instances of ""this word""."
"4405 147 Alvena Mountain","I found 646049465038696 instances of ""this word""."
```

[Learn more about the Faker functionality in the docs](https://anywaydata.com/docs/test-data/faker-test-data)

## Summary

You can now use most of the API functions listed in the Faker API documenation and create very complicated data sets using the parameters for the API.

Read through the Faker docs and experiment.

[fakerjs.dev/api/helpers.html#mustache](https://fakerjs.dev/api/helpers.html#mustache)