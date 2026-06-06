import { createGeneratorPageComponentConfigInputs } from './create-generator-page-component-config-inputs.js';
import { createGeneratorPageComponentConfig } from './create-generator-page-component-config.js';

function createGeneratorPageComponentRuntimeConfig({
  runtime,
  createPageComponentConfigInputs = createGeneratorPageComponentConfigInputs,
  createPageComponentConfigFn = createGeneratorPageComponentConfig,
} = {}) {
  const pageComponentConfigInputs = createPageComponentConfigInputs({
    runtime,
  });

  return createPageComponentConfigFn(pageComponentConfigInputs);
}

export { createGeneratorPageComponentRuntimeConfig };
