import { createGeneratorPageComponentRuntimeSchemaDependencies } from './create-generator-page-component-runtime-schema-dependencies.js';
import { createGeneratorPageComponentRuntimeServiceDependencies } from './create-generator-page-component-runtime-service-dependencies.js';

function createGeneratorPageComponentRuntimeDependencies({
  runtime,
  createRuntimeSchemaDependencies = createGeneratorPageComponentRuntimeSchemaDependencies,
  createRuntimeServiceDependencies = createGeneratorPageComponentRuntimeServiceDependencies,
} = {}) {
  return {
    ...createRuntimeSchemaDependencies({
      runtime,
    }),
    ...createRuntimeServiceDependencies({
      runtime,
    }),
  };
}

export { createGeneratorPageComponentRuntimeDependencies };
