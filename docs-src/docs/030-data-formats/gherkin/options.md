---
sidebar_position: 2
title: "Gherkin Options"
description: "Options available for pretty printing the Gherkin output suitable for using in an executable specification."
---

Options available for pretty printing the Gherkin output suitable for using in an executable specification.

## In Cell Padding

The `In Cell Padding` option determines if the values in the table will have padding to make them more readable.

Options are:

- None
- Left
- Right
- Both

### None

```
|Country|Population|World Share|
|China|1,439,323,776|18.47 %|
|India|1,380,004,385|17.70 %|
|United States|331,002,651|4.25 %|
```

### Left

```
| Country| Population| World Share|
| China| 1,439,323,776| 18.47 %|
| India| 1,380,004,385| 17.70 %|
| United States| 331,002,651| 4.25 %|
```

### Right

```
|Country |Population |World Share |
|China |1,439,323,776 |18.47 % |
|India |1,380,004,385 |17.70 % |
|United States |331,002,651 |4.25 % |
```

### Both

```
| Country | Population | World Share |
| China | 1,439,323,776 | 18.47 % |
| India | 1,380,004,385 | 17.70 % |
| United States | 331,002,651 | 4.25 % |
```

## Pretty Print

`Pretty Print` will format the cells in the table so they fit the widest value in the column.

```
|Country      |Population   |World Share|
|China        |1,439,323,776|18.47 %    |
|India        |1,380,004,385|17.70 %    |
|United States|331,002,651  |4.25 %     |
```

## Show Headers

`Show Headers` is the configuration that controls if the Headers are shown in the table or not.

```
|China|1,439,323,776|18.47 %|
|India|1,380,004,385|17.70 %|
|United States|331,002,651|4.25 %|
```

## Left Indent

`Left Indent` is the string that will be displayed to the left of each column, in the example below I added three spaces into the text field `   `.

```
   |China|1,439,323,776|18.47 %|
   |India|1,380,004,385|17.70 %|
   |United States|331,002,651|4.25 %|
```

## Combine the Options

It is possible to combine the options to achieve the desired results.

e.g. adding 2 spaces, in front, with padding on both sides, showing headers and pretty printing:

```
  | Country       | Population    | World Share |
  | China         | 1,439,323,776 | 18.47 %     |
  | India         | 1,380,004,385 | 17.70 %     |
  | United States | 331,002,651   | 4.25 %      |
```