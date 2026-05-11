import { createApiService } from './api-service.js';

function createConcreteService({ unsafeEnabled = false } = {}) {
  const state = { formatDefaultOptions: new Map(), formatCustomTips: new Map() };
  let globalUnsafe = unsafeEnabled;
  const service = createApiService({
    state,
    getGlobalUnsafeFakerEnabled: () => globalUnsafe,
    logger: console,
  });

  return {
    service,
    state,
    setGlobalUnsafe: (value) => {
      globalUnsafe = value;
    },
  };
}

export { createConcreteService };
