class TestFrameworkConvertorOptions {
  constructor() {
    this.options = {
      suiteName: 'GeneratedDataTests',
      testNamePrefix: 'row',
      assertionStyle: 'strict',
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
    assertionStyle: config.assertionStyle,
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

function isStrictAssertionStyle(model) {
  return model.assertionStyle !== 'basic';
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
  return renderPyTest(model)
    .replace('import pytest', 'import unittest')
    .replace(/@pytest\.fixture[\s\S]*?def setup_context\(\):\n\s{4}return \{\}\n\n/g, '')
    .replace(/@pytest\.mark\.parametrize\("([^"]+)", ([^)]+)\)\n/g, '')
    .replace(/def test_[^(]+\(([^)]*)\):/, 'def test_parameterized(self):')
    .replace(/def row_provider\(\):/g, 'def row_provider(self):')
    .replace(/ROWS = /g, 'rows = ')
    .replace(/expected = row/g, 'expected = row')
    .replace(/actual = map_row_under_test\(row\)/g, 'actual = map_row_under_test(row)')
    .replace(/assert\s/g, 'self.assertTrue(')
    .replace(/\n/g, '\n')
    .concat('\n\nif __name__ == "__main__":\n    unittest.main()');
}

function renderNose2(model) {
  return renderUnittest(model);
}

function renderVitest(model) {
  return renderJest(model).replace(/test\.each/g, 'it.each');
}

function renderMocha(model) {
  return renderJest(model)
    .replace("describe('", "describe('")
    .replace(/test\.each\(([^)]+)\)\('([^']+)'/g, "$1.forEach((row) => { it('$2'")
    .replace(/expect\(([^)]+)\)\.toStrictEqual\(([^)]+)\);/g, "require('assert').deepStrictEqual($1, $2);")
    .replace(/expect\(([^)]+)\)\.toEqual\(([^)]+)\);/g, "require('assert').deepEqual($1, $2);")
    .replace(/\n\s*\}\);\n\}\);\n$/m, '\n  });\n});\n');
}

function renderNunit(model) {
  return renderXunit(model)
    .replace('using Xunit;', 'using NUnit.Framework;')
    .replace(/\[Theory\]/g, '[Test]')
    .replace(/\[MemberData\(nameof\(Rows\)\)\]\n/g, '')
    .replace(/Assert\.Equal/g, 'Assert.AreEqual')
    .replace(/Assert\.True/g, 'Assert.That');
}

function renderMsTest(model) {
  return renderXunit(model)
    .replace('using Xunit;', 'using Microsoft.VisualStudio.TestTools.UnitTesting;')
    .replace(/\[Theory\]/g, '[TestMethod]')
    .replace(/\[MemberData\(nameof\(Rows\)\)\]\n/g, '')
    .replace(/Assert\.Equal/g, 'Assert.AreEqual')
    .replace(/Assert\.True/g, 'Assert.IsTrue');
}

function renderMiniTest(model) {
  return renderRspec(model)
    .replace(`RSpec.describe '${model.suiteName}' do`, `class ${model.suiteName} < Minitest::Test`)
    .replace(/^/m, "require 'minitest/autorun'\n\n")
    .replace(/it '([^']+)' do/, 'def test_$1')
    .replace(/expect\(([^)]+)\)\.to eql\(([^)]+)\)/g, 'assert_equal($2, $1)')
    .replace(/expect\(([^)]+)\)\.to eq\(([^)]+)\)/g, 'assert(($1) == ($2))')
    .replace(/^end$/m, 'end');
}

function renderPest(model) {
  const phpunit = renderPhpUnit(model);
  return phpunit
    .replace(
      '<?php\n\nuse PHPUnit\\Framework\\TestCase;\n\nfinal class',
      "<?php\n\nit('row parameterized', function (...$row): void {"
    )
    .replace(/final class[\s\S]*?{[\s\S]*?public static function rowProvider\(\): array\s*{/, '')
    .replace(/\}\s*$/, '});');
}

function renderJUnit5Kotlin(model) {
  return renderKotest(model).replace('StringSpec', 'StringSpec');
}

function renderSpek(model) {
  return renderKotest(model)
    .replace('import io.kotest.core.spec.style.StringSpec', 'import org.spekframework.spek2.Spek')
    .replace(`class ${model.suiteName} : StringSpec({`, `object ${model.suiteName} : Spek({`);
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
