import { JSDOM } from 'jsdom';
import { ExtendedDataGrid } from '../../../js/gui_components/data-grid-editor/ag-grid/main-display-grid.js';

describe('AG Grid main display grid', () => {
  let dom;
  let api;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body><div id="host"></div></body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
    global.Event = dom.window.Event;

    api = {
      sizeColumnsToFit: jest.fn(),
    };

    global.agGrid = {
      createGrid: jest.fn(() => api),
    };
  });

  afterEach(() => {
    dom.window.close();
    delete global.agGrid;
  });

  test('constructor configures default AG Grid options', () => {
    const grid = new ExtendedDataGrid();

    expect(grid.gridOptions.columnDefs).toEqual([{ headerName: '~rename-me', field: 'column1' }]);
    expect(grid.gridOptions.defaultColDef).toEqual(
      expect.objectContaining({
        wrapText: true,
        autoHeight: true,
        resizable: true,
        rowDrag: true,
        editable: true,
        filter: true,
        sortable: true,
      })
    );
    expect(grid.gridOptions.components.agColumnHeader).toBeDefined();
    expect(grid.gridOptions.rowSelection).toEqual({
      mode: 'multiRow',
      checkboxes: false,
      headerCheckbox: false,
      enableClickSelection: true,
    });
  });

  test('createChildGrid creates grid and wires toolbar', () => {
    const grid = new ExtendedDataGrid();
    const host = document.getElementById('host');

    grid.createChildGrid(host);

    expect(document.getElementById('myGrid')).toBeTruthy();
    expect(global.agGrid.createGrid).toHaveBeenCalledWith(document.getElementById('myGrid'), grid.gridOptions);
    expect(grid.getGridExtras()).toBeDefined();
  });

  test('sizeColumnsToFit delegates to grid api', () => {
    const grid = new ExtendedDataGrid();
    grid.gridApi = api;

    grid.sizeColumnsToFit();

    expect(api.sizeColumnsToFit).toHaveBeenCalledTimes(1);
  });
});
