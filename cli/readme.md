## Simple CLI Test Data Generator

Experiment with bun to create a CLI file using existing sources as much as possible.

Re-using code from AnyWayData.com web app. Generate Test Data using the same file specification.

Faker API is documented here:

- https://fakerjs.dev/api/

AnyWayData Test Generation is described here:

- https://anywaydata.com/docs/test-data/test-data-generation
- https://anywaydata.com/docs/test-data/regex-test-data
- https://anywaydata.com/docs/test-data/faker-test-data

## Example usage

Given a file of test data spec as input in `exampleTestDataSpec.txt` generate 3 lines of output to console.

`anywaydata generate -i exampleTestDataSpec.txt -n 3`

Output file can be specified with `-o` option.

`anywaydata generate -i exampleTestDataSpec.txt -n 3 -o output.txt`

Outputting to a file using standard out redirection.

`anywaydata generate -i exampleTestDataSpec.txt -n 3 > output.csv`


## Test Data Specification File Format

The file format is a very simple.

- Each Column of data is specified as the column name on one line, and the data spec on next line
- Multiple Columns can be created by adding multiple two line sequences

e.g.

```
Column Name 1
Data Value Spec for Column Name 1
Column Name 2
Data Value Spec for Column Name 2
```

### Data Value Specifications - Literal Values

 e.g.

```
Company
AnyWayData
```
Above creates a single field called `Company` with the String literal value `AnyWayData`

Literal data would be repeated e.g.

```
anywaydata generate -i ./examples/company-literal.txt -n 3
"Company"
"AnyWayData"
"AnyWayData"
"AnyWayData"
```

### Data Value Specifications - Faker Random Data Values

Faker Data can be used as the data spec e.g.

```
Company
company.name
```

This could be used as follows:

```
> anywaydata generate -i ./examples/company.txt -n 3                                    
"Company"
"Lowe LLC"
"Stroman, Hills and Bauch"
"Torp - Gutkowski"
```

The faker API is documented here: https://fakerjs.dev/api/

### Data Value Specifications - Regex Random Data Values

Any data spec value that is not identified as a faker value is treated as a regex. Literals are actually processed as a regex.

So if you wanted a literal with a "." you would have to escape it.

```
Company
AnyWayData\.com
```

But this means we can generate data that Faker does not support. e.g. custom fields with 3 to 6 letters A-Z followed by 0 to 6 digits

```
Regex Generated Field
[A-Z]{3,6}[0-9]{0,6}
```

Would generate something like:

```
> anywaydata generate -i ./examples/regex-field.txt -n 3                                    
"Regex Generated Field"
"OFQ6"
"OPXSE"
"LVQF5162"
```

### Building

This is a prototype using Bun

https://bun.sh/



```
bun build ./index.ts --outdir ./out --target bun
```

Creating executables:

https://bun.sh/docs/bundler/executables


```
bun build ./index.ts --compile --minify --sourcemap --target=bun-windows-x64 --outfile ./out/windows64/anywaydata.exe
```


// ENOENT: Failed to move cross-compiled bun binary into cache directory C:\Users\user\.bun\install\cache\bun-linux-x64-v1.2.10
```
bun build ./index.ts --compile --outfile ./out/linux-x64/anywaydata --target=bun-linux-x64
```

```
bun build ./index.ts --compile --outfile ./out/linux-arm64/anywaydata --target=bun-linux-arm64
```

```
bun build ./index.ts --compile --outfile ./out/macos-x64/anywaydata --target=bun-darwin-x64
```

```
bun build ./index.ts --compile --outfile ./out/macos-arm64/anywaydata --target=bun-darwin-arm64
```