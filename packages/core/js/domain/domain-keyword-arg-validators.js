function createOrderedArgsValidator({ lowerName, upperName }) {
  return (_args = [], context = {}) => {
    const argsByName = context?.argsByName || {};
    const lowerValue = argsByName[lowerName];
    const upperValue = argsByName[upperName];

    if (typeof lowerValue === 'undefined' || typeof upperValue === 'undefined') {
      return { ok: true };
    }

    if (lowerValue > upperValue) {
      return {
        ok: false,
        error: `Invalid keyword arguments: argument "${lowerName}" must be less than or equal to argument "${upperName}"`,
      };
    }

    return { ok: true };
  };
}

function composeArgsValidators(...validators) {
  return (args = [], context = {}) => {
    for (const validator of validators) {
      if (typeof validator !== 'function') {
        continue;
      }
      const result = validator(args, context);
      if (!result?.ok) {
        return result;
      }
    }

    return { ok: true };
  };
}

function createNumericArgRangeValidator({
  argName,
  min,
  max,
  inclusiveMin = true,
  inclusiveMax = true,
  description,
} = {}) {
  return (_args = [], context = {}) => {
    const argsByName = context?.argsByName || {};
    const value = argsByName[argName];

    if (typeof value === 'undefined') {
      return { ok: true };
    }

    if (typeof value !== 'number' || !Number.isFinite(value)) {
      return { ok: true };
    }

    const belowMin = typeof min === 'number' && (inclusiveMin ? value < min : value <= min);
    if (belowMin) {
      return {
        ok: false,
        error:
          description ||
          `Invalid keyword arguments: argument "${argName}" must be ${inclusiveMin ? 'greater than or equal to' : 'greater than'} ${min}`,
      };
    }

    const aboveMax = typeof max === 'number' && (inclusiveMax ? value > max : value >= max);
    if (aboveMax) {
      return {
        ok: false,
        error:
          description ||
          `Invalid keyword arguments: argument "${argName}" must be ${inclusiveMax ? 'less than or equal to' : 'less than'} ${max}`,
      };
    }

    return { ok: true };
  };
}

function createIntegerArgValidator({ argName } = {}) {
  return (_args = [], context = {}) => {
    const argsByName = context?.argsByName || {};
    const value = argsByName[argName];

    if (typeof value === 'undefined') {
      return { ok: true };
    }

    if (typeof value !== 'number' || !Number.isFinite(value)) {
      return { ok: true };
    }

    if (!Number.isInteger(value)) {
      return {
        ok: false,
        error: `Invalid keyword arguments: argument "${argName}" must be an integer`,
      };
    }

    return { ok: true };
  };
}

function createNonEmptyArrayArgValidator({ argName } = {}) {
  return (_args = [], context = {}) => {
    const argsByName = context?.argsByName || {};
    const value = argsByName[argName];

    if (typeof value === 'undefined' || !Array.isArray(value)) {
      return { ok: true };
    }

    if (value.length === 0) {
      return {
        ok: false,
        error: `Invalid keyword arguments: argument "${argName}" must not be empty`,
      };
    }

    return { ok: true };
  };
}

export {
  composeArgsValidators,
  createIntegerArgValidator,
  createNonEmptyArrayArgValidator,
  createNumericArgRangeValidator,
  createOrderedArgsValidator,
};
