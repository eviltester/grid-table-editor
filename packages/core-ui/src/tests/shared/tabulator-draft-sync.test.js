import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createTabulatorDraftSync } from '../../../js/gui_components/shared/test-data/tabulator-draft-sync.js';

describe('tabulator draft sync', () => {
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

  function createCell({ field = 'columnName', rowData = { columnName: 'name' }, value = 'name' } = {}) {
    const host = document.createElement('div');
    const input = document.createElement('input');
    input.value = value;
    host.appendChild(input);
    return {
      input,
      cell: {
        getElement: () => host,
        getField: () => field,
        getRow: () => ({ getData: () => rowData }),
      },
    };
  }

  test('publishes draft state during edit and updates schema on input', async () => {
    const onDraftCellEditChange = jest.fn();
    const onSchemaChanged = jest.fn();
    const sync = createTabulatorDraftSync({ onDraftCellEditChange, onSchemaChanged });
    const { cell, input } = createCell({ value: 'person_name' });

    sync.beginDraftTracking(cell);
    await flush();

    expect(onDraftCellEditChange).toHaveBeenCalledWith({
      field: 'columnName',
      rowData: { columnName: 'name' },
      value: 'person_name',
    });
    expect(onSchemaChanged).toHaveBeenCalled();

    input.value = 'customer_name';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await flush();

    expect(onDraftCellEditChange).toHaveBeenLastCalledWith({
      field: 'columnName',
      rowData: { columnName: 'name' },
      value: 'customer_name',
    });
  });

  test('clears active draft state', () => {
    const onDraftCellEditChange = jest.fn();
    const sync = createTabulatorDraftSync({
      onDraftCellEditChange,
      onSchemaChanged: jest.fn(),
    });

    sync.clearDraftTracking();
    expect(onDraftCellEditChange).toHaveBeenCalledWith(null);
  });
});
