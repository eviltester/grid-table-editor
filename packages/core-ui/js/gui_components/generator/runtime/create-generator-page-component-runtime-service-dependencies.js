function createGeneratorPageComponentRuntimeServiceDependencies({ runtime } = {}) {
  return {
    getExporter: () => runtime.exporter,
    TabulatorCtor: runtime.TabulatorCtor,
    GridExtensionClass: runtime.GridExtensionClass,
  };
}

export { createGeneratorPageComponentRuntimeServiceDependencies };
