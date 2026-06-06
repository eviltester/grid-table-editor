const STORY_ARTIFACT_SELECTORS = [
  '#confirm-modal-backdrop',
  '#text-input-modal-backdrop',
  '[data-role="method-picker-overlay"]',
  '.tippy-box',
  '.tippy-popper',
  '#inline-help-items',
];

const activeStoryCleanups = new Set();

function getDefaultDocumentObj() {
  return typeof document !== 'undefined' ? document : null;
}

function runActiveStoryCleanup() {
  if (activeStoryCleanups.size === 0) {
    return;
  }
  const cleanups = Array.from(activeStoryCleanups);
  activeStoryCleanups.clear();
  cleanups.forEach((cleanup) => cleanup?.());
}

function destroyTippyInstances(documentObj = getDefaultDocumentObj()) {
  if (!documentObj?.querySelectorAll) {
    return;
  }

  documentObj.querySelectorAll('*').forEach((element) => {
    try {
      element?._tippy?.destroy?.();
    } catch {
      // ignore cleanup-time tooltip teardown failures
    }
  });
}

function removeStoryArtifacts(documentObj = getDefaultDocumentObj()) {
  if (!documentObj) {
    return;
  }

  STORY_ARTIFACT_SELECTORS.forEach((selector) => {
    documentObj.querySelectorAll(selector).forEach((element) => element.remove());
  });
}

function cleanupStoryEnvironment(documentObj = getDefaultDocumentObj()) {
  destroyTippyInstances(documentObj);
  runActiveStoryCleanup();
  removeStoryArtifacts(documentObj);
}

function buildElementCleanup(element) {
  if (!element) {
    return null;
  }

  return () => {
    element.__storybookCleanup?.();
    element.remove?.();
  };
}

function registerStoryCleanup(storyResult, documentObj = getDefaultDocumentObj()) {
  if (!storyResult) {
    activeStoryCleanups.add(() => removeStoryArtifacts(documentObj));
    return storyResult;
  }

  if (typeof storyResult.then === 'function') {
    return storyResult.then((resolvedResult) => registerStoryCleanup(resolvedResult, documentObj));
  }

  const elementCleanup =
    storyResult?.nodeType === 1
      ? buildElementCleanup(storyResult)
      : typeof storyResult?.__storybookCleanup === 'function'
        ? () => storyResult.__storybookCleanup()
        : null;

  activeStoryCleanups.add(() => {
    elementCleanup?.();
    removeStoryArtifacts(documentObj);
  });

  return storyResult;
}

function renderStoryWithCleanup(storyFn, documentObj = getDefaultDocumentObj(), { cleanupExisting = true } = {}) {
  if (cleanupExisting) {
    cleanupStoryEnvironment(documentObj);
  }
  return registerStoryCleanup(typeof storyFn === 'function' ? storyFn() : storyFn, documentObj);
}

export {
  STORY_ARTIFACT_SELECTORS,
  cleanupStoryEnvironment,
  destroyTippyInstances,
  registerStoryCleanup,
  renderStoryWithCleanup,
  removeStoryArtifacts,
  runActiveStoryCleanup,
};
