class TestFrameworkConvertorOptions {
  constructor() {
    this.options = {
      suiteName: 'GeneratedDataTests',
      testNamePrefix: 'row',
      includeSetup: true,
      prettyPrint: true,
      dataSourceStrategy: 'provider',
    };
  }

  mergeOptions(newOptions) {
    if (newOptions?.options) {
      this.options = { ...this.options, ...newOptions.options };
      return;
    }
    this.options = { ...this.options, ...(newOptions || {}) };
  }
}

function toRowObject(headers, rowValues) {
  const row = {};
  headers.forEach((header, index) => {
    row[header] = rowValues[index];
  });
  return row;
}

function jsValue(value) {
  return JSON.stringify(value);
}

function pythonValue(value) {
  if (value === null) return 'None';
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return `[${value.map((entry) => pythonValue(entry)).join(', ')}]`;
  if (typeof value === 'object') {
    return `{${Object.entries(value)
      .map(([key, entry]) => `${JSON.stringify(key)}: ${pythonValue(entry)}`)
      .join(', ')}}`;
  }
  return JSON.stringify(value);
}

function rubyValue(value) {
  if (value === null) return 'nil';
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return `[${value.map((entry) => rubyValue(entry)).join(', ')}]`;
  if (typeof value === 'object') {
    return `{ ${Object.entries(value)
      .map(([key, entry]) => `${key}: ${rubyValue(entry)}`)
      .join(', ')} }`;
  }
  return JSON.stringify(value);
}

function phpValue(value) {
  if (value === null) return 'null';
  if (typeof value === 'string') return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return `[${value.map((entry) => phpValue(entry)).join(', ')}]`;
  if (typeof value === 'object') {
    return `[${Object.entries(value)
      .map(([key, entry]) => `'${String(key).replace(/'/g, "\\'")}' => ${phpValue(entry)}`)
      .join(', ')}]`;
  }
  return 'null';
}

function buildCanonicalModel(dataTable, config) {
  const headers = dataTable.getHeaders();
  const rows = [];
  for (let rowIndex = 0; rowIndex < dataTable.getRowCount(); rowIndex += 1) {
    rows.push(toRowObject(headers, dataTable.getRow(rowIndex)));
  }

  return {
    schemaVersion: '1.0',
    suiteName: config.suiteName,
    testNamePrefix: config.testNamePrefix,
    includeSetup: config.includeSetup,
    prettyPrint: config.prettyPrint,
    dataSourceStrategy: config.dataSourceStrategy,
    headers,
    rows,
  };
}

function formatRowCollection(rows, valueFormatter, prettyPrint, baseIndent = '') {
  if (!prettyPrint) {
    return `[${rows.map((row) => valueFormatter(row)).join(', ')}]`;
  }
  const indent = `${baseIndent}  `;
  return `[\n${rows.map((row) => `${indent}${valueFormatter(row)}`).join(',\n')}\n${baseIndent}]`;
}

function isStrictAssertionStyle(_model) {
  return true;
}

function isScalarValue(value) {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
}

function renderJavaJUnit4(model) {
  const strictAssertions = isStrictAssertionStyle(model);
  const assertionLineForIndex = (index, header) =>
    strictAssertions
      ? `        assertEquals(expected[${index}], actual[${index}]); // ${header}`
      : `        assertTrue(Objects.equals(expected[${index}], actual[${index}])); // ${header}`;

  if (model.dataSourceStrategy !== 'provider') {
    const dataRows = model.rows.map(
      (row) =>
        `            new Object[] { ${Object.values(row)
          .map((value) => jsValue(value))
          .join(', ')} }`
    );
    const setupLines = model.includeSetup
      ? ['    @Before', '    public void setUp() {', '        // setup', '    }', '']
      : [];
    const lines = [
      ...(strictAssertions
        ? ['import static org.junit.Assert.assertEquals;']
        : ['import static org.junit.Assert.assertTrue;']),
      ...(strictAssertions ? [] : ['import java.util.Objects;']),
      ...(model.includeSetup ? ['import org.junit.Before;'] : []),
      'import org.junit.experimental.theories.DataPoints;',
      'import org.junit.experimental.theories.FromDataPoints;',
      'import org.junit.experimental.theories.Theories;',
      'import org.junit.experimental.theories.Theory;',
      'import org.junit.runner.RunWith;',
      '',
      '@RunWith(Theories.class)',
      `public class ${model.suiteName} {`,
      '    @DataPoints("rows")',
      '    public static Object[][] rows = new Object[][] {',
      dataRows.join(',\n'),
      '    };',
      '',
      '    private Object[] mapRowUnderTest(Object[] input) {',
      '        // Example: return PersonMapper.normalize(input);',
      '        return input; // replace with your system-under-test call',
      '    }',
      '',
      ...setupLines,
      '    @Theory',
      `    public void ${model.testNamePrefix}_parameterized(@FromDataPoints("rows") Object[] row) {`,
      '        Object[] expected = row;',
      '        Object[] actual = mapRowUnderTest(row);',
      model.headers.map((header, index) => assertionLineForIndex(index, header)).join('\n'),
      '    }',
      '}',
    ];
    return lines.join('\n');
  }

  const dataRows = model.rows.map(
    (row) =>
      `            new Object[] { ${Object.values(row)
        .map((value) => jsValue(value))
        .join(', ')} }`
  );
  const setupLines = model.includeSetup
    ? ['    @Before', '    public void setUp() {', '        // setup', '    }', '']
    : [];
  const lines = [
    ...(strictAssertions
      ? ['import static org.junit.Assert.assertEquals;']
      : ['import static org.junit.Assert.assertTrue;']),
    ...(strictAssertions ? [] : ['import java.util.Objects;']),
    'import java.util.Arrays;',
    'import java.util.Collection;',
    ...(model.includeSetup ? ['import org.junit.Before;'] : []),
    'import org.junit.Test;',
    'import org.junit.runner.RunWith;',
    'import org.junit.runners.Parameterized;',
    '',
    '@RunWith(Parameterized.class)',
    `public class ${model.suiteName} {`,
    '    @Parameterized.Parameters(name = "{index}")',
    '    public static Collection<Object[]> data() {',
    '        return Arrays.asList(',
    dataRows.join(',\n'),
    '        );',
    '    }',
    '',
    '    private final Object[] row;',
    '',
    `    public ${model.suiteName}(Object... row) {`,
    '        this.row = row;',
    '    }',
    '',
    '    private Object[] mapRowUnderTest(Object[] input) {',
    '        // Example: return PersonMapper.normalize(input);',
    '        return input; // replace with your system-under-test call',
    '    }',
    '',
    ...setupLines,
    '    @Test',
    `    public void ${model.testNamePrefix}_parameterized() {`,
    '        Object[] expected = row;',
    '        Object[] actual = mapRowUnderTest(row);',
    model.headers.map((header, index) => assertionLineForIndex(index, header)).join('\n'),
    '    }',
    '}',
  ];
  return lines.join('\n');
}

