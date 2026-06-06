function createGeneratorMountedPageBridge() {
  return {
    connectMountedPage({ generatorPage } = {}) {
      return {
        schemaErrorDisplay: generatorPage?.getSchemaErrorDisplay?.(),
        generatorControls: generatorPage?.getGeneratorControls?.(),
        generatorPreview: generatorPage?.getGeneratorPreview?.(),
        schemaDefinition: generatorPage?.getSchemaDefinition?.(),
      };
    },
  };
}

export { createGeneratorMountedPageBridge };
