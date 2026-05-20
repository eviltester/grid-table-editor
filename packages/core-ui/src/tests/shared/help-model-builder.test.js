import {
  buildSchemaHelpModel,
  renderSchemaHelpHtml,
} from '../../../js/gui_components/shared/test-data/help-model-builder.js';

describe('help-model-builder', () => {
  test('builds faker command help from metadata', () => {
    const model = buildSchemaHelpModel('faker', 'person.firstName');

    expect(model.show).toBe(true);
    expect(model.kind).toBe('command');
    expect(model.heading).toBe('faker.person.firstName');
    expect(model.docsUrl).toMatch(/^https:/);
    expect(renderSchemaHelpHtml(model)).toContain('faker.person.firstName');
  });

  test('builds literal type help without command params', () => {
    const model = buildSchemaHelpModel('literal', '');

    expect(model).toMatchObject({
      show: true,
      kind: 'type',
      heading: 'Literal',
    });
    expect(renderSchemaHelpHtml(model)).toContain('Literal');
    expect(renderSchemaHelpHtml(model)).toContain('Learn more');
  });

  test('builds domain command help from keyword definitions', () => {
    const model = buildSchemaHelpModel('domain', 'string.counterString');

    expect(model.show).toBe(true);
    expect(model.kind).toBe('command');
    expect(model.heading).toContain('counterString');
    expect(renderSchemaHelpHtml(model)).toContain('delimiter');
  });
});
