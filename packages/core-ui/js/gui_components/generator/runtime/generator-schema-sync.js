function syncGeneratorSchemaRowsFromTextMode({
  schemaDefinition,
  getSchemaRows,
  getSchemaTextTokens,
  revalidateSchemaRows,
  surfaceSchemaError,
  formatSchemaErrors,
  showErrors = false,
  applySemanticValidation = true,
} = {}) {
  const state = schemaDefinition?.getState?.();
  const isTextMode = state?.isTextMode === true;

  if (isTextMode) {
    const parsed = schemaDefinition?.syncFromText?.({ showErrors, force: true, refreshTextFromRows: true }) || {
      rows: [],
      errors: [],
    };
    if (parsed.errors.length > 0) {
      if (showErrors) {
        surfaceSchemaError?.(formatSchemaErrors?.(parsed.errors) || '');
      }
      return parsed;
    }
  }

  const currentRows = getSchemaRows?.() || [];
  const validation = applySemanticValidation ? revalidateSchemaRows?.() : { rows: currentRows, errors: [] };
  return {
    rows: currentRows,
    errors: validation?.errors || [],
    tokens: getSchemaTextTokens?.() || [],
  };
}

export { syncGeneratorSchemaRowsFromTextMode };
