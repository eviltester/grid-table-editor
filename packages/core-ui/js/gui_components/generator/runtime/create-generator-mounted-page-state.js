function createGeneratorMountedPageState({ runtime, generatorPage } = {}) {
  const exporter = new runtime.ExporterClass(runtime.generatorViewState.getPreviewGrid() || null);
  const mountedState = {
    generatorPage,
    exporter,
    schemaErrorDisplay: generatorPage?.getSchemaErrorDisplay?.(),
    generatorControls: generatorPage?.getGeneratorControls?.(),
    generatorPreview: generatorPage?.getGeneratorPreview?.(),
    schemaDefinition: generatorPage?.getSchemaDefinition?.(),
  };

  Object.assign(runtime, mountedState);

  return mountedState;
}

export { createGeneratorMountedPageState };
