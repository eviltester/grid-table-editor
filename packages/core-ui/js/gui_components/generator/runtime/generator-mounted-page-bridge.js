function createGeneratorMountedPageBridge() {
  return {
    connectMountedPage({ generatorPage, ExporterClass, getPreviewGrid } = {}) {
      const mountedFeatures = {
        schemaErrorDisplay: generatorPage?.getSchemaErrorDisplay?.(),
        generatorControls: generatorPage?.getGeneratorControls?.(),
        generatorPreview: generatorPage?.getGeneratorPreview?.(),
        schemaDefinition: generatorPage?.getSchemaDefinition?.(),
      };

      mountedFeatures.exporter = new ExporterClass(getPreviewGrid?.() || null);

      return mountedFeatures;
    },

    initializeMountedPage({ renderSchemaRows, syncInitialFormatState } = {}) {
      renderSchemaRows?.();
      syncInitialFormatState?.();
    },
  };
}

export { createGeneratorMountedPageBridge };
