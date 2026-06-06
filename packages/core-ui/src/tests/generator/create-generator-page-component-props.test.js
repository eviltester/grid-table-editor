import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorPageComponentProps } from '../../../js/gui_components/generator/runtime/create-generator-page-component-props.js';

describe('createGeneratorPageComponentProps', () => {
  test('builds the generator page props tree around the schema-definition props subtree', () => {
    const generatorSchemaDefinitionSupport = {
      createBlankRow: jest.fn(() => ({ id: 'row-1' })),
      mapRuleToRow: jest.fn(),
      getMethodPickerOptions: jest.fn(() => []),
      getVisibleDomainCommands: jest.fn(() => []),
      buildModeHelpHtml: jest.fn(() => '<p>schema mode</p>'),
      validateSchemaRows: jest.fn((rows) => ({ rows, errors: [] })),
    };

    const props = createGeneratorPageComponentProps({
      schemaTextToDataRules: jest.fn(),
      dataRulesToSchemaText: jest.fn(),
      faker: {},
      RandExp: function RandExp() {},
      generatorSchemaDefinitionSupport,
      fakerCommands: ['helpers.arrayElement'],
      sampleSchemaText: 'Name\nliteral(Alice)',
      onRowsChanged: jest.fn(),
    });

    expect(props.controlsProps.selectedFormat).toBe('csv');
    expect(props.previewProps.outputPreviewText).toBe('');
    expect(props.schemaDefinitionProps.createBlankRow).toBe(generatorSchemaDefinitionSupport.createBlankRow);
    expect(props.schemaDefinitionProps.fakerCommands).toEqual(['helpers.arrayElement']);
    expect(props.schemaDefinitionProps.sampleSchemaText).toBe('Name\nliteral(Alice)');
  });
});
