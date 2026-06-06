function createGeneratorMountedPageStartupSync({ runtime } = {}) {
  return function runMountedPageStartupSync() {
    runtime?.renderSchemaRows?.();
    runtime?.generatorViewState?.syncGeneratorControlsFormatState?.('csv');
  };
}

export { createGeneratorMountedPageStartupSync };