function renderJavaJUnit5(model) {
  const strictAssertions = isStrictAssertionStyle(model);
  const assertionLineForIndex = (index, header) =>
    strictAssertions
      ? `        assertEquals(expected[${index}], actual[${index}]); // ${header}`
      : `        assertTrue(Objects.equals(expected[${index}], actual[${index}])); // ${header}`;

  if (model.dataSourceStrategy === 'inline' || model.dataSourceStrategy === 'csv') {
    const csvRows = model.rows.map((row) =>
      Object.values(row)
        .map((value) => (typeof value === 'string' ? `"${String(value).replace(/"/g, '\\"')}"` : String(value)))
        .join(', ')
    );
    const setupLines = model.includeSetup
      ? ['    @BeforeEach', '    void setUp() {', '        // setup', '    }', '']
      : [];
    const csvLines = [
      ...(strictAssertions
        ? ['import static org.junit.jupiter.api.Assertions.assertEquals;']
        : ['import static org.junit.jupiter.api.Assertions.assertTrue;']),
      ...(strictAssertions ? [] : ['import java.util.Objects;']),
      ...(model.includeSetup ? ['import org.junit.jupiter.api.BeforeEach;'] : []),
      'import org.junit.jupiter.params.ParameterizedTest;',
      'import org.junit.jupiter.params.provider.CsvSource;',
      '',
      `public class ${model.suiteName} {`,
      ...setupLines,
      '    @ParameterizedTest',
      '    @CsvSource({',
      ...csvRows.map((row) => `        ${JSON.stringify(row)},`),
      '    })',
      `    void ${model.testNamePrefix}_parameterized(Object... row) {`,
      '        Object[] expected = row;',
      '        Object[] actual = mapRowUnderTest(row);',
      model.headers.map((header, index) => assertionLineForIndex(index, header)).join('\n'),
      '    }',
      '',
      '    private Object[] mapRowUnderTest(Object[] input) {',
      '        // Example: return PersonMapper.normalize(input);',
      '        return input; // replace with your system-under-test call',
      '    }',
      '}',
    ];
    return csvLines.join('\n');
  }
  const dataRows = model.rows.map(
    (row) =>
      `            Arguments.of(${Object.values(row)
        .map((value) => jsValue(value))
        .join(', ')})`
  );
  const setupLines = model.includeSetup
    ? ['    @BeforeEach', '    void setUp() {', '        // setup', '    }', '']
    : [];
  const lines = [
    ...(strictAssertions
      ? ['import static org.junit.jupiter.api.Assertions.assertEquals;']
      : ['import static org.junit.jupiter.api.Assertions.assertTrue;']),
    ...(strictAssertions ? [] : ['import java.util.Objects;']),
    'import java.util.stream.Stream;',
    ...(model.includeSetup ? ['import org.junit.jupiter.api.BeforeEach;'] : []),
    'import org.junit.jupiter.params.ParameterizedTest;',
    'import org.junit.jupiter.params.provider.Arguments;',
    'import org.junit.jupiter.params.provider.MethodSource;',
    '',
    `public class ${model.suiteName} {`,
    '    static Stream<Arguments> data() {',
    '        return Stream.of(',
    dataRows.join(',\n'),
    '        );',
    '    }',
    '',
    ...setupLines,
    '    @ParameterizedTest',
    '    @MethodSource("data")',
    `    void ${model.testNamePrefix}_parameterized(Object... row) {`,
    '        Object[] expected = row;',
    '        Object[] actual = mapRowUnderTest(row);',
    model.headers.map((header, index) => assertionLineForIndex(index, header)).join('\n'),
    '    }',
    '',
    '    private Object[] mapRowUnderTest(Object[] input) {',
    '        // Example: return PersonMapper.normalize(input);',
    '        return input; // replace with your system-under-test call',
    '    }',
    '}',
  ];
  return lines.join('\n');
}

function renderTestNg(model) {
  const strictAssertions = isStrictAssertionStyle(model);
  const assertionLineForIndex = (index, header) =>
    strictAssertions
      ? `        assertEquals(expected[${index}], actual[${index}]); // ${header}`
      : `        assertTrue(Objects.equals(expected[${index}], actual[${index}])); // ${header}`;

  if (model.dataSourceStrategy !== 'provider') {
    const factoryRows = model.rows.map(
      (row) =>
        `            new Object[] { ${Object.values(row)
          .map((value) => jsValue(value))
          .join(', ')} }`
    );
    const setupLines = model.includeSetup
      ? ['    @BeforeMethod', '    public void setUp() {', '        // setup', '    }', '']
      : [];
    const inlineLines = [
      ...(strictAssertions
        ? ['import static org.testng.Assert.assertEquals;']
        : ['import static org.testng.Assert.assertTrue;']),
      ...(strictAssertions ? [] : ['import java.util.Objects;']),
      'import org.testng.annotations.Factory;',
      ...(model.includeSetup ? ['import org.testng.annotations.BeforeMethod;'] : []),
      'import org.testng.annotations.Test;',
      '',
      `public class ${model.suiteName} {`,
      '    private final Object[] row;',
      '',
      `    public ${model.suiteName}(Object... row) {`,
      '        this.row = row;',
      '    }',
      '',
      '    @Factory',
      `    public static Object[] ${model.testNamePrefix}Factory() {`,
      '        Object[][] rows = new Object[][] {',
      factoryRows.join(',\n'),
      '        };',
      '        Object[] instances = new Object[rows.length];',
      '        for (int i = 0; i < rows.length; i++) {',
      `            instances[i] = new ${model.suiteName}(rows[i]);`,
      '        }',
      '        return instances;',
      '    }',
      '',
      ...setupLines,
      '    @Test',
      `    public void ${model.testNamePrefix}_parameterized() {`,
      '        Object[] expected = row;',
      '        Object[] actual = mapRowUnderTest(row);',
      model.headers.map((header, index) => assertionLineForIndex(index, header)).join('\n'),
      '    }',
      '',
      '    private Object[] mapRowUnderTest(Object[] input) {',
      '        // Example: return PersonMapper.normalize(input);',
      '        return input; // replace with your system-under-test call',
      '    }',
      '}',
    ];
    return inlineLines.join('\n');
  }

  const dataRows = model.rows.map(
    (row) =>
      `            new Object[] { ${Object.values(row)
        .map((value) => jsValue(value))
        .join(', ')} }`
  );
  const setupLines = model.includeSetup
    ? ['    @BeforeMethod', '    public void setUp() {', '        // setup', '    }', '']
    : [];
  const lines = [
    ...(strictAssertions
      ? ['import static org.testng.Assert.assertEquals;']
      : ['import static org.testng.Assert.assertTrue;']),
    ...(strictAssertions ? [] : ['import java.util.Objects;']),
    ...(model.includeSetup ? ['import org.testng.annotations.BeforeMethod;'] : []),
    'import org.testng.annotations.DataProvider;',
    'import org.testng.annotations.Test;',
    '',
    `public class ${model.suiteName} {`,
    '    @DataProvider(name = "rows")',
    '    public Object[][] rows() {',
    '        return new Object[][] {',
    dataRows.join(',\n'),
    '        };',
    '    }',
    '',
    ...setupLines,
    '    @Test(dataProvider = "rows")',
    `    public void ${model.testNamePrefix}_parameterized(Object... row) {`,
    '        Object[] expected = row;',
    '        Object[] actual = mapRowUnderTest(row);',
    model.headers.map((header, index) => assertionLineForIndex(index, header)).join('\n'),
    '    }',
    '',
    '    private Object[] mapRowUnderTest(Object[] input) {',
    '        // Example: return PersonMapper.normalize(input);',
    '        return input; // replace with your system-under-test call',
    '    }',
    '}',
  ];
  return lines.join('\n');
}

