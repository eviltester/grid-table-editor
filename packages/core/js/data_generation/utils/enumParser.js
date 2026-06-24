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
   * Check if rule spec uses AWD enum function format
   * @param {string} ruleSpec - The rule specification to check
   * @returns {boolean} True if using function format
   */
  static isAwdEnumFormat(ruleSpec) {
    return /^(enum|datatype\.enum|awd\.datatype\.enum)\s*\([\s\S]*\)$/i.test(String(ruleSpec || '').trim());
  }

  static hasAwdEnumInvocationPrefix(ruleSpec) {
    return /^(enum|datatype\.enum|awd\.datatype\.enum)\s*\(/i.test(String(ruleSpec || '').trim());
  }

  static serializeDomainEnumValue(value) {
    return JSON.stringify(String(value ?? ''));
  }

  static buildCanonicalDomainRuleSpecFromValues(values = []) {
    const normalizedValues = (Array.isArray(values) ? values : []).map((value) => String(value));
    return `datatype.enum(${normalizedValues.map((value) => this.serializeDomainEnumValue(value)).join(', ')})`;
  }

  static serializeSchemaEnumValue(value) {
    const text = String(value ?? '');
    if (/^[^,\s"()]+$/u.test(text)) {
      return text;
    }
    return JSON.stringify(text);
  }

  static buildCanonicalSchemaRuleSpecFromValues(values = []) {
    const normalizedValues = (Array.isArray(values) ? values : []).map((value) => String(value));
    return `enum(${normalizedValues.map((value) => this.serializeSchemaEnumValue(value)).join(',')})`;
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
    return this.isCanonicalDomainEnumRuleSpec(spec) || this.isAwdEnumFormat(spec) || this.isShorthandEnumFormat(spec);
  }

  static isImplicitCsvEnumRuleSpec(ruleSpec) {
    const spec = String(ruleSpec || '').trim();
    if (!spec.includes(',')) {
      return false;
    }

    const values = spec.split(',').map((value) => value.trim());
    if (values.length < 2) {
      return false;
    }

    return (
      values.every((value) => value.length > 0 && value.length <= 50) &&
      !values.some((value) => {
        return /[[\]{}()^$*+?|\\]/.test(value) || (value.includes('.') && /[A-Z]/.test(value));
      })
    );
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
          values: this.extractAwdEnumValues(spec),
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
      try {
        return {
          ok: true,
          values: this.extractEnumValues(spec),
          explicit: true,
          source: 'shorthand',
          error: '',
        };
      } catch (error) {
        return {
          ok: false,
          values: [],
          explicit: true,
          source: 'shorthand',
          error: error?.message || String(error),
        };
      }
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

    if (allowImplicitCsv && this.isImplicitCsvEnumRuleSpec(spec)) {
      try {
        return {
          ok: true,
          values: this.extractEnumValues(spec),
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
    if (!parsed.ok) {
      return false;
    }
    return includeParenthesizedList || parsed.source !== 'parenthesized-list';
  }

  static extractEnumDisplayValue(ruleSpec) {
    const value = String(ruleSpec ?? '').trim();
    const wrappedMatch = value.match(/^(?:enum|datatype\.enum|awd\.datatype\.enum)\s*\(([\s\S]*)\)$/i);
    if (wrappedMatch) {
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
    return `enum(${this.extractEnumDisplayValue(enumValue)})`;
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
    const match = text.match(/^values\s*=\s*([\s\S]*)$/i);
    if (!match) {
      return null;
    }

    const valuesText = match[1].trim();
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
   * - Function: enum("value1","value2","value3") or enum(value1,value2,value3)
   * @param {string} ruleSpec - The rule specification to parse
   * @returns {string[]} Array of enum values
   */
  static extractEnumValues(ruleSpec) {
    const spec = String(ruleSpec || '').trim();

    // Check if it's a formal enum function format
    if (this.hasAwdEnumInvocationPrefix(spec)) {
      return this.extractAwdEnumValues(spec);
    }

    if (this.isShorthandEnumFormat(spec)) {
      const shorthand = spec.replace(/^enum\s+/i, '');
      return this.extractEnumValues(this.unwrapOptionalListParens(shorthand));
    }

    // Simple comma-separated format
    return this.unwrapOptionalListParens(spec)
      .split(',')
      .map((v) => {
        const trimmed = v.trim();
        if (trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed.length >= 2) {
          return this.unescapeQuotedEnumValue(trimmed.slice(1, -1));
        }
        return trimmed;
      });
  }

  /**
   * Extract values from formal enum function formats
   * Handles: enum(value1,value2) and enum("value1", "value2", "value3")
   * @param {string} ruleSpec - The function-format rule specification
   * @returns {string[]} Array of enum values
   */
  static extractAwdEnumValues(ruleSpec) {
    // Match patterns like: enum(value1,value2) or enum("value1", "value2", "value3")
    const match = ruleSpec.match(/^(?:enum|datatype\.enum|awd\.datatype\.enum)\s*\(\s*(.+)\s*\)$/);
    if (!match) {
      throw new Error('Invalid enum format');
    }

    const paramsStr = match[1].trim();
    const namedValues = this.unwrapNamedValuesArgument(paramsStr);
    if (namedValues !== null) {
      return this.extractEnumValues(namedValues);
    }

    return this.splitEnumParameterValues(paramsStr);
  }
}
