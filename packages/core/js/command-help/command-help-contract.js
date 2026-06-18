function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function splitAllowedTypes(typeText = '') {
  return String(typeText || '')
    .split('|')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function unquoteLiteralTypeToken(value) {
  const trimmed = String(value || '').trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function isQuotedLiteralTypeToken(value) {
  const trimmed = String(value || '').trim();
  return (trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"));
}

function createReturnValueValidator(returnType = '') {
  const allowedTypes = splitAllowedTypes(returnType);
  if (allowedTypes.length === 0 || allowedTypes.includes('unknown')) {
    return () => true;
  }

  return (value) =>
    allowedTypes.some((allowedType) => {
      if (allowedType === 'string') {
        return typeof value === 'string';
      }
      if (allowedType === 'integer') {
        return typeof value === 'bigint' || Number.isInteger(value);
      }
      if (allowedType === 'number') {
        return typeof value === 'number' && Number.isFinite(value);
      }
      if (allowedType === 'boolean') {
        return typeof value === 'boolean';
      }
      if (allowedType === 'array') {
        return Array.isArray(value);
      }
      if (allowedType === 'object') {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
      }
      if (allowedType === 'date') {
        if (value instanceof Date) {
          return !Number.isNaN(value.valueOf());
        }
        return typeof value === 'string' && !Number.isNaN(Date.parse(value));
      }
      if (allowedType === 'regexp') {
        return value instanceof RegExp || typeof value === 'string';
      }
      if (/^[+-]?\d+(?:\.\d+)?$/.test(allowedType)) {
        return typeof value === 'number' && Object.is(value, Number(allowedType));
      }
      if (isQuotedLiteralTypeToken(allowedType)) {
        return typeof value === 'string' && value === unquoteLiteralTypeToken(allowedType);
      }
      return typeof value === 'string' && value === allowedType;
    });
}

function normalizeValidatorValue(validator, returnType = '') {
  if (validator instanceof RegExp || typeof validator === 'function') {
    return validator;
  }
  return createReturnValueValidator(returnType);
}

function coerceSampleReturnValue(value, returnType = '') {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  const unquoted =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ? trimmed.slice(1, -1)
      : trimmed;
  const allowedTypes = splitAllowedTypes(returnType);

  if (allowedTypes.includes('string')) {
    return value;
  }

  if (allowedTypes.includes('array') && unquoted.startsWith('[') && unquoted.endsWith(']')) {
    try {
      return JSON.parse(unquoted);
    } catch {
      return value;
    }
  }
  if (allowedTypes.includes('object') && unquoted.startsWith('{') && unquoted.endsWith('}')) {
    try {
      return JSON.parse(unquoted);
    } catch {
      return value;
    }
  }
  if (allowedTypes.includes('boolean') && /^(true|false)$/iu.test(unquoted)) {
    return unquoted.toLowerCase() === 'true';
  }
  if ((allowedTypes.includes('integer') || allowedTypes.includes('number')) && /^[+-]?\d+(?:\.\d+)?$/u.test(unquoted)) {
    return Number(unquoted);
  }
  if (allowedTypes.includes('date')) {
    return unquoted;
  }

  return value;
}

function validateCommandHelpValue(validator, value, context = {}) {
  if (validator instanceof RegExp) {
    return validator.test(String(value ?? ''));
  }
  if (typeof validator === 'function') {
    return validator(value, context) === true;
  }
  return false;
}

function normalizeFunctionCallText(functionCall) {
  return String(functionCall || '').trim();
}

function normalizeUsageExamples({ command = '', returnType = '', usageExamples = [] } = {}) {
  if (!Array.isArray(usageExamples)) {
    return [];
  }

  return usageExamples
    .map((entry) => {
      const functionCall = normalizeFunctionCallText(entry?.functionCall);
      if (!functionCall) {
        return null;
      }
      return {
        functionCall,
        sampleReturnValue: coerceSampleReturnValue(entry?.sampleReturnValue, returnType),
        description: isNonEmptyString(entry?.description) ? entry.description.trim() : `Shows ${command} in use.`,
      };
    })
    .filter(Boolean);
}

export { createReturnValueValidator, normalizeUsageExamples, normalizeValidatorValue, validateCommandHelpValue };
