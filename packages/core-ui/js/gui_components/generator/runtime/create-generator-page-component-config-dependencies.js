import { createGeneratorPageComponentProps } from './create-generator-page-component-props.js';
import { createGeneratorPageComponentServices } from './create-generator-page-component-services.js';

function createGeneratorPageComponentConfigDependencies({
  schemaTextToDataRules,
  dataRulesToSchemaText,
  faker,
  RandExp,
  generatorSchemaDefinitionSupport,
  fakerCommands = [],
  sampleSchemaText = '',
  getExporter,
  TabulatorCtor,
  GridExtensionClass,
  onRowsChanged,
} = {}) {
  return {
    props: createGeneratorPageComponentProps({
      schemaTextToDataRules,
      dataRulesToSchemaText,
      faker,
      RandExp,
      generatorSchemaDefinitionSupport,
      fakerCommands,
      sampleSchemaText,
      onRowsChanged,
    }),
    services: createGeneratorPageComponentServices({
      getExporter,
      TabulatorCtor,
      GridExtensionClass,
    }),
  };
}

export { createGeneratorPageComponentConfigDependencies };
