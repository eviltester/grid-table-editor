import { createGeneratorControlsCallbacks } from './create-generator-controls-callbacks.js';
import { createGeneratorPreviewCallbacks } from './create-generator-preview-callbacks.js';
import { createGeneratorSchemaDefinitionCallbacks } from './create-generator-schema-definition-callbacks.js';

function createGeneratorPageComponentCallbacks({
  onApplyOptions,
  onGenerateData,
  onGeneratePairwise,
  onPreview,
  onRenderOutputPreview,
  onSchemaError,
  onSchemaClear,
  onRowsChanged,
} = {}) {
  return {
    generatorControls: createGeneratorControlsCallbacks({
      onApplyOptions,
      onGenerateData,
      onGeneratePairwise,
      onRenderOutputPreview,
    }),
    generatorPreview: createGeneratorPreviewCallbacks({
      onPreview,
    }),
    schemaDefinition: createGeneratorSchemaDefinitionCallbacks({
      onSchemaError,
      onSchemaClear,
      onRowsChanged,
    }),
  };
}

export { createGeneratorPageComponentCallbacks };
