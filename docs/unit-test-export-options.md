# Unit Test Export Options

`Code (Unit Test)` export generates **parameterized, data-driven test scaffolding** from table rows.

The output is intended as a starting point:

- row data is emitted as test parameters (provider/method/inline/csv depending on framework)
- a placeholder `mapRowUnderTest(...)` function/method is generated
- generated assertions compare expected row values with actual mapped values

Shared options:

- `suiteName`
- `testNamePrefix`
- `includeSetup` (`true` or `false`)
- `prettyPrint`
- `dataSourceStrategy` (framework-dependent)

## JUnit Example (Generated Scaffold)

Example (JUnit5, provider strategy):

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

## Data Source Strategy Availability

- `junit5`, `junit6`: `provider`, `inline`, `csv`
- `junit4`, `testng`, `pytest`, `unittest`, `nose2`, `jest`, `vitest`, `mocha`, `xunit`, `nunit`, `mstest`: `provider`, `inline`
- `rspec`, `minitest`, `phpunit`, `pest`, `kotest`, `junit5-kotlin`, `spek`, `test-more`, `test2-suite`: `provider`

## includeSetup

When enabled, generated output includes framework-idiomatic setup scaffolding:

- JUnit4 `@Before`
- JUnit5/6 `@BeforeEach`
- TestNG `@BeforeMethod`
- PyTest fixture
- unittest `setUp`
- nose2 `setUp`
- Jest `beforeEach`
- Vitest `beforeEach`
- Mocha `beforeEach`
- xUnit constructor setup
- NUnit `[SetUp]`
- MSTest `[TestInitialize]`
- RSpec `before`
- Minitest `setup`
- PHPUnit `setUp()`
- Kotest `beforeTest`
- JUnit5 Kotlin `@BeforeEach`
- Spek `beforeEachTest`
- Test::More setup variable scaffold
- Test2::Suite setup variable scaffold

## Framework Docs (Official)

- JUnit 4: https://junit.org/junit4/
- JUnit 5 (Jupiter): https://junit.org/junit5/
- TestNG: https://testng.org/
- pytest: https://docs.pytest.org/
- unittest: https://docs.python.org/3/library/unittest.html
- nose2: https://docs.nose2.io/
- Jest: https://jestjs.io/
- Vitest: https://vitest.dev/
- Mocha: https://mochajs.org/
- xUnit.net: https://xunit.net/
- NUnit: https://nunit.org/
- MSTest: https://learn.microsoft.com/dotnet/core/testing/unit-testing-with-mstest
- RSpec: https://rspec.info/
- Minitest: https://github.com/minitest/minitest
- PHPUnit: https://phpunit.de/
- Pest: https://pestphp.com/
- Kotest: https://kotest.io/
- JUnit 5 for Kotlin (Jupiter): https://junit.org/junit5/
- Spek: https://spekframework.github.io/
- Test::More: https://metacpan.org/pod/Test::More
- Test2::Suite: https://metacpan.org/pod/Test2::Suite
