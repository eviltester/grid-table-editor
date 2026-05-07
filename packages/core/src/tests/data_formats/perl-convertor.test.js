import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { PerlConvertor, PerlConvertorOptions } from '@anywaydata/core/data_formats/perl-convertor.js';

const basicTable = new GenericDataTable();
basicTable.setHeaders(['name', 'age']);
basicTable.appendDataRow(['Alice', '30']);
basicTable.appendDataRow(['Bob', '25']);

describe('PerlConvertor', () => {
  test('default output is assigned array ref with unquoted numbers', () => {
    const expected = `my $data = [
  { 'name' => 'Alice', 'age' => 30 },
  { 'name' => 'Bob', 'age' => 25 },
];`;
    const convertor = new PerlConvertor();
    expect(convertor.fromDataTable(basicTable)).toBe(expected);
  });

  test('list collection type uses @variable and list syntax', () => {
    const convertor = new PerlConvertor();
    convertor.setOptions({ collectionType: 'list' });
    expect(convertor.fromDataTable(basicTable).startsWith('my @data = (')).toBe(true);
  });

  test('quotes numbers when quoteNumbers is enabled', () => {
    const convertor = new PerlConvertor();
    convertor.setOptions({ quoteNumbers: true });
    expect(convertor.fromDataTable(basicTable)).toContain("'age' => '30'");
  });

  test('supports blessed object rows when anonymous objects disabled', () => {
    const convertor = new PerlConvertor();
    convertor.setOptions({ useAnonymousObjects: false, objectClassName: 'Person' });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain("bless({ name => 'Alice'");
    expect(output).toContain("}, 'Person')");
  });

  test('supports quoted hash keys style', () => {
    const table = new GenericDataTable();
    table.setHeaders(['First Name']);
    table.appendDataRow(['Alice']);
    const convertor = new PerlConvertor();
    convertor.setOptions({ hashKeyStyle: 'quoted' });
    expect(convertor.fromDataTable(table)).toContain("{ 'First Name' => 'Alice'");
  });

  test('bareword hash keys use sanitized identifiers for anonymous hashes', () => {
    const table = new GenericDataTable();
    table.setHeaders(['First Name']);
    table.appendDataRow(['Alice']);
    const convertor = new PerlConvertor();
    convertor.setOptions({ hashKeyStyle: 'bareword' });
    expect(convertor.fromDataTable(table)).toContain("{ First_Name => 'Alice'");
    expect(convertor.fromDataTable(table)).not.toContain("{ First Name => 'Alice'");
  });

  test('supports constructor object instantiation style', () => {
    const convertor = new PerlConvertor();
    convertor.setOptions({
      useAnonymousObjects: false,
      objectClassName: 'Person',
      objectInstantiationStyle: 'constructor',
    });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain("Person->new({ name => 'Alice'");
    expect(output).not.toContain('bless(');
  });
});

describe('PerlConvertorOptions', () => {
  test('mergeOptions supports flat and nested forms', () => {
    const options = new PerlConvertorOptions();
    options.mergeOptions({ variableName: 'records' });
    expect(options.options.variableName).toBe('records');
    options.mergeOptions({ options: { quoteNumbers: true } });
    expect(options.options.quoteNumbers).toBe(true);
  });
});
