function createGeneratorPageComponentRuntimeSchemaCallbacks({ runtime } = {}) {
  return {
    onSchemaError: (message) => runtime.generatorSchemaRuntime?.showSchemaErrorStatus(message),
    onSchemaClear: () => runtime.generatorSchemaRuntime?.clearSchemaErrorStatus(),
    onRowsChanged: () => runtime.updateAllPairsButtonVisibility?.(),
  };
}

export { createGeneratorPageComponentRuntimeSchemaCallbacks };
