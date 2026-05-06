---
sidebar_position: 5
title: "Pairwise Testing"
description: "Generate efficient test data combinations using pairwise combinatorial testing"
---

# Pairwise Test Data Generation

The pairwise feature generates the minimal set of test data combinations that provides complete pairwise coverage across multiple enum fields. This is ideal for combinatorial testing scenarios where you need to test interactions between different categorical parameters efficiently.

## What is Pairwise Testing?

Pairwise Testing is a combinatorial testing technique that generates test cases to cover all possible pairs of parameter values. Instead of testing every possible combination (which can be exponentially large), pairwise testing ensures that every pair of values across different parameters is tested at least once.

For example, with:
- **Color**: red, blue, green, yellow (4 values)  
- **Size**: small, medium, large (3 values)
- **Material**: wood, metal (2 values)

A full factorial test would require 4 × 3 × 2 = 24 test cases. Pairwise testing achieves 100% pairwise coverage with just 8-12 test cases, providing a 50-67% reduction in test data while maintaining comprehensive coverage of parameter interactions.

## When to Use Pairwise

Pairwise testing is most effective when:

- You have **2 or more categorical parameters** (enum fields)
- Each parameter has **multiple possible values**
- You want to test **interactions between parameters** 
- **Full factorial testing is impractical** due to the large number of combinations
- You're doing **configuration testing, UI testing, or API testing** with multiple options

## How to Generate Pairwise Data

### In the Main App (app.html)

1. **Open the Test Data section** by clicking the "Test Data" header
2. **Define your enum parameters** in the Test Data Text Schema:
   ```
   color
   red,blue,green,yellow
   size  
   small,medium,large
   material
   wood,metal
   ```
3. **Click "Generate Pairwise"** - the button appears automatically when you have 2+ enum fields
4. **Review the results** - compact pairwise combinations will populate the main grid
5. **Export as needed** using any of the available export formats (CSV, JSON, etc.)

### In the Data Generator (generator.html)

1. **Set up enum fields** in the schema:
   - Set Column Name (e.g., "color")
   - Choose "enum" from the source type dropdown
   - Enter comma-separated values (e.g., "red,blue,green,yellow")
2. **Add additional enum fields** using the "+ Add Field" button  
3. **Click "Generate Pairwise"** - appears when 2+ enum fields are configured
4. **Download the results** as a file in your chosen format

## Enum Format Examples

AnyWayData supports multiple formats for specifying enum values in pairwise testing:

### Simple Comma-Separated Format

The basic format uses comma-separated values:

```
Priority
high,medium,low
Status  
active,inactive,pending
```

### Function-Based Formats

For more complex scenarios, you can use function-based formats:

#### Basic enum() Function
```
Priority
enum(high,medium,low)
Status
enum(active,inactive,pending)
```

#### Datatype enum() Function  
```
Priority
datatype.enum(high,medium,low)
Status
datatype.enum(active,inactive,pending)
```

#### Full AWD enum() Function
```
Priority
awd.datatype.enum(high,medium,low)
Status
awd.datatype.enum(active,inactive,pending)
```

### Quoted Values for Complex Data

When your enum values contain commas or special characters, use quoted values:

```
Product Category
enum("Hardware, Electronics","Software, Applications","Books, Media")
Location
enum("New York, NY","Los Angeles, CA","Chicago, IL")
Status Message
enum("Ready, waiting for input","Processing, please wait","Error, check configuration")
```

### Mixed Quoted and Unquoted Values

You can mix quoted and unquoted values in the same enum:

```
Environment
enum("Production, Live",staging,development,"Test, QA")
User Type
enum("Admin, Full Access",editor,viewer,"Guest, Limited")
```

## Mixed Pairwise with Random Data

One of the most powerful features of pairwise testing is combining it with random data generation. You can use pairwise for your categorical parameters while generating random values for other fields.

### Example: API Testing Scenario

Consider testing an API with both categorical parameters (that need pairwise coverage) and data fields (that need realistic random values):

- First categorical parameters for pairwise coverage
- Then random values User ID, etc.

```
HTTP Method
enum(GET,POST,PUT,DELETE)
Content Type  
enum("application/json","application/xml","text/plain")
User ID
faker.number.int
Email Address
faker.internet.email
Request Timestamp
faker.date.recent
Authorization Token
[A-Fa-f0-9]{32}
Response Time
faker.number.int
```

This configuration generates test data where:

- **HTTP Method and Content Type** use pairwise to ensure every combination is tested (4 × 3 = 12 pairs covered)
- **User ID, Email, Timestamp, Token, and Response Time** generate unique random values for each test case

### Example Output

The mixed approach generates data like this:

