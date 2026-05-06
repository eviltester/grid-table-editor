import { dataResponse, errorResponse } from '../ruleResponse.js';

export class EnumTestDataGenerator {
  constructor() {}

  generateFrom(aRule) {
    try {
      const ruleSpec = String(aRule.ruleSpec || '');
      let enumValues;

      // Handle different enum formats
      if (this.isAwdEnumFormat(ruleSpec)) {
        enumValues = this.extractAwdEnumValues(ruleSpec);
      } else {
        // Simple comma-separated format
        enumValues = ruleSpec.split(',').map((v) => v.trim());
      }

      // Randomly select one of the enum values
      const randomIndex = Math.floor(Math.random() * enumValues.length);
      return dataResponse(enumValues[randomIndex]);
    } catch (e) {
      return errorResponse('Enum Generation Error: ' + e.message);
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
}
