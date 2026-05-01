import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { PhpConvertor, PhpConvertorOptions } from '@anywaydata/core/data_formats/php-convertor.js';

const basicTable = new GenericDataTable();
basicTable.setHeaders(['name', 'age']);
basicTable.appendDataRow(['Alice', '30']);
basicTable.appendDataRow(['Bob', '25']);

describe('PhpConvertor', () => {
  test('default output is assigned PHP array() with unquoted numbers', () => {
    const expected = `$data = array(
    array('name' => 'Alice', 'age' => 30),
    array('name' => 'Bob', 'age' => 25),
);`;
    const convertor = new PhpConvertor();
    expect(convertor.fromDataTable(basicTable)).toBe(expected);
  });

  test('list collection type uses [] syntax', () => {
    const convertor = new PhpConvertor();
    convertor.setOptions({ collectionType: 'list' });
    const output = convertor.fromDataTable(basicTable);
    expect(output.startsWith('$data = [')).toBe(true);
  });

  test('quotes numbers when quoteNumbers is enabled', () => {
    const convertor = new PhpConvertor();
    convertor.setOptions({ quoteNumbers: true });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain("'age' => '30'");
  });

  test('supports class-instance rows when anonymous objects disabled', () => {
    const convertor = new PhpConvertor();
    convertor.setOptions({ objectRepresentation: 'class', objectClassName: 'Person', constructorArgStyle: 'named' });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain('class Person {');
    expect(output).toContain('new Person(name:');
  });

  test('can include php opening tag', () => {
    const convertor = new PhpConvertor();
    convertor.setOptions({ includePhpTag: true });
    expect(convertor.fromDataTable(basicTable).startsWith('<?php')).toBe(true);
  });

  test('supports stdClass row representation', () => {
    const convertor = new PhpConvertor();
    convertor.setOptions({ objectRepresentation: 'stdclass' });
    expect(convertor.fromDataTable(basicTable)).toContain('(object)array(');
  });

  test('unquoted array key mode keeps string keys quoted for PHP safety', () => {
    const convertor = new PhpConvertor();
    convertor.setOptions({ arrayKeyQuoteStyle: 'unquoted' });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain("'name' =>");
    expect(output).not.toContain('name =>');
  });

  test('unquoted array key mode keeps sanitized numeric-like headers quoted', () => {
    const table = new GenericDataTable();
    table.setHeaders(['1', '2.5']);
    table.appendDataRow(['Alice', '30']);
    const convertor = new PhpConvertor();
    convertor.setOptions({ arrayKeyQuoteStyle: 'unquoted' });
    const output = convertor.fromDataTable(table);
    expect(output).toContain("'_1' =>");
    expect(output).toContain("'_2_5' =>");
  });

  test('supports null/boolean coercion options', () => {
    const table = new GenericDataTable();
    table.setHeaders(['empty', 'flag', 'none']);
    table.appendDataRow(['', 'true', 'null']);
    const convertor = new PhpConvertor();
    convertor.setOptions({
      blankValueBehavior: 'null',
      coerceBooleanLiterals: true,
      coerceNullLiteral: true,
    });
    const output = convertor.fromDataTable(table);
    expect(output).toContain("'empty' => null");
    expect(output).toContain("'flag' => true");
    expect(output).toContain("'none' => null");
  });

  test('supports typed properties and constructor promotion for PHP 8+', () => {
    const convertor = new PhpConvertor();
    convertor.setOptions({
      objectRepresentation: 'class',
      classPropertyTyping: 'typed',
      useConstructorPromotion: true,
      phpCompatibility: '8+',
    });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain('public function __construct(public mixed $name, public mixed $age)');
  });

  test('falls back to positional args for non-php8 named arg usage', () => {
    const convertor = new PhpConvertor();
    convertor.setOptions({
      objectRepresentation: 'class',
      phpCompatibility: '7+',
      constructorArgStyle: 'named',
    });
    const output = convertor.fromDataTable(basicTable);
    expect(output).toContain("new Row('Alice', 30)");
  });

  test('blank headers are normalized to valid non-empty identifiers', () => {
    const table = new GenericDataTable();
    table.setHeaders(['', '']);
    table.appendDataRow(['Alice', 'Bob']);
    const convertor = new PhpConvertor();
    convertor.setOptions({
      objectRepresentation: 'class',
      constructorArgStyle: 'named',
      phpCompatibility: '8+',
      objectClassName: 'Person',
    });
    const output = convertor.fromDataTable(table);
    expect(output).toContain('public $field;');
    expect(output).toContain('public $field_2;');
    expect(output).toContain('public function __construct($field, $field_2)');
    expect(output).toContain("new Person(field: 'Alice', field_2: 'Bob')");
  });
});

describe('PhpConvertorOptions', () => {
  test('mergeOptions supports flat and nested forms', () => {
    const options = new PhpConvertorOptions();
    options.mergeOptions({ variableName: 'records' });
    expect(options.options.variableName).toBe('records');
    options.mergeOptions({ options: { quoteNumbers: true } });
    expect(options.options.quoteNumbers).toBe(true);
  });
});
