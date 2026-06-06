import { createGeneratorPageRuntimeMount } from './create-generator-page-runtime-mount.js';

function createGeneratorPageRuntimeMountFactory({ createPageRuntimeMountFn = createGeneratorPageRuntimeMount } = {}) {
  return ({ runtime } = {}) =>
    createPageRuntimeMountFn({
      runtime,
    });
}

export { createGeneratorPageRuntimeMountFactory };
