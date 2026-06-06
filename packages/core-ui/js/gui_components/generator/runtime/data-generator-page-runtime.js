/*
 * Responsibilities:
 * - Generator-page runtime orchestration for the standalone generator page.
 * - Coordinates mounted and unmounted runtime factories while keeping page behavior testable.
 */

import { createGeneratorRuntimeFactoryInputs } from './create-generator-runtime-factory-inputs.js';
import { createGeneratorRuntime } from './create-generator-runtime.js';

function createUninitializedDataGeneratorPage(options = {}) {
  return createGeneratorRuntime({
    options,
    ...createGeneratorRuntimeFactoryInputs(),
  });
}

function createDataGeneratorPage(options = {}) {
  const page = createUninitializedDataGeneratorPage(options);
  page.init();
  return page;
}

export { createUninitializedDataGeneratorPage, createDataGeneratorPage };
