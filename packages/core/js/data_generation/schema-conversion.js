import { TestDataGenerator } from './testDataGenerator.js';
function cloneRule(rule) {
  return {
    name: String(rule?.name ?? ''),
    ruleSpec: String(rule?.ruleSpec ?? ''),
    type: String(rule?.type ?? ''),
    comments: String(rule?.comments ?? ''),
  };
}

function splitCommentLines(comments) {
  const value = String(comments ?? '');
  if (value.length === 0) {
    return [];
  }
  return value.split('\n');
}

function synthesizeTokensFromRules(rules) {
  const safeRules = Array.isArray(rules) ? rules : [];
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

  return tokens;
}

function renderSpecFromRulesWithTokens(rules, schemaTokens) {
  const rows = Array.isArray(rules)
    ? rules.map((rule) => ({
        name: String(rule?.name ?? ''),
        rule: String(rule?.ruleSpec ?? ''),
      }))
    : [];
  const tokens = Array.isArray(schemaTokens) ? schemaTokens : [];
  if (tokens.length === 0) {
    return '';
  }

  const outputLines = [];
  let rowIndex = 0;
  tokens.forEach((token) => {
    if (token?.kind === 'comment' || token?.kind === 'blank') {
      outputLines.push(token.text ?? '');
      return;
    }
    if (token?.kind === 'rule' && rowIndex < rows.length) {
      outputLines.push(rows[rowIndex].name);
      outputLines.push(rows[rowIndex].rule);
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
  const rules = ok ? generator.testDataRules().map((rule) => cloneRule(rule)) : [];
  const tokens =
    typeof generator.rulesParser?.getSchemaTokens === 'function' ? generator.rulesParser.getSchemaTokens() : [];

  return {
    ok,
    rules,
    tokens,
    errors,
    report: typeof generator.compilationReport === 'function' ? generator.compilationReport() : '',
    generator,
  };
}

export function renderSchemaText({ rules, tokens = [] } = {}) {
  const resolvedTokens = Array.isArray(tokens) && tokens.length > 0 ? tokens : synthesizeTokensFromRules(rules);
  const text = renderSpecFromRulesWithTokens(rules, resolvedTokens);
  return {
    ok: true,
    text,
    errors: [],
  };
}
