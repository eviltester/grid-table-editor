import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { enableTestDataGenerationInterface } from '../../../js/gui_components/testdatadefn.js';

describe('test data definition editor engine compatibility', () => {
  let dom;

  function installTabulatorMock() {
    class TabulatorMock {
      static latestInstance;
      constructor(_element, options) {
        this.rows = [];
        this.options = options;
        TabulatorMock.latestInstance = this;
      }
      setData(data) {
        this.rows = data.map((row) => ({ ...row }));
        return Promise.resolve();
      }
      addData(rows) {
        this.rows.push(...rows.map((row) => ({ ...row })));
        return Promise.resolve();
      }
      getData() {
        return this.rows;
      }
      getSelectedRows() {
        return [];
      }
      deleteRow() {}
      getColumnDefinitions() {
        return [{ title: 'columnName', field: 'columnName' }];
      }
      getRows() {
        return [];
      }
      clearFilter() {}
      setFilter() {}
      addColumn() {}
      getDataCount() {
        return this.rows.length;
      }
      getColumns() {
        return [];
      }
      blockRedraw() {}
      restoreRedraw() {}
      redraw() {}
    }

    global.Tabulator = TabulatorMock;
    return TabulatorMock;
  }

  async function flushUi() {
    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body><div id="host"></div></body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
    global.Event = dom.window.Event;
    global.agGrid = undefined;
    global.RandExp = function RandExp() {};
  });

  afterEach(() => {
    dom.window.close();
    delete global.agGrid;
  });

  test('does not throw when AG Grid library is unavailable', () => {
    const gridExtras = {
      getRowCount: jest.fn(() => 0),
      getSelectedRowIndexes: jest.fn(() => []),
      getGridAsGenericDataTable: jest.fn(),
    };
    expect(() => {
      enableTestDataGenerationInterface(
        'host',
        {
          setGridFromGenericDataTable: jest.fn(),
        },
        {
          renderTextFromGrid: jest.fn(),
        },
        gridExtras
      );
    }).not.toThrow();

    expect(document.querySelector('#generatedata')).toBeTruthy();
    expect(document.querySelector('#testdatadefntext')).toBeTruthy();
  });

  test('uses tabulator path when ag-grid is unavailable', () => {
    installTabulatorMock();

    const gridExtras = {
      getRowCount: jest.fn(() => 0),
      getSelectedRowIndexes: jest.fn(() => []),
      getGridAsGenericDataTable: jest.fn(),
    };

    expect(() => {
      enableTestDataGenerationInterface(
        'host',
        {
          setGridFromGenericDataTable: jest.fn(),
        },
        {
          renderTextFromGrid: jest.fn(),
        },
        gridExtras
      );
    }).not.toThrow();

    expect(document.querySelector('#defngrid button')).toBeTruthy();
    delete global.Tabulator;
  });

  test('mode radios update How Many from grid context', () => {
    const gridExtras = {
      getRowCount: jest.fn(() => 12),
      getSelectedRowIndexes: jest.fn(() => [1, 4, 5]),
      getGridAsGenericDataTable: jest.fn(),
    };

    enableTestDataGenerationInterface(
      'host',
      {
        setGridFromGenericDataTable: jest.fn(),
      },
      {
        renderTextFromGrid: jest.fn(),
      },
      gridExtras
    );

    const countInput = document.getElementById('generateCount');
    expect(countInput.value).toBe('1');

    const amendTableRadio = document.querySelector('input[value="amend-table"]');
    amendTableRadio.checked = true;
    amendTableRadio.dispatchEvent(new Event('change'));
    expect(countInput.value).toBe('12');

    const amendSelectedRadio = document.querySelector('input[value="amend-selected"]');
    amendSelectedRadio.checked = true;
    amendSelectedRadio.dispatchEvent(new Event('change'));
    expect(countInput.value).toBe('3');
  });

  test('generate does not auto-refresh text preview', async () => {
    const renderTextFromGrid = jest.fn();
    const TabulatorMock = installTabulatorMock();
    const gridExtras = {
      getRowCount: jest.fn(() => 1),
      getSelectedRowIndexes: jest.fn(() => []),
      applyGeneratedSchemaAmend: jest.fn(() => Promise.resolve({ noSelectedRows: false, amendedRows: 1 })),
    };

    enableTestDataGenerationInterface(
      'host',
      {
        setGridFromGenericDataTable: jest.fn(),
      },
      {
        renderTextFromGrid,
      },
      gridExtras
    );

    TabulatorMock.latestInstance.rows = [{ columnName: 'name', type: 'lorem.word', value: '' }];
    const amendTableRadio = document.querySelector('input[value="amend-table"]');
    amendTableRadio.checked = true;
    amendTableRadio.dispatchEvent(new Event('change'));
    document.getElementById('generatedata').click();
    await flushUi();

    expect(renderTextFromGrid).not.toHaveBeenCalled();
    expect(document.getElementById('testdata-status').textContent).toContain('Refresh text preview if needed');
    expect(document.getElementById('testdata-schema-error').textContent).toBe('');
    delete global.Tabulator;
  });

  test('refresh text preview button renders text on demand', async () => {
    const renderTextFromGrid = jest.fn();
    const gridExtras = {
      getRowCount: jest.fn(() => 0),
      getSelectedRowIndexes: jest.fn(() => []),
      getGridAsGenericDataTable: jest.fn(),
    };

    enableTestDataGenerationInterface(
      'host',
      {
        setGridFromGenericDataTable: jest.fn(),
      },
      {
        renderTextFromGrid,
      },
      gridExtras
    );

    document.getElementById('refreshtestdatapreview').click();
    await flushUi();

    expect(renderTextFromGrid).toHaveBeenCalledTimes(1);
    expect(document.getElementById('testdata-status').textContent).toContain('Text preview refreshed');

    await new Promise((resolve) => setTimeout(resolve, 1900));
    expect(document.getElementById('testdata-status').textContent).toBe('');
  });

  test('refresh text preview shows failure status when renderer rejects', async () => {
    const renderTextFromGrid = jest.fn(() => Promise.reject(new Error('refresh failed')));

    enableTestDataGenerationInterface(
      'host',
      {
        setGridFromGenericDataTable: jest.fn(),
      },
      {
        renderTextFromGrid,
      },
      {
        getRowCount: jest.fn(() => 0),
        getSelectedRowIndexes: jest.fn(() => []),
      }
    );

    document.getElementById('refreshtestdatapreview').click();
    await flushUi();

    expect(document.getElementById('testdata-status').textContent).toContain('Text preview refresh failed');
    expect(document.getElementById('refreshtestdatapreview').disabled).toBe(false);
  });

  test('generate reports schema validation failure for invalid rules', async () => {
    const TabulatorMock = installTabulatorMock();

    enableTestDataGenerationInterface(
      'host',
      {
        setGridFromGenericDataTable: jest.fn(),
      },
      {
        renderTextFromGrid: jest.fn(),
      },
      {
        getRowCount: jest.fn(() => 0),
        getSelectedRowIndexes: jest.fn(() => []),
      }
    );

    TabulatorMock.latestInstance.rows = [];
    document.getElementById('testdatadefntext').value = 'OnlyAHeader';
    document.getElementById('generatedata').click();
    await flushUi();

    expect(document.getElementById('testdata-schema-error').textContent).toContain(
      'No rules defined. Provide column/rule pairs.'
    );
    expect(document.getElementById('testdata-status').textContent).toContain('Schema validation failed');
    expect(document.getElementById('generatedata').disabled).toBe(false);
  });

  test('generate reports invalid row count for negative values', async () => {
    const TabulatorMock = installTabulatorMock();
    const importer = {
      setGridFromGenericDataTable: jest.fn(),
    };

    enableTestDataGenerationInterface(
      'host',
      importer,
      {
        renderTextFromGrid: jest.fn(),
      },
      {
        getRowCount: jest.fn(() => 0),
        getSelectedRowIndexes: jest.fn(() => []),
      }
    );

    TabulatorMock.latestInstance.rows = [{ columnName: 'Name', type: 'person.fullName', value: '' }];
    document.getElementById('generateCount').value = '-1';
    document.getElementById('generatedata').click();
    await flushUi();

    expect(document.getElementById('testdata-schema-error').textContent).toContain('Enter how many rows to generate.');
    expect(document.getElementById('testdata-status').textContent).toContain('Invalid row count');
    expect(importer.setGridFromGenericDataTable).not.toHaveBeenCalled();
  });

  test('amend selected reports when no rows are selected', async () => {
    const TabulatorMock = installTabulatorMock();
    const gridExtras = {
      getRowCount: jest.fn(() => 2),
      getSelectedRowIndexes: jest.fn(() => []),
      applyGeneratedSchemaAmend: jest.fn(() => Promise.resolve({ noSelectedRows: true, amendedRows: 0 })),
    };

    enableTestDataGenerationInterface(
      'host',
      {
        setGridFromGenericDataTable: jest.fn(),
      },
      {
        renderTextFromGrid: jest.fn(),
      },
      gridExtras
    );

    TabulatorMock.latestInstance.rows = [{ columnName: 'name', type: 'person.fullName', value: '' }];
    const amendSelectedRadio = document.querySelector('input[value="amend-selected"]');
    amendSelectedRadio.checked = true;
    amendSelectedRadio.dispatchEvent(new Event('change'));
    document.getElementById('generatedata').click();
    await flushUi();

    expect(document.getElementById('testdata-schema-error').textContent).toContain('No rows selected.');
    expect(document.getElementById('testdata-status').textContent).toContain('No selected rows to amend');
    delete global.Tabulator;
  });

  test('pairwise generation reports inline error when fewer than two enum columns exist', async () => {
    const TabulatorMock = installTabulatorMock();

    enableTestDataGenerationInterface(
      'host',
      {
        setGridFromGenericDataTable: jest.fn(),
      },
      {
        renderTextFromGrid: jest.fn(),
      },
      {
        getRowCount: jest.fn(() => 0),
        getSelectedRowIndexes: jest.fn(() => []),
      }
    );

    TabulatorMock.latestInstance.rows = [{ columnName: 'OnlyEnum', type: 'enum', value: 'a,b' }];
    document.getElementById('generateallpairs').click();
    await flushUi();

    expect(document.getElementById('testdata-schema-error').textContent).toContain(
      'Pairwise generation requires at least 2 enum columns.'
    );
    expect(document.getElementById('testdata-status').textContent).toContain('Insufficient enum columns');
    delete global.Tabulator;
  });

  test('generate shows failure status when importer throws', async () => {
    const TabulatorMock = installTabulatorMock();
    const importer = {
      setGridFromGenericDataTable: jest.fn(() => Promise.reject(new Error('boom'))),
    };

    enableTestDataGenerationInterface(
      'host',
      importer,
      {
        renderTextFromGrid: jest.fn(),
      },
      {
        getRowCount: jest.fn(() => 0),
        getSelectedRowIndexes: jest.fn(() => []),
      }
    );

    TabulatorMock.latestInstance.rows = [{ columnName: 'Name', type: 'person.fullName', value: '' }];
    document.getElementById('generateCount').value = '1';
    document.getElementById('generatedata').click();
    await flushUi();

    expect(document.getElementById('testdata-schema-error').textContent).toContain(
      'Generate failed. Check console for details.'
    );
    expect(document.getElementById('testdata-status').textContent).toContain('Generate failed');
    expect(document.getElementById('generatedata').disabled).toBe(false);
  });

  test('tabulator schema text updates while editing a cell', async () => {
    const TabulatorMock = installTabulatorMock();

    enableTestDataGenerationInterface(
      'host',
      {
        setGridFromGenericDataTable: jest.fn(),
      },
      {
        renderTextFromGrid: jest.fn(),
      },
      {
        getRowCount: jest.fn(() => 0),
        getSelectedRowIndexes: jest.fn(() => []),
      }
    );

    const rowData = { columnName: 'name', type: 'RegEx', value: '[A-Z]+' };
    TabulatorMock.latestInstance.rows = [rowData];

    const editorHost = document.createElement('div');
    const input = document.createElement('input');
    input.value = 'person_name';
    editorHost.appendChild(input);

    TabulatorMock.latestInstance.options.cellEditing({
      getElement: () => editorHost,
      getField: () => 'columnName',
      getRow: () => ({ getData: () => rowData }),
    });

    await flushUi();
    expect(document.getElementById('testdatadefntext').value).toContain('person_name');

    input.value = 'customer_name';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await flushUi();
    expect(document.getElementById('testdatadefntext').value).toContain('customer_name');

    delete global.Tabulator;
  });

  test('schema text comments survive text-to-grid parse and add-column grid sync', async () => {
    const TabulatorMock = installTabulatorMock();

    enableTestDataGenerationInterface(
      'host',
      {
        setGridFromGenericDataTable: jest.fn(),
      },
      {
        renderTextFromGrid: jest.fn(),
      },
      {
        getRowCount: jest.fn(() => 0),
        getSelectedRowIndexes: jest.fn(() => []),
      }
    );

    const schemaTextArea = document.getElementById('testdatadefntext');
    schemaTextArea.value =
      '# first comment\n\nPriority\nenum(high,medium,low)\n\n# second comment\nStatus\nenum(active,inactive)';
    schemaTextArea.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 1100));
    await flushUi();

    expect(TabulatorMock.latestInstance.rows).toHaveLength(2);
    document.querySelector('#defngrid button').click();
    await flushUi();

    const rebuilt = document.getElementById('testdatadefntext').value;
    expect(rebuilt).toContain('# first comment');
    expect(rebuilt).toContain('# second comment');
  });

  test('leading blank line in schema text is preserved and plain value maps to a typed row', async () => {
    const TabulatorMock = installTabulatorMock();

    enableTestDataGenerationInterface(
      'host',
      {
        setGridFromGenericDataTable: jest.fn(),
      },
      {
        renderTextFromGrid: jest.fn(),
      },
      {
        getRowCount: jest.fn(() => 0),
        getSelectedRowIndexes: jest.fn(() => []),
      }
    );

    const schemaTextArea = document.getElementById('testdatadefntext');
    schemaTextArea.value = '\nc2\nvalue';
    schemaTextArea.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 1100));
    await flushUi();

    expect(TabulatorMock.latestInstance.rows).toHaveLength(1);
    expect(TabulatorMock.latestInstance.rows[0]).toMatchObject({
      comments: '',
      columnName: 'c2',
      value: 'value',
    });

    document.querySelector('#defngrid button').click();
    await flushUi();
    expect(document.getElementById('testdatadefntext').value).toContain('\nc2\n');
  });

  test('enum type rows are emitted as enum(...) definitions in schema text', async () => {
    const TabulatorMock = installTabulatorMock();

    enableTestDataGenerationInterface(
      'host',
      {
        setGridFromGenericDataTable: jest.fn(),
      },
      {
        renderTextFromGrid: jest.fn(),
      },
      {
        getRowCount: jest.fn(() => 0),
        getSelectedRowIndexes: jest.fn(() => []),
      }
    );

    TabulatorMock.latestInstance.rows = [{ columnName: 'Priority', type: 'enum', value: '1,2,3,4' }];
    TabulatorMock.latestInstance.options.cellEdited();
    await flushUi();

    expect(document.getElementById('testdatadefntext').value).toContain('Priority\nenum(1,2,3,4)');

    delete global.Tabulator;
  });

  test('literal type rows are emitted as literal(...) definitions in schema text', async () => {
    const TabulatorMock = installTabulatorMock();

    enableTestDataGenerationInterface(
      'host',
      {
        setGridFromGenericDataTable: jest.fn(),
      },
      {
        renderTextFromGrid: jest.fn(),
      },
      {
        getRowCount: jest.fn(() => 0),
        getSelectedRowIndexes: jest.fn(() => []),
      }
    );

    TabulatorMock.latestInstance.rows = [{ columnName: 'Separator', type: 'literal', value: '.' }];
    TabulatorMock.latestInstance.options.cellEdited();
    await flushUi();

    expect(document.getElementById('testdatadefntext').value).toContain('Separator\nliteral(.)');

    delete global.Tabulator;
  });

  test('literal type rows preserve empty and whitespace-only values in schema text', async () => {
    const TabulatorMock = installTabulatorMock();

    enableTestDataGenerationInterface(
      'host',
      {
        setGridFromGenericDataTable: jest.fn(),
      },
      {
        renderTextFromGrid: jest.fn(),
      },
      {
        getRowCount: jest.fn(() => 0),
        getSelectedRowIndexes: jest.fn(() => []),
      }
    );

    TabulatorMock.latestInstance.rows = [
      { columnName: 'EmptyLiteral', type: 'literal', value: '' },
      { columnName: 'SpaceLiteral', type: 'literal', value: '   ' },
    ];
    TabulatorMock.latestInstance.options.cellEdited();
    await flushUi();

    const schemaText = document.getElementById('testdatadefntext').value;
    expect(schemaText).toContain('EmptyLiteral\nliteral()');
    expect(schemaText).toContain('SpaceLiteral\nliteral(   )');

    delete global.Tabulator;
  });

  test('text schema literal() parses to literal row type (not regex)', async () => {
    const TabulatorMock = installTabulatorMock();

    enableTestDataGenerationInterface(
      'host',
      {
        setGridFromGenericDataTable: jest.fn(),
      },
      {
        renderTextFromGrid: jest.fn(),
      },
      {
        getRowCount: jest.fn(() => 0),
        getSelectedRowIndexes: jest.fn(() => []),
      }
    );

    const schemaTextArea = document.getElementById('testdatadefntext');
    schemaTextArea.value = 't\nliteral()';
    schemaTextArea.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 1100));
    await flushUi();

    expect(TabulatorMock.latestInstance.rows).toHaveLength(1);
    expect(TabulatorMock.latestInstance.rows[0]).toMatchObject({
      columnName: 't',
      type: 'literal',
      value: '',
    });

    delete global.Tabulator;
  });

  test('literal type rows preserve leading spaces in value when mapped to schema text', async () => {
    const TabulatorMock = installTabulatorMock();

    enableTestDataGenerationInterface(
      'host',
      {
        setGridFromGenericDataTable: jest.fn(),
      },
      {
        renderTextFromGrid: jest.fn(),
      },
      {
        getRowCount: jest.fn(() => 0),
        getSelectedRowIndexes: jest.fn(() => []),
      }
    );

    TabulatorMock.latestInstance.rows = [{ columnName: 'LeadingSpaceLiteral', type: 'literal', value: '   123' }];
    TabulatorMock.latestInstance.options.cellEdited();
    await flushUi();

    const schemaText = document.getElementById('testdatadefntext').value;
    expect(schemaText).toContain('LeadingSpaceLiteral\nliteral(   123)');

    delete global.Tabulator;
  });

  test('load sample schema button populates text schema with literal, enum, regex, and faker examples', () => {
    installTabulatorMock();

    enableTestDataGenerationInterface(
      'host',
      {
        setGridFromGenericDataTable: jest.fn(),
      },
      {
        renderTextFromGrid: jest.fn(),
      },
      {
        getRowCount: jest.fn(() => 0),
        getSelectedRowIndexes: jest.fn(() => []),
      }
    );

    const tooltipButton = document.createElement('button');
    tooltipButton.className = 'testdata-schema-sample-button';
    document.body.appendChild(tooltipButton);
    tooltipButton.click();
    const value = document.getElementById('testdatadefntext').value;

    expect(value).toContain('Literal Example');
    expect(value).toContain('literal(Pending Review)');
    expect(value).toContain('Enum Example');
    expect(value).toContain('enum("Open","In Progress","Closed")');
    expect(value).toContain('Enum Example 2');
    expect(value).toContain('enum("High","Medium","Low")');
    expect(value).toContain('Regex Example');
    expect(value).toContain('[A-Z]{3}-\\d{4}');
    expect(value).toContain('Faker Example');
    expect(value).toContain('person.fullName');

    delete global.Tabulator;
  });
});
