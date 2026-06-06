import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorSchemaDefinitionProps } from '../../../js/gui_components/generator/runtime/create-generator-schema-definition-props.js';

describe('createGeneratorSchemaDefinitionProps', () => {
  test('builds the schema-definition props subtree around shared schema support contracts', () => {
    const onRowsChanged = jest.fn();
    const generatorSchemaDefinitionSupport = {
      createBlankRow: jest.fn(() => ({ id: 'row-1' })),
      mapRuleToRow: jest.fn(),
      getMethodPickerOptions: jest.fn(() => []),
      getVisibleDomainCommands: jest.fn(() => []),
      buildModeHelpHtml: jest.fn(() => '<p>schema mode</p>'),
      validateSchemaRows: jest.fn((rows) => ({ rows, errors: [] })),
    };

    const props = createGeneratorSchemaDefinitionProps({
      schemaTextToDataRules: jest.fn(),
      dataRulesToSchemaText: jest.fn(),
      faker: {},
      RandExp: function RandExp() {},
      generatorSchemaDefinitionSupport,
      fakerCommands: ['helpers.arrayElement'],
      sampleSchemaText: 'Name\nliteral(Alice)',
      onRowsChanged,
    });

    expect(props.createBlankRow).toBe(generatorSchemaDefinitionSupport.createBlankRow);
    expect(props.fakerCommands).toEqual(['helpers.arrayElement']);
    expect(props.sampleSchemaText).toBe('Name\nliteral(Alice)');
    expect(props.sectionClassName).toBe('shared-schema-definition-shell shared-schema-section');
    expect(props.headingClassName).toBe('shared-schema-heading');
    expect(props.errorClassName).toBe('shared-schema-error');
    expect(props.helpGroupClassName).toBe('shared-schema-button-with-help');
    expect(props.rowsClassName).toBe('shared-schema-rows');
    expect(props.textContainerClassName).toBe('shared-schema-text');
    expect(props.footerClassName).toBe('shared-schema-footer');
    expect(props.ids).toBeUndefined();

    props.updatePairwiseButtonVisibility();

    expect(onRowsChanged).toHaveBeenCalledTimes(1);
  });
});
