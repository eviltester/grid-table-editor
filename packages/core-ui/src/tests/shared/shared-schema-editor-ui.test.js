import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import {
  renderSharedSchemaRows,
  hideVisibleHelpTooltips,
  handleSharedSchemaRowInputChange,
  handleSharedSchemaRowButtonClick,
  SCHEMA_ROWS_KEY,
  SCHEMA_MODE_HELP_ICON_KEY,
  SHARED_SCHEMA_ROW_INVALID_CLASS,
  SHARED_SCHEMA_FIELD_INVALID_CLASS,
  SHARED_SCHEMA_ROW_VALIDATION_CLASS,
  SHARED_SCHEMA_HELP_LINK_CLASS,
  SHARED_SCHEMA_HELP_DATA_HELP,
  SHARED_SCHEMA_ROW_ACTIONS_CLASS,
  SHARED_SCHEMA_DRAG_HANDLE_CLASS,
  SHARED_SCHEMA_COMMAND_PICKER_CONTROL_CLASS,
  SHARED_SCHEMA_COMMAND_PICKER_BUTTON_CLASS,
  SHARED_SCHEMA_COMMAND_PICKER_SHADOW_SELECT_CLASS,
  SHARED_SCHEMA_COMMAND_ROW_CLASS,
  SHARED_SCHEMA_VALUE_ROW_CLASS,
  SCHEMA_ROW_DRAGGING_CLASS,
  SCHEMA_ROW_DROP_BEFORE_CLASS,
  SCHEMA_ROW_DROP_AFTER_CLASS,
  getSchemaRowDropInstruction,
  applySchemaRowDropInstructionIndicator,
} from '../../../js/gui_components/shared/test-data/schema/shared-schema-editor-ui.js';

