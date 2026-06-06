function createGeneratorControlsServices({ getExporter } = {}) {
  return {
    canExportFormat: (type) => getExporter?.()?.canExport?.(type) !== false,
    getCurrentOptionsForFormat: (type) => getExporter?.()?.getOptionsForType?.(type),
  };
}

export { createGeneratorControlsServices };
