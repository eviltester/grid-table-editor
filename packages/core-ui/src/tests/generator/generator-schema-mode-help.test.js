import { buildGeneratorSchemaModeHelpHtml } from '../../../js/gui_components/generator/help/index.js';

describe('generator schema mode help', () => {
  test('schema mode help includes sample button in text mode and docs copy in schema mode', () => {
    expect(
      buildGeneratorSchemaModeHelpHtml({ inTextMode: true, generateToFileHelpUrl: 'https://example.com' })
    ).toContain('shared-schema-sample-button');
    expect(
      buildGeneratorSchemaModeHelpHtml({ inTextMode: false, generateToFileHelpUrl: 'https://example.com' })
    ).toContain('Generate To File docs');
  });
});
