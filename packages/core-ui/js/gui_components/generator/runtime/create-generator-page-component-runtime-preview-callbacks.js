function createGeneratorPageComponentRuntimePreviewCallbacks({ runtime } = {}) {
  return {
    onPreview: () => runtime.previewData(),
  };
}

export { createGeneratorPageComponentRuntimePreviewCallbacks };