function renderPyTest(model) {
  const strictAssertions = isStrictAssertionStyle(model);
  const assertionLines = model.headers.flatMap((header) => {
    const valueAssertion = `    assert actual[${JSON.stringify(header)}] == expected[${JSON.stringify(header)}]`;
    if (!strictAssertions) {
      return [valueAssertion];
    }
    return [
      valueAssertion,
      `    assert type(actual[${JSON.stringify(header)}]) is type(expected[${JSON.stringify(header)}])`,
    ];
  });
  const rowData = formatRowCollection(model.rows, pythonValue, model.prettyPrint, '    ');
  const mappingLines = [
    'def map_row_under_test(row):',
    '    # Example: return normalize_person(row)',
    '    return row  # replace with your system-under-test call',
    '',
  ];
  const setupLines = model.includeSetup ? ['@pytest.fixture', 'def setup_context():', '    return {}', ''] : [];
  const testArgs = model.includeSetup ? `${model.testNamePrefix}, setup_context` : model.testNamePrefix;
  if (model.dataSourceStrategy === 'provider') {
    const providerLines = [
      'import pytest',
      '',
      ...mappingLines,
      ...setupLines,
      'def row_provider():',
      `    return ${rowData}`,
      '',
      `@pytest.mark.parametrize("${model.testNamePrefix}", row_provider())`,
      `def test_${model.testNamePrefix}_parameterized(${testArgs}):`,
      `    expected = ${model.testNamePrefix}`,
      `    actual = map_row_under_test(${model.testNamePrefix})`,
      ...assertionLines,
    ];
    return providerLines.join('\n');
  }
  const lines = [
    'import pytest',
    '',
    ...mappingLines,
    ...setupLines,
    `ROWS = ${rowData}`,
    '',
    `@pytest.mark.parametrize("${model.testNamePrefix}", ROWS)`,
    `def test_${model.testNamePrefix}_parameterized(${testArgs}):`,
    `    expected = ${model.testNamePrefix}`,
    `    actual = map_row_under_test(${model.testNamePrefix})`,
    ...assertionLines,
  ];
  return lines.join('\n');
}

function renderJest(model) {
  const rowData = formatRowCollection(model.rows, jsValue, model.prettyPrint, '  ');
  const assertionMethod = isStrictAssertionStyle(model) ? 'toStrictEqual' : 'toEqual';
  const setupLines = model.includeSetup ? ['  beforeEach(() => {', '    // setup', '  });', ''] : [];
  if (model.dataSourceStrategy === 'provider') {
    const providerLines = [
      `const getRows = () => ${rowData};`,
      'const mapRowUnderTest = (row) => {',
      '  // Example: return normalizePerson(row);',
      '  return row; // replace with your system-under-test call',
      '};',
      '',
      `describe('${model.suiteName}', () => {`,
      ...setupLines,
      `  test.each(getRows())('${model.testNamePrefix} parameterized', (row) => {`,
      '    const expected = row;',
      '    const actual = mapRowUnderTest(row);',
      ...model.headers.map(
        (header) =>
          `    expect(actual[${JSON.stringify(header)}]).${assertionMethod}(expected[${JSON.stringify(header)}]);`
      ),
      '  });',
      '});',
    ];
    return providerLines.join('\n');
  }
  const lines = [
    `const rows = ${rowData};`,
    'const mapRowUnderTest = (row) => {',
    '  // Example: return normalizePerson(row);',
    '  return row; // replace with your system-under-test call',
    '};',
    '',
    `describe('${model.suiteName}', () => {`,
    ...setupLines,
    `  test.each(rows)('${model.testNamePrefix} parameterized', (row) => {`,
    '    const expected = row;',
    '    const actual = mapRowUnderTest(row);',
    ...model.headers.map(
      (header) =>
        `    expect(actual[${JSON.stringify(header)}]).${assertionMethod}(expected[${JSON.stringify(header)}]);`
    ),
    '  });',
    '});',
  ];
  return lines.join('\n');
}

