import { applySanitizedUiOptionsToTargets } from './options-catalog-adapter.js';

function applyGeneratorFormatOptions({
  options,
  currentSelectedType,
  exporter,
  syncFormatStateIfChanged,
  renderOutputPreviewForCurrentSelection,
  setGenerationStatus,
  scheduleClearGenerationStatus,
  sanitizeOptions = applySanitizedUiOptionsToTargets,
} = {}) {
  if (!options) {
    return null;
  }

  const requestedType = options.outputFormat || currentSelectedType;
  if (!requestedType) {
    return null;
  }

  const sanitized = sanitizeOptions({
    requestedFormat: requestedType,
    rawOptions: options?.options || options,
    targets: [exporter],
  });

  const resolvedType = sanitized?.outputFormat || requestedType;
  syncFormatStateIfChanged?.(resolvedType, currentSelectedType);

  const type = resolvedType || currentSelectedType;
  renderOutputPreviewForCurrentSelection?.();
  setGenerationStatus?.(`${type.toUpperCase()} options applied.`);
  scheduleClearGenerationStatus?.();

  return {
    requestedType,
    resolvedType,
    sanitized,
  };
}

export { applyGeneratorFormatOptions };
