import {
  buildSchemaHelpModel,
  renderSchemaHelpHtml,
} from '../../../js/gui_components/shared/test-data/help/help-model-builder.js';

describe('help-model-builder', () => {
  test('builds faker command help from metadata', () => {
    const model = buildSchemaHelpModel('faker', 'person.firstName');

    expect(model.show).toBe(true);
    expect(model.kind).toBe('command');
    expect(model.heading).toBe('faker.person.firstName');
    expect(model.docsUrl).toMatch(/^https:/);
    expect(renderSchemaHelpHtml(model)).toContain('faker.person.firstName');
  });

  test('builds literal type help with params and example guidance', () => {
    const model = buildSchemaHelpModel('literal', '');

    expect(model).toMatchObject({
      show: true,
      kind: 'type',
      heading: 'Literal',
    });
    expect(Array.isArray(model.params)).toBe(true);
    expect(model.params[0]).toMatchObject({
      name: 'value',
      type: 'string',
      optional: false,
    });
    expect(model.example).toContain('literal(');
    expect(renderSchemaHelpHtml(model)).toContain('Literal');
    expect(renderSchemaHelpHtml(model)).toContain('Schema params field');
    expect(renderSchemaHelpHtml(model)).toContain('Learn more');
  });

  test('builds enum and regex type help with parameter descriptions and examples', () => {
    const enumModel = buildSchemaHelpModel('enum', '');
    expect(enumModel.params[0]).toMatchObject({
      name: 'values',
      optional: false,
    });
    expect(enumModel.example).toBe('enum active,inactive,pending');
    expect(renderSchemaHelpHtml(enumModel)).toContain('allowed values');

    const regexModel = buildSchemaHelpModel('regex', '');
    expect(regexModel.params[0]).toMatchObject({
      name: 'pattern',
      optional: false,
    });
    expect(regexModel.example).toContain('regex(');
    expect(renderSchemaHelpHtml(regexModel)).toContain('regular expression');
  });

  test('builds domain command help from keyword definitions', () => {
    const model = buildSchemaHelpModel('domain', 'string.counterString');

    expect(model.show).toBe(true);
    expect(model.kind).toBe('command');
    expect(model.heading).toContain('counterString');
    expect(renderSchemaHelpHtml(model)).toContain('delimiter');
  });

  test('maps faker helpers docs link to anywaydata faker helpers docs', () => {
    const model = buildSchemaHelpModel('faker', 'helpers.fake');
    expect(model.docsUrl).toBe('https://anywaydata.com/docs/test-data/faker/helpers');
  });
});
