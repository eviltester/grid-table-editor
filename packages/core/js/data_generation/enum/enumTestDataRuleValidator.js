import { EnumParser } from '../utils/enumParser.js';

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
      if (EnumParser.isAwdEnumFormat(ruleSpec)) {
        enumValues = EnumParser.extractAwdEnumValues(ruleSpec);
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

  isValid() {
    return this.validationError.length === 0;
  }

  getValidationError() {
    return this.validationError;
  }
}
