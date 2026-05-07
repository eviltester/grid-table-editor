import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { KotlinConvertor, KotlinConvertorOptions } from '@anywaydata/core/data_formats/kotlin-convertor.js';

const basicTable = new GenericDataTable();
basicTable.setHeaders(['name', 'age']);
basicTable.appendDataRow(['Alice', '30']);
basicTable.appendDataRow(['Bob', '25']);

describe('KotlinConvertor', () => {
  test('default output is assigned listOf with unquoted numbers', () => {
    const expected = `val data = listOf(
    mapOf("name" to "Alice", "age" to 30),
    mapOf("name" to "Bob", "age" to 25),
)`;
    const convertor = new KotlinConvertor();
    expect(convertor.fromDataTable(basicTable)).toBe(expected);
  });

  test('array collection type uses arrayOf wrapper', () => {
    const convertor = new KotlinConvertor();
    convertor.setOptions({ collectionType: 'array' });
    expect(convertor.fromDataTable(basicTable).startsWith('val data = arrayOf(')).toBe(true);
  });

  test('quotes numbers when quoteNumbers is enabled', () => {
    const convertor = new KotlinConvertor();
    convertor.setOptions({ quoteNumbers: true });
    expect(convertor.fromDataTable(basicTable)).toContain('"age" to "30"');
  });

  test('supports data-class instance rows when anonymous objects disabled', () => {
    const convertor = new KotlinConvertor();
    convertor.setOptions({ useAnonymousObjects: false, objectClassName: 'Person' });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain('data class Person(');
    expect(output).toContain('Person(name =');
  });

  test('supports mutable assignment with var', () => {
    const convertor = new KotlinConvertor();
    convertor.setOptions({ mutableAssignment: true });
    expect(convertor.fromDataTable(basicTable).startsWith('var data = listOf(')).toBe(true);
  });

  test('escapes kotlin keywords in variable and field names', () => {
    const table = new GenericDataTable();
    table.setHeaders(['class', 'when']);
    table.appendDataRow(['A', 'B']);
    const convertor = new KotlinConvertor();
    convertor.setOptions({ variableName: 'class', useAnonymousObjects: false, objectClassName: 'my object' });
    const output = convertor.fromDataTable(table);
    expect(output).toContain('data class MyObject(');
    expect(output).toContain('val `class` = listOf(');
    expect(output).toContain('val `class`: Any');
    expect(output).toContain('`when` = "B"');
  });

  test('uses mutable collection constructors when enabled', () => {
    const convertor = new KotlinConvertor();
    convertor.setOptions({ useMutableCollections: true });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain('mutableListOf(');
    expect(output).toContain('mutableMapOf(');
  });

  test('supports disabling trailing comma in pretty mode', () => {
    const convertor = new KotlinConvertor();
    convertor.setOptions({ trailingComma: false });
    const output = convertor.fromDataTable(basicTable);
    expect(output).not.toContain('),\n)');
  });
});

describe('KotlinConvertorOptions', () => {
  test('mergeOptions supports flat and nested forms', () => {
    const options = new KotlinConvertorOptions();
    options.mergeOptions({ variableName: 'records' });
    expect(options.options.variableName).toBe('records');
    options.mergeOptions({ options: { quoteNumbers: true } });
    expect(options.options.quoteNumbers).toBe(true);
  });
});
