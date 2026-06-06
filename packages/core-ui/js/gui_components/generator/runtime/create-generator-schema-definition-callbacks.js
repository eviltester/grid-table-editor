function createGeneratorSchemaDefinitionCallbacks({ onSchemaError, onSchemaClear, onRowsChanged } = {}) {
  return {
    onSchemaError: (message) => onSchemaError?.(message),
    onSchemaClear: () => onSchemaClear?.(),
    onRowsChanged: () => onRowsChanged?.(),
  };
}

export { createGeneratorSchemaDefinitionCallbacks };
