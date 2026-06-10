import { EnumParser } from './utils/enumParser.js';
import { SchemaParsingErrors } from './schema-parsing-errors.js';

function normalizeScalarValue(value) {
  if (value === undefined || value === null) {
    return '';
  }
  return String(value);
}

function escapeRegexPattern(pattern) {
  return String(pattern)
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');
}

function matchesLikePattern(value, pattern) {
  return new RegExp(`^${escapeRegexPattern(pattern)}$`).test(normalizeScalarValue(value));
}

function matchesRuleScalarValue(rule, value) {
  const normalizedValue = normalizeScalarValue(value);
  switch (
    String(rule?.type || '')
      .trim()
      .toLowerCase()
  ) {
    case 'enum':
      return EnumParser.extractEnumValues(rule.ruleSpec).includes(normalizedValue);
    case 'regex':
      return new RegExp(`^(?:${String(rule.ruleSpec || '')})$`).test(normalizedValue);
    case 'literal':
      return normalizeScalarValue(rule.ruleSpec) === normalizedValue;
    default:
      return null;
  }
}

function getRuleUniverseValues(rule) {
  const ruleType = String(rule?.type || '')
    .trim()
    .toLowerCase();
  if (ruleType === 'enum') {
    return EnumParser.extractEnumValues(rule.ruleSpec);
  }
  if (ruleType === 'literal') {
    return [normalizeScalarValue(rule.ruleSpec)];
  }
  return null;
}

function validateComparisonPredicate(predicate, rule) {
  if (!rule || predicate?.kind !== 'comparison' || predicate?.right?.kind !== 'value') {
    return [];
  }

  const rightValue = predicate.right.value;
  const line = predicate.line;
  const matchesValue = matchesRuleScalarValue(rule, rightValue);
  if (matchesValue === null) {
    return [];
  }

  const ruleType = String(rule.type || '')
    .trim()
    .toLowerCase();
  if (predicate.relation === '=' && matchesValue === false) {
    if (ruleType === 'enum') {
      return [SchemaParsingErrors.invalidConstraintEnumValue(rule.name, rightValue, line)];
    }
    if (ruleType === 'regex') {
      return [SchemaParsingErrors.invalidConstraintRegexValue(rule.name, rightValue, line)];
    }
    if (ruleType === 'literal') {
      return [SchemaParsingErrors.invalidConstraintLiteralValue(rule.name, rightValue, rule.ruleSpec, line)];
    }
  }

  if (predicate.relation === '<>' && ruleType === 'literal' && matchesValue === true) {
    return [SchemaParsingErrors.invalidConstraintLiteralExclusion(rule.name, rightValue, line)];
  }

  return [];
}

function validateLikePredicate(predicate, rule) {
  if (!rule || predicate?.kind !== 'like' || predicate?.pattern?.kind !== 'value') {
    return [];
  }

  const supportedValues = getRuleUniverseValues(rule);
  if (!supportedValues) {
    return [];
  }

  const pattern = predicate.pattern.value;
  const matches = supportedValues.filter((value) => matchesLikePattern(value, pattern));
  if (!predicate.negated && matches.length === 0) {
    return [SchemaParsingErrors.invalidConstraintLikePattern(rule.name, pattern, lineOrPredicate(predicate))];
  }
  if (predicate.negated && matches.length === supportedValues.length) {
    return [SchemaParsingErrors.invalidConstraintNotLikePattern(rule.name, pattern, lineOrPredicate(predicate))];
  }

  return [];
}

function lineOrPredicate(predicate) {
  return predicate?.line;
}

function validateInPredicate(predicate, rule) {
  if (!rule || predicate?.kind !== 'in') {
    return [];
  }

  const supportedValues = getRuleUniverseValues(rule);
  if (!supportedValues) {
    if (
      String(rule?.type || '')
        .trim()
        .toLowerCase() === 'regex'
    ) {
      const scalarValues = Array.isArray(predicate.right?.values)
        ? predicate.right.values.map((node) => node?.value).filter((value) => value !== undefined)
        : [];
      if (!predicate.negated && scalarValues.length > 0) {
        const anyMatch = scalarValues.some((value) => matchesRuleScalarValue(rule, value) === true);
        if (!anyMatch) {
          return [SchemaParsingErrors.invalidConstraintRegexSet(rule.name, scalarValues, predicate.line)];
        }
      }
    }
    return [];
  }

  const scalarValues = Array.isArray(predicate.right?.values)
    ? predicate.right.values.map((node) => normalizeScalarValue(node?.value))
    : [];
  const matchingValues = scalarValues.filter((value) => supportedValues.includes(value));
  if (!predicate.negated && matchingValues.length === 0) {
    return [SchemaParsingErrors.invalidConstraintInSet(rule.name, scalarValues, predicate.line)];
  }
  if (predicate.negated && matchingValues.length === supportedValues.length) {
    return [SchemaParsingErrors.invalidConstraintNotInSet(rule.name, scalarValues, predicate.line)];
  }

  return [];
}

function visitPredicate(predicate, ruleLookup, errors) {
  if (!predicate || typeof predicate !== 'object') {
    return;
  }

  if (predicate.kind === 'logical') {
    visitPredicate(predicate.left, ruleLookup, errors);
    visitPredicate(predicate.right, ruleLookup, errors);
    return;
  }
  if (predicate.kind === 'logical-not') {
    visitPredicate(predicate.operand, ruleLookup, errors);
    return;
  }

  const leftParameterName = predicate.left?.name;
  const rule = leftParameterName ? ruleLookup.get(String(leftParameterName).trim()) : null;
  errors.push(...validateComparisonPredicate(predicate, rule));
  errors.push(...validateLikePredicate(predicate, rule));
  errors.push(...validateInPredicate(predicate, rule));
}

function dedupeErrors(errors = []) {
  return (Array.isArray(errors) ? errors : []).filter(
    (error, index, list) =>
      list.findIndex(
        (candidate) =>
          candidate?.code === error?.code && candidate?.line === error?.line && candidate?.message === error?.message
      ) === index
  );
}

function validateConstraintsAgainstRules(constraints = [], rules = []) {
  const ruleLookup = new Map(
    (Array.isArray(rules) ? rules : []).map((rule) => [String(rule?.name ?? '').trim(), rule])
  );
  const errors = [];

  (Array.isArray(constraints) ? constraints : []).forEach((constraint) => {
    if (!constraint?.ast) {
      return;
    }
    visitPredicate(constraint.ast.condition, ruleLookup, errors);
    visitPredicate(constraint.ast.consequence, ruleLookup, errors);
  });

  return dedupeErrors(errors);
}

export { validateConstraintsAgainstRules };
