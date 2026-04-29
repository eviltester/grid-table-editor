import { JSDOM } from 'jsdom';
import { SqlOptionsPanel } from '../../js/gui_components/options_panels/options-sql-panel.js';
import { SqlConvertorOptions } from '@anywaydata/core/data_formats/sql-convertor.js';

describe('SqlOptionsPanel', () => {
  let dom;
  let parent;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body><div id="host"></div></body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
    parent = document.getElementById('host');
  });

  afterEach(() => {
    dom.window.close();
  });

  test('renders expected controls', () => {
    const panel = new SqlOptionsPanel(parent);
    panel.addToGui();

    expect(parent.querySelector('.sql-options')).toBeTruthy();
    expect(parent.querySelector("input[name='table-name']")).toBeTruthy();
    expect(parent.querySelector("input[name='max-values-per-insert']")).toBeTruthy();
    expect(parent.querySelector("input[name='quote-numeric']")).toBeTruthy();
    expect(parent.querySelector("select[name='sql-dialect']")).toBeTruthy();
    expect(parent.querySelector("input[name='quote-identifiers']")).toBeTruthy();
    expect(parent.querySelector("select[name='null-handling']")).toBeTruthy();
    expect(parent.querySelector("input[name='wrap-transaction']")).toBeTruthy();
    expect(parent.querySelector('.apply-options')).toBeTruthy();
  });

  test('getOptionsFromGui returns options with DOM values applied', () => {
    const panel = new SqlOptionsPanel(parent);
    panel.addToGui();
    parent.querySelector("input[name='table-name']").value = 'users';
    parent.querySelector("input[name='max-values-per-insert']").value = '25';
    parent.querySelector("input[name='quote-numeric']").checked = false;
    parent.querySelector("select[name='sql-dialect']").value = 'mysql';
    parent.querySelector("input[name='quote-identifiers']").checked = false;
    parent.querySelector("select[name='null-handling']").value = 'empty-as-null';
    parent.querySelector("input[name='wrap-transaction']").checked = true;

    const options = panel.getOptionsFromGui();

    expect(options).toBeInstanceOf(SqlConvertorOptions);
    expect(options.options.tableName).toBe('users');
    expect(options.options.maxValuesPerInsert).toBe(25);
    expect(options.options.quoteNumeric).toBe(false);
    expect(options.options.sqlDialect).toBe('mysql');
    expect(options.options.quoteIdentifiers).toBe(false);
    expect(options.options.nullHandling).toBe('empty-as-null');
    expect(options.options.wrapTransaction).toBe(true);
  });

  test('setFromOptions populates the form', () => {
    const panel = new SqlOptionsPanel(parent);
    panel.addToGui();
    panel.setFromOptions({
      options: {
        tableName: 'orders',
        maxValuesPerInsert: 10,
        quoteNumeric: false,
        sqlDialect: 'sqlserver',
        quoteIdentifiers: false,
        nullHandling: 'empty-or-literal-null',
        wrapTransaction: true,
      },
    });

    expect(parent.querySelector("input[name='table-name']").value).toBe('orders');
    expect(parent.querySelector("input[name='max-values-per-insert']").value).toBe('10');
    expect(parent.querySelector("input[name='quote-numeric']").checked).toBe(false);
    expect(parent.querySelector("select[name='sql-dialect']").value).toBe('sqlserver');
    expect(parent.querySelector("input[name='quote-identifiers']").checked).toBe(false);
    expect(parent.querySelector("select[name='null-handling']").value).toBe('empty-or-literal-null');
    expect(parent.querySelector("input[name='wrap-transaction']").checked).toBe(true);
  });

  test('setApplyCallback invokes callback with current options', () => {
    const panel = new SqlOptionsPanel(parent);
    const callback = jest.fn();
    panel.addToGui();
    panel.setApplyCallback(callback);
    parent.querySelector("input[name='table-name']").value = 'orders';

    parent.querySelector('.apply-options').click();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0][0].options.tableName).toBe('orders');
  });
});