```csv
HTTP Method,Content Type,User ID,Email Address,Request Timestamp,Authorization Token,Response Time
GET,application/json,15847,alice.johnson@example.com,2026-05-05T14:30:22Z,A1B2C3D4E5F6789012345678,245
POST,application/xml,92634,bob.smith@test.org,2026-05-04T09:15:43Z,F9E8D7C6B5A4321098765432,189
PUT,text/plain,7321,carol.davis@demo.net,2026-05-03T16:45:12Z,1122334455667788AABBCCDD,312
DELETE,application/json,48592,david.wilson@sample.io,2026-05-02T11:20:55Z,9988776655443322EEFFAABB,156
GET,application/xml,83746,eve.brown@testing.com,2026-05-01T08:35:17Z,DEADBEEFCAFEBABE12345678,278
POST,text/plain,19873,frank.miller@qa.org,2026-04-30T13:50:09Z,ABCDEF1234567890FEDCBA09,203
```

### Benefits of Mixed Approach

1. **Comprehensive Coverage**: All parameter interactions are tested while maintaining realistic data variety
2. **Optimal Test Size**: Fewer test cases than full factorial, more coverage than pure random
3. **Real-World Relevance**: Combines systematic testing with realistic random values
4. **Flexible Configuration**: Easy to adjust which parameters use All Pairs vs. random generation

### Best Practices for Mixed Testing

- **Use pairwise for categorical parameters** with limited, well-defined values
- **Use random generation for data fields** that need variety (IDs, timestamps, names)
- **Keep enum parameters meaningful** - they should represent real configuration choices
- **Balance test data size** - more enum parameters = larger pairwise sets
- **Validate generated combinations** to ensure they make business sense

## Algorithm Details

AnyWayData uses a greedy set cover approximation algorithm that:

- **Achieves 90-99% data reduction** compared to full factorial testing
- **Guarantees 100% pairwise coverage** - every pair of values is tested at least once
- **Runs in O(n² × v² × log(pairs)) time** where n is parameters and v is values per parameter
- **Generates deterministic results** - same input always produces the same pairwise set

## Example Output

Given the color and size example above, pairwise generates these 12 combinations:

```csv
color,size
red,small
red,medium  
red,large
blue,small
blue,medium
blue,large
green,small
green,medium
green,large
yellow,small
yellow,medium
yellow,large
```

This covers every possible pair:
- (red,small), (red,medium), (red,large)
- (blue,small), (blue,medium), (blue,large)  
- And so on...

## Integration with Other Features

Pairwise data integrates with AnyWayData's other capabilities:

- **Export formats**: Use CSV, JSON, SQL, Markdown, or code generation formats
- **Grid editing**: Manually adjust generated combinations if needed
- **Text formats**: Copy results directly for use in test frameworks

## Best Practices

- **Use meaningful parameter names** that clearly describe what's being tested
- **Keep enum values concise** and representative of real test scenarios  
- **Use quoted values** when enum options contain commas or special characters
- **Choose appropriate enum formats** - simple comma-separated for basic cases, function formats for complex schemas
- **Review generated combinations** to ensure they make sense for your use case
- **Combine with other test data types** - use pairwise for categorical parameters and faker/regex for random data fields
- **Balance categorical vs. random parameters** - more enum fields increase the pairwise test set size
- **Validate mixed scenarios** - ensure pairwise combinations work with random data values
- **Document your test coverage** - export results to show what parameter interactions are tested
- **Test your enum formats** - verify that quoted and complex enum values work as expected

## Limitations

- All Pairs testing is designed for **categorical (enum) parameters only** - other parameter types use random generation
- Requires **at least 2 enum fields** to generate meaningful pairwise combinations  
- **Does not test higher-order interactions** (3-way, 4-way, etc.) - only pairwise coverage
- **May not be suitable for parameters with dependencies** or constraints between values

## Related Sources of Information

### Official Standards and Publications



### Tools and Implementations

**James Bach Satisfice AllPairs Tool**
- Open-source tool written in Perl for pairwise data generation
- Download: https://www.satisfice.com/download/allpairs

**Microsoft PICT (Pairwise Independent Combinatorial Tool)**
- Open-source command-line tool for generating pairwise test cases
- Industry-standard reference implementation
- GitHub Repository: https://github.com/microsoft/pict
- Documentation: https://github.com/Microsoft/pict/blob/main/doc/pict.md

**Pairwise.org Community Resource**
- Comprehensive resource site for pairwise testing
- Tool comparisons and efficiency analysis
- Website: http://www.pairwise.org/
- Tools listing: https://www.pairwise.org/tools.html

### Academic Research and Papers

**Michael Bolton Developsense**
- A good overview of Pairwise and Orthogonal data generation
- https://www.developsense.com/resource/pairwiseTesting.html

**Google Scholar - Combinatorial Testing Research**
- Extensive collection of academic papers on pairwise and combinatorial testing
- Search: ["pairwise testing" OR "combinatorial testing"](https://scholar.google.com/scholar?hl=en&q=%22pairwise+testing%22+OR+%22combinatorial+testing%22)
- Covers theoretical foundations, algorithms, and empirical studies

**NIST Special Publication 800-142: Practical Combinatorial Testing**
- *National Institute of Standards and Technology*
- Comprehensive guide to combinatorial testing methodology and best practices
- Available at: https://csrc.nist.gov/publications/detail/sp/800-142/final
- Authors: Richard Kuhn, Raghu Kacker, Yu Lei (NIST)
