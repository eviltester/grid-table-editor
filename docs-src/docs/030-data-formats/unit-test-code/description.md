---
sidebar_position: 1
title: "Unit Test Code"
description: "Unit Test Code export generates scaffolded, data-driven test source for multiple frameworks and languages from grid data."
---

Unit Test Code export lets you generate test scaffolding directly from tabular data.

## What is Unit Test Code Output?

AnyWayData can export rows as data-driven test inputs for multiple frameworks (for example JUnit, pytest, Jest, xUnit, RSpec, PHPUnit, Kotest, and Perl test frameworks).

Generated output includes:

- framework-appropriate imports/annotations
- setup scaffold (optional)
- provider or inline data strategy (framework dependent)
- assertion scaffold mapped to each header

## How is Unit Test Code output different from language data exports?

Language data exports (JSON, Python, Java, etc.) produce data structures.

Unit Test Code output produces executable test scaffolding that:

- includes framework test wrappers
- loops/parameterizes rows as test cases
- emits assertion templates for each column

## Example Scaffold (JUnit 5)

Example output using a provider strategy:

```java
import static org.junit.jupiter.api.Assertions.assertEquals;
import java.util.stream.Stream;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

public class GeneratedDataTests {
    static Stream<Arguments> data() {
        return Stream.of(
            Arguments.of("Connie", 21),
            Arguments.of("Miles", 34)
        );
    }

    @ParameterizedTest
    @MethodSource("data")
    void row_parameterized(Object... row) {
        Object[] expected = row;
        Object[] actual = mapRowUnderTest(row);
        assertEquals(expected[0], actual[0]); // Name
        assertEquals(expected[1], actual[1]); // Age
    }

    private Object[] mapRowUnderTest(Object[] input) {
        // Example: return PersonMapper.normalize(input);
        return input; // replace with your system-under-test call
    }
}
```

## AnyWayData Support for Unit Test Code

AnyWayData currently supports exporting to multiple unit-test frameworks across Java, JavaScript/TypeScript, Python, Ruby, PHP, Kotlin, and Perl.

See [Unit Test Code Options](/docs/data-formats/unit-test-code/options) for configuration details.

For more information on language-specific data output support, see:

- [C#](/docs/data-formats/csharp/csharp)
- [Java](/docs/data-formats/java/java)
- [JavaScript](/docs/data-formats/javascript/javascript)
- [Kotlin](/docs/data-formats/kotlin/kotlin)
- [Perl](/docs/data-formats/perl/perl)
- [PHP](/docs/data-formats/php/php)
- [Python](/docs/data-formats/python/python)
- [Ruby](/docs/data-formats/ruby/ruby)
- [TypeScript](/docs/data-formats/typescript/typescript)

