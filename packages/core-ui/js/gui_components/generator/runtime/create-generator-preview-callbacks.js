function createGeneratorPreviewCallbacks({ onPreview } = {}) {
  return {
    onPreview: () => onPreview?.(),
  };
}

export { createGeneratorPreviewCallbacks };
