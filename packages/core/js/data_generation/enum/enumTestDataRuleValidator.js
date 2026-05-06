export class EnumTestDataRuleValidator {
  constructor() {
    this.validationError = '';
  }

  validate(aTestDataRule) {
    this.validationError = '';

    try {
      const ruleSpec = String(aTestDataRule.ruleSpec || '');

      // Handle different enum formats
      let enumValues;
      if (this.isAwdEnumFormat(ruleSpec)) {
        enumValues = this.extractAwdEnumValues(ruleSpec);
      } else {
        // Simple comma-separated format
        enumValues = ruleSpec.split(',').map((v) => v.trim());
      }

      // Must have at least 2 values
      if (enumValues.length < 2) {
        this.validationError = 'Enum must have at least 2 values';
        return false;
      }

      // Values must not be empty
      if (enumValues.some((v) => v.length === 0)) {
        this.validationError = 'Enum values cannot be empty';
        return false;
      }

      return true;
    } catch (err) {
      this.validationError = err.message || String(err);
      return false;
    }
  }

  isAwdEnumFormat(ruleSpec) {
    return /^(enum|datatype\.enum|awd\.datatype\.enum)\s*\(/.test(ruleSpec);
  }

  extractAwdEnumValues(ruleSpec) {
    // Match patterns like: enum(value1,value2) or enum("value1", "value2", "value3")
    const match = ruleSpec.match(/^(?:enum|datatype\.enum|awd\.datatype\.enum)\s*\(\s*(.+)\s*\)$/);
    if (!match) {
      throw new Error('Invalid enum format');
    }

    const paramsStr = match[1].trim();
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
        if (currentValue.trim().length > 0) {
          values.push(currentValue.trim());
        }
        currentValue = '';
      } else {
        // Add character to current value
        currentValue += char;
      }
      i++;
    }

    // Add final value
    if (currentValue.trim().length > 0) {
      values.push(currentValue.trim());
    }

    if (values.length === 0) {
      throw new Error('No valid values found in enum');
    }

    // Remove surrounding quotes from quoted values
    return values.map((value) => {
      const trimmed = value.trim();
      if (trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed.length >= 2) {
        return trimmed.slice(1, -1);
      }
      return trimmed;
    });
  }

  isValid() {
    return this.validationError.length === 0;
  }

  getValidationError() {
    return this.validationError;
  }
}
