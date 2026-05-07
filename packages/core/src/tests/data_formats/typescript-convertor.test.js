import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { TypeScriptConvertor, TypeScriptConvertorOptions } from '@anywaydata/core/data_formats/typescript-convertor.js';

const basicTable = new GenericDataTable();
basicTable.setHeaders(['name', 'age']);
basicTable.appendDataRow(['Alice', '30']);
basicTable.appendDataRow(['Bob', '25']);

describe('TypeScriptConvertor - anonymous objects (default)', () => {
  test('default: list output assigned to typed variable, numbers unquoted', () => {
    const expected = `const data: Array<Record<string, unknown>> = [
    {"name": "Alice", "age": 30},
    {"name": "Bob", "age": 25}
];`;
    const convertor = new TypeScriptConvertor();
    expect(convertor.fromDataTable(basicTable)).toBe(expected);
  });

  test('collectionType array uses T[] type annotation', () => {
    const convertor = new TypeScriptConvertor();
    convertor.setOptions({ collectionType: 'array' });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain('const data: Record<string, unknown>[] = [');
  });

  test('quoteNumbers outputs numbers as strings', () => {
    const convertor = new TypeScriptConvertor();
    convertor.setOptions({ quoteNumbers: true });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain('{"name": "Alice", "age": "30"}');
  });

  test('assignToVariable false omits declaration prefix', () => {
    const convertor = new TypeScriptConvertor();
    convertor.setOptions({ assignToVariable: false });
    const output = convertor.fromDataTable(basicTable);
    expect(output.startsWith('[')).toBe(true);
    expect(output).not.toContain('const data');
  });

  test('custom variable name is used', () => {
    const convertor = new TypeScriptConvertor();
    convertor.setOptions({ variableName: 'records' });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain('const records: Array<Record<string, unknown>> = [');
  });

  test('prettyPrint false outputs compact single-line collection', () => {
    const convertor = new TypeScriptConvertor();
    convertor.setOptions({ prettyPrint: false });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain('[{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}];');
  });

  test('tab delimiter indents with tab character', () => {
    const convertor = new TypeScriptConvertor();
    convertor.setOptions({ prettyPrintDelimiter: '\t' });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain('\t{"name": "Alice", "age": 30}');
  });

  test('invalid custom delimiter falls back to spaces', () => {
    const convertor = new TypeScriptConvertor();
    convertor.setOptions({ prettyPrintDelimiter: '---' });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain('    {"name": "Alice", "age": 30}');
  });
});

describe('TypeScriptConvertor - named class instances', () => {
  test('generates class definition and typed list', () => {
    const convertor = new TypeScriptConvertor();
    convertor.setOptions({ useAnonymousObjects: false });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain('class Row {');
    expect(output).toContain('name: string;');
    expect(output).toContain('age: number;');
    expect(output).toContain('constructor(name: string, age: number) {');
    expect(output).toContain('const data: Array<Row> = [');
    expect(output).toContain('new Row("Alice", 30)');
  });

  test('named class with array collection type uses Row[]', () => {
    const convertor = new TypeScriptConvertor();
    convertor.setOptions({ useAnonymousObjects: false, collectionType: 'array' });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain('const data: Row[] = [');
  });

  test('custom class name', () => {
    const convertor = new TypeScriptConvertor();
    convertor.setOptions({ useAnonymousObjects: false, objectClassName: 'Employee' });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain('class Employee {');
    expect(output).toContain('new Employee("Alice", 30)');
  });

  test('blank value null uses union type with null', () => {
    const table = new GenericDataTable();
    table.setHeaders(['name', 'age']);
    table.appendDataRow(['Alice', '']);
    table.appendDataRow(['Bob', '42']);

    const convertor = new TypeScriptConvertor();
    convertor.setOptions({ useAnonymousObjects: false, blankValueBehavior: 'null' });
    const output = convertor.fromDataTable(table);

    expect(output).toContain('age: number | null;');
    expect(output).toContain('new Row("Alice", null)');
  });
});

describe('TypeScriptConvertor - header and identifier sanitisation', () => {
  test('sanitises special characters in field names for class mode', () => {
    const table = new GenericDataTable();
    table.setHeaders(['First Name', '2nd Column']);
    table.appendDataRow(['Alice', 'value']);

    const convertor = new TypeScriptConvertor();
    convertor.setOptions({ useAnonymousObjects: false });
    const output = convertor.fromDataTable(table);

    expect(output).toContain('First_Name: string;');
    expect(output).toContain('_2nd_Column: string;');
  });

  test('keeps original header keys in anonymous objects', () => {
    const table = new GenericDataTable();
    table.setHeaders(['First Name', '2nd Column']);
    table.appendDataRow(['Alice', 'value']);

    const convertor = new TypeScriptConvertor();
    const output = convertor.fromDataTable(table);

    expect(output).toContain('"First Name": "Alice"');
    expect(output).toContain('"2nd Column": "value"');
  });
});

describe('TypeScriptConvertorOptions', () => {
  test('mergeOptions merges into defaults', () => {
    const opts = new TypeScriptConvertorOptions();
    opts.mergeOptions({ quoteNumbers: true, variableName: 'myList' });
    expect(opts.options.quoteNumbers).toBe(true);
    expect(opts.options.variableName).toBe('myList');
    expect(opts.options.collectionType).toBe('list');
  });

  test('mergeOptions accepts options wrapper', () => {
    const opts = new TypeScriptConvertorOptions();
    opts.mergeOptions({ options: { collectionType: 'array' } });
    expect(opts.options.collectionType).toBe('array');
  });
});
