import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { RubyConvertor, RubyConvertorOptions } from '@anywaydata/core/data_formats/ruby-convertor.js';

const basicTable = new GenericDataTable();
basicTable.setHeaders(['name', 'age']);
basicTable.appendDataRow(['Alice', '30']);
basicTable.appendDataRow(['Bob', '25']);

describe('RubyConvertor', () => {
  test('default output is assigned array with unquoted numbers', () => {
    const expected = `data = [
  { 'name' => 'Alice', 'age' => 30 },
  { 'name' => 'Bob', 'age' => 25 },
]`;
    const convertor = new RubyConvertor();
    expect(convertor.fromDataTable(basicTable)).toBe(expected);
  });

  test('list collection type uses Array[] wrapper', () => {
    const convertor = new RubyConvertor();
    convertor.setOptions({ collectionType: 'list' });
    expect(convertor.fromDataTable(basicTable).startsWith('data = Array[')).toBe(true);
  });

  test('quotes numbers when quoteNumbers is enabled', () => {
    const convertor = new RubyConvertor();
    convertor.setOptions({ quoteNumbers: true });
    expect(convertor.fromDataTable(basicTable)).toContain("'age' => '30'");
  });

  test('supports class-instance rows when anonymous objects disabled', () => {
    const convertor = new RubyConvertor();
    convertor.setOptions({ useAnonymousObjects: false, objectClassName: 'Person' });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain('class Person');
    expect(output).toContain('Person.new(name:');
  });

  test('class mode normalizes uppercase headers to ruby-safe keyword args', () => {
    const table = new GenericDataTable();
    table.setHeaders(['Name', 'Last Name']);
    table.appendDataRow(['Alice', 'Jones']);
    const convertor = new RubyConvertor();
    convertor.setOptions({ useAnonymousObjects: false, objectRepresentation: 'class', objectClassName: 'Person' });
    const output = convertor.fromDataTable(table);
    expect(output).toContain('attr_accessor :name, :last_name');
    expect(output).toContain('def initialize(name:, last_name:)');
    expect(output).toContain('Person.new(name:');
    expect(output).toContain('last_name:');
  });

  test('supports symbol hash keys', () => {
    const convertor = new RubyConvertor();
    convertor.setOptions({ hashKeyStyle: 'symbol' });
    expect(convertor.fromDataTable(basicTable)).toContain('{ name: ');
  });

  test('supports Struct object representation', () => {
    const convertor = new RubyConvertor();
    convertor.setOptions({ useAnonymousObjects: false, objectRepresentation: 'struct', objectClassName: 'Person' });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain('Person = Struct.new(:name, :age)');
    expect(output).toContain('Person.new(name:');
  });

  test('supports Data object representation', () => {
    const convertor = new RubyConvertor();
    convertor.setOptions({ useAnonymousObjects: false, objectRepresentation: 'data', objectClassName: 'Person' });
    expect(convertor.fromDataTable(basicTable)).toContain('Person = Data.define(:name, :age)');
  });

  test('supports aligned pretty hash style', () => {
    const convertor = new RubyConvertor();
    convertor.setOptions({ hashPrettyStyle: 'aligned' });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain('{\n');
  });

  test('supports snake_case field name strategy', () => {
    const table = new GenericDataTable();
    table.setHeaders(['First Name', 'lastName']);
    table.appendDataRow(['Alice', 'Jones']);
    const convertor = new RubyConvertor();
    convertor.setOptions({ fieldNameStyle: 'snake_case', hashKeyStyle: 'symbol' });
    const output = convertor.fromDataTable(table);
    expect(output).toContain('first_name:');
    expect(output).toContain('last_name:');
  });

  test('supports rspec let wrapper output', () => {
    const convertor = new RubyConvertor();
    convertor.setOptions({ outputWrapper: 'rspec-let', variableName: 'users' });
    const output = convertor.fromDataTable(basicTable);
    expect(output.startsWith('let(:users) do')).toBe(true);
    expect(output.endsWith('end')).toBe(true);
  });
});

describe('RubyConvertorOptions', () => {
  test('mergeOptions supports flat and nested forms', () => {
    const options = new RubyConvertorOptions();
    options.mergeOptions({ variableName: 'records' });
    expect(options.options.variableName).toBe('records');
    options.mergeOptions({ options: { quoteNumbers: true } });
    expect(options.options.quoteNumbers).toBe(true);
  });
});
