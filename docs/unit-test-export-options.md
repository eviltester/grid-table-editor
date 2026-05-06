# Unit Test Export Options

`Code (Unit Test)` formats share a common option set:

- `suiteName`
- `testNamePrefix`
- `assertionStyle` (`strict` or `basic`)
- `includeSetup` (`true` or `false`)
- `prettyPrint`
- `dataSourceStrategy` (framework-dependent)

## Assertion Style Mapping

| Framework | strict | basic |
| --- | --- | --- |
| JUnit4/5/6 | `assertEquals` | `assertEquals` |
| TestNG | `assertEquals` | `assertEquals` |
| PyTest | `==` | `==` |
| Jest | `toStrictEqual` | `toEqual` |
| xUnit | `Assert.Equal` | `Assert.Equal` |
| RSpec | `eq` | `eq` |
| PHPUnit | `assertSame` | `assertEquals` |
| Kotest | `shouldBe` | `shouldBe` |
| Test::More | `is_deeply` | `is` when scalar-safe, otherwise `is_deeply` |

## Data Source Strategy Availability

- `junit5`, `junit6`: `provider`, `inline`, `csv`
- `junit4`, `testng`, `pytest`, `jest`, `xunit`: `provider`, `inline`
- `rspec`, `phpunit`, `kotest`, `test-more`: `provider` (single supported strategy in UI)

## includeSetup

When enabled, generated output includes framework-idiomatic setup scaffolding:

- JUnit4 `@Before`
- JUnit5/6 `@BeforeEach`
- TestNG `@BeforeMethod`
- PyTest fixture
- Jest `beforeEach`
- xUnit constructor setup
- RSpec `before`
- PHPUnit `setUp()`
- Kotest `beforeTest`
- Test::More setup variable scaffold
