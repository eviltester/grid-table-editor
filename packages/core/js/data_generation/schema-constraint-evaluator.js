function getRecordValue(record, parameterName) {
  if (record instanceof Map) {
    return record.get(parameterName);
  }
  if (record && typeof record === 'object') {
    return record[parameterName];
  }
  return undefined;
}

function normalizeScalar(value) {
  if (value === undefined || value === null) {
    return '';
  }
  return value;
}

function coerceComparable(leftValue, rightValue) {
  const leftNumber = Number(leftValue);
  const rightNumber = Number(rightValue);
  const useNumeric =
    String(leftValue ?? '').trim().length > 0 &&
    String(rightValue ?? '').trim().length > 0 &&
    Number.isFinite(leftNumber) &&
    Number.isFinite(rightNumber);
  if (useNumeric) {
    return { left: leftNumber, right: rightNumber };
  }
  return {
    left: String(normalizeScalar(leftValue)),
    right: String(normalizeScalar(rightValue)),
  };
}

function evaluateLike(value, pattern) {
  const escapedPattern = String(pattern)
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');
  return new RegExp(`^${escapedPattern}$`).test(String(normalizeScalar(value)));
}

function evaluateRelation(leftValue, relation, rightValue) {
  const comparable = coerceComparable(leftValue, rightValue);
  switch (relation) {
    case '=':
      return comparable.left === comparable.right;
    case '<>':
      return comparable.left !== comparable.right;
    case '>':
      return comparable.left > comparable.right;
    case '>=':
      return comparable.left >= comparable.right;
    case '<':
      return comparable.left < comparable.right;
    case '<=':
      return comparable.left <= comparable.right;
    default:
      return false;
  }
}

function resolveNodeValue(node, record) {
  if (!node) {
    return undefined;
  }
  if (node.kind === 'parameter') {
    return getRecordValue(record, node.name);
  }
  if (node.kind === 'value') {
    return node.value;
  }
  return undefined;
}

function evaluatePredicate(predicate, record) {
  if (!predicate) {
    return true;
  }
  switch (predicate.kind) {
    case 'logical':
      return predicate.operator === 'AND'
        ? evaluatePredicate(predicate.left, record) && evaluatePredicate(predicate.right, record)
        : evaluatePredicate(predicate.left, record) || evaluatePredicate(predicate.right, record);
    case 'logical-not':
      return !evaluatePredicate(predicate.operand, record);
    case 'comparison':
      return evaluateRelation(
        resolveNodeValue(predicate.left, record),
        predicate.relation,
        resolveNodeValue(predicate.right, record)
      );
    case 'like': {
      const matches = evaluateLike(
        resolveNodeValue(predicate.left, record),
        resolveNodeValue(predicate.pattern, record)
      );
      return predicate.negated ? !matches : matches;
    }
    case 'in': {
      const leftValue = String(normalizeScalar(resolveNodeValue(predicate.left, record)));
      const values = Array.isArray(predicate.right?.values)
        ? predicate.right.values.map((item) => String(normalizeScalar(resolveNodeValue(item, record))))
        : [];
      const contains = values.includes(leftValue);
      return predicate.negated ? !contains : contains;
    }
    case 'function': {
      const value = Number(resolveNodeValue(predicate.parameter, record));
      if (!Number.isFinite(value)) {
        return false;
      }
      return predicate.functionName === 'ISNEGATIVE' ? value < 0 : value > 0;
    }
    default:
      return false;
  }
}

function evaluateConstraint(constraint, record) {
  if (!constraint?.ast) {
    return true;
  }
  const conditionMet = evaluatePredicate(constraint.ast.condition, record);
  if (!conditionMet) {
    return true;
  }
  return evaluatePredicate(constraint.ast.consequence, record);
}

export { evaluateConstraint, evaluatePredicate };
