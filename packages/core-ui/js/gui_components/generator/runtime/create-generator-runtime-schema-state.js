function defineGeneratorRuntimeSchemaState(runtime, { getRuntime } = {}) {
  Object.defineProperties(runtime, {
    schemaRows: {
      get() {
        return getRuntime().generatorSchemaState.getRows();
      },
      set(rows) {
        getRuntime().generatorSchemaState.setRows(rows);
      },
      enumerable: true,
      configurable: true,
    },
    schemaTextTokens: {
      get() {
        return getRuntime().generatorSchemaState.getTokens();
      },
      set(tokens) {
        getRuntime().generatorSchemaState.setTokens(tokens);
      },
      enumerable: true,
      configurable: true,
    },
    isTextMode: {
      get() {
        return getRuntime().generatorSchemaState.getTextMode();
      },
      set(isTextMode) {
        getRuntime().generatorSchemaState.setTextMode(isTextMode);
      },
      enumerable: true,
      configurable: true,
    },
  });
}

export { defineGeneratorRuntimeSchemaState };
