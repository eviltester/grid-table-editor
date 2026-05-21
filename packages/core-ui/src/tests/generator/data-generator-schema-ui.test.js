import { JSDOM } from 'jsdom';
import {
  renderGeneratorSchemaRows,
  handleGeneratorRowInputChange,
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

  test('renders command select for faker rows and value input for literal rows', () => {
    renderGeneratorSchemaRows({
      documentObj: document,
      schemaRows: [
        { id: '1', name: 'First', sourceType: 'faker', command: 'person.firstName', params: '()' },
        { id: '2', name: 'Fixed', sourceType: 'literal', value: 'x' },
      ],
      fakerCommands: ['person.firstName'],
      getVisibleDomainCommands: () => ['string.uuid'],
      getSchemaHelpData: () => ({ show: true, docsUrl: 'https://example.com', title: 'help', html: '<p>help</p>' }),
      updateAllPairsButtonVisibility: () => {},
    });

    const rows = Array.from(document.querySelectorAll('.generator-schema-row'));
    expect(rows).toHaveLength(2);
    expect(rows[0].querySelector('[data-field="command"]')).not.toBeNull();
    expect(rows[1].querySelector('[data-field="value"]')).not.toBeNull();
    expect(rows[1].querySelector('[data-field="command"]')).toBeNull();
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

  test('schema mode help includes sample button in both modes', () => {
    expect(buildSchemaModeHelpHtml({ inTextMode: true, generateToFileHelpUrl: 'https://example.com' })).toContain(
      'generator-schema-sample-button'
    );
    expect(buildSchemaModeHelpHtml({ inTextMode: false, generateToFileHelpUrl: 'https://example.com' })).toContain(
      'Generate To File docs'
    );
  });
});