describe('shared schema editor ui', () => {
  let dom;
  let rowsElement;
  let modeHelpIconElement;

  beforeEach(() => {
    dom = new JSDOM(
      `<!doctype html><html><body>
        <div id="${SCHEMA_ROWS_KEY}"></div>
        <span id="${SCHEMA_MODE_HELP_ICON_KEY}"></span>
      </body></html>`
    );
    global.document = dom.window.document;
    global.window = dom.window;
    rowsElement = document.getElementById(SCHEMA_ROWS_KEY);
    modeHelpIconElement = document.getElementById(SCHEMA_MODE_HELP_ICON_KEY);
  });

  afterEach(() => {
    dom.window.close();
    delete global.document;
    delete global.window;
  });

  test('renders rows into the shared schema rows container using shared classes', () => {
    const updateHelpHints = jest.fn();
    renderSharedSchemaRows({
      documentObj: document,
      rowsElement,
      schemaRows: [{ id: '1', name: 'First', sourceType: 'literal', value: 'x' }],
      getSchemaHelpData: () => ({ show: false, docsUrl: '', title: '', html: '' }),
      updateAllPairsButtonVisibility: () => {},
      updateHelpHints,
    });

    expect(rowsElement).not.toBeNull();
    expect(rowsElement.querySelectorAll('.shared-schema-row')).toHaveLength(1);
    expect(rowsElement.querySelector('.generator-schema-row')).toBeNull();
    expect(updateHelpHints).toHaveBeenCalledTimes(1);
  });

  test('hides the shared schema mode help tooltip when present', () => {
    const hide = jest.fn();
    modeHelpIconElement._tippy = { hide };
    global.tippy = { hideAll: jest.fn() };

    hideVisibleHelpTooltips({ modeHelpIconElement, windowObj: window });

    expect(hide).toHaveBeenCalled();
    expect(global.tippy.hideAll).toHaveBeenCalledWith({ duration: 0 });

    delete global.tippy;
  });

  test('row input handler normalises faker commands after edit', () => {
    const schemaRows = [{ id: '1', name: 'First', sourceType: 'faker', command: '', params: '()' }];
    const schemaSession = {
      updateRowAtIndex(index, updater) {
        schemaRows[index] = updater(schemaRows[index]);
        return schemaRows[index];
      },
    };

    rowsElement.innerHTML = `
      <div class="shared-schema-row" data-row-id="1">
        <select data-field="command"><option value="faker.person.firstName" selected>faker.person.firstName</option></select>
      </div>`;
    const select = document.querySelector('[data-field="command"]');
    select.value = 'faker.person.firstName';

    handleSharedSchemaRowInputChange({
      event: { target: select },
      schemaRows,
      schemaSession,
      renderSchemaRows: () => {},
      updateAllPairsButtonVisibility: () => {},
    });

    expect(schemaRows[0].command).toBe('person.firstName');
  });

  test('row action handler resolves actions from nested icon targets', () => {
    renderSharedSchemaRows({
      documentObj: document,
      rowsElement,
      schemaRows: [{ id: '1', name: 'First', sourceType: 'faker', command: 'person.firstName', params: '()' }],
      getSchemaHelpData: () => ({ show: false, docsUrl: '', title: '', html: '' }),
      updateAllPairsButtonVisibility: () => {},
    });

    const addRowAfter = jest.fn();
    const removeRow = jest.fn();
    const moveRow = jest.fn();
    const nestedIcon = document.querySelector('[data-action="add"] svg');

    handleSharedSchemaRowButtonClick({
      event: { target: nestedIcon },
      schemaRows: [{ id: '1' }],
      addRowAfter,
      removeRow,
      moveRow,
    });

    expect(addRowAfter).toHaveBeenCalledWith(0);
    expect(removeRow).not.toHaveBeenCalled();
    expect(moveRow).not.toHaveBeenCalled();
  });

  test('renders shared schema help links with shared-only help hooks', () => {
    renderSharedSchemaRows({
      documentObj: document,
      rowsElement,
      schemaRows: [{ id: '1', name: 'First', sourceType: 'domain', command: 'person.firstName', params: '' }],
      getVisibleDomainCommands: () => ['person.firstName'],
      getSchemaHelpData: () => ({ show: true, docsUrl: '/docs/example', title: 'Help', html: '<p>Help</p>' }),
      updateAllPairsButtonVisibility: () => {},
    });

    const helpLink = document.querySelector('[data-field="faker-doc-link"]');
    expect(helpLink).not.toBeNull();
    expect(helpLink.classList.contains(SHARED_SCHEMA_HELP_LINK_CLASS)).toBe(true);
    expect(helpLink.classList.contains('generator-schema-help-link')).toBe(false);
    expect(helpLink.getAttribute('data-help')).toBe(SHARED_SCHEMA_HELP_DATA_HELP);
  });

  test('renders validation state with shared-only classes', () => {
    renderSharedSchemaRows({
      documentObj: document,
      rowsElement,
      schemaRows: [
        {
          id: '1',
          name: 'First',
          sourceType: 'domain',
          command: 'person.firstName',
          params: '',
          validation: {
            valid: false,
            message: 'Row 1 invalid',
            issues: [{ field: 'name' }, { field: 'command' }, { field: 'params' }],
          },
        },
      ],
      getVisibleDomainCommands: () => ['person.firstName'],
      getSchemaHelpData: () => ({ show: true, docsUrl: '/docs/example', title: 'Help', html: '<p>Help</p>' }),
      updateAllPairsButtonVisibility: () => {},
    });

    const row = document.querySelector('.shared-schema-row');
    expect(row.classList.contains(SHARED_SCHEMA_ROW_INVALID_CLASS)).toBe(true);
    expect(row.classList.contains('generator-schema-row-invalid')).toBe(false);
    expect(document.querySelector('[data-field="name"]').classList.contains(SHARED_SCHEMA_FIELD_INVALID_CLASS)).toBe(
      true
    );
    expect(
      document.querySelector('[data-action="pick-command"]').classList.contains(SHARED_SCHEMA_FIELD_INVALID_CLASS)
    ).toBe(true);
    expect(document.querySelector('[data-field="params"]').classList.contains(SHARED_SCHEMA_FIELD_INVALID_CLASS)).toBe(
      true
    );
    expect(document.querySelector(`.${SHARED_SCHEMA_ROW_VALIDATION_CLASS}`)?.textContent).toContain('Row 1 invalid');
    expect(document.querySelector('.generator-schema-row-validation')).toBeNull();
  });

  test('renders row actions and command picker with shared-only classes', () => {
    renderSharedSchemaRows({
      documentObj: document,
      rowsElement,
      schemaRows: [{ id: '1', name: 'First', sourceType: 'faker', command: 'person.firstName', params: '' }],
      fakerCommands: ['person.firstName'],
      getSchemaHelpData: () => ({ show: false, docsUrl: '', title: '', html: '' }),
      updateAllPairsButtonVisibility: () => {},
    });

    const rowActions = document.querySelector(`.${SHARED_SCHEMA_ROW_ACTIONS_CLASS}`);
    const dragHandle = document.querySelector(`.${SHARED_SCHEMA_DRAG_HANDLE_CLASS}`);
    const commandPickerControl = document.querySelector(`.${SHARED_SCHEMA_COMMAND_PICKER_CONTROL_CLASS}`);
    const commandPickerButton = document.querySelector(`.${SHARED_SCHEMA_COMMAND_PICKER_BUTTON_CLASS}`);
    const commandPickerSelect = document.querySelector(`.${SHARED_SCHEMA_COMMAND_PICKER_SHADOW_SELECT_CLASS}`);

    expect(rowActions).not.toBeNull();
    expect(document.querySelector('.generator-row-actions')).toBeNull();
    expect(dragHandle).not.toBeNull();
    expect(document.querySelector('.generator-schema-drag-handle')).toBeNull();
    expect(commandPickerControl).not.toBeNull();
    expect(document.querySelector('.generator-command-picker-control')).toBeNull();
    expect(commandPickerButton).not.toBeNull();
    expect(document.querySelector('.generator-command-picker-button')).toBeNull();
    expect(commandPickerSelect).not.toBeNull();
    expect(document.querySelector('.generator-command-picker-shadow-select')).toBeNull();
  });

  test('renders row layout state with shared-only classes', () => {
    renderSharedSchemaRows({
      documentObj: document,
      rowsElement,
      schemaRows: [
        { id: '1', name: 'First', sourceType: 'faker', command: 'person.firstName', params: '' },
        { id: '2', name: 'Second', sourceType: 'literal', value: 'x' },
      ],
      fakerCommands: ['person.firstName'],
      getSchemaHelpData: () => ({ show: false, docsUrl: '', title: '', html: '' }),
      updateAllPairsButtonVisibility: () => {},
    });

    const rows = document.querySelectorAll('.shared-schema-row');
    expect(rows[0].classList.contains(SHARED_SCHEMA_COMMAND_ROW_CLASS)).toBe(true);
    expect(rows[0].classList.contains('generator-schema-row-faker')).toBe(false);
    expect(rows[1].classList.contains(SHARED_SCHEMA_VALUE_ROW_CLASS)).toBe(true);
    expect(rows[1].classList.contains('generator-schema-row-non-faker')).toBe(false);
  });

  test('applies drag/drop indicators with shared-only classes', () => {
    renderSharedSchemaRows({
      documentObj: document,
      rowsElement,
      schemaRows: [
        { id: '1', name: 'First', sourceType: 'literal', value: 'x' },
        { id: '2', name: 'Second', sourceType: 'literal', value: 'y' },
      ],
      getSchemaHelpData: () => ({ show: false, docsUrl: '', title: '', html: '' }),
      updateAllPairsButtonVisibility: () => {},
    });

    const rows = document.querySelectorAll('.shared-schema-row');
    rows[1].getBoundingClientRect = () => ({ top: 0, height: 20 });
    const dropInstruction = getSchemaRowDropInstruction({
      event: { target: rows[1], clientY: 19 },
      schemaRows: [
        { id: '1', name: 'First', sourceType: 'literal', value: 'x' },
        { id: '2', name: 'Second', sourceType: 'literal', value: 'y' },
      ],
      draggedRowId: '1',
    });

    applySchemaRowDropInstructionIndicator({
      rootElement: document.body,
      draggedRowId: '1',
      dropInstruction,
    });

    expect(rows[0].classList.contains(SCHEMA_ROW_DRAGGING_CLASS)).toBe(true);
    expect(rows[0].classList.contains('generator-schema-row-dragging')).toBe(false);
    expect(rows[1].classList.contains(SCHEMA_ROW_DROP_BEFORE_CLASS)).toBe(false);
    expect(rows[1].classList.contains(SCHEMA_ROW_DROP_AFTER_CLASS)).toBe(true);
    expect(rows[1].classList.contains('generator-schema-row-drop-after')).toBe(false);
  });
});
