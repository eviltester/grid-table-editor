/*
 * Responsibilities:
 * - Generator-page orchestration for the standalone generator page.
 * - Coordinates mounted and unmounted page factories while keeping page behavior testable.
 */

import { createGeneratorPageDefaults } from './create-generator-page-defaults.js';
import { createGeneratorPageService } from './generator-page-service.js';

function createUninitializedDataGeneratorPage(options = {}) {
  return createGeneratorPageService({
    options,
    ...createGeneratorPageDefaults(),
  });
}

function createDataGeneratorPage(options = {}) {
  const page = createUninitializedDataGeneratorPage(options);
  page.init();
  return page;
}

export { createUninitializedDataGeneratorPage, createDataGeneratorPage };
