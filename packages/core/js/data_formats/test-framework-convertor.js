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

function renderJavaJUnit4(model) {
  const dataRows = model.rows.map(
    (row) =>
      `            new Object[] { ${Object.values(row)
        .map((value) => jsValue(value))
        .join(', ')} }`
  );
  const lines = [
    'import static org.junit.Assert.assertEquals;',
    'import java.util.Arrays;',
    'import java.util.Collection;',
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
    '    @Test',
    `    public void ${model.testNamePrefix}_parameterized() {`,
    model.headers.map((header, index) => `        assertEquals(row[${index}], row[${index}]); // ${header}`).join('\n'),
    '    }',
    '}',
  ];
  return lines.join('\n');
}

function renderJavaJUnit5(model) {
  if (model.dataSourceStrategy === 'inline' || model.dataSourceStrategy === 'csv') {
    const csvRows = model.rows.map((row) =>
      Object.values(row)
        .map((value) => (typeof value === 'string' ? `"${String(value).replace(/"/g, '\\"')}"` : String(value)))
        .join(', ')
    );
    const csvLines = [
      'import static org.junit.jupiter.api.Assertions.assertEquals;',
      'import org.junit.jupiter.params.ParameterizedTest;',
      'import org.junit.jupiter.params.provider.CsvSource;',
      '',
      `public class ${model.suiteName} {`,
      '    @ParameterizedTest',
      '    @CsvSource({',
      ...csvRows.map((row) => `        ${JSON.stringify(row)},`),
      '    })',
      `    void ${model.testNamePrefix}_parameterized(Object... row) {`,
      model.headers
        .map((header, index) => `        assertEquals(row[${index}], row[${index}]); // ${header}`)
        .join('\n'),
      '    }',
      '}',
    ];
    return csvLines.join('\n');
  }
  const dataRows = model.rows.map(
    (row) =>
      `            org.junit.jupiter.params.provider.Arguments.of(${Object.values(row)
        .map((value) => jsValue(value))
        .join(', ')})`
  );
  const lines = [
    'import static org.junit.jupiter.api.Assertions.assertEquals;',
    'import java.util.stream.Stream;',
    'import org.junit.jupiter.params.ParameterizedTest;',
    'import org.junit.jupiter.params.provider.MethodSource;',
    '',
    `public class ${model.suiteName} {`,
    '    static Stream<org.junit.jupiter.params.provider.Arguments> data() {',
    '        return Stream.of(',
    dataRows.join(',\n'),
    '        );',
    '    }',
    '',
    '    @ParameterizedTest',
    '    @MethodSource("data")',
    `    void ${model.testNamePrefix}_parameterized(Object... row) {`,
    model.headers.map((header, index) => `        assertEquals(row[${index}], row[${index}]); // ${header}`).join('\n'),
    '    }',
    '}',
  ];
  return lines.join('\n');
}

function renderTestNg(model) {
  const dataRows = model.rows.map(
    (row) =>
      `            new Object[] { ${Object.values(row)
        .map((value) => jsValue(value))
        .join(', ')} }`
  );
  const lines = [
    'import static org.testng.Assert.assertEquals;',
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
    '    @Test(dataProvider = "rows")',
    `    public void ${model.testNamePrefix}_parameterized(Object... row) {`,
    model.headers.map((header, index) => `        assertEquals(row[${index}], row[${index}]); // ${header}`).join('\n'),
    '    }',
    '}',
  ];
  return lines.join('\n');
}

function renderPyTest(model) {
  const rowData = formatRowCollection(model.rows, pythonValue, model.prettyPrint, '    ');
  if (model.dataSourceStrategy === 'provider') {
    const providerLines = [
      'import pytest',
      '',
      'def row_provider():',
      `    return ${rowData}`,
      '',
      `@pytest.mark.parametrize("${model.testNamePrefix}", row_provider())`,
      `def test_${model.testNamePrefix}_parameterized(${model.testNamePrefix}):`,
      ...model.headers.map(
        (header) =>
          `    assert ${model.testNamePrefix}[${JSON.stringify(header)}] == ${model.testNamePrefix}[${JSON.stringify(header)}]`
      ),
    ];
    return providerLines.join('\n');
  }
  const lines = [
    'import pytest',
    '',
    `ROWS = ${rowData}`,
    '',
    `@pytest.mark.parametrize("${model.testNamePrefix}", ROWS)`,
    `def test_${model.testNamePrefix}_parameterized(${model.testNamePrefix}):`,
    ...model.headers.map(
      (header) =>
        `    assert ${model.testNamePrefix}[${JSON.stringify(header)}] == ${model.testNamePrefix}[${JSON.stringify(header)}]`
    ),
  ];
  return lines.join('\n');
}

