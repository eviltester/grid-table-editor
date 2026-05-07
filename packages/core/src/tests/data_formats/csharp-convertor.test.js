import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { CSharpConvertor, CSharpConvertorOptions } from '@anywaydata/core/data_formats/csharp-convertor.js';

const basicTable = new GenericDataTable();
basicTable.setHeaders(['name', 'age']);
basicTable.appendDataRow(['Alice', '30']);
basicTable.appendDataRow(['Bob', '25']);

describe('CSharpConvertor', () => {
  test('default output is assigned list with unquoted numbers', () => {
    const expected = `var data = new List<object> {
    new Dictionary<string, object> { { "name", "Alice" }, { "age", 30 } },
    new Dictionary<string, object> { { "name", "Bob" }, { "age", 25 } },
};`;
    const convertor = new CSharpConvertor();
    expect(convertor.fromDataTable(basicTable)).toBe(expected);
  });

  test('array collection type uses new[] wrapper', () => {
    const convertor = new CSharpConvertor();
    convertor.setOptions({ collectionType: 'array' });
    expect(convertor.fromDataTable(basicTable).startsWith('var data = new[] {')).toBe(true);
  });

  test('quotes numbers when quoteNumbers is enabled', () => {
    const convertor = new CSharpConvertor();
    convertor.setOptions({ quoteNumbers: true });
    expect(convertor.fromDataTable(basicTable)).toContain('new Dictionary<string, string>');
    expect(convertor.fromDataTable(basicTable)).toContain('{ "age", "30" }');
  });

  test('supports class-instance rows when anonymous objects disabled', () => {
    const convertor = new CSharpConvertor();
    convertor.setOptions({ useAnonymousObjects: false, objectClassName: 'person row' });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain('public class PersonRow');
    expect(output).toContain('new PersonRow {');
  });

  test('deduplicates colliding PascalCase member names in class mode', () => {
    const table = new GenericDataTable();
    table.setHeaders(['name', 'Name']);
    table.appendDataRow(['Alice', 'Alicia']);
    const convertor = new CSharpConvertor();
    convertor.setOptions({ useAnonymousObjects: false, objectClassName: 'person row' });
    const output = convertor.fromDataTable(table);
    expect(output).toContain('public object Name { get; set; }');
    expect(output).toContain('public object Name_2 { get; set; }');
    expect(output).toContain('new PersonRow { Name = "Alice", Name_2 = "Alicia" }');
  });

  test('escapes C# keyword identifiers', () => {
    const table = new GenericDataTable();
    table.setHeaders(['class']);
    table.appendDataRow(['A']);
    const convertor = new CSharpConvertor();
    convertor.setOptions({ variableName: 'class', useAnonymousObjects: false, objectClassName: 'class' });
    const output = convertor.fromDataTable(table);
    expect(output).toContain('public class Class');
    expect(output).toContain('public object Class { get; set; }');
    expect(output).toContain('var @class =');
  });

  test('supports IReadOnlyList and IEnumerable collection targets', () => {
    const convertor = new CSharpConvertor();
    convertor.setOptions({ collectionTargetType: 'ireadonlylist' });
    expect(convertor.fromDataTable(basicTable).startsWith('IReadOnlyList<object> data = new List<object> {')).toBe(
      true
    );
    convertor.setOptions({ collectionTargetType: 'ienumerable' });
    expect(convertor.fromDataTable(basicTable).startsWith('IEnumerable<object> data = new List<object> {')).toBe(true);
  });

  test('supports explicit dictionary value type override', () => {
    const convertor = new CSharpConvertor();
    convertor.setOptions({ quoteNumbers: true, dictionaryValueType: 'object' });
    expect(convertor.fromDataTable(basicTable)).toContain('new Dictionary<string, object>');
  });

  test('dictionary string override quotes numeric values even when Number Convert is off', () => {
    const convertor = new CSharpConvertor();
    convertor.setOptions({ quoteNumbers: false, dictionaryValueType: 'string' });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain('new Dictionary<string, string>');
    expect(output).toContain('{ "age", "30" }');
    expect(output).not.toContain('{ "age", 30 }');
  });
});

describe('CSharpConvertorOptions', () => {
  test('mergeOptions supports flat and nested forms', () => {
    const options = new CSharpConvertorOptions();
    options.mergeOptions({ variableName: 'records' });
    expect(options.options.variableName).toBe('records');
    options.mergeOptions({ options: { quoteNumbers: true } });
    expect(options.options.quoteNumbers).toBe(true);
  });
});
