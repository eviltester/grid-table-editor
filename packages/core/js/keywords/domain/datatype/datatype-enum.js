import { EnumParser } from '../../../data_generation/utils/enumParser.js';

function normalizeDatatypeEnumValuesFromArgs(args = []) {
  const rawArgs = Array.isArray(args) ? args : [];
  if (rawArgs.length === 1 && Array.isArray(rawArgs[0])) {
    return rawArgs[0].map((value) => value);
  }
  if (rawArgs.length === 1 && typeof rawArgs[0] === 'string') {
    const singleValue = rawArgs[0].trim();
    if (singleValue.length === 0) {
      return [];
    }

    try {
      return EnumParser.extractEnumValues(singleValue);
    } catch {
      return [singleValue];
    }
  }

  return rawArgs.flatMap((value) => (Array.isArray(value) ? value : [value]));
}

function normalizeDatatypeEnumArgs(args = []) {
  return normalizeDatatypeEnumValuesFromArgs(args);
}

function getContextFieldDefinition(context = {}) {
  return context?.fieldDefinition && typeof context.fieldDefinition === 'object' ? context.fieldDefinition : {};
}

function getContextRuleSpec(context = {}) {
  const fieldDefinition = getContextFieldDefinition(context);
  const candidates = [context?.ruleSpec, fieldDefinition?.ruleSpec, context?.functionCall];

  for (const candidate of candidates) {
    const value = String(candidate ?? '').trim();
    if (value.length > 0) {
      return value;
    }
  }

  return '';
}

function isDatatypeEnumCommand(command) {
  const normalizedCommand = String(command ?? '')
    .trim()
    .toLowerCase();
  return normalizedCommand === 'datatype.enum' || normalizedCommand === 'awd.datatype.enum';
}

function normalizeDatatypeEnumValuesFromContext(context = {}) {
  const explicitEnumValues = Array.isArray(context?.enumValues) ? context.enumValues : [];
  if (explicitEnumValues.length > 0) {
    return explicitEnumValues.map((entry) => String(entry));
  }

  const args = Array.isArray(context?.args)
    ? context.args
    : Array.isArray(context?.parsedArgs)
      ? context.parsedArgs
      : [];
  if (args.length > 0) {
    return normalizeDatatypeEnumValuesFromArgs(args).map((entry) => String(entry));
  }

  const fieldDefinition = getContextFieldDefinition(context);
  const sourceType = String(fieldDefinition?.sourceType ?? '')
    .trim()
    .toLowerCase();
  const command = String(fieldDefinition?.command ?? '')
    .trim()
    .toLowerCase();
  const params = String(fieldDefinition?.params ?? '').trim();
  const value = String(fieldDefinition?.value ?? '').trim();
  const candidates = [getContextRuleSpec(context)];

  if (sourceType === 'enum' && value.length > 0) {
    candidates.push(`enum(${EnumParser.extractEnumDisplayValue(value)})`);
    candidates.push(value);
  }
  if (isDatatypeEnumCommand(command) && params.length > 0) {
    candidates.push(`datatype.enum(${EnumParser.extractEnumDisplayValue(params)})`);
    candidates.push(params);
  }

  for (const candidate of candidates) {
    const ruleSpec = String(candidate ?? '').trim();
    if (!ruleSpec) {
      continue;
    }
    try {
      return EnumParser.extractEnumValues(ruleSpec).map((entry) => String(entry));
    } catch {
      // Keep looking until a valid enum source is found.
    }
  }

  return [];
}

function executeCustomDatatypeEnum(executionContext = {}) {
  const args = Array.isArray(executionContext.args) ? executionContext.args : [];
  const values = normalizeDatatypeEnumValuesFromArgs(args);

  if (values.length === 0) {
    throw new Error('Invalid keyword arguments: argument "values" is required');
  }

  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex];
}

export { executeCustomDatatypeEnum, normalizeDatatypeEnumArgs, normalizeDatatypeEnumValuesFromContext };