function renderJest(model) {
  const rowData = formatRowCollection(model.rows, jsValue, model.prettyPrint, '  ');
  if (model.dataSourceStrategy === 'provider') {
    const providerLines = [
      `const getRows = () => ${rowData};`,
      '',
      `describe('${model.suiteName}', () => {`,
      `  test.each(getRows())('${model.testNamePrefix} parameterized', (row) => {`,
      ...model.headers.map(
        (header) => `    expect(row[${JSON.stringify(header)}]).toStrictEqual(row[${JSON.stringify(header)}]);`
      ),
      '  });',
      '});',
    ];
    return providerLines.join('\n');
  }
  const lines = [
    `const rows = ${rowData};`,
    '',
    `describe('${model.suiteName}', () => {`,
    `  test.each(rows)('${model.testNamePrefix} parameterized', (row) => {`,
    ...model.headers.map(
      (header) => `    expect(row[${JSON.stringify(header)}]).toStrictEqual(row[${JSON.stringify(header)}]);`
    ),
    '  });',
    '});',
  ];
  return lines.join('\n');
}

function renderXunit(model) {
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
      '    [Theory]',
      ...inlineRows,
      `    public void ${model.testNamePrefix}_parameterized(params object[] row)`,
      '    {',
      ...model.headers.map((header, index) => `        Assert.Equal(row[${index}], row[${index}]); // ${header}`),
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
    '    public static IEnumerable<object[]> Rows => new List<object[]>',
    '    {',
    rowData.join(',\n'),
    '    };',
    '',
    '    [Theory]',
    '    [MemberData(nameof(Rows))]',
    `    public void ${model.testNamePrefix}_parameterized(params object[] row)`,
    '    {',
    ...model.headers.map((header, index) => `        Assert.Equal(row[${index}], row[${index}]); // ${header}`),
    '    }',
    '}',
  ];
  return lines.join('\n');
}

function renderRspec(model) {
  const rowData = `[${model.rows.map((row) => rubyValue(row)).join(', ')}]`;
  const lines = [
    `ROWS = ${rowData}`,
    '',
    `RSpec.describe '${model.suiteName}' do`,
    `  it '${model.testNamePrefix} parameterized' do`,
    '    ROWS.each do |row|',
    ...model.headers.map(
      (header) =>
        `      expect(row[:${header}] || row[${JSON.stringify(header)}]).to eq(row[:${header}] || row[${JSON.stringify(header)}])`
    ),
    '    end',
    '  end',
    'end',
  ];
  return lines.join('\n');
}

function renderPhpUnit(model) {
  const rowData = model.rows.map(
    (row) =>
      `            [${Object.values(row)
        .map((value) => phpValue(value))
        .join(', ')}]`
  );
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
    '    /** @dataProvider rowProvider */',
    `    public function test_${model.testNamePrefix}_parameterized(...$row): void`,
    '    {',
    ...model.headers.map(
      (header, index) => `        $this->assertEquals($row[${index}], $row[${index}]); // ${header}`
    ),
    '    }',
    '}',
  ];
  return lines.join('\n');
}

function renderKotest(model) {
  const rowData = formatRowCollection(model.rows, jsValue, model.prettyPrint, '        ');
  const lines = [
    'import io.kotest.core.spec.style.StringSpec',
    'import io.kotest.matchers.shouldBe',
    '',
    `class ${model.suiteName} : StringSpec({`,
    `    "${model.testNamePrefix} parameterized" {`,
    `        val rows = ${rowData}`,
    '        rows.forEach { row ->',
    ...model.headers.map(
      (header) => `            row[${JSON.stringify(header)}] shouldBe row[${JSON.stringify(header)}]`
    ),
    '        }',
    '    }',
    '})',
  ];
  return lines.join('\n');
}

function renderTestMore(model) {
  const rowData = formatRowCollection(model.rows, jsValue, model.prettyPrint, '');
  const lines = [
    'use strict;',
    'use warnings;',
    'use Test::More;',
    '',
    `my $rows = ${rowData};`,
    '',
    'foreach my $row (@$rows) {',
    ...model.headers.map(
      (header) =>
        `    is_deeply($row->{${JSON.stringify(header)}}, $row->{${JSON.stringify(header)}}, '${model.testNamePrefix} ${header}');`
    ),
    '}',
    '',
    'done_testing();',
  ];
  return lines.join('\n');
}

const RENDERERS = {
  junit4: (model) => renderJavaJUnit4(model),
  junit5: (model) => renderJavaJUnit5(model),
  junit6: (model) => renderJavaJUnit5(model),
  testng: (model) => renderTestNg(model),
  pytest: (model) => renderPyTest(model),
  jest: (model) => renderJest(model),
  xunit: (model) => renderXunit(model),
  rspec: (model) => renderRspec(model),
  phpunit: (model) => renderPhpUnit(model),
  kotest: (model) => renderKotest(model),
  'test-more': (model) => renderTestMore(model),
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
