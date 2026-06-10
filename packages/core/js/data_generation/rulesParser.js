import { TestDataRules } from './testDataRules.js';
import { SchemaParsingErrors } from './schema-parsing-errors.js';
import { parseConstraintText } from './schema-constraint-parser.js';

function startsConstraint(trimmedLine) {
  return /^IF\s+(?:\[|\(|NOT\b)/i.test(trimmedLine);
}

function isEscapedQuote(text, index) {
  let backslashCount = 0;
  let back = index - 1;
  while (back >= 0 && text[back] === '\\') {
    backslashCount += 1;
    back -= 1;
  }
  return backslashCount % 2 !== 0;
}

function findConstraintTerminatorIndex(text) {
  let inQuote = null;
  let inParameter = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"' || char === "'") {
      if (!isEscapedQuote(text, index)) {
        inQuote = inQuote === char ? null : inQuote || char;
      }
      continue;
    }
    if (inQuote) {
      continue;
    }
    if (char === '[') {
      inParameter = true;
      continue;
    }
    if (char === ']' && inParameter) {
      inParameter = false;
      continue;
    }
    if (inParameter) {
      continue;
    }
    if (char === ';') {
      return index;
    }
    if (
      text.slice(index, index + 5).toUpperCase() === 'ENDIF' &&
      !/[A-Z0-9_]/i.test(text[index - 1] || '') &&
      !/[A-Z0-9_]/i.test(text[index + 5] || '')
    ) {
      return index;
    }
  }
  return -1;
}

function collectConstraintBlock(defnLines, startIndex) {
  const lines = [];
  let endIndex = startIndex;
  for (; endIndex < defnLines.length; endIndex += 1) {
    lines.push(defnLines[endIndex]);
    const joined = lines.join('\n');
    if (findConstraintTerminatorIndex(joined) >= 0) {
      return {
        text: joined,
        endIndex,
      };
    }
  }
  return {
    text: lines.join('\n'),
    endIndex: defnLines.length - 1,
  };
}

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
      this.errors.push(SchemaParsingErrors.invalidSchemaPairing());
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
          this.errors.push(SchemaParsingErrors.missingRuleDefinition(pendingName, pendingNameLine));
          return;
        }
        this.schemaTokens.push({ kind: 'blank', text: line, line: index + 1 });
        pendingLeadingTextLines.push(line);
        continue;
      }

      if (pendingName === null) {
        if (/^\s*#/.test(line)) {
          this.schemaTokens.push({ kind: 'comment', text: line, line: index + 1 });
          pendingLeadingTextLines.push(line);
          continue;
        }
        if (startsConstraint(trimmed)) {
          const constraintBlock = collectConstraintBlock(defnLines, index);
          const parsedConstraint = parseConstraintText(constraintBlock.text, { startLine: index + 1 });
          if (!parsedConstraint.ok) {
            this.errors.push(...parsedConstraint.errors);
            return;
          }
          this.testDataRules.addConstraint({
            sourceText: constraintBlock.text,
            ast: parsedConstraint.ast,
            terminator: parsedConstraint.terminator,
            referencedParameters: parsedConstraint.referencedParameters,
            line: index + 1,
          });
          this.schemaTokens.push({
            kind: 'constraint',
            text: constraintBlock.text,
            line: index + 1,
            endLine: constraintBlock.endIndex + 1,
            terminator: parsedConstraint.terminator,
          });
          index = constraintBlock.endIndex;
          pendingLeadingTextLines = [];
          continue;
        }
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
      this.errors.push(SchemaParsingErrors.missingRuleDefinition(pendingName, pendingNameLine));
      return;
    }

    if (this.testDataRules.rules.length === 0) {
      this.errors.push(SchemaParsingErrors.invalidSchemaPairing());
      return;
    }

    const knownColumns = new Set(this.testDataRules.rules.map((rule) => String(rule?.name ?? '').trim()));
    this.testDataRules.constraints.forEach((constraint) => {
      const referencedParameters = Array.isArray(constraint?.referencedParameters)
        ? constraint.referencedParameters
        : [];
      referencedParameters.forEach((parameterName) => {
        if (!knownColumns.has(parameterName)) {
          this.errors.push(SchemaParsingErrors.unknownConstraintParameter(parameterName, constraint?.line));
        }
      });
    });
    if (this.errors.length > 0) {
      this.testDataRules.constraints = [];
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
      if (token.kind === 'constraint') {
        outputLines.push(...String(token.text ?? '').split('\n'));
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
