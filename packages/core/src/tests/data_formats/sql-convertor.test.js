import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { SqlConvertor, SqlConvertorOptions } from '@anywaydata/core/data_formats/sql-convertor.js';

function createTable(headers, rows) {
  const table = new GenericDataTable();
  table.setHeaders(headers);
  rows.forEach((row) => table.appendDataRow(row));
  return table;
}

describe('SqlConvertor', () => {
  test('creates default SQL insert output with quoted values', () => {
    const table = createTable(
      ['full_name', 'phone', 'email', 'currency', 'number'],
      [
        ['Edgar Sauer', '+1 623-255-3609', 'edgar86@yahoo.com', '$ 2,231,969', '3252402'],
        ['Roberto Funk', '+1 373-008-4782', 'roberto15@yahoo.com', '$ 5,239,283', '1034557'],
      ]
    );

    const expected = `INSERT INTO "myTable" ("full_name","phone","email","currency","number") values \n\t('Edgar Sauer','+1 623-255-3609','edgar86@yahoo.com','$ 2,231,969','3252402'),\n\t('Roberto Funk','+1 373-008-4782','roberto15@yahoo.com','$ 5,239,283','1034557');`;
    const output = new SqlConvertor().fromDataTable(table);

    expect(output).toBe(expected);
  });

  test('splits output into multiple INSERT statements based on max values', () => {
    const table = createTable(
      ['name', 'age'],
      [
        ['A', '1'],
        ['B', '2'],
        ['C', '3'],
      ]
    );
    const options = new SqlConvertorOptions();
    options.options.maxValuesPerInsert = 2;
    const convertor = new SqlConvertor(options);

    const output = convertor.fromDataTable(table);

    expect(output).toBe(
      `INSERT INTO "myTable" ("name","age") values \n\t('A','1'),\n\t('B','2');\n\nINSERT INTO "myTable" ("name","age") values \n\t('C','3');`
    );
  });

  test('can disable quote numeric values', () => {
    const table = createTable(['name', 'age', 'salary'], [['Monica', '29', '1000.55']]);
    const options = new SqlConvertorOptions();
    options.options.quoteNumeric = false;
    const convertor = new SqlConvertor(options);

    const output = convertor.fromDataTable(table);

    expect(output).toContain(`('Monica',29,1000.55)`);
  });

  test('escapes single quotes in text values', () => {
    const table = createTable(['name'], [["O'Neil"]]);

    const output = new SqlConvertor().fromDataTable(table);

    expect(output).toContain(`('O''Neil')`);
  });

  test('uses defaults for blank table name and invalid max values', () => {
    const table = createTable(['name'], [['A'], ['B']]);
    const options = new SqlConvertorOptions();
    options.options.tableName = '  ';
    options.options.maxValuesPerInsert = 0;
    const convertor = new SqlConvertor(options);

    const output = convertor.fromDataTable(table);

    expect(output.startsWith('INSERT INTO "myTable"')).toBe(true);
    expect(output).toContain("\t('A'),\n\t('B')");
  });

  test('can disable identifier quoting', () => {
    const table = createTable(['name'], [['A']]);
    const options = new SqlConvertorOptions();
    options.options.quoteIdentifiers = false;
    const convertor = new SqlConvertor(options);

    const output = convertor.fromDataTable(table);

    expect(output).toContain('INSERT INTO myTable (name)');
  });

  test('uses mysql identifier quoting and escaping', () => {
    const table = createTable(['col`1'], [['A']]);
    const options = new SqlConvertorOptions();
    options.options.sqlDialect = 'mysql';
    options.options.tableName = 'order`items';
    const convertor = new SqlConvertor(options);

    const output = convertor.fromDataTable(table);

    expect(output).toContain('INSERT INTO `order``items` (`col``1`)');
  });

  test('uses sql server identifier quoting and escaping', () => {
    const table = createTable(['col]1'], [['A']]);
    const options = new SqlConvertorOptions();
    options.options.sqlDialect = 'sqlserver';
    options.options.tableName = 'order]items';
    const convertor = new SqlConvertor(options);

    const output = convertor.fromDataTable(table);

    expect(output).toContain('INSERT INTO [order]]items] ([col]]1])');
  });

  test('uses ansi identifier quoting and escaping by default', () => {
    const table = createTable(['col"1'], [['A']]);
    const options = new SqlConvertorOptions();
    options.options.tableName = 'order"items';
    const convertor = new SqlConvertor(options);

    const output = convertor.fromDataTable(table);

    expect(output).toContain('INSERT INTO "order""items" ("col""1")');
  });

  test('wraps output in transaction statements using selected dialect', () => {
    const table = createTable(['name'], [['A']]);
    const options = new SqlConvertorOptions();
    options.options.wrapTransaction = true;
    options.options.sqlDialect = 'mysql';
    const convertor = new SqlConvertor(options);

    const output = convertor.fromDataTable(table);

    expect(output.startsWith('START TRANSACTION;')).toBe(true);
    expect(output).toContain('INSERT INTO `myTable` (`name`) values');
    expect(output.endsWith('COMMIT;')).toBe(true);
  });

  test('null handling can map empty values to NULL', () => {
    const table = createTable(
      ['name', 'note'],
      [
        ['A', ''],
        ['B', null],
      ]
    );
    const options = new SqlConvertorOptions();
    options.options.nullHandling = 'empty-as-null';
    const convertor = new SqlConvertor(options);

    const output = convertor.fromDataTable(table);

    expect(output).toContain("\t('A',NULL)");
    expect(output).toContain("\t('B',NULL)");
  });

  test('null handling can map literal NULL text to NULL', () => {
    const table = createTable(['name', 'note'], [['A', 'NULL']]);
    const options = new SqlConvertorOptions();
    options.options.nullHandling = 'empty-or-literal-null';
    const convertor = new SqlConvertor(options);

    const output = convertor.fromDataTable(table);

    expect(output).toContain("\t('A',NULL)");
  });

  test('returns empty output when table has no headers or rows', () => {
    const empty = new GenericDataTable();

    const output = new SqlConvertor().fromDataTable(empty);

    expect(output).toBe('');
  });
});
