import {
  buildSchemaHelpModel,
  renderSchemaHelpHtml,
} from '../../../js/gui_components/shared/test-data/help/help-model-builder.js';
import { getVisibleDomainCommands } from '../../../js/gui_components/shared/test-data/help/domain-command-provider.js';

describe('help-model-builder', () => {
  test('domain-command provider exports the visible-command helper directly', () => {
    expect(typeof getVisibleDomainCommands).toBe('function');
  });

  test('builds faker command help from metadata', () => {
    const model = buildSchemaHelpModel('faker', 'person.firstName');

    expect(model.show).toBe(true);
    expect(model.kind).toBe('command');
    expect(model.heading).toBe('faker.person.firstName');
    expect(model.docsUrl).toMatch(/^https:/);
    expect(model.docsUrl).toBe('https://anywaydata.com/docs/test-data/domain/person');
    expect(model.fakerDocsUrl).toBe('https://fakerjs.dev/api/person');
    expect(model.usageExamples[0]).toEqual(
      expect.objectContaining({
        functionCall: expect.stringContaining('person.firstName'),
        sampleReturnValue: expect.any(String),
      })
    );
    expect(Object.prototype.hasOwnProperty.call(model, 'example')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(model, 'examples')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(model, 'exampleReturnValues')).toBe(false);
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
    expect(model.usageExamples[0]).toEqual(
      expect.objectContaining({
        functionCall: expect.stringContaining('string.counterString'),
        sampleReturnValue: expect.any(String),
      })
    );
    expect(Object.prototype.hasOwnProperty.call(model, 'example')).toBe(false);
    expect(renderSchemaHelpHtml(model)).toContain('delimiter');
  });

  test('builds domain help for auto-increment timestamps with step metadata', () => {
    const model = buildSchemaHelpModel('domain', 'autoIncrement.timestamp');

    expect(model.show).toBe(true);
    expect(model.heading).toContain('autoIncrement.timestamp');
    expect(renderSchemaHelpHtml(model)).toContain('run start time');
    expect(renderSchemaHelpHtml(model)).toContain('outputFormat');
  });

  test('preserves custom domain docs links and parameters for auto increment help', () => {
    const model = buildSchemaHelpModel('domain', 'autoIncrement.sequence');

    expect(model.docsUrl).toBe('https://anywaydata.com/docs/test-data/auto-increment-sequences');
    expect(model.params.map((param) => param.name)).toEqual(['start', 'step', 'prefix', 'suffix', 'zeropadding']);
    expect(model.params.map((param) => param.optional)).toEqual([true, true, true, true, true]);
    expect(model.params.map((param) => param.defaultValue)).toEqual(['1', '1', '', '', '0']);
    expect(renderSchemaHelpHtml(model)).toContain('accepted row');
    expect(renderSchemaHelpHtml(model)).toContain('zeropadding');
  });

  test('keeps documented params for datatype.enum domain help', () => {
    const model = buildSchemaHelpModel('domain', 'datatype.enum');

    expect(model.params).toEqual([
      expect.objectContaining({
        name: 'values',
        variadic: true,
        optional: false,
      }),
    ]);
    expect(renderSchemaHelpHtml(model)).toContain('Schema params field');
    expect(renderSchemaHelpHtml(model)).toContain('values');
  });

  test('maps faker helpers docs link to anywaydata faker helpers docs', () => {
    const model = buildSchemaHelpModel('faker', 'helpers.fake');
    expect(model.docsUrl).toBe('https://anywaydata.com/docs/test-data/faker/helpers');
    expect(model.fakerDocsUrl).toBe('');
  });

  test('keeps config-authored docs urls without runtime localization', () => {
    const model = buildSchemaHelpModel('faker', 'helpers.fake');
    expect(model.docsUrl).toBe('https://anywaydata.com/docs/test-data/faker/helpers');
  });
});
