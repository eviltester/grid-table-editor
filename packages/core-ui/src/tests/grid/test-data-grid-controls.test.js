import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import {
  createGridChromeElements,
  bindGridChromeControls,
} from '../../../js/gui_components/app/test-data-grid/test-data-grid-controls.js';

describe('test-data-grid controls', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
  });

  afterEach(() => {
    dom.window.close();
  });

  test('createGridChromeElements appends table host and buttons', () => {
    const gridDiv = document.createElement('div');
    const { tableDiv, addNewRowButton, deleteRowsButton } = createGridChromeElements(gridDiv);

    expect(gridDiv.contains(tableDiv)).toBe(true);
    expect(addNewRowButton.innerText).toContain('+ Add Column');
    expect(deleteRowsButton.innerText).toContain('- Delete Selected');
  });

  test('bindGridChromeControls adds row via bridge and sync callback', () => {
    const addNewRowButton = document.createElement('button');
    const deleteRowsButton = document.createElement('button');
    const bridge = { addRows: jest.fn() };
    const onSchemaChanged = jest.fn();

    bindGridChromeControls({
      addNewRowButton,
      deleteRowsButton,
      getBridge: () => bridge,
      getExtras: () => null,
      onSchemaChanged,
    });

    addNewRowButton.click();
    expect(bridge.addRows).toHaveBeenCalled();
    expect(onSchemaChanged).toHaveBeenCalled();
  });
});
