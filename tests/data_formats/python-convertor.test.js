import { GenericDataTable } from '../../js/data_formats/generic-data-table.js';
import { PythonConvertor, PythonConvertorOptions } from '../../js/data_formats/python-convertor.js';

const basicTable = new GenericDataTable();
basicTable.setHeaders(['name', 'age']);
basicTable.appendDataRow(['Alice', '30']);
basicTable.appendDataRow(['Bob', '25']);

describe('PythonConvertor - anonymous dicts (default)', () => {
  test('default: list of dicts assigned to variable, numbers unquoted', () => {
    const expected = `data = [
    {"name": "Alice", "age": 30},
    {"name": "Bob", "age": 25},
]`;
    const convertor = new PythonConvertor();
    expect(convertor.fromDataTable(basicTable)).toBe(expected);
  });

  test('quote numbers option keeps values as strings', () => {
    const expected = `data = [
    {"name": "Alice", "age": "30"},
    {"name": "Bob", "age": "25"},
]`;
    const convertor = new PythonConvertor();
    convertor.setOptions({ quoteNumbers: true });
    expect(convertor.fromDataTable(basicTable)).toBe(expected);
  });

  test('tuple collection type uses parentheses', () => {
    const expected = `data = (
    {"name": "Alice", "age": 30},
    {"name": "Bob", "age": 25},
)`;
    const convertor = new PythonConvertor();
    convertor.setOptions({ collectionType: 'tuple' });
    expect(convertor.fromDataTable(basicTable)).toBe(expected);
  });

  test('custom variable name', () => {
    const convertor = new PythonConvertor();
    convertor.setOptions({ variableName: 'records' });
    const output = convertor.fromDataTable(basicTable);
    expect(output.startsWith('records = [')).toBe(true);
  });

  test('no variable assignment when assignToVariable is false', () => {
    const convertor = new PythonConvertor();
    convertor.setOptions({ assignToVariable: false });
    const output = convertor.fromDataTable(basicTable);
    expect(output.startsWith('[')).toBe(true);
  });

  test('uses Decimal() for decimal-like values when useDecimalType is enabled', () => {
    const table = new GenericDataTable();
    table.setHeaders(['amount', 'count']);
    table.appendDataRow(['12.34', '5']);

    const convertor = new PythonConvertor();
    convertor.setOptions({ useDecimalType: true });

    const output = convertor.fromDataTable(table);
    expect(output).toContain('from decimal import Decimal');
    expect(output).toContain('"amount": Decimal("12.34")');
    expect(output).toContain('"count": 5');
  });

  test('decimal column scope uses comma-separated column list', () => {
    const table = new GenericDataTable();
    table.setHeaders(['Money', 'Column 2']);
    table.appendDataRow(['12.34', '9.99']);

    const convertor = new PythonConvertor();
    convertor.setOptions({ useDecimalType: true, decimalColumnsCsv: 'Money' });

    const output = convertor.fromDataTable(table);
    expect(output).toContain('"Money": Decimal("12.34")');
    expect(output).toContain('"Column_2": 9.99');
  });

  test('decimal column scope supports comma-separated values with spaces', () => {
    const table = new GenericDataTable();
    table.setHeaders(['Money', 'Column 2']);
    table.appendDataRow(['12.34', '9.99']);

    const convertor = new PythonConvertor();
    convertor.setOptions({ useDecimalType: true, decimalColumnsCsv: 'Money, Column 2' });

    const output = convertor.fromDataTable(table);
    expect(output).toContain('"Money": Decimal("12.34")');
    expect(output).toContain('"Column_2": Decimal("9.99")');
  });

  test('treat integers as Decimal in scoped decimal columns', () => {
    const table = new GenericDataTable();
    table.setHeaders(['Money', 'Count']);
    table.appendDataRow(['5', '7']);

    const convertor = new PythonConvertor();
    convertor.setOptions({
      useDecimalType: true,
      decimalColumnsCsv: 'Money',
      decimalTreatIntegersAsDecimal: true,
    });

    const output = convertor.fromDataTable(table);
    expect(output).toContain('"Money": Decimal("5")');
    expect(output).toContain('"Count": 7');
  });

  test('blank values can be exported as None', () => {
    const table = new GenericDataTable();
    table.setHeaders(['name', 'notes']);
    table.appendDataRow(['Alice', '']);

    const convertor = new PythonConvertor();
    convertor.setOptions({ blankValueBehavior: 'none' });

    const output = convertor.fromDataTable(table);
    expect(output).toContain('"notes": None');
  });

  test('supports single quote style for keys and string values', () => {
    const table = new GenericDataTable();
    table.setHeaders(['name']);
    table.appendDataRow(["O'Neil"]);

    const convertor = new PythonConvertor();
    convertor.setOptions({ quoteStyle: 'single' });

    const output = convertor.fromDataTable(table);
    expect(output).toContain("{'name': 'O\\'Neil'}");
  });

  test('escapes control characters in string values', () => {
    const table = new GenericDataTable();
    table.setHeaders(['text']);
    table.appendDataRow(['line1\nline2\r\nend\ttab']);

    const convertor = new PythonConvertor();
    const output = convertor.fromDataTable(table);
    expect(output).toContain('"line1\\nline2\\r\\nend\\ttab"');
  });

  test('includes configured imports when includeImports is enabled', () => {
    const convertor = new PythonConvertor();
    convertor.setOptions({
      includeImports: true,
      importStatements: 'from dataclasses import dataclass\nfrom typing import List',
    });

    const output = convertor.fromDataTable(basicTable);
    expect(output.startsWith('from dataclasses import dataclass')).toBe(true);
    expect(output).toContain('from typing import List');
  });

  test('supports compact output when prettyPrint is false', () => {
    const convertor = new PythonConvertor();
    convertor.setOptions({ prettyPrint: false });

    const output = convertor.fromDataTable(basicTable);
    expect(output).toBe('data = [{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]');
  });

  test('supports custom pretty print delimiter', () => {
    const convertor = new PythonConvertor();
    convertor.setOptions({ prettyPrintDelimiter: '\t\t' });

    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain('\n\t\t{"name": "Alice", "age": 30},');
  });

  test('falls back to safe spaces when custom delimiter is non-whitespace', () => {
    const convertor = new PythonConvertor();
    convertor.setOptions({ prettyPrintDelimiter: '+' });

    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain('\n    {"name": "Alice", "age": 30},');
  });
});