function renderXunit(model) {
  const strictAssertions = isStrictAssertionStyle(model);
  const assertionLineForIndex = (index, header) =>
    strictAssertions
      ? `        Assert.Equal(expected[${index}], actual[${index}]); // ${header}`
      : `        Assert.True(object.Equals(expected[${index}], actual[${index}])); // ${header}`;
  const setupLines = model.includeSetup
    ? [`    public ${model.suiteName}()`, '    {', '        // setup', '    }', '']
    : [];
  if (model.dataSourceStrategy !== 'provider') {
    const inlineRows = model.rows.map(
      (row) =>
        `    [InlineData(${Object.values(row)
          .map((value) => jsValue(value))
          .join(', ')})]`
    );
    const inlineLines = [
      'using Xunit;',
      '',
      `public class ${model.suiteName}`,
      '{',
      ...setupLines,
      '    [Theory]',
      ...inlineRows,
      `    public void ${model.testNamePrefix}_parameterized(params object[] row)`,
      '    {',
      '        var expected = row;',
      '        var actual = MapRowUnderTest(row);',
      ...model.headers.map((header, index) => assertionLineForIndex(index, header)),
      '    }',
      '',
      '    private object[] MapRowUnderTest(object[] input)',
      '    {',
      '        // Example: return PersonMapper.Normalize(input);',
      '        return input; // replace with your system-under-test call',
      '    }',
      '}',
    ];
    return inlineLines.join('\n');
  }
  const rowData = model.rows.map(
    (row) =>
      `            new object[] { ${Object.values(row)
        .map((value) => jsValue(value))
        .join(', ')} }`
  );
  const lines = [
    'using System.Collections.Generic;',
    'using Xunit;',
    '',
    `public class ${model.suiteName}`,
    '{',
    ...setupLines,
    '    public static IEnumerable<object[]> Rows => new List<object[]>',
    '    {',
    rowData.join(',\n'),
    '    };',
    '',
    '    [Theory]',
    '    [MemberData(nameof(Rows))]',
    `    public void ${model.testNamePrefix}_parameterized(params object[] row)`,
    '    {',
    '        var expected = row;',
    '        var actual = MapRowUnderTest(row);',
    ...model.headers.map((header, index) => assertionLineForIndex(index, header)),
    '    }',
    '',
    '    private object[] MapRowUnderTest(object[] input)',
    '    {',
    '        // Example: return PersonMapper.Normalize(input);',
    '        return input; // replace with your system-under-test call',
    '    }',
    '}',
  ];
  return lines.join('\n');
}

function renderRspec(model) {
  const strictAssertions = isStrictAssertionStyle(model);
  const matcher = strictAssertions ? 'eql' : 'eq';
  const rowData = formatRowCollection(model.rows, rubyValue, model.prettyPrint, '  ');
  const setupLines = model.includeSetup ? ['  before do', '    # setup', '  end', ''] : [];
  if (model.dataSourceStrategy === 'provider') {
    const providerLines = [
      `def row_provider`,
      `  ${rowData.replace(/\n/g, '\n  ')}`,
      'end',
      '',
      'def map_row_under_test(row)',
      '  # Example: PersonNormalizer.normalize(row)',
      '  row # replace with your system-under-test call',
      'end',
      '',
      `RSpec.describe '${model.suiteName}' do`,
      ...setupLines,
      `  it '${model.testNamePrefix} parameterized' do`,
      '    row_provider.each do |row|',
      '      expected = row',
      '      actual = map_row_under_test(row)',
      ...model.headers.map(
        (header) =>
          `      expect(actual[:${header}] || actual[${JSON.stringify(header)}]).to ${matcher}(expected[:${header}] || expected[${JSON.stringify(header)}])`
      ),
      '    end',
      '  end',
      'end',
    ];
    return providerLines.join('\n');
  }
  const lines = [
    `ROWS = ${rowData}`,
    'def map_row_under_test(row)',
    '  # Example: PersonNormalizer.normalize(row)',
    '  row # replace with your system-under-test call',
    'end',
    '',
    `RSpec.describe '${model.suiteName}' do`,
    ...setupLines,
    `  it '${model.testNamePrefix} parameterized' do`,
    '    ROWS.each do |row|',
    '      expected = row',
    '      actual = map_row_under_test(row)',
    ...model.headers.map(
      (header) =>
        `      expect(actual[:${header}] || actual[${JSON.stringify(header)}]).to ${matcher}(expected[:${header}] || expected[${JSON.stringify(header)}])`
    ),
    '    end',
    '  end',
    'end',
  ];
  return lines.join('\n');
}

function renderPhpUnit(model) {
  const assertionMethod = isStrictAssertionStyle(model) ? 'assertSame' : 'assertEquals';
  const rowData = model.rows.map(
    (row) =>
      `            [${Object.values(row)
        .map((value) => phpValue(value))
        .join(', ')}]`
  );
  const setupLines = model.includeSetup
    ? ['    protected function setUp(): void', '    {', '        // setup', '    }', '']
    : [];
  if (model.dataSourceStrategy !== 'provider') {
    const inlineLines = [
      '<?php',
      '',
      'use PHPUnit\\Framework\\TestCase;',
      '',
      `final class ${model.suiteName} extends TestCase`,
      '{',
      ...setupLines,
      `    public function test_${model.testNamePrefix}_parameterized(): void`,
      '    {',
      '        $rows = [',
      rowData.join(',\n'),
      '        ];',
      '        foreach ($rows as $row) {',
      '            $expected = $row;',
      '            $actual = $this->mapRowUnderTest($row);',
      ...model.headers.map(
        (header, index) => `            $this->${assertionMethod}($expected[${index}], $actual[${index}]); // ${header}`
      ),
      '        }',
      '    }',
      '',
      '    private function mapRowUnderTest(array $row): array',
      '    {',
      '        // Example: return PersonMapper::normalize($row);',
      '        return $row; // replace with your system-under-test call',
      '    }',
      '}',
    ];
    return inlineLines.join('\n');
  }
  const lines = [
    '<?php',
    '',
    'use PHPUnit\\Framework\\TestCase;',
    '',
    `final class ${model.suiteName} extends TestCase`,
    '{',
    '    public static function rowProvider(): array',
    '    {',
    '        return [',
    rowData.join(',\n'),
    '        ];',
    '    }',
    '',
    ...setupLines,
    '    /** @dataProvider rowProvider */',
    `    public function test_${model.testNamePrefix}_parameterized(...$row): void`,
    '    {',
    '        $expected = $row;',
    '        $actual = $this->mapRowUnderTest($row);',
    ...model.headers.map(
      (header, index) => `        $this->${assertionMethod}($expected[${index}], $actual[${index}]); // ${header}`
    ),
    '    }',
    '',
    '    private function mapRowUnderTest(array $row): array',
    '    {',
    '        // Example: return PersonMapper::normalize($row);',
    '        return $row; // replace with your system-under-test call',
    '    }',
    '}',
  ];
  return lines.join('\n');
}

