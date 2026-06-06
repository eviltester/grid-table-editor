import { createGeneratorRuntimeActionsDependencies } from './create-generator-runtime-actions-dependencies.js';
import { createGeneratorRuntimeViewStateDependencies } from './create-generator-runtime-view-state-dependencies.js';

function createGeneratorRuntimeInteractionDependencies({
  runtime,
  DownloadClass,
  faker,
  RandExp,
  createUnavailableRowCountResult,
} = {}) {
  const generatorViewState = createGeneratorRuntimeViewStateDependencies({
    runtime,
    createUnavailableRowCountResult,
  });

  const generatorRuntimeActions = createGeneratorRuntimeActionsDependencies({
    runtime,
    DownloadClass,
    faker,
    RandExp,
  });

  return {
    generatorViewState,
    generatorRuntimeActions,
  };
}

export { createGeneratorRuntimeInteractionDependencies };
