import { createGeneratorRuntimeActionsService } from './create-generator-runtime-actions-service.js';
import { createGeneratorRuntimeViewState } from './create-generator-runtime-view-state.js';

function createGeneratorRuntimeInteractionServices({
  runtime,
  DownloadClass,
  faker,
  RandExp,
  createUnavailableRowCountResult,
} = {}) {
  const generatorViewState = createGeneratorRuntimeViewState({
    runtime,
    createUnavailableRowCountResult,
  });

  const generatorRuntimeActions = createGeneratorRuntimeActionsService({
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

export { createGeneratorRuntimeInteractionServices };