function renderKotest(model) {
  const strictAssertions = isStrictAssertionStyle(model);
  const assertionLines = model.headers.flatMap((header) => {
    const valueAssertion = `            actual[${JSON.stringify(header)}] shouldBe expected[${JSON.stringify(header)}]`;
    if (!strictAssertions) {
      return [valueAssertion];
    }
    return [
      valueAssertion,
      `            actual[${JSON.stringify(header)}]?.let { it::class } shouldBe expected[${JSON.stringify(header)}]?.let { it::class }`,
    ];
  });
  const rowData = formatRowCollection(model.rows, jsValue, model.prettyPrint, '        ');
  const setupLines = model.includeSetup ? ['    beforeTest {', '        // setup', '    }', ''] : [];
  if (model.dataSourceStrategy === 'provider') {
    const providerLines = [
      'import io.kotest.core.spec.style.StringSpec',
      'import io.kotest.matchers.shouldBe',
      '',
      `class ${model.suiteName} : StringSpec({`,
      ...setupLines,
      '    val mapRowUnderTest: (Map<String, Any?>) -> Map<String, Any?> = { row ->',
      '        // Example: PersonMapper.normalize(row)',
      '        row // replace with your system-under-test call',
      '    }',
      '',
      `    fun rowProvider() = ${rowData}`,
      '',
      `    "${model.testNamePrefix} parameterized" {`,
      '        rowProvider().forEach { row ->',
      '            val expected = row',
      '            val actual = mapRowUnderTest(row)',
      ...assertionLines,
      '        }',
      '    }',
      '})',
    ];
    return providerLines.join('\n');
  }
  const lines = [
    'import io.kotest.core.spec.style.StringSpec',
    'import io.kotest.matchers.shouldBe',
    '',
    `class ${model.suiteName} : StringSpec({`,
    ...setupLines,
    '    val mapRowUnderTest: (Map<String, Any?>) -> Map<String, Any?> = { row ->',
    '        // Example: PersonMapper.normalize(row)',
    '        row // replace with your system-under-test call',
    '    }',
    '',
    `    "${model.testNamePrefix} parameterized" {`,
    `        val rows = ${rowData}`,
    '        rows.forEach { row ->',
    '            val expected = row',
    '            val actual = mapRowUnderTest(row)',
    ...assertionLines,
    '        }',
    '    }',
    '})',
  ];
  return lines.join('\n');
}

function renderTestMore(model) {
  const rowData = formatRowCollection(model.rows, jsValue, model.prettyPrint, '');
  const useBasicAssertions = !isStrictAssertionStyle(model);
  const lines = [
    'use strict;',
    'use warnings;',
    'use Test::More;',
    '',
    'sub map_row_under_test {',
    '    my ($row) = @_;',
    '    # Example: return normalize_person($row);',
    '    return $row; # replace with your system-under-test call',
    '}',
    '',
    ...(model.includeSetup ? ['my $setup = {};', ''] : []),
    ...(model.dataSourceStrategy === 'provider'
      ? [`sub row_provider {`, `    return ${rowData};`, `}`, '', 'my $rows = row_provider();']
      : [`my $rows = ${rowData};`]),
    '',
    'foreach my $row (@$rows) {',
    '    my $expected = $row;',
    '    my $actual = map_row_under_test($row);',
    ...model.headers.map((header) => {
      const canUseScalarAssertion = useBasicAssertions && model.rows.every((row) => isScalarValue(row[header]));
      if (canUseScalarAssertion) {
        return `    is($actual->{${JSON.stringify(header)}}, $expected->{${JSON.stringify(header)}}, '${model.testNamePrefix} ${header}');`;
      }
      return `    is_deeply($actual->{${JSON.stringify(header)}}, $expected->{${JSON.stringify(header)}}, '${model.testNamePrefix} ${header}');`;
    }),
    '}',
    '',
    'done_testing();',
  ];
  return lines.join('\n');
}

function renderUnittest(model) {
  const strictAssertions = isStrictAssertionStyle(model);
  const assertionLines = model.headers.flatMap((header) => {
    const valueAssertion = `            self.assertEqual(actual[${JSON.stringify(header)}], expected[${JSON.stringify(header)}])`;
    if (!strictAssertions) {
      return [valueAssertion];
    }
    return [
      valueAssertion,
      `            self.assertIs(type(actual[${JSON.stringify(header)}]), type(expected[${JSON.stringify(header)}]))`,
    ];
  });
  const rowData = formatRowCollection(model.rows, pythonValue, model.prettyPrint, '        ');
  const setupLines = model.includeSetup ? ['    def setUp(self):', '        self.setup_context = {}', ''] : [];
  const providerLines =
    model.dataSourceStrategy === 'provider'
      ? ['    @staticmethod', '    def row_provider():', `        return ${rowData}`, '']
      : [`    ROWS = ${rowData}`, ''];
  const rowsExpression = model.dataSourceStrategy === 'provider' ? 'self.row_provider()' : 'self.ROWS';
  const lines = [
    'import unittest',
    '',
    'def map_row_under_test(row):',
    '    # Example: return normalize_person(row)',
    '    return row  # replace with your system-under-test call',
    '',
    `class ${model.suiteName}(unittest.TestCase):`,
    ...setupLines,
    ...providerLines,
    `    def test_${model.testNamePrefix}_parameterized(self):`,
    `        for ${model.testNamePrefix} in ${rowsExpression}:`,
    `            expected = ${model.testNamePrefix}`,
    `            actual = map_row_under_test(${model.testNamePrefix})`,
    ...assertionLines,
    '',
    "if __name__ == '__main__':",
    '    unittest.main()',
  ];
  return lines.join('\n');
}

function renderNose2(model) {
  const strictAssertions = isStrictAssertionStyle(model);
  const assertionLines = model.headers.flatMap((header) => {
    const valueAssertion = `        self.assertEqual(actual[${JSON.stringify(header)}], expected[${JSON.stringify(header)}])`;
    if (!strictAssertions) {
      return [valueAssertion];
    }
    return [
      valueAssertion,
      `        self.assertIs(type(actual[${JSON.stringify(header)}]), type(expected[${JSON.stringify(header)}]))`,
    ];
  });
  const rowData = formatRowCollection(model.rows, pythonValue, model.prettyPrint, '    ');
  const setupLines = model.includeSetup ? ['    def setUp(self):', '        self.setup_context = {}', ''] : [];
  const providerLines =
    model.dataSourceStrategy === 'provider'
      ? ['def row_provider():', `    return ${rowData}`, '']
      : [`ROWS = ${rowData}`, ''];
  const paramsExpression = model.dataSourceStrategy === 'provider' ? 'row_provider()' : 'ROWS';
  const lines = [
    'import unittest',
    'from nose2.tools import params',
    '',
    'def map_row_under_test(row):',
    '    # Example: return normalize_person(row)',
    '    return row  # replace with your system-under-test call',
    '',
    ...providerLines,
    `class ${model.suiteName}(unittest.TestCase):`,
    ...setupLines,
    `    @params(*${paramsExpression})`,
    `    def test_${model.testNamePrefix}_parameterized(self, ${model.testNamePrefix}):`,
    `        expected = ${model.testNamePrefix}`,
    `        actual = map_row_under_test(${model.testNamePrefix})`,
    ...assertionLines,
    '',
    "if __name__ == '__main__':",
    '    unittest.main()',
  ];
  return lines.join('\n');
}

