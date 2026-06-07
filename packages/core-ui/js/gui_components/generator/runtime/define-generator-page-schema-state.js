function defineGeneratorPageSchemaState(pageService, { getPageService } = {}) {
  Object.defineProperties(pageService, {
    schemaRows: {
      get() {
        return getPageService().generatorSchemaState.getRows();
      },
      set(rows) {
        getPageService().generatorSchemaState.setRows(rows);
      },
      enumerable: true,
      configurable: true,
    },
    schemaTextTokens: {
      get() {
        return getPageService().generatorSchemaState.getTokens();
      },
      set(tokens) {
        getPageService().generatorSchemaState.setTokens(tokens);
      },
      enumerable: true,
      configurable: true,
    },
    isTextMode: {
      get() {
        return getPageService().generatorSchemaState.getTextMode();
      },
      set(isTextMode) {
        getPageService().generatorSchemaState.setTextMode(isTextMode);
      },
      enumerable: true,
      configurable: true,
    },
  });
}

export { defineGeneratorPageSchemaState };
