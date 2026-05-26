import {
  mapDataRuleToGridRow,
  mapGridRowToSchemaRow,
} from '../../../../js/gui_components/app/test-data-grid/schema/test-data-grid-schema-row-mappers.js';

describe('test-data-grid schema row mappers', () => {
  const mapperContext = {
    FAKER_SECTION_VALUE: 'faker',
    DOMAIN_SECTION_VALUE: 'domain',
    FAKER_COMMANDS: ['person.firstName'],
    DOMAIN_COMMANDS: ['string.counterString'],
  };

  test('maps domain rule to grid row', () => {
    const row = mapDataRuleToGridRow({
      name: 'c1',
      type: 'domain',
      ruleSpec: 'string.counterString(1,5)',
      comments: '',
    });
    expect(row).toMatchObject({
      columnName: 'c1',
      type: 'string.counterString',
      value: '(1,5)',
    });
  });

  test('maps literal rule to grid row', () => {
    const row = mapDataRuleToGridRow({
      name: 'lit',
      type: 'literal',
      ruleSpec: 'literal(ABC)',
      comments: '',
    });
    expect(row).toMatchObject({
      columnName: 'lit',
      type: 'literal',
      value: 'ABC',
    });
  });

  test('maps grid row faker command to schema row', () => {
    const schemaRow = mapGridRowToSchemaRow(
      {
        columnName: 'first',
        type: 'person.firstName',
        value: '',
      },
      mapperContext
    );
    expect(schemaRow).toEqual({
      name: 'first',
      sourceType: 'faker',
      command: 'person.firstName',
      params: '',
    });
  });

  test('maps grid row enum to schema row', () => {
    const schemaRow = mapGridRowToSchemaRow(
      {
        columnName: 'status',
        type: 'enum',
        value: 'a,b',
      },
      mapperContext
    );
    expect(schemaRow).toEqual({
      name: 'status',
      sourceType: 'enum',
      value: 'a,b',
    });
  });
});