function renderVitest(model) {
  const rowData = formatRowCollection(model.rows, jsValue, model.prettyPrint, '  ');
  const assertionMethod = isStrictAssertionStyle(model) ? 'toStrictEqual' : 'toEqual';
  const setupLines = model.includeSetup ? ['  beforeEach(() => {', '    // setup', '  });', ''] : [];
  if (model.dataSourceStrategy === 'provider') {
    const providerLines = [
      "import { describe, it, expect, beforeEach } from 'vitest';",
      '',
      `const getRows = () => ${rowData};`,
      'const mapRowUnderTest = (row) => {',
      '  // Example: return normalizePerson(row);',
      '  return row; // replace with your system-under-test call',
      '};',
      '',
      `describe('${model.suiteName}', () => {`,
      ...setupLines,
      `  it.each(getRows())('${model.testNamePrefix} parameterized', (row) => {`,
      '    const expected = row;',
      '    const actual = mapRowUnderTest(row);',
      ...model.headers.map(
        (header) =>
          `    expect(actual[${JSON.stringify(header)}]).${assertionMethod}(expected[${JSON.stringify(header)}]);`
      ),
      '  });',
      '});',
    ];
    return providerLines.join('\n');
  }
  const lines = [
    "import { describe, it, expect, beforeEach } from 'vitest';",
    '',
    `const rows = ${rowData};`,
    'const mapRowUnderTest = (row) => {',
    '  // Example: return normalizePerson(row);',
    '  return row; // replace with your system-under-test call',
    '};',
    '',
    `describe('${model.suiteName}', () => {`,
    ...setupLines,
    `  it.each(rows)('${model.testNamePrefix} parameterized', (row) => {`,
    '    const expected = row;',
    '    const actual = mapRowUnderTest(row);',
    ...model.headers.map(
      (header) =>
        `    expect(actual[${JSON.stringify(header)}]).${assertionMethod}(expected[${JSON.stringify(header)}]);`
    ),
    '  });',
    '});',
  ];
  return lines.join('\n');
}

function renderMocha(model) {
  const rowData = formatRowCollection(model.rows, jsValue, model.prettyPrint, '  ');
  const assertMethod = isStrictAssertionStyle(model) ? 'deepStrictEqual' : 'deepEqual';
  const setupLines = model.includeSetup ? ['  beforeEach(() => {', '    // setup', '  });', ''] : [];
  const rowsBinding =
    model.dataSourceStrategy === 'provider'
      ? [`const getRows = () => ${rowData};`, 'const rows = getRows();']
      : [`const rows = ${rowData};`];
  const lines = [
    "const assert = require('node:assert/strict');",
    '',
    ...rowsBinding,
    'const mapRowUnderTest = (row) => {',
    '  // Example: return normalizePerson(row);',
    '  return row; // replace with your system-under-test call',
    '};',
    '',
    `describe('${model.suiteName}', () => {`,
    ...setupLines,
    '  rows.forEach((row, index) => {',
    `    it(\`${model.testNamePrefix} parameterized \${index}\`, () => {`,
    '      const expected = row;',
    '      const actual = mapRowUnderTest(row);',
    ...model.headers.map(
      (header) =>
        `      assert.${assertMethod}(actual[${JSON.stringify(header)}], expected[${JSON.stringify(header)}]);`
    ),
    '    });',
    '  });',
    '});',
  ];
  return lines.join('\n');
}

function renderNunit(model) {
  const strictAssertions = isStrictAssertionStyle(model);
  const assertLine = (index, header) =>
    strictAssertions
      ? `            Assert.AreEqual(expected[${index}], actual[${index}], "${header}");`
      : `            Assert.That(object.Equals(expected[${index}], actual[${index}]), Is.True, "${header}");`;
  const setupLines = model.includeSetup
    ? ['    [SetUp]', '    public void SetUp() {', '        // setup', '    }', '']
    : [];
  const inlineRows = model.rows.map(
    (row) =>
      `        new object[] { ${Object.values(row)
        .map((value) => jsValue(value))
        .join(', ')} }`
  );
  const lines = [
    'using System.Collections.Generic;',
    'using NUnit.Framework;',
    '',
    `public class ${model.suiteName}`,
    '{',
    ...setupLines,
    ...(model.dataSourceStrategy === 'provider'
      ? [
          '    public static IEnumerable<object[]> Rows()',
          '    {',
          '        return new[]',
          '        {',
          ...model.rows.map(
            (row) =>
              `            new object[] { ${Object.values(row)
                .map((value) => jsValue(value))
                .join(', ')} },`
          ),
          '        };',
          '    }',
          '',
          '    [TestCaseSource(nameof(Rows))]',
          `    public void ${model.testNamePrefix}_parameterized(params object[] row)`,
          '    {',
          '        var expected = row;',
          '        var actual = MapRowUnderTest(row);',
          ...model.headers.map((header, index) => assertLine(index, header)),
          '    }',
        ]
      : [
          '    private static readonly object[][] Rows = new object[][]',
          '    {',
          inlineRows.join(',\n'),
          '    };',
          '',
          '    [Test]',
          `    public void ${model.testNamePrefix}_parameterized()`,
          '    {',
          '        foreach (var row in Rows)',
          '        {',
          '            var expected = row;',
          '            var actual = MapRowUnderTest(row);',
          ...model.headers.map((header, index) => assertLine(index, header)),
          '        }',
          '    }',
        ]),
    '',
    '    private object[] MapRowUnderTest(object[] input)',
    '    {',
    '        // Example: return PersonMapper.Normalize(input);',
    '        return input; // replace with your system-under-test call',
    '    }',
    '}',
  ];
  return lines.join('\n');
}

