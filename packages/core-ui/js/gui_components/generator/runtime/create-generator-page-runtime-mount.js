import { createGeneratorPageComponent } from '../page/create-generator-page-component.js';
import { createGeneratorMountedPageState } from './create-generator-mounted-page-state.js';
import { createGeneratorMountedPageStartupSync } from './create-generator-mounted-page-startup-sync.js';
import { createGeneratorPageComponentRuntimeConfig } from './create-generator-page-component-runtime-config.js';

function createGeneratorPageRuntimeMount({
  runtime,
  createPageComponent = createGeneratorPageComponent,
  createPageComponentRuntimeConfig = createGeneratorPageComponentRuntimeConfig,
  createMountedPageState = createGeneratorMountedPageState,
  createMountedPageStartupSync = createGeneratorMountedPageStartupSync,
} = {}) {
  const pageComponentConfig = createPageComponentRuntimeConfig({
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
