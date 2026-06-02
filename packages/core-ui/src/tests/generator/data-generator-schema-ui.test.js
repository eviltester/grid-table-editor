import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import {
  renderGeneratorSchemaRows,
  handleGeneratorRowInputChange,
  handleGeneratorRowButtonClick,
  buildSchemaModeHelpHtml,
} from '../../../js/gui_components/generator/schema/index.js';

describe('generator schema ui', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="generatorSchemaRows"></div></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;
  });

  afterEach(() => {
    dom.window.close();
  });

  test('renders command picker button for command rows and value input for literal rows', () => {
    renderGeneratorSchemaRows({
      documentObj: document,
      schemaRows: [
        { id: '1', name: 'First', sourceType: 'faker', command: 'person.firstName', params: '()' },
        { id: '2', name: 'Fixed', sourceType: 'literal', value: 'x' },
      ],
      getSchemaHelpData: () => ({ show: true, docsUrl: 'https://example.com', title: 'help', html: '<p>help</p>' }),
      updateAllPairsButtonVisibility: () => {},
    });

    const rows = Array.from(document.querySelectorAll('.generator-schema-row'));
    expect(rows).toHaveLength(2);
    expect(rows[0].querySelector('[data-action="drag"]')).not.toBeNull();
    expect(rows[0].querySelector('[data-action="drag"]').getAttribute('draggable')).toBe('true');
    expect(rows[0].querySelector('[data-action="drag"]').getAttribute('aria-label')).toBe('Drag field to reorder');
    expect(rows[0].querySelector('[data-action="drag"] svg.app-icon')).not.toBeNull();
    expect(rows[0].querySelector('[data-action="add"]').getAttribute('aria-label')).toBe('Insert field after this row');
    expect(rows[0].querySelector('[data-action="remove"]').getAttribute('aria-label')).toBe('Remove field');
    expect(rows[0].querySelector('[data-action="pick-command"]')).not.toBeNull();
    expect(rows[1].querySelector('[data-field="value"]')).not.toBeNull();
    expect(rows[1].querySelector('[data-action="pick-command"]')).toBeNull();
  });

  test('row input handler normalises faker commands after edit', () => {
    const schemaRows = [{ id: '1', name: 'First', sourceType: 'faker', command: '', params: '()' }];
    const schemaSession = {
      updateRowAtIndex(index, updater) {
        schemaRows[index] = updater(schemaRows[index]);
        return schemaRows[index];
      },
    };

    document.getElementById('generatorSchemaRows').innerHTML = `
      <div class="generator-schema-row" data-row-id="1">
        <select data-field="command"><option value="faker.person.firstName" selected>faker.person.firstName</option></select>
      </div>`;
    const select = document.querySelector('[data-field="command"]');
    select.value = 'faker.person.firstName';

    handleGeneratorRowInputChange({
      event: { target: select },
      schemaRows,
      schemaSession,
      renderSchemaRows: () => {},
      updateAllPairsButtonVisibility: () => {},
    });

    expect(schemaRows[0].command).toBe('person.firstName');
  });

  test('row action handler resolves actions from nested icon targets', () => {
    renderGeneratorSchemaRows({
      documentObj: document,
      schemaRows: [{ id: '1', name: 'First', sourceType: 'faker', command: 'person.firstName', params: '()' }],
      getSchemaHelpData: () => ({ show: false }),
      updateAllPairsButtonVisibility: () => {},
    });

    const addRowAfter = jest.fn();
    const removeRow = jest.fn();
    const moveRow = jest.fn();
    const nestedIcon = document.querySelector('[data-action="add"] svg');

    handleGeneratorRowButtonClick({
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

  test('schema mode help includes sample button in both modes', () => {
    expect(buildSchemaModeHelpHtml({ inTextMode: true, generateToFileHelpUrl: 'https://example.com' })).toContain(
      'generator-schema-sample-button'
    );
    expect(buildSchemaModeHelpHtml({ inTextMode: false, generateToFileHelpUrl: 'https://example.com' })).toContain(
      'Generate To File docs'
    );
  });
});