describe('PythonConvertor - named class instances', () => {
  test('outputs class definition and named instances', () => {
    const expected = `class Row:
    def __init__(self, name, age):
        self.name = name
        self.age = age

data = [
    Row(name="Alice", age=30),
    Row(name="Bob", age=25),
]`;
    const convertor = new PythonConvertor();
    convertor.setOptions({ useAnonymousDicts: false });
    expect(convertor.fromDataTable(basicTable)).toBe(expected);
  });

  test('custom class name', () => {
    const convertor = new PythonConvertor();
    convertor.setOptions({ useAnonymousDicts: false, objectClassName: 'Person' });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain('class Person:');
    expect(output).toContain('Person(name="Alice"');
  });

  test('keeps valid class indentation when prettyPrint is false', () => {
    const convertor = new PythonConvertor();
    convertor.setOptions({ useAnonymousDicts: false, prettyPrint: false });
    const output = convertor.fromDataTable(basicTable);

    expect(output).toContain('class Row:\n    def __init__(self, name, age):\n        self.name = name');
    expect(output).toContain('data = [Row(name="Alice", age=30), Row(name="Bob", age=25)]');
  });
});

describe('PythonConvertor - header name sanitisation', () => {
  test('converts spaces and special chars to underscores', () => {
    const table = new GenericDataTable();
    table.setHeaders(['first name', 'age-group']);
    table.appendDataRow(['Alice', '30']);
    const convertor = new PythonConvertor();
    const output = convertor.fromDataTable(table);
    expect(output).toContain('"first_name"');
    expect(output).toContain('"age_group"');
  });

  test('prepends underscore when header starts with digit', () => {
    const table = new GenericDataTable();
    table.setHeaders(['1col']);
    table.appendDataRow(['v']);
    const convertor = new PythonConvertor();
    const output = convertor.fromDataTable(table);
    expect(output).toContain('"_1col"');
  });
});

describe('PythonConvertorOptions', () => {
  test('mergeOptions merges flat options', () => {
    const opts = new PythonConvertorOptions();
    opts.mergeOptions({ variableName: 'myList' });
    expect(opts.options.variableName).toBe('myList');
  });

  test('mergeOptions merges nested options object', () => {
    const opts = new PythonConvertorOptions();
    opts.mergeOptions({ options: { collectionType: 'tuple' } });
    expect(opts.options.collectionType).toBe('tuple');
  });

  test('default options include new formatting and typing controls', () => {
    const opts = new PythonConvertorOptions();
    expect(opts.options.useDecimalType).toBe(false);
    expect(opts.options.decimalColumnsCsv).toBe('');
    expect(opts.options.decimalTreatIntegersAsDecimal).toBe(false);
    expect(opts.options.blankValueBehavior).toBe('empty-string');
    expect(opts.options.quoteStyle).toBe('double');
    expect(opts.options.includeImports).toBe(false);
    expect(opts.options.prettyPrint).toBe(true);
    expect(opts.options.prettyPrintDelimiter).toBe('    ');
  });
});
