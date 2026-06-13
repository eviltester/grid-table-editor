function getIntegerArg(value, argName, defaultValue) {
  if (typeof value === 'undefined') {
    return defaultValue;
  }
  if (!Number.isInteger(value)) {
    throw new Error(`Invalid argument for ${argName}: expected an integer.`);
  }
  return value;
}

function getStringArg(value, defaultValue = '') {
  if (typeof value === 'undefined') {
    return defaultValue;
  }
  return String(value);
}

function formatAutoIncrementValue(value, zeroPadding) {
  const integerValue = Number(value);
  const sign = integerValue < 0 ? '-' : '';
  const digits = Math.abs(integerValue).toString();
  return `${sign}${digits.padStart(Math.max(0, zeroPadding), '0')}`;
}

function executeCustomAutoIncrementSequence(executionContext = {}) {
  const args = Array.isArray(executionContext.args) ? executionContext.args : [];
  const state = executionContext.autoIncrementState || {};

  const start = getIntegerArg(args[0], 'start', 1);
  const step = getIntegerArg(args[1], 'step', 1);
  const prefix = getStringArg(args[2], '');
  const suffix = getStringArg(args[3], '');
  const zeroPadding = getIntegerArg(args[4], 'zeropadding', 0);

  if (zeroPadding < 0) {
    throw new Error('Invalid argument for zeropadding: expected an integer greater than or equal to 0.');
  }

  const currentValue = Number.isInteger(state.nextValue) ? state.nextValue : start;
  state.nextValue = currentValue + step;

  if (!prefix && !suffix && zeroPadding === 0) {
    return currentValue;
  }

  return `${prefix}${formatAutoIncrementValue(currentValue, zeroPadding)}${suffix}`;
}

export { executeCustomAutoIncrementSequence, formatAutoIncrementValue };
