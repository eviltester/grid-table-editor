import { createGeneratorControlsProps } from './create-generator-controls-props.js';
import { createGeneratorPreviewProps } from './create-generator-preview-props.js';
import { createGeneratorSchemaDefinitionProps } from './create-generator-schema-definition-props.js';

function createGeneratorPageComponentProps({
  schemaTextToDataRules,
  dataRulesToSchemaText,
  faker,
  RandExp,
  generatorSchemaDefinitionSupport,
  fakerCommands = [],
  sampleSchemaText = '',
  onRowsChanged,
} = {}) {
  return {
    controlsProps: createGeneratorControlsProps(),
    previewProps: createGeneratorPreviewProps(),
    schemaDefinitionProps: createGeneratorSchemaDefinitionProps({
      schemaTextToDataRules,
      dataRulesToSchemaText,
      faker,
      RandExp,
      generatorSchemaDefinitionSupport,
      fakerCommands,
      sampleSchemaText,
      onRowsChanged,
    }),
  };
}

export { createGeneratorPageComponentProps };
