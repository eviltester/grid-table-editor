import { JSDOM } from 'jsdom';
import {
  captureActiveFieldState,
  restoreActiveFieldState,
} from '../../../js/gui_components/shared/test-data/schema/schema-focus-state.js';

describe('schema focus state', () => {
  let dom;

  afterEach(() => {
    dom?.window.close();
  });

  test('captures and restores focused row action buttons after a row render', () => {
    dom = new JSDOM(`
      <!doctype html>
      <html>
        <body>
          <div class="shared-schema-row" data-row-id="row-1">
            <button type="button" data-action="drag">Drag</button>
          </div>
        </body>
      </html>
    `);
    const { document } = dom.window;

    document.querySelector('[data-action="drag"]').focus();

    const state = captureActiveFieldState(document);
    expect(state).toMatchObject({
      rowId: 'row-1',
      fieldName: null,
      actionName: 'drag',
    });

    document.body.innerHTML = `
      <div class="shared-schema-row" data-row-id="row-1">
        <button type="button" data-action="drag">Drag</button>
      </div>
    `;
    const nextDragButton = document.querySelector('[data-action="drag"]');

    restoreActiveFieldState(document, state);

    expect(document.activeElement).toBe(nextDragButton);
  });
});
