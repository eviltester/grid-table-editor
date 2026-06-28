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
  const isRowEditableParsedError = (issue) =>
    ['unknown_domain_command', 'unknown_faker_command', 'forbidden_faker_command'].includes(issue?.code);
  const state = schemaDefinition?.getState?.();
  const isTextMode = state?.isTextMode === true;

  if (isTextMode) {
    const parsed = schemaDefinition?.syncFromText?.({ showErrors, force: true, refreshTextFromRows: true }) || {
      rows: [],
      errors: [],
    };
    if (parsed.errors.length > 0) {
      if (Array.isArray(parsed.rows) && parsed.rows.length > 0) {
        try {
          const validation = revalidateSchemaRows?.();
          const validationErrors = Array.isArray(validation?.errors) ? validation.errors : [];
          if (validationErrors.length > 0 && validationErrors.every((issue) => isRowEditableParsedError(issue))) {
            return {
              rows: validation.rows || parsed.rows,
              errors: validationErrors,
              tokens: getSchemaTextTokens?.() || parsed.tokens || [],
            };
          }
        } catch {
          // Keep the original compiler errors for malformed recoverable rows that cannot be row-validated.
        }
      }
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
