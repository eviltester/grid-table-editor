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

  function renderRowWithActions() {
    dom.window.document.body.innerHTML = `
      <div class="shared-schema-row shared-schema-row-invalid" data-row-id="row-1">
        <input type="text" data-field="name" value="Name">
        <button type="button" data-action="pick-command">Pick command</button>
        <div class="shared-schema-row-validation" role="status">invalid row</div>
        <div class="shared-schema-row-actions">
          <button type="button" data-action="drag">Drag</button>
          <button type="button" data-action="add">Add</button>
          <button type="button" data-action="remove">Remove</button>
          <button type="button" data-action="up">Up</button>
          <button type="button" data-action="down">Down</button>
        </div>
      </div>
    `;
  }

  test.each(['pick-command', 'drag', 'add', 'remove', 'up', 'down'])(
    'captures and restores focused %s action buttons after a row render',
    (actionName) => {
      dom = new JSDOM(`
        <!doctype html>
        <html>
          <body></body>
        </html>
      `);
      const { document } = dom.window;

      renderRowWithActions();

      document.querySelector(`[data-action="${actionName}"]`).focus();

      const state = captureActiveFieldState(document);
      expect(state).toMatchObject({
        rowId: 'row-1',
        fieldName: null,
        actionName,
      });

      renderRowWithActions();
      const nextActionButton = document.querySelector(`[data-action="${actionName}"]`);

      restoreActiveFieldState(document, state);

      expect(document.activeElement).toBe(nextActionButton);
    }
  );

  test('captures and restores focused row fields after a row render', () => {
    dom = new JSDOM(`
      <!doctype html>
      <html>
        <body>
          <div class="shared-schema-row shared-schema-row-invalid" data-row-id="row-1">
            <input type="text" data-field="name" value="Name">
            <div class="shared-schema-row-validation" role="status">invalid row</div>
          </div>
        </body>
      </html>
    `);
    const { document } = dom.window;

    document.querySelector('[data-field="name"]').focus();

    const state = captureActiveFieldState(document);
    expect(state).toMatchObject({
      rowId: 'row-1',
      fieldName: 'name',
      actionName: null,
    });

    document.body.innerHTML = `
      <div class="shared-schema-row shared-schema-row-invalid" data-row-id="row-1">
        <input type="text" data-field="name" value="Name">
        <div class="shared-schema-row-validation" role="status">invalid row</div>
      </div>
    `;
    const nextNameInput = document.querySelector('[data-field="name"]');

    restoreActiveFieldState(document, state);

    expect(document.activeElement).toBe(nextNameInput);
  });
});
