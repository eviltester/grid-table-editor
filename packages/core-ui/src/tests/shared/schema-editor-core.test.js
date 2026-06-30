import { validateSchemaRows } from '../../../js/gui_components/shared/test-data/schema/schema-editor-core.js';

describe('schema-editor-core', () => {
  test('keeps unsafe faker validation warnings blocking until unsafe faker is enabled', () => {
    const schemaRowsToDataRules = () => ({ dataRules: [], errors: [] });
    const row = {
      name: 'Choice',
      sourceType: 'faker',
      command: 'helpers.fake',
      params: '(faker.person.firstName())',
      semanticValidationIssues: [
        {
          code: 'compiler_validation_error',
          reasonCode: 'unsafe_faker_rule',
          field: 'params',
          line: 1,
          severity: 'warning',
          message: 'Row 1: invalid faker params - Unsafe faker rule syntax detected',
        },
      ],
    };

    expect(
      validateSchemaRows({
        schemaRows: [row],
        schemaRowsToDataRules,
        unsafeFakerExpressions: false,
      }).errors
    ).toHaveLength(1);

    expect(
      validateSchemaRows({
        schemaRows: [row],
        schemaRowsToDataRules,
        unsafeFakerExpressions: true,
      }).errors
    ).toEqual([]);
  });
});
