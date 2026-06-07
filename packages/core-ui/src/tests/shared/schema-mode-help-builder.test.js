import { buildSchemaModeHelpHtml } from '../../../js/gui_components/shared/test-data/help/schema-mode-help-builder.js';

describe('schema mode help builder', () => {
  test('always includes sample button and only renders optional docs link in schema mode', () => {
    expect(buildSchemaModeHelpHtml({ inTextMode: true })).toContain('shared-schema-sample-button');
    expect(buildSchemaModeHelpHtml({ inTextMode: true })).not.toContain('Generate To File docs');

    const schemaModeHtml = buildSchemaModeHelpHtml({
      inTextMode: false,
      supplementalLinkUrl: 'https://example.com',
      supplementalLinkText: 'Generate To File docs',
    });

    expect(schemaModeHtml).toContain('Generate To File docs');
    expect(schemaModeHtml).toContain('https://example.com');
    expect(schemaModeHtml.trim().endsWith('Insert Example Schema</button>')).toBe(true);
  });
});
