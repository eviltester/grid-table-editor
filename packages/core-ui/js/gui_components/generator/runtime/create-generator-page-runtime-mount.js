import { createGeneratorPageComponent } from '../page/create-generator-page-component.js';
import { createGeneratorMountedPageState } from './create-generator-mounted-page-state.js';
import { createGeneratorMountedPageStartupSync } from './create-generator-mounted-page-startup-sync.js';
import { createGeneratorPageRuntimeConfig } from './create-generator-page-runtime-config.js';

function createGeneratorPageRuntimeMount({
  runtime,
  createPageComponent = createGeneratorPageComponent,
  createPageRuntimeConfig = createGeneratorPageRuntimeConfig,
  createMountedPageState = createGeneratorMountedPageState,
  createMountedPageStartupSync = createGeneratorMountedPageStartupSync,
} = {}) {
  const pageComponentConfig = createPageRuntimeConfig({
    runtime,
  });

  const generatorPage = createPageComponent({
    root: runtime.parentElement,
    documentObj: runtime.documentObj,
    ...pageComponentConfig,
  });

  const mountedState = createMountedPageState({
    runtime,
    generatorPage,
  });

  const runMountedPageStartupSync = createMountedPageStartupSync({
    runtime,
  });
  runMountedPageStartupSync();

  return mountedState;
}

export { createGeneratorPageRuntimeMount };
