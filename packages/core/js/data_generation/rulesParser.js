import { TestDataRules } from './testDataRules.js';

export class RulesParser {
  constructor(aFaker, RandExp, options = {}) {
    this.faker = aFaker;
    this.RandExp = RandExp;
    this.options = options;
    this.testDataRules = new TestDataRules();
    this.errors = [];
    this.schemaTokens = [];
  }

  parseText(textContent) {
    this.testDataRules = new TestDataRules();
    this.errors = [];
    this.schemaTokens = [];

    const defnLines = String(textContent ?? '').split('\n');
    if (defnLines.length === 0 || (defnLines.length === 1 && defnLines[0].trim().length === 0)) {
      this.errors.push('ERROR: No Rules Defined');
      return;
    }

    let pendingName = null;
    let pendingNameLine = null;
    let pendingLeadingTextLines = [];

    for (let index = 0; index < defnLines.length; index++) {
      const line = defnLines[index];
      const trimmed = line.trim();

      if (trimmed.length === 0) {
        if (pendingName !== null) {
          this.errors.push(`ERROR: Missing Rule Definition for ${pendingName}`);
          return;
        }
        this.schemaTokens.push({ kind: 'blank', text: line, line: index + 1 });
        pendingLeadingTextLines.push(line);
        continue;
      }

      if (/^\s*#/.test(line)) {
        if (pendingName !== null) {
          this.errors.push(`ERROR: Missing Rule Definition for ${pendingName}`);
          return;
        }
        this.schemaTokens.push({ kind: 'comment', text: line, line: index + 1 });
        pendingLeadingTextLines.push(line);
        continue;
      }

      if (pendingName === null) {
        pendingName = trimmed;
        pendingNameLine = index + 1;
        continue;
      }

      const rule = trimmed;
      this.testDataRules.addRule(pendingName, rule, {
        comments: pendingLeadingTextLines.join('\n'),
      });
      this.schemaTokens.push({
        kind: 'rule',
        name: pendingName,
        rule,
        headerLine: pendingNameLine,
        ruleLine: index + 1,
      });
      pendingName = null;
      pendingNameLine = null;
      pendingLeadingTextLines = [];
    }

    if (pendingName !== null) {
      this.errors.push(`ERROR: Missing Rule Definition for ${pendingName}`);
      return;
    }

    if (this.testDataRules.rules.length === 0) {
      this.errors.push('ERROR: No Rules Defined');
    }
  }

  getSchemaTokens() {
    return this.schemaTokens.map((token) => ({ ...token }));
  }

  renderSpecFromRulesWithTokens(rules) {
    const rows = Array.isArray(rules)
      ? rules.map((rule) => ({
          name: String(rule?.name ?? ''),
          rule: String(rule?.ruleSpec ?? ''),
        }))
      : [];
    const outputLines = [];
    let rowIndex = 0;

    this.schemaTokens.forEach((token) => {
      if (token.kind === 'comment' || token.kind === 'blank') {
        outputLines.push(token.text ?? '');
        return;
      }
      if (token.kind === 'rule') {
        if (rowIndex < rows.length) {
          outputLines.push(rows[rowIndex].name);
          outputLines.push(rows[rowIndex].rule);
          rowIndex += 1;
        }
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

  renderSpecFromRulesWithComments(rules) {
    const safeRules = Array.isArray(rules) ? rules : [];
    const outputLines = [];
    safeRules.forEach((rule) => {
      const comments = String(rule?.comments ?? '');
      if (comments.length > 0) {
        const commentLines = comments.split('\n');
        outputLines.push(...commentLines);
      }

      outputLines.push(String(rule?.name ?? ''));
      outputLines.push(String(rule?.ruleSpec ?? ''));
    });
    return outputLines.join('\n');
  }

  isValid() {
    return this.errors.length === 0;
  }
}
