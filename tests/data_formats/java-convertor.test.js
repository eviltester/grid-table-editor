import { GenericDataTable } from '../../js/data_formats/generic-data-table.js';
import { JavaConvertor, JavaConvertorOptions } from '../../js/data_formats/java-convertor.js';

const basicTable = new GenericDataTable();
basicTable.setHeaders(['name', 'age']);
basicTable.appendDataRow(['Alice', '30']);
basicTable.appendDataRow(['Bob', '25']);

describe('JavaConvertor - anonymous maps (default)', () => {
  test('default: List of Maps assigned to variable, numbers unquoted, with imports, pretty', () => {
    const expected = `import java.util.Map;
import java.util.List;
import java.util.ArrayList;

List<Map<String, Object>> data = new ArrayList<>(List.of(
    Map.of("name", "Alice", "age", 30),
    Map.of("name", "Bob", "age", 25)
));`;
    const convertor = new JavaConvertor();
    expect(convertor.fromDataTable(basicTable)).toBe(expected);
  });

  test('quoteNumbers: numbers are output as strings', () => {
    const convertor = new JavaConvertor();
    convertor.setOptions({ quoteNumbers: true });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain('Map.of("name", "Alice", "age", "30")');
  });

  test('collectionType array uses Map array syntax', () => {
    const convertor = new JavaConvertor();
    convertor.setOptions({ collectionType: 'array' });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain('@SuppressWarnings("unchecked")');
    expect(output).toContain('Map<String, Object>[] data = new Map[]{');
    expect(output).toContain('};');
  });

  test('assignToVariable false omits variable declaration', () => {
    const convertor = new JavaConvertor();
    convertor.setOptions({ assignToVariable: false });
    const output = convertor.fromDataTable(basicTable);
    expect(output).not.toContain('data =');
    expect(output.trim().startsWith('import') || output.trim().startsWith('new ArrayList')).toBe(true);
  });

  test('custom variable name', () => {
    const convertor = new JavaConvertor();
    convertor.setOptions({ variableName: 'records' });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain('records = new ArrayList<>');
  });

  test('includeImports false omits import lines', () => {
    const convertor = new JavaConvertor();
    convertor.setOptions({ includeImports: false });
    const output = convertor.fromDataTable(basicTable);
    expect(output).not.toContain('import java.util');
    expect(output.startsWith('List<')).toBe(true);
  });

  test('array type without variable assignment has no @SuppressWarnings', () => {
    const convertor = new JavaConvertor();
    convertor.setOptions({ collectionType: 'array', assignToVariable: false });
    const output = convertor.fromDataTable(basicTable);
    expect(output).not.toContain('@SuppressWarnings');
    expect(output).toContain('new Map[]{');
  });

  test('blank value behaves as null by default', () => {
    const table = new GenericDataTable();
    table.setHeaders(['name', 'score']);
    table.appendDataRow(['Alice', '']);
    const convertor = new JavaConvertor();
    const output = convertor.fromDataTable(table);
    expect(output).toContain('"score", null');
  });

  test('blank value as empty-string when blankValueBehavior is empty-string', () => {
    const table = new GenericDataTable();
    table.setHeaders(['name', 'score']);
    table.appendDataRow(['Alice', '']);
    const convertor = new JavaConvertor();
    convertor.setOptions({ blankValueBehavior: 'empty-string' });
    const output = convertor.fromDataTable(table);
    expect(output).toContain('"score", ""');
  });

  test('prettyPrint false outputs compact single line', () => {
    const convertor = new JavaConvertor();
    convertor.setOptions({ prettyPrint: false, includeImports: false });
    const output = convertor.fromDataTable(basicTable);
    expect(output).not.toContain('\n    Map.of(');
    expect(output).toContain('new ArrayList<>(List.of(Map.of(');
  });

  test('tab delimiter indents with tab character', () => {
    const convertor = new JavaConvertor();
    convertor.setOptions({ prettyPrintDelimiter: '\t' });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain('\tMap.of(');
  });

  test('custom delimiter (spaces) is used for indentation', () => {
    const convertor = new JavaConvertor();
    convertor.setOptions({ prettyPrintDelimiter: '  ' });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain('  Map.of(');
  });

  test('invalid custom delimiter falls back to 4 spaces', () => {
    const convertor = new JavaConvertor();
    convertor.setOptions({ prettyPrintDelimiter: '---' });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain('    Map.of(');
  });

  test('leading-zero integer is normalized (09 -> 9)', () => {
    const table = new GenericDataTable();
    table.setHeaders(['name', 'code']);
    table.appendDataRow(['Alice', '09']);
    table.appendDataRow(['Bob', '010']);
    const convertor = new JavaConvertor();
    const output = convertor.fromDataTable(table);
    expect(output).toContain('"code", 9');
    expect(output).toContain('"code", 10');
    expect(output).not.toContain('"code", 09');
    expect(output).not.toContain('"code", 010');
  });
});

