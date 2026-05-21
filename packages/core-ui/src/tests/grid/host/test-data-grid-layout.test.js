import { JSDOM } from 'jsdom';
import { applyTestDataGridLayout } from '../../../../js/gui_components/app/test-data-grid/host/test-data-grid-layout.js';

describe('test-data-grid layout', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
  });

  afterEach(() => {
    dom.window.close();
  });

  test('applies expected layout styles', () => {
    document.body.innerHTML =
      '<div id="grid"></div><div class="test-data-schema-text-container"><p>h</p><textarea></textarea></div><div class="test-data-schema-edit-zone"></div>';
    const gridDiv = document.getElementById('grid');
    const textEdit = document.querySelector('.test-data-schema-text-container');
    const zone = document.querySelector('.test-data-schema-edit-zone');

    applyTestDataGridLayout({
      gridDiv,
      textEdit,
      zone,
      hasGridApi: true,
    });

    expect(gridDiv.style.height).toBe('220px');
    expect(gridDiv.style.width).toBe('70%');
    expect(textEdit.style.width).toBe('30%');
    expect(zone.style.display).toBe('flex');
  });
});
