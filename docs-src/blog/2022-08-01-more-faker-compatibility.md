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

It has an extensive API of function calls. e.g. `address.buildingNumber` to generate a random building number.

In AG Grid you can find a list of faker function calls in the drop down used on the Test Data Generation data grid.

The items in the drop down are a subset of the function calls, without any parameters.

When you read through the API documentation for faker you will see a lot of options available for the API calls. These are now also available from AnyWayData by typing the data spec into the text area editor.

e.g.

From the drop down menu it is possible to generate a random direction with `address.cardinalDirection` this will generate `North`, `South` etc.

But with the text area it is possible to take advantage of the API for [cardinalDirection](https://fakerjs.dev/api/address.html#cardinalDirection) and pass in a parameter e.g.

```
Direction
address.cardinalDirection(true)
```

The `true` parameter will generate short versions of the direction e.g. `N`, `S`, `E`:

|Direction|
|-----|
|W|
|N|
|S|
|W|


## More Advanced

Reading through the Faker API documentation we can see that this opens up a lot more possibilities in terms of data generation.

We can now generate dates within a certain range: say [between](https://fakerjs.dev/api/date.html#between) `01/01/2020` and `01/08/2022`

```
Date
date.between('2020-01-01T00:00:00.000Z', '2022-08-01T00:00:00.000Z')
```

or

```
Date
date.between('2020-01-01', '2022-08-01')
```

Or if we were working with Finance we could generate banking [IBAN](https://fakerjs.dev/api/finance.html#iban) numbers for a specific country.

```
IBAN
finance.iban(true, 'GB')
IBANDE
finance.iban(false, 'DE')
```

e.g.

|IBAN|IBANDE|
|-----|-----|
|GB93 ELAC 1500 7007 0044 81|DE05059809588200970058|
|GB58 UFYS 0460 3540 0705 65|DE58252902443001009070|
|GB79 WKWS 0040 5932 0004 96|DE38438921300010561024|
|GB72 PRIY 9000 7326 7888 74|DE27900409653220700650|
|GB02 IMHN 0089 8110 0662 92|DE74800040080510006033|


## DataTypes

Now we can control the ranges of Data Types e.g. generate a number between 32 and 47

```
Num
datatype.number({ min: 32, max: 47 })
```

e.g.

|Num|
|-----|
|35|
|41|
|32|
|43|
|41|


## Unique values

Faker has a `Unique` generator that we can now take advantage of to generate unique values in our data sets.

[unique(https://fakerjs.dev/api/unique.html) calls another faker function and we have to prefix it with `this`.

```
Unique Num
unique(this.datatype.number)
```

e.g.

|Unique Num|
|-----|
|92795|
|23809|
|25476|
|63287|
|14541|


## Helpers and Templates

We have also enabled the helper functions. This allows using Mustache templates directly to create very complex data values.

The [Mustache](https://fakerjs.dev/api/helpers.html#mustache) documentation shows some of the capabilities:

```
Sentence
helpers.mustache('I found {{count}} instances of "{{word}}".', {count: () => `${this.datatype.number()}`,word: "this word",}) 
```

e.g.

|Sentence|
|-----|
|I found 76980 instances of "this word".|
|I found 21667 instances of "this word".|
|I found 23679 instances of "this word".|
|I found 18850 instances of "this word".|
|I found 3422 instances of "this word".|


The main difference to be aware of when using examples form the faker documentation is that any use of `faker` in the parameters should be replaced with `this`.

But now we can create quick complex data strings.

```
Sentence
helpers.mustache('{{ex}}, A {{adj}} {{noun}}.', {ex: `${this.word.interjection()}`, adj: `${this.word.adjective()}`, noun: `${this.word.noun()}`})
```

|Sentence|
|-----|
|tsk tsk, A awkward seed.|
|ugh, A trustworthy lesson.|
|aw, A nasty casement.|
|drat, A unlucky accordion.|
|yuck, A monthly manhunt.|
|phooey, A intent bulk.|
|phooey, A agitated hubcap.|
|duh, A silent behold.|
|hmph, A sticky drapes.|
|er, A suburban tan.|

## Summary

You can now use most of the API functions listed in the Faker API documenation and create very complicated data sets using the parameters for the API.

Read through the Faker docs and experiment.