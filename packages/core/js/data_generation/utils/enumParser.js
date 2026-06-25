import { DomainKeywordInvocationParser } from '../../domain/parser/DomainKeywordInvocationParser.js';

/**
 * Shared utility for parsing enum rule specifications
 * Handles both simple comma-separated and function-based enum formats
 */
export class EnumParser {
  static unescapeQuotedEnumValue(value) {
    return String(value ?? '').replace(/\\(["\\])/g, '$1');
  }

  static isShorthandEnumFormat(ruleSpec) {
    return /^enum\s+/.test(String(ruleSpec || '').trim());
  }

  static unwrapOptionalListParens(value) {
    const text = String(value || '').trim();
    if (text.startsWith('(') && text.endsWith(')') && text.length >= 2) {
      return text.slice(1, -1).trim();
    }
    return text;
  }

  static isParenthesizedListFormat(ruleSpec) {
    const spec = String(ruleSpec || '').trim();
    return spec.startsWith('(') && spec.endsWith(')') && spec.includes(',');
  }

  /**
   * Check if rule spec has an enum function invocation shape.
   * This does not validate whether the invocation has usable enum values.
   * @param {string} ruleSpec - The rule specification to check
   * @returns {boolean} True if using enum function invocation shape
   */
  static hasEnumInvocationShape(ruleSpec) {
    return /^(enum|datatype\.enum|awd\.datatype\.enum)\s*\([\s\S]*\)$/i.test(String(ruleSpec || '').trim());
  }

  static hasAwdEnumInvocationPrefix(ruleSpec) {
    return /^(enum|datatype\.enum|awd\.datatype\.enum)\s*\(/i.test(String(ruleSpec || '').trim());
  }

  static hasNonEnumInvocationPrefix(ruleSpec) {
    const spec = String(ruleSpec || '').trim();
    return /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*\s*\(/.test(spec) && !this.hasAwdEnumInvocationPrefix(spec);
  }

  static serializeDomainEnumValue(value) {
    return JSON.stringify(String(value ?? ''));
  }

  static buildCanonicalDomainRuleSpecFromValues(values = []) {
    const normalizedValues = (Array.isArray(values) ? values : []).map((value) => String(value));
    return `datatype.enum(${normalizedValues.map((value) => this.serializeDomainEnumValue(value)).join(', ')})`;
  }

  static serializeSchemaEnumValue(value) {
    return JSON.stringify(String(value ?? ''));
  }

  static buildCanonicalSchemaRuleSpecFromValues(values = []) {
    const normalizedValues = (Array.isArray(values) ? values : []).map((value) => String(value));
    return `enum(${normalizedValues.map((value) => this.serializeSchemaEnumValue(value)).join(',')})`;
  }

  static buildCsvLiteralFromValues(values = []) {
    return (Array.isArray(values) ? values : [])
      .map((value) => {
        const text = String(value ?? '');
        if (text.length === 0 || text.includes(',') || text.includes('"') || text !== text.trim()) {
          return `"${text.replace(/"/g, '""')}"`;
        }
        return text;
      })
      .join(',');
  }

  static buildCanonicalDomainRuleSpec(ruleSpecOrValues) {
    const values = Array.isArray(ruleSpecOrValues) ? ruleSpecOrValues : this.extractEnumValues(ruleSpecOrValues);
    return this.buildCanonicalDomainRuleSpecFromValues(values);
  }

  static buildCanonicalSchemaRuleSpec(ruleSpecOrValues) {
    const values = Array.isArray(ruleSpecOrValues) ? ruleSpecOrValues : this.extractEnumValues(ruleSpecOrValues);
    return this.buildCanonicalSchemaRuleSpecFromValues(values);
  }

  static normalizeToCanonicalDomainRuleSpec(ruleSpec) {
    return this.buildCanonicalDomainRuleSpec(ruleSpec);
  }

  static normalizeToCanonicalSchemaRuleSpec(ruleSpec) {
    return this.buildCanonicalSchemaRuleSpec(ruleSpec);
  }

  static isCanonicalDomainEnumRuleSpec(ruleSpec) {
    return /^datatype\.enum\s*\([\s\S]+\)$/i.test(String(ruleSpec || '').trim());
  }

  static isCanonicalSchemaSerializableEnumRuleSpec(ruleSpec) {
    const spec = String(ruleSpec || '').trim();
    const parsed = this.parseEnumRuleSpec(spec, { allowImplicitCsv: false });
    return parsed.ok && parsed.explicit && parsed.source !== 'parenthesized-list';
  }

  static isImplicitCsvEnumRuleSpec(ruleSpec) {
    const spec = String(ruleSpec || '').trim();
    if (!spec.includes(',')) {
      return false;
    }

    try {
      const values = this.parseCsvLiteral(spec);
      return values.length >= 2 && values.every((value) => value.length > 0);
    } catch {
      return false;
    }
  }

  static parseEnumRuleSpec(ruleSpec, { allowImplicitCsv = true } = {}) {
    const spec = String(ruleSpec || '').trim();
    if (!spec) {
      return { ok: false, values: [], explicit: false, source: '', error: 'Invalid enum format' };
    }

    if (this.hasAwdEnumInvocationPrefix(spec)) {
      try {
        return {
          ok: true,
          values: this.parseEnumFunctionValues(spec),
          explicit: true,
          source: 'function',
          error: '',
        };
      } catch (error) {
        return {
          ok: false,
          values: [],
          explicit: true,
          source: 'function',
          error: error?.message || String(error),
        };
      }
    }

    if (this.isShorthandEnumFormat(spec)) {
      return {
        ok: false,
        values: [],
        explicit: true,
        source: 'shorthand',
        error: 'Invalid enum format: use a CSV literal or enum("value1", "value2")',
      };
    }

    if (this.isParenthesizedListFormat(spec)) {
      try {
        return {
          ok: true,
          values: this.extractEnumValues(spec),
          explicit: true,
          source: 'parenthesized-list',
          error: '',
        };
      } catch (error) {
        return {
          ok: false,
          values: [],
          explicit: true,
          source: 'parenthesized-list',
          error: error?.message || String(error),
        };
      }
    }

    if (this.hasNonEnumInvocationPrefix(spec)) {
      return { ok: false, values: [], explicit: false, source: '', error: 'Invalid enum format' };
    }

    if (allowImplicitCsv && spec.includes(',')) {
      try {
        const values = this.parseCsvLiteral(spec);
        if (values.some((value) => value.length === 0)) {
          return {
            ok: false,
            values: [],
            explicit: false,
            source: 'implicit-csv',
            error: 'Enum values cannot be empty',
          };
        }
        if (values.length < 2) {
          return {
            ok: false,
            values: [],
            explicit: false,
            source: 'implicit-csv',
            error: 'Enum must have at least 2 values',
          };
        }
        return {
          ok: true,
          values,
          explicit: false,
          source: 'implicit-csv',
          error: '',
        };
      } catch (error) {
        return {
          ok: false,
          values: [],
          explicit: false,
          source: 'implicit-csv',
          error: error?.message || String(error),
        };
      }
    }

    return { ok: false, values: [], explicit: false, source: '', error: 'Invalid enum format' };
  }

  static isEnumRuleSpec(ruleSpec, { allowImplicitCsv = true, includeParenthesizedList = false } = {}) {
    const parsed = this.parseEnumRuleSpec(ruleSpec, { allowImplicitCsv });
    if (!parsed.ok && parsed.explicit) {
      return true;
    }
    if (!parsed.ok && parsed.source === 'implicit-csv') {
      return true;
    }
    if (!parsed.ok) {
      return false;
    }
    return includeParenthesizedList || parsed.source !== 'parenthesized-list';
  }

  static extractEnumDisplayValue(ruleSpec) {
    const value = String(ruleSpec ?? '').trim();
    const wrappedMatch = value.match(/^(?:enum|datatype\.enum|awd\.datatype\.enum)\s*\(([\s\S]*)\)$/i);
    if (wrappedMatch) {
      const parsed = this.parseEnumRuleSpec(value, { allowImplicitCsv: false });
      if (parsed.ok) {
        return this.buildCsvLiteralFromValues(parsed.values);
      }
      return wrappedMatch[1].trim();
    }
    if (this.isShorthandEnumFormat(value)) {
      const shorthand = value.replace(/^enum\s+/i, '').trim();
      return this.unwrapOptionalListParens(shorthand);
    }
    return this.unwrapOptionalListParens(value);
  }

  static buildSchemaRuleSpecFromInput(enumInput) {
    const enumValue = String(enumInput ?? '').trim();
    if (enumValue.length === 0) {
      return '';
    }
    const parsed = this.parseEnumRuleSpec(enumValue);
    if (parsed.ok) {
      return this.buildCanonicalSchemaRuleSpecFromValues(parsed.values);
    }
    const displayValue = this.extractEnumDisplayValue(enumValue);
    if (this.looksLikeEnumInvocationArgumentFragment(displayValue)) {
      const fragmentParsed = this.parseEnumRuleSpec(`enum(${displayValue})`, { allowImplicitCsv: false });
      if (fragmentParsed.ok) {
        return this.buildCanonicalSchemaRuleSpecFromValues(fragmentParsed.values);
      }
      if (fragmentParsed.explicit) {
        throw new Error(fragmentParsed.error);
      }
    }
    return this.buildCanonicalSchemaRuleSpecFromValues(this.parseCsvLiteral(displayValue));
  }

  static looksLikeEnumInvocationArgumentFragment(value) {
    const text = String(value || '').trim();
    return text.startsWith('[') || /^(csv|values)\s*=/i.test(text);
  }

  static isEnumLikeRule(rule = {}) {
    const ruleType = String(rule?.type || '')
      .trim()
      .toLowerCase();
    if (ruleType === 'enum') {
      return true;
    }
    return ruleType === 'domain' && this.isCanonicalDomainEnumRuleSpec(rule?.ruleSpec);
  }

  static unwrapNamedValuesArgument(paramsStr) {
    const text = String(paramsStr || '').trim();
    const namedMatch = text.match(/^([A-Za-z_$][\w$]*)\s*=/);
    if (namedMatch && namedMatch[1].toLowerCase() !== 'values') {
      throw new Error(`Invalid keyword arguments: unknown named argument "${namedMatch[1]}"`);
    }

    const match = text.match(/^values\s*=\s*([\s\S]*)$/i);
    if (!match) {
      return null;
    }

    const valuesText = match[1].trim();
    if (valuesText.startsWith('"')) {
      if (!(valuesText.length >= 2 && valuesText.endsWith('"') && valuesText[valuesText.length - 2] !== '\\')) {
        throw new Error('Invalid keyword arguments: unclosed quote in argument "values"');
      }
    }

    if (
      valuesText.length >= 2 &&
      valuesText.startsWith('"') &&
      valuesText.endsWith('"') &&
      valuesText[valuesText.length - 2] !== '\\'
    ) {
      return this.unescapeQuotedEnumValue(valuesText.slice(1, -1));
    }

    return valuesText;
  }

  static parseCsvLiteral(csvText) {
    const text = String(csvText ?? '');
    const values = [];
    let currentValue = '';
    let inQuotes = false;
    let quotedField = false;
    let afterClosingQuote = false;

    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];

      if (inQuotes) {
        if (char === '"') {
          if (text[index + 1] === '"') {
            currentValue += '"';
            index += 1;
          } else {
            inQuotes = false;
            afterClosingQuote = true;
          }
        } else {
          currentValue += char;
        }
        continue;
      }

      if (afterClosingQuote) {
        if (char === ',') {
          values.push(currentValue);
          currentValue = '';
          quotedField = false;
          afterClosingQuote = false;
          continue;
        }
        if (char === ' ' || char === '\t') {
          continue;
        }
        throw new Error('Invalid enum CSV: unexpected content after closing quote');
      }

      if (char === ',') {
        values.push(quotedField ? currentValue : currentValue.trim());
        currentValue = '';
        quotedField = false;
        continue;
      }

      if (char === '"') {
        if (currentValue.trim().length > 0) {
          throw new Error('Invalid enum CSV: unexpected quote in unquoted value');
        }
        inQuotes = true;
        quotedField = true;
        currentValue = '';
        continue;
      }

      currentValue += char;
    }

    if (inQuotes) {
      throw new Error('Invalid enum CSV: unclosed quote');
    }

    values.push(quotedField || afterClosingQuote ? currentValue : currentValue.trim());

    return values;
  }

  static validateEnumValueList(values, sourceName = 'values') {
    if (!Array.isArray(values)) {
      throw new Error(`Invalid keyword arguments: argument "${sourceName}" must be an array`);
    }
    if (values.length === 0) {
      throw new Error('Invalid keyword arguments: argument "values" is required');
    }
    if (values.some((value) => typeof value !== 'string')) {
      throw new Error(`Invalid keyword arguments: argument "${sourceName}" must contain only strings`);
    }
    if (values.some((value) => value.length === 0)) {
      throw new Error('Enum values cannot be empty');
    }
    return values;
  }

  static parseCsvEnumValues(csvText) {
    return this.validateEnumValueList(this.parseCsvLiteral(csvText), 'csv');
  }

  static parseEnumFunctionValues(ruleSpec) {
    const invocationParser = new DomainKeywordInvocationParser();
    const parsed = invocationParser.parse(ruleSpec);
    if (!parsed.ok) {
      throw new Error(parsed.error || 'Invalid enum format');
    }

    const keyword = String(parsed.keyword || '').toLowerCase();
    if (!['enum', 'datatype.enum', 'awd.datatype.enum'].includes(keyword)) {
      throw new Error('Invalid enum format');
    }

    return this.extractEnumValuesFromParsedArguments(parsed.arguments || []);
  }

  static extractEnumValuesFromParsedArguments(args = []) {
    if (!Array.isArray(args) || args.length === 0) {
      throw new Error('Invalid keyword arguments: argument "values" is required');
    }

    const hasNamedArgs = args.some((argument) => argument.kind === 'named');
    const hasPositionalArgs = args.some((argument) => argument.kind !== 'named');
    if (hasNamedArgs && hasPositionalArgs) {
      throw new Error('Invalid keyword arguments: cannot mix named and positional enum arguments');
    }

    if (hasNamedArgs) {
      if (args.length !== 1) {
        throw new Error('Invalid keyword arguments: enum accepts one named argument');
      }
      const [argument] = args;
      const name = String(argument.name || '').toLowerCase();
      if (name === 'csv') {
        if (typeof argument.value !== 'string') {
          throw new Error('Invalid keyword arguments: argument "csv" must be string');
        }
        return this.parseCsvEnumValues(argument.value);
      }
      if (name === 'values') {
        if (Array.isArray(argument.value)) {
          return this.validateEnumValueList(argument.value, 'values');
        }
        if (typeof argument.value === 'string') {
          return this.parseCsvEnumValues(argument.value);
        }
        throw new Error('Invalid keyword arguments: argument "values" must be string or array');
      }
      throw new Error(`Invalid keyword arguments: unknown named argument "${argument.name}"`);
    }

    const positionalValues = args.map((argument) => argument.value);
    if (positionalValues.length === 1) {
      const [value] = positionalValues;
      if (Array.isArray(value)) {
        return this.validateEnumValueList(value, 'values');
      }
      if (typeof value === 'string') {
        return this.parseCsvEnumValues(value);
      }
      throw new Error('Invalid keyword arguments: enum values must be strings or an array of strings');
    }

    return this.validateEnumValueList(positionalValues, 'values');
  }

  static splitEnumParameterValues(paramsStr) {
    const values = [];
    let currentValue = '';
    let inQuotes = false;
    let i = 0;

    while (i < paramsStr.length) {
      const char = paramsStr[i];

      if (char === '"' && (i === 0 || paramsStr[i - 1] !== '\\')) {
        // Toggle quote state for unescaped quotes
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        // Found separator outside quotes
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        // Add character to current value
        currentValue += char;
      }
      i++;
    }

    if (inQuotes) {
      throw new Error('Invalid keyword arguments: unclosed quote in enum values');
    }

    // Add final value
    values.push(currentValue.trim());

    if (values.length === 0 || values.every((value) => value.length === 0)) {
      throw new Error('No valid values found in enum');
    }

    // Remove surrounding quotes from quoted values
    return values.map((value) => {
      const trimmed = value.trim();
      if (trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed.length >= 2) {
        return this.unescapeQuotedEnumValue(trimmed.slice(1, -1));
      }
      return trimmed;
    });
  }

  /**
   * Extract enum values from rule specification
   * Handles both formats:
   * - Simple: "value1,value2,value3"
   * - Function: enum("value1","value2","value3")
   * @param {string} ruleSpec - The rule specification to parse
   * @returns {string[]} Array of enum values
   */
  static extractEnumValues(ruleSpec) {
    const spec = String(ruleSpec || '').trim();

    // Check if it's a formal enum function format
    if (this.hasAwdEnumInvocationPrefix(spec)) {
      return this.parseEnumFunctionValues(spec);
    }

    if (this.isShorthandEnumFormat(spec)) {
      throw new Error('Invalid enum format: use a CSV literal or enum("value1", "value2")');
    }

    // Simple comma-separated format
    return this.parseCsvLiteral(this.unwrapOptionalListParens(spec));
  }

  /**
   * Extract values from formal enum function formats
   * Handles: enum("value1", "value2", "value3")
   * @param {string} ruleSpec - The function-format rule specification
   * @returns {string[]} Array of enum values
   */
  static extractAwdEnumValues(ruleSpec) {
    return this.parseEnumFunctionValues(ruleSpec);
  }
}