function renderMsTest(model) {
  const strictAssertions = isStrictAssertionStyle(model);
  const assertLine = (index, header) =>
    strictAssertions
      ? `            Assert.AreEqual(expected[${index}], actual[${index}], "${header}");`
      : `            Assert.IsTrue(object.Equals(expected[${index}], actual[${index}]), "${header}");`;
  const setupLines = model.includeSetup
    ? ['    [TestInitialize]', '    public void SetUp() {', '        // setup', '    }', '']
    : [];
  const inlineRows = model.rows.map(
    (row) =>
      `        new object[] { ${Object.values(row)
        .map((value) => jsValue(value))
        .join(', ')} }`
  );
  const lines = [
    'using System.Collections.Generic;',
    'using Microsoft.VisualStudio.TestTools.UnitTesting;',
    '',
    '[TestClass]',
    `public class ${model.suiteName}`,
    '{',
    ...setupLines,
    ...(model.dataSourceStrategy === 'provider'
      ? [
          '    public static IEnumerable<object[]> Rows()',
          '    {',
          '        return new[]',
          '        {',
          ...model.rows.map(
            (row) =>
              `            new object[] { ${Object.values(row)
                .map((value) => jsValue(value))
                .join(', ')} },`
          ),
          '        };',
          '    }',
          '',
          '    [DataTestMethod]',
          '    [DynamicData(nameof(Rows), DynamicDataSourceType.Method)]',
          `    public void ${model.testNamePrefix}_parameterized(params object[] row)`,
          '    {',
          '        var expected = row;',
          '        var actual = MapRowUnderTest(row);',
          ...model.headers.map((header, index) => assertLine(index, header)),
          '    }',
        ]
      : [
          '    private static readonly object[][] Rows = new object[][]',
          '    {',
          inlineRows.join(',\n'),
          '    };',
          '',
          '    [TestMethod]',
          `    public void ${model.testNamePrefix}_parameterized()`,
          '    {',
          '        foreach (var row in Rows)',
          '        {',
          '            var expected = row;',
          '            var actual = MapRowUnderTest(row);',
          ...model.headers.map((header, index) => assertLine(index, header)),
          '        }',
          '    }',
        ]),
    '',
    '    private object[] MapRowUnderTest(object[] input)',
    '    {',
    '        // Example: return PersonMapper.Normalize(input);',
    '        return input; // replace with your system-under-test call',
    '    }',
    '}',
  ];
  return lines.join('\n');
}

function renderMiniTest(model) {
  const strictAssertions = isStrictAssertionStyle(model);
  const rowData = formatRowCollection(model.rows, rubyValue, model.prettyPrint, '    ');
  const setupLines = model.includeSetup ? ['  def setup', '    @setup_context = {}', '  end', ''] : [];
  const lines = [
    "require 'minitest/autorun'",
    '',
    'def map_row_under_test(row)',
    '  # Example: PersonNormalizer.normalize(row)',
    '  row # replace with your system-under-test call',
    'end',
    '',
    `class ${model.suiteName} < Minitest::Test`,
    ...setupLines,
    ...(model.dataSourceStrategy === 'provider'
      ? ['  def row_provider', `    ${rowData.replace(/\n/g, '\n    ')}`, '  end', '']
      : [`  ROWS = ${rowData}`, '']),
    `  def test_${model.testNamePrefix}_parameterized`,
    model.dataSourceStrategy === 'provider' ? '    rows = row_provider' : '    rows = ROWS',
    '    rows.each do |row|',
    '      expected = row',
    '      actual = map_row_under_test(row)',
    ...model.headers.map((header) =>
      strictAssertions
        ? `      assert_equal(expected[${JSON.stringify(header)}], actual[${JSON.stringify(header)}], '${model.testNamePrefix} ${header}')`
        : `      assert(actual[${JSON.stringify(header)}] == expected[${JSON.stringify(header)}], '${model.testNamePrefix} ${header}')`
    ),
    '    end',
    '  end',
    'end',
  ];
  return lines.join('\n');
}

function renderPest(model) {
  const assertionMethod = isStrictAssertionStyle(model)
    ? 'expect($actual[%i])->toBe($expected[%i]);'
    : 'expect($actual[%i])->toEqual($expected[%i]);';
  const rowData = model.rows.map(
    (row) =>
      `    [${Object.values(row)
        .map((value) => phpValue(value))
        .join(', ')}]`
  );
  const headerAssertions = model.headers.map((_, index) => assertionMethod.replaceAll('%i', String(index)));
  const lines = [
    '<?php',
    '',
    'function mapRowUnderTest(array $row): array',
    '{',
    '    // Example: return PersonMapper::normalize($row);',
    '    return $row; // replace with your system-under-test call',
    '}',
    '',
    ...(model.dataSourceStrategy === 'provider'
      ? [
          'function rowProvider(): array',
          '{',
          '    return [',
          rowData.join(',\n'),
          '    ];',
          '}',
          '',
          `it('${model.testNamePrefix} parameterized', function (array $row): void {`,
          '    $expected = $row;',
          '    $actual = mapRowUnderTest($row);',
          ...headerAssertions.map((line) => `    ${line}`),
          '})->with(rowProvider());',
        ]
      : [
          '$rows = [',
          rowData.join(',\n'),
          '];',
          '',
          `it('${model.testNamePrefix} parameterized', function (): void {`,
          '    foreach ($rows as $row) {',
          '        $expected = $row;',
          '        $actual = mapRowUnderTest($row);',
          ...headerAssertions.map((line) => `        ${line}`),
          '    }',
          '});',
        ]),
  ];
  return lines.join('\n');
}