describe('JavaConvertor - named class (POJO)', () => {
  test('generates class definition and instantiation', () => {
    const convertor = new JavaConvertor();
    convertor.setOptions({ useAnonymousMaps: false });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain('class Row {');
    expect(output).toContain('    String name;');
    expect(output).toContain('    int age;');
    expect(output).toContain('    Row(String name, int age) {');
    expect(output).toContain('        this.name = name;');
    expect(output).toContain('List<Row> data = new ArrayList<>(List.of(');
    expect(output).toContain('new Row("Alice", 30)');
    expect(output).toContain('new Row("Bob", 25)');
  });

  test('custom class name', () => {
    const convertor = new JavaConvertor();
    convertor.setOptions({ useAnonymousMaps: false, objectClassName: 'Employee' });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain('class Employee {');
    expect(output).toContain('List<Employee> data = new ArrayList<>(List.of(');
    expect(output).toContain('new Employee("Alice", 30)');
  });

  test('named class with array collection type', () => {
    const convertor = new JavaConvertor();
    convertor.setOptions({ useAnonymousMaps: false, collectionType: 'array' });
    const output = convertor.fromDataTable(basicTable);
    expect(output).not.toContain('@SuppressWarnings');
    expect(output).toContain('Row[] data = new Row[]{');
    expect(output).toContain('new Row("Alice", 30)');
  });

  test('named class infers double type for decimal columns', () => {
    const table = new GenericDataTable();
    table.setHeaders(['name', 'price']);
    table.appendDataRow(['Item', '9.99']);
    const convertor = new JavaConvertor();
    convertor.setOptions({ useAnonymousMaps: false });
    const output = convertor.fromDataTable(table);
    expect(output).toContain('    double price;');
    expect(output).toContain('new Row("Item", 9.99)');
  });

  test('named class with quoteNumbers uses String for all columns', () => {
    const convertor = new JavaConvertor();
    convertor.setOptions({ useAnonymousMaps: false, quoteNumbers: true });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain('    String name;');
    expect(output).toContain('    String age;');
    expect(output).toContain('new Row("Alice", "30")');
  });

  test('named class does not include Map imports', () => {
    const convertor = new JavaConvertor();
    convertor.setOptions({ useAnonymousMaps: false });
    const output = convertor.fromDataTable(basicTable);
    expect(output).not.toContain('import java.util.Map;');
    expect(output).toContain('import java.util.List;');
  });

  test('named class uses boxed Integer when integer column has blanks (blankValueBehavior null)', () => {
    const table = new GenericDataTable();
    table.setHeaders(['name', 'score']);
    table.appendDataRow(['Alice', '42']);
    table.appendDataRow(['Bob', '']);
    const convertor = new JavaConvertor();
    convertor.setOptions({ useAnonymousMaps: false, blankValueBehavior: 'null' });
    const output = convertor.fromDataTable(table);
    expect(output).toContain('    Integer score;');
    expect(output).toContain('Row(String name, Integer score)');
    expect(output).toContain('new Row("Alice", 42)');
    expect(output).toContain('new Row("Bob", null)');
  });

  test('named class uses boxed Double when decimal column has blanks (blankValueBehavior null)', () => {
    const table = new GenericDataTable();
    table.setHeaders(['name', 'price']);
    table.appendDataRow(['Item A', '9.99']);
    table.appendDataRow(['Item B', '']);
    const convertor = new JavaConvertor();
    convertor.setOptions({ useAnonymousMaps: false, blankValueBehavior: 'null' });
    const output = convertor.fromDataTable(table);
    expect(output).toContain('    Double price;');
    expect(output).toContain('Row(String name, Double price)');
    expect(output).toContain('new Row("Item A", 9.99)');
    expect(output).toContain('new Row("Item B", null)');
  });

  test('named class normalizes leading-zero integers (09 -> 9)', () => {
    const table = new GenericDataTable();
    table.setHeaders(['name', 'code']);
    table.appendDataRow(['Alice', '09']);
    const convertor = new JavaConvertor();
    convertor.setOptions({ useAnonymousMaps: false });
    const output = convertor.fromDataTable(table);
    expect(output).toContain('new Row("Alice", 9)');
    expect(output).not.toContain('new Row("Alice", 09)');
  });
});

describe('JavaConvertor - more than 10 columns (Map.ofEntries)', () => {
  test('uses Map.ofEntries for > 10 columns', () => {
    const table = new GenericDataTable();
    const headers = Array.from({ length: 11 }, (_, i) => `col${i + 1}`);
    table.setHeaders(headers);
    table.appendDataRow(Array.from({ length: 11 }, (_, i) => String(i + 1)));
    const convertor = new JavaConvertor();
    const output = convertor.fromDataTable(table);
    expect(output).toContain('Map.ofEntries(');
    expect(output).toContain('Map.entry(');
    expect(output).not.toContain('Map.of(');
  });
});

describe('JavaConvertor - header sanitization', () => {
  test('sanitizes special characters in header names for class fields', () => {
    const table = new GenericDataTable();
    table.setHeaders(['First Name', '2nd Column']);
    table.appendDataRow(['Alice', 'value']);
    const convertor = new JavaConvertor();
    convertor.setOptions({ useAnonymousMaps: false });
    const output = convertor.fromDataTable(table);
    expect(output).toContain('String First_Name;');
    expect(output).toContain('String _2nd_Column;');
  });

  test('Map keys use original header names (not sanitized)', () => {
    const table = new GenericDataTable();
    table.setHeaders(['First Name', '2nd Column']);
    table.appendDataRow(['Alice', 'value']);
    const convertor = new JavaConvertor();
    const output = convertor.fromDataTable(table);
    expect(output).toContain('"First Name"');
    expect(output).toContain('"2nd Column"');
  });
});

describe('JavaConvertorOptions', () => {
  test('mergeOptions merges into defaults', () => {
    const opts = new JavaConvertorOptions();
    opts.mergeOptions({ quoteNumbers: true, variableName: 'myList' });
    expect(opts.options.quoteNumbers).toBe(true);
    expect(opts.options.variableName).toBe('myList');
    expect(opts.options.collectionType).toBe('list');
  });

  test('mergeOptions accepts options wrapper', () => {
    const opts = new JavaConvertorOptions();
    opts.mergeOptions({ options: { collectionType: 'array' } });
    expect(opts.options.collectionType).toBe('array');
  });
});
