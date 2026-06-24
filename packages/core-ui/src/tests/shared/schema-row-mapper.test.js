import {
  mapDataRuleToSchemaRow,
  mapDataRuleToGridRow,
  mapGridRowToSchemaRow,
  preservePreviousMethodLikeSourceType,
  applySchemaSourceTypeChange,
  applySchemaCommandSelection,
} from '../../../js/gui_components/shared/test-data/schema/schema-row-mapper.js';

describe('schema-row-mapper', () => {
  test('maps parsed faker and literal rules into shared schema rows', () => {
    const fakerRow = mapDataRuleToSchemaRow({ type: 'faker', name: 'First', ruleSpec: 'person.firstName(sex="male")' });
    const literalRow = mapDataRuleToSchemaRow({ type: 'literal', name: 'Fixed', ruleSpec: 'literal("")' });
    const enumRow = mapDataRuleToSchemaRow({
      type: 'enum',
      name: 'Status',
      ruleSpec: 'datatype.enum(active,inactive)',
    });

    expect(fakerRow).toMatchObject({
      name: 'First',
      sourceType: 'faker',
      command: 'person.firstName',
      params: '(sex="male")',
      value: '',
    });
    expect(literalRow).toMatchObject({
      name: 'Fixed',
      sourceType: 'literal',
      value: '',
    });
    expect(enumRow).toMatchObject({
      name: 'Status',
      sourceType: 'enum',
      value: 'active,inactive',
    });
  });

  test('maps parsed domain rules into grid rows', () => {
    const row = mapDataRuleToGridRow({
      type: 'domain',
      name: 'Element',
      ruleSpec: 'science.chemicalElement.name',
      comments: 'docs',
    });

    expect(row).toEqual({
      columnName: 'Element',
      comments: 'docs',
      leadingTextLines: [],
      type: 'chemicalElement.name',
      value: '',
    });
  });

  test('maps grid rows back into schema rows for faker and enum types', () => {
    expect(
      mapGridRowToSchemaRow(
        { columnName: 'First', type: 'person.firstName', value: '(sex="male")' },
        {
          FAKER_SECTION_VALUE: 'faker',
          DOMAIN_SECTION_VALUE: 'domain',
          FAKER_COMMANDS: ['person.firstName'],
          DOMAIN_COMMANDS: ['chemicalElement.name'],
        }
      )
    ).toEqual({
      name: 'First',
      sourceType: 'faker',
      command: 'person.firstName',
      params: '(sex="male")',
    });

    expect(
      mapGridRowToSchemaRow(
        { columnName: 'Status', type: 'enum', value: 'enum(active,inactive)' },
        {
          FAKER_SECTION_VALUE: 'faker',
          DOMAIN_SECTION_VALUE: 'domain',
          FAKER_COMMANDS: ['person.firstName'],
          DOMAIN_COMMANDS: ['chemicalElement.name'],
        }
      )
    ).toEqual({
      name: 'Status',
      sourceType: 'enum',
      value: 'enum(active,inactive)',
    });

    expect(
      mapGridRowToSchemaRow(
        { columnName: 'Status', type: 'datatype.enum', value: 'active,inactive,pending' },
        {
          FAKER_SECTION_VALUE: 'faker',
          DOMAIN_SECTION_VALUE: 'domain',
          FAKER_COMMANDS: ['person.firstName'],
          DOMAIN_COMMANDS: ['chemicalElement.name', 'datatype.enum'],
        }
      )
    ).toEqual({
      name: 'Status',
      sourceType: 'domain',
      command: 'datatype.enum',
      params: 'active,inactive,pending',
    });
  });

  test('preserves previous domain type for invalid method-like text rules', () => {
    const preservedRow = preservePreviousMethodLikeSourceType({
      row: {
        name: 'Name',
        sourceType: 'regex',
        command: '',
        params: '',
        value: 'person.fullNam',
      },
      previousRow: {
        name: 'Name',
        sourceType: 'domain',
        command: 'person.fullName',
        params: '',
      },
      rawRuleSpec: 'person.fullNam',
    });

    expect(preservedRow).toMatchObject({
      name: 'Name',
      sourceType: 'domain',
      command: 'person.fullNam',
      params: '',
      value: '',
    });
  });

  test('preserves previous faker type and params for invalid method-like text rules', () => {
    const preservedRow = preservePreviousMethodLikeSourceType({
      row: {
        name: 'Value',
        sourceType: 'regex',
        command: '',
        params: '',
        value: 'helpers.arrayElemnt(["A","B"])',
      },
      previousRow: {
        name: 'Value',
        sourceType: 'faker',
        command: 'helpers.arrayElement',
        params: '(["A","B"])',
      },
      rawRuleSpec: 'helpers.arrayElemnt(["A","B"])',
    });

    expect(preservedRow).toMatchObject({
      name: 'Value',
      sourceType: 'faker',
      command: 'helpers.arrayElemnt',
      params: '(["A","B"])',
      value: '',
    });
  });

  test('migrates datatype.enum params back into value when switching to enum source type', () => {
    const nextRow = applySchemaSourceTypeChange(
      {
        name: 'Status',
        sourceType: 'domain',
        command: 'datatype.enum',
        params: 'active,inactive,pending',
        value: '',
      },
      'enum'
    );

    expect(nextRow).toMatchObject({
      sourceType: 'enum',
      command: 'datatype.enum',
      params: 'active,inactive,pending',
      value: 'active,inactive,pending',
    });
  });

  test('clears stale semantic validation when switching source type', () => {
    const nextRow = applySchemaSourceTypeChange(
      {
        name: 'Pattern',
        sourceType: 'regex',
        command: '',
        params: '',
        value: '(',
        semanticValidationIssues: [
          {
            code: 'compiler_validation_error',
            field: 'value',
            message: 'Row 1: invalid regex value - unterminated group',
          },
        ],
        validation: {
          valid: false,
          issues: [
            {
              code: 'compiler_validation_error',
              field: 'value',
              message: 'Row 1: invalid regex value - unterminated group',
            },
          ],
          message: 'Row 1: invalid regex value - unterminated group',
        },
      },
      'enum'
    );

    expect(nextRow).toMatchObject({
      sourceType: 'enum',
      semanticValidationIssues: [],
      validation: {
        valid: true,
        issues: [],
        message: '',
      },
    });
  });

  test('migrates enum value into datatype.enum params when command is selected', () => {
    const nextRow = applySchemaCommandSelection(
      {
        name: 'Status',
        sourceType: 'domain',
        command: '',
        params: '',
        value: 'active,inactive,pending',
      },
      {
        sourceType: 'domain',
        command: 'datatype.enum',
      }
    );

    expect(nextRow).toMatchObject({
      sourceType: 'domain',
      command: 'datatype.enum',
      params: 'active,inactive,pending',
      value: '',
    });
  });

  test('clears stale params when switching to a different command', () => {
    const nextRow = applySchemaCommandSelection(
      {
        name: 'Status',
        sourceType: 'domain',
        command: 'string.alpha',
        params: '(length=12)',
        value: '',
      },
      {
        sourceType: 'domain',
        command: 'internet.email',
      }
    );

    expect(nextRow).toMatchObject({
      sourceType: 'domain',
      command: 'internet.email',
      params: '',
      value: '',
    });
  });
});
