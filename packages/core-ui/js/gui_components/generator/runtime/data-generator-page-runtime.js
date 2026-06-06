/*
 * Responsibilities:
 * - Generator-page runtime orchestration for the standalone generator page.
 * - Coordinates mounted and unmounted runtime factories while keeping page behavior testable.
 */

import { createUninitializedGeneratorRuntime } from './create-generator-runtime-instance.js';
import { createGeneratorRuntimeFactoryInputs } from './create-generator-runtime-factory-inputs.js';

function createUninitializedDataGeneratorPage(options = {}) {
  return createUninitializedGeneratorRuntime({
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
