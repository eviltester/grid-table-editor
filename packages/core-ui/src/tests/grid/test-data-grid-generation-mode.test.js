import { JSDOM } from 'jsdom';
import {
  getGenerationMode,
  applyModeDefaultRowCount,
} from '../../../js/gui_components/app/test-data-grid/controller/test-data-grid-generation-mode.js';

describe('test-data-grid-generation-mode', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM(`
      <!doctype html>
      <html>
        <body>
          <input type="number" id="generateCount" value="1" />
          <label><input type="radio" name="testDataGenerationMode" value="new-table" checked></label>
          <label><input type="radio" name="testDataGenerationMode" value="amend-table"></label>
          <label><input type="radio" name="testDataGenerationMode" value="amend-selected"></label>
        </body>
      </html>
    `);
  });

  afterEach(() => {
    dom.window.close();
  });

  test('getGenerationMode returns checked value or fallback', () => {
    expect(getGenerationMode({ documentObj: dom.window.document, defaultMode: 'new-table' })).toBe('new-table');

    dom.window.document.querySelector('input[value="new-table"]').checked = false;
    dom.window.document.querySelector('input[value="amend-selected"]').checked = true;

    expect(getGenerationMode({ documentObj: dom.window.document, defaultMode: 'new-table' })).toBe('amend-selected');
  });

  test('applyModeDefaultRowCount updates count for amend modes', () => {
    const gridExtras = {
      getRowCount: () => 12,
      getSelectedRowIndexes: () => [1, 3, 5],
    };

    applyModeDefaultRowCount({
      mode: 'amend-table',
      documentObj: dom.window.document,
      gridExtras,
      amendTableMode: 'amend-table',
      amendSelectedMode: 'amend-selected',
    });
    expect(dom.window.document.getElementById('generateCount').value).toBe('12');

    applyModeDefaultRowCount({
      mode: 'amend-selected',
      documentObj: dom.window.document,
      gridExtras,
      amendTableMode: 'amend-table',
      amendSelectedMode: 'amend-selected',
    });
    expect(dom.window.document.getElementById('generateCount').value).toBe('3');
  });
});
