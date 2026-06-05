import { parseNonNegativeCount } from '../test-data/generation/index.js';

function resolveInputElementName(inputElement, inputId) {
  if (inputId) {
    return inputId;
  }
  if (inputElement?.id) {
    return inputElement.id;
  }
  const ariaLabel = inputElement?.getAttribute?.('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  const labelText = inputElement?.closest?.('label')?.textContent?.trim?.();
  if (labelText) {
    return labelText;
  }
  return 'rowCount';
}

function parseRowCountInputElement(inputElement, { inputId, min = 0 } = {}) {
  if (!inputElement) {
    const resolvedInputId = inputId || 'rowCount';
    return {
      value: min,
      valid: false,
      errors: [`${resolvedInputId} must be a number greater than or equal to ${min}.`],
    };
  }

  const resolvedInputId = resolveInputElementName(inputElement, inputId);
  const resolvedMin = inputElement.min ? Number.parseInt(inputElement.min, 10) : min;
  const max = inputElement.max ? Number.parseInt(inputElement.max, 10) : null;
  const parsed = parseNonNegativeCount(inputElement.value, { min: resolvedMin, max });
  const rawValue = Number.parseInt(inputElement.value, 10);

  if (!Number.isFinite(rawValue) || rawValue < resolvedMin) {
    return {
      value: parsed.value,
      valid: false,
      errors: [`${resolvedInputId} must be a number greater than or equal to ${resolvedMin}.`],
    };
  }

  if (Number.isFinite(max) && rawValue > max) {
    return {
      value: parsed.value,
      valid: false,
      errors: [`${resolvedInputId} must be less than or equal to ${max}.`],
    };
  }

  return {
    value: parsed.value,
    valid: true,
    errors: [],
  };
}

export { parseRowCountInputElement };
