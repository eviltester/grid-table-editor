import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createAgGridDraftSync } from '../../../js/gui_components/shared/test-data/ag-grid-draft-sync.js';

describe('ag-grid draft sync', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
    global.Event = dom.window.Event;
  });

  afterEach(() => {
    dom.window.close();
  });

  async function flush() {
    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  test('publishes draft state during edit and updates schema on input', async () => {
    const onDraftCellEditChange = jest.fn();
    const onSchemaChanged = jest.fn();
    const sync = createAgGridDraftSync({ onDraftCellEditChange, onSchemaChanged });
    const rowData = { columnName: 'name' };
    const editorHost = document.createElement('div');
    const input = document.createElement('input');
    input.value = 'person_name';
    editorHost.appendChild(input);

    sync.onCellEditingStarted({
      eGridCell: editorHost,
      data: rowData,
      colDef: { field: 'columnName' },
    });
    await flush();

    expect(onDraftCellEditChange).toHaveBeenCalledWith({
      field: 'columnName',
      rowData,
      value: 'person_name',
    });
    expect(onSchemaChanged).toHaveBeenCalled();

    input.value = 'customer_name';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await flush();

    expect(onDraftCellEditChange).toHaveBeenLastCalledWith({
      field: 'columnName',
      rowData,
      value: 'customer_name',
    });
  });

  test('clears draft state on cell editing stopped', () => {
    const onDraftCellEditChange = jest.fn();
    const sync = createAgGridDraftSync({
      onDraftCellEditChange,
      onSchemaChanged: jest.fn(),
    });

    sync.onCellEditingStopped();
    expect(onDraftCellEditChange).toHaveBeenCalledWith(null);
  });
});
