import {
  mapDataRuleToSchemaRow,
  mapDataRuleToGridRow,
  mapGridRowToSchemaRow,
} from '../../../js/gui_components/shared/test-data/schema-row-mapper.js';

describe('schema-row-mapper', () => {
  test('maps parsed faker and literal rules into shared schema rows', () => {
    const fakerRow = mapDataRuleToSchemaRow({ type: 'faker', name: 'First', ruleSpec: 'person.firstName(sex="male")' });
    const literalRow = mapDataRuleToSchemaRow({ type: 'literal', name: 'Fixed', ruleSpec: 'literal("")' });

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
  });
});
