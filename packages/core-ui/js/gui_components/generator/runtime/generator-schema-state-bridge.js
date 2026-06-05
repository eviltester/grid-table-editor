function createGeneratorSchemaStateBridge({
  getSchemaDefinition,
  getSchemaSession,
  updatePairwiseButtonVisibility,
} = {}) {
  const getResolvedSchemaDefinition = () => getSchemaDefinition?.() || null;
  const getResolvedSchemaSession = () => getSchemaSession?.() || null;

  return {
    getRows() {
      if (getResolvedSchemaDefinition()?.getState) {
        return getResolvedSchemaDefinition().getState().rows || [];
      }
      return getResolvedSchemaSession()?.getRows?.() || [];
    },

    setRows(rows) {
      if (getResolvedSchemaDefinition()?.setRows) {
        getResolvedSchemaDefinition().setRows(rows);
        return;
      }
      getResolvedSchemaSession()?.setRows?.(rows);
    },

    getTokens() {
      if (getResolvedSchemaDefinition()?.getTokens) {
        return getResolvedSchemaDefinition().getTokens() || [];
      }
      return getResolvedSchemaSession()?.getTokens?.() || [];
    },

    setTokens(tokens) {
      if (getResolvedSchemaDefinition()?.setTokens) {
        getResolvedSchemaDefinition().setTokens(tokens);
        return;
      }
      getResolvedSchemaSession()?.setTokens?.(tokens);
    },

    getTextMode() {
      if (getResolvedSchemaDefinition()?.getState) {
        return getResolvedSchemaDefinition().getState().isTextMode === true;
      }
      return getResolvedSchemaSession()?.getTextMode?.() === true;
    },

    setTextMode(isTextMode) {
      if (getResolvedSchemaDefinition()?.setTextMode) {
        getResolvedSchemaDefinition().setTextMode(isTextMode);
        return;
      }
      getResolvedSchemaSession()?.setTextMode?.(isTextMode);
    },

    renderSchemaRows() {
      getResolvedSchemaDefinition()?.render?.();
      updatePairwiseButtonVisibility?.();
    },
  };
}

export { createGeneratorSchemaStateBridge };
