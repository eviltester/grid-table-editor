import { EnumParser } from '../../../data_generation/utils/enumParser.js';

function normalizeDatatypeEnumArgs(args = []) {
  const rawArgs = Array.isArray(args) ? args : [];
  if (rawArgs.length === 1 && typeof rawArgs[0] === 'string') {
    const singleValue = rawArgs[0].trim();
    if (singleValue.length === 0) {
      return [];
    }

    try {
      return EnumParser.extractEnumValues(`enum(${singleValue})`);
    } catch {
      return [singleValue];
    }
  }

  return rawArgs.map((value) => value);
}

function executeCustomDatatypeEnum(executionContext = {}) {
  const args = Array.isArray(executionContext.args) ? executionContext.args : [];
  const values = normalizeDatatypeEnumArgs(args);

  if (values.length === 0) {
    throw new Error('Invalid keyword arguments: argument "values" is required');
  }

  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex];
}

export { executeCustomDatatypeEnum, normalizeDatatypeEnumArgs };
