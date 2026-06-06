function createGeneratorControlsCallbacks({
  onApplyOptions,
  onGenerateData,
  onGeneratePairwise,
  onRenderOutputPreview,
} = {}) {
  return {
    onFormatChanged: () => {
      onRenderOutputPreview?.();
    },
    onApplyOptions: ({ sanitized }) => {
      onApplyOptions?.(sanitized);
    },
    onGenerateData: () => {
      onGenerateData?.();
    },
    onGeneratePairwise: () => {
      onGeneratePairwise?.();
    },
  };
}

export { createGeneratorControlsCallbacks };