function renderJUnit5Kotlin(model) {
  const safeIdentifier = (value) => {
    const raw = value == null ? '' : String(value);
    const normalized = raw
      .replace(/[^A-Za-z0-9_]/g, '_')
      .replace(/^[^A-Za-z_]/, '_$&')
      .replace(/_+/g, '_')
      .replace(/^_+/, '');
    return normalized || 'value';
  };
  const rowsData = formatRowCollection(model.rows, jsValue, model.prettyPrint, '        ');
  const strictAssertions = isStrictAssertionStyle(model);
  const assertionLines = model.headers.flatMap((header) => {
    if (strictAssertions) {
      return [
        `        assertEquals(expected[${JSON.stringify(header)}], actual[${JSON.stringify(header)}])`,
        `        assertEquals(expected[${JSON.stringify(header)}]?.let { it::class }, actual[${JSON.stringify(header)}]?.let { it::class })`,
      ];
    }
    return [
      `        assertTrue(Objects.equals(expected[${JSON.stringify(header)}], actual[${JSON.stringify(header)}]))`,
    ];
  });
  const setupLines = model.includeSetup
    ? ['    @BeforeEach', '    fun setup() {', '        // setup', '    }', '']
    : [];
  const providerLines = [
    '    companion object {',
    '        @JvmStatic',
    '        fun rows(): Stream<Arguments> = Stream.of(',
    model.rows
      .map((row) => `            Arguments.of(${model.headers.map((header) => jsValue(row[header])).join(', ')})`)
      .join(',\n'),
    '        )',
    '    }',
    '',
  ];
  const inlineLines = [`    private val rows = ${rowsData}`, ''];
  const lines = [
    'import org.junit.jupiter.api.Assertions.assertEquals',
    'import org.junit.jupiter.api.Assertions.assertTrue',
    'import org.junit.jupiter.api.BeforeEach',
    'import org.junit.jupiter.api.Test',
    'import org.junit.jupiter.params.ParameterizedTest',
    'import org.junit.jupiter.params.provider.Arguments',
    ...(model.dataSourceStrategy === 'provider' ? ['import org.junit.jupiter.params.provider.MethodSource'] : []),
    'import java.util.Objects',
    'import java.util.stream.Stream',
    '',
    `class ${model.suiteName} {`,
    ...setupLines,
    '    private fun mapRowUnderTest(row: Map<String, Any?>): Map<String, Any?> {',
    '        // Example: PersonMapper.normalize(row)',
    '        return row // replace with your system-under-test call',
    '    }',
    '',
    ...(model.dataSourceStrategy === 'provider' ? providerLines : inlineLines),
    ...(model.dataSourceStrategy === 'provider'
      ? [
          `    @ParameterizedTest(name = "${model.testNamePrefix} {index}")`,
          '    @MethodSource("rows")',
          `    fun ${safeIdentifier(model.testNamePrefix)}Parameterized(${model.headers
            .map((header) => `${safeIdentifier(header)}: Any?`)
            .join(', ')}) {`,
          `        val expected = mapOf(${model.headers.map((header) => `${JSON.stringify(header)} to ${safeIdentifier(header)}`).join(', ')})`,
          '        val actual = mapRowUnderTest(expected)',
          ...assertionLines,
          '    }',
        ]
      : [
          '    @Test',
          `    fun ${safeIdentifier(model.testNamePrefix)}ParameterizedInline() {`,
          '        rows.forEach { row ->',
          '            val expected = row',
          '            val actual = mapRowUnderTest(row)',
          ...assertionLines,
          '        }',
          '    }',
        ]),
    '}',
  ];
  return lines.join('\n');
}

function renderSpek(model) {
  const strictAssertions = isStrictAssertionStyle(model);
  const rowData = formatRowCollection(model.rows, jsValue, model.prettyPrint, '            ');
  const assertionLines = model.headers.flatMap((header) => {
    const valueAssertion = `                    assertEquals(expected[${JSON.stringify(header)}], actual[${JSON.stringify(header)}])`;
    if (!strictAssertions) {
      return [valueAssertion];
    }
    return [
      valueAssertion,
      `                    assertEquals(expected[${JSON.stringify(header)}]?.let { it::class }, actual[${JSON.stringify(header)}]?.let { it::class })`,
    ];
  });
  const lines = [
    'import kotlin.test.assertEquals',
    'import org.spekframework.spek2.Spek',
    'import org.spekframework.spek2.style.specification.describe',
    '',
    `object ${model.suiteName} : Spek({`,
    ...(model.includeSetup ? ['    beforeEachTest {', '        // setup', '    }', ''] : []),
    '    fun mapRowUnderTest(row: Map<String, Any?>): Map<String, Any?> {',
    '        // Example: PersonMapper.normalize(row)',
    '        return row // replace with your system-under-test call',
    '    }',
    '',
    ...(model.dataSourceStrategy === 'provider'
      ? ['    fun rowProvider() = ' + rowData, '']
      : ['    val rows = ' + rowData, '']),
    `    describe("${model.testNamePrefix} parameterized") {`,
    model.dataSourceStrategy === 'provider'
      ? '        rowProvider().forEachIndexed { index, row ->'
      : '        rows.forEachIndexed { index, row ->',
    '            it("row $index") {',
    '                val expected = row',
    '                val actual = mapRowUnderTest(row)',
    ...assertionLines,
    '            }',
    '        }',
    '    }',
    '})',
  ];
  return lines.join('\n');
}

function renderTest2Suite(model) {
  return renderTestMore(model).replace('use Test::More;', 'use Test2::V0;');
}

const RENDERERS = {
  junit4: (model) => renderJavaJUnit4(model),
  junit5: (model) => renderJavaJUnit5(model),
  junit6: (model) => renderJavaJUnit5(model),
  testng: (model) => renderTestNg(model),
  pytest: (model) => renderPyTest(model),
  unittest: (model) => renderUnittest(model),
  nose2: (model) => renderNose2(model),
  jest: (model) => renderJest(model),
  vitest: (model) => renderVitest(model),
  mocha: (model) => renderMocha(model),
  xunit: (model) => renderXunit(model),
  nunit: (model) => renderNunit(model),
  mstest: (model) => renderMsTest(model),
  rspec: (model) => renderRspec(model),
  minitest: (model) => renderMiniTest(model),
  phpunit: (model) => renderPhpUnit(model),
  pest: (model) => renderPest(model),
  kotest: (model) => renderKotest(model),
  'junit5-kotlin': (model) => renderJUnit5Kotlin(model),
  spek: (model) => renderSpek(model),
  'test-more': (model) => renderTestMore(model),
  'test2-suite': (model) => renderTest2Suite(model),
};

class TestFrameworkConvertor {
  constructor(options) {
    this.config = new TestFrameworkConvertorOptions();
    if (options) {
      this.setOptions(options);
    }
  }

  setOptions(newOptions) {
    this.config.mergeOptions(newOptions);
  }

  setFramework(frameworkId) {
    this.frameworkId = frameworkId;
  }

  fromDataTable(dataTable) {
    const frameworkId = this.frameworkId;
    if (!frameworkId || !RENDERERS[frameworkId]) {
      return '';
    }

    const model = buildCanonicalModel(dataTable, this.config.options);
    return RENDERERS[frameworkId](model);
  }
}

export { TestFrameworkConvertor, TestFrameworkConvertorOptions, buildCanonicalModel };
