import { TestDataGenerator } from './testDataGenerator.js';
import { EnumParser } from './utils/enumParser.js';

function cloneConstraintAst(ast) {
  if (ast == null) {
    return null;
  }
  if (typeof structuredClone === 'function') {
    return structuredClone(ast);
  }
  return JSON.parse(JSON.stringify(ast));
}

function cloneRule(rule) {
  const rawRuleSpec = String(rule?.ruleSpec ?? '');
  const normalizedRuleSpec = EnumParser.isCanonicalSchemaSerializableEnumRuleSpec(rawRuleSpec)
    ? EnumParser.normalizeToCanonicalSchemaRuleSpec(rawRuleSpec)
    : rawRuleSpec;
  return {
    name: String(rule?.name ?? ''),
    ruleSpec: normalizedRuleSpec,
    type: String(rule?.type ?? ''),
    comments: String(rule?.comments ?? ''),
  };
}

function cloneConstraint(constraint) {
  return {
    sourceText: String(constraint?.sourceText ?? ''),
    ast: cloneConstraintAst(constraint?.ast),
    terminator: constraint?.terminator || ';',
    referencedParameters: Array.isArray(constraint?.referencedParameters)
      ? constraint.referencedParameters.map((name) => String(name ?? '').trim())
      : [],
    line: constraint?.line,
  };
}

function splitCommentLines(comments) {
  const value = String(comments ?? '');
  if (value.length === 0) {
    return [];
  }
  return value.split('\n');
}

function synthesizeTokensFromRules(rules, constraints = []) {
  const safeRules = Array.isArray(rules) ? rules : [];
  const safeConstraints = Array.isArray(constraints) ? constraints : [];
  const tokens = [];

  safeRules.forEach((rule) => {
    const leadingTextLines = Array.isArray(rule?.leadingTextLines)
      ? rule.leadingTextLines.map((line) => String(line ?? ''))
      : splitCommentLines(rule?.comments);
    leadingTextLines.forEach((line) => {
      if (line.trim().length === 0) {
        tokens.push({ kind: 'blank', text: line });
      } else {
        tokens.push({ kind: 'comment', text: line });
      }
    });
    tokens.push({ kind: 'rule' });
  });

  safeConstraints.forEach((constraint, index) => {
    if (tokens.length > 0 || index > 0) {
      tokens.push({ kind: 'blank', text: '' });
    }
    tokens.push({
      kind: 'constraint',
      text: String(constraint?.sourceText ?? ''),
      terminator: constraint?.terminator || ';',
    });
  });

  return tokens;
}

function renderSpecFromRulesWithTokens(rules, constraints, schemaTokens) {
  const rows = Array.isArray(rules)
    ? rules.map((rule) => ({
        name: String(rule?.name ?? ''),
        rule: EnumParser.isCanonicalSchemaSerializableEnumRuleSpec(rule?.ruleSpec)
          ? EnumParser.normalizeToCanonicalSchemaRuleSpec(rule?.ruleSpec)
          : String(rule?.ruleSpec ?? ''),
      }))
    : [];
  const safeConstraints = Array.isArray(constraints) ? constraints : [];
  const tokens = Array.isArray(schemaTokens) ? schemaTokens : [];
  if (tokens.length === 0) {
    return '';
  }

  const outputLines = [];
  let rowIndex = 0;
  let constraintIndex = 0;
  tokens.forEach((token) => {
    if (token?.kind === 'comment' || token?.kind === 'blank') {
      outputLines.push(token.text ?? '');
      return;
    }
    if (token?.kind === 'constraint') {
      const constraint = safeConstraints[constraintIndex];
      outputLines.push(...String(constraint?.sourceText ?? token.text ?? '').split('\n'));
      constraintIndex += 1;
      return;
    }
    if (token?.kind === 'rule' && rowIndex < rows.length) {
      if (token.inline) {
        outputLines.push(`${rows[rowIndex].name}${token.separator || ': '}${rows[rowIndex].rule}`);
      } else {
        outputLines.push(rows[rowIndex].name);
        outputLines.push(rows[rowIndex].rule);
      }
      rowIndex += 1;
    }
  });

  while (rowIndex < rows.length) {
    if (outputLines.length > 0) {
      outputLines.push('');
    }
    outputLines.push(rows[rowIndex].name);
    outputLines.push(rows[rowIndex].rule);
    rowIndex += 1;
  }

  while (constraintIndex < safeConstraints.length) {
    if (outputLines.length > 0) {
      outputLines.push('');
    }
    outputLines.push(...String(safeConstraints[constraintIndex]?.sourceText ?? '').split('\n'));
    constraintIndex += 1;
  }

  return outputLines.join('\n');
}

export function parseSchemaText({
  schemaText,
  faker,
  RandExp,
  options = {},
  TestDataGeneratorClass = TestDataGenerator,
} = {}) {
  const generator = new TestDataGeneratorClass(faker, RandExp, options);
  generator.importSpec(String(schemaText ?? ''));
  generator.compile();

  const ok = generator.isValid();
  const errors = ok ? [] : generator.errors();
  const rules = generator.testDataRules().map((rule) => cloneRule(rule));
  const constraints =
    typeof generator.schemaConstraints === 'function'
      ? generator.schemaConstraints().map((constraint) => cloneConstraint(constraint))
      : [];
  const tokens =
    typeof generator.rulesParser?.getSchemaTokens === 'function' ? generator.rulesParser.getSchemaTokens() : [];

  return {
    ok,
    rules,
    constraints,
    tokens,
    errors,
    report: typeof generator.compilationReport === 'function' ? generator.compilationReport() : '',
    generator,
  };
}

export function renderSchemaText({ rules, constraints = [], tokens = [] } = {}) {
  const resolvedTokens =
    Array.isArray(tokens) && tokens.length > 0 ? tokens : synthesizeTokensFromRules(rules, constraints);
  const text = renderSpecFromRulesWithTokens(rules, constraints, resolvedTokens);
  return {
    ok: true,
    text,
    errors: [],
  };
}
