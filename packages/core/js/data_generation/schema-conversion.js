import { TestDataGenerator } from './testDataGenerator.js';
function cloneRule(rule) {
  return {
    name: String(rule?.name ?? ''),
    ruleSpec: String(rule?.ruleSpec ?? ''),
    type: String(rule?.type ?? ''),
    comments: String(rule?.comments ?? ''),
  };
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

function renderSpecFromRulesWithComments(rules) {
  const safeRules = Array.isArray(rules) ? rules : [];
  const outputLines = [];
  safeRules.forEach((rule) => {
    const comments = String(rule?.comments ?? '');
    if (comments.length > 0) {
      outputLines.push(...comments.split('\n'));
    }
    outputLines.push(String(rule?.name ?? ''));
    outputLines.push(String(rule?.ruleSpec ?? ''));
  });
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
  const hasTokens = Array.isArray(tokens) && tokens.length > 0;
  const text = hasTokens ? renderSpecFromRulesWithTokens(rules, tokens) : renderSpecFromRulesWithComments(rules);
  return {
    ok: true,
    text,
    errors: [],
  };
}
