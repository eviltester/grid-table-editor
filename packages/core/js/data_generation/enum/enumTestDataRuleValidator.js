import { EnumParser } from '../utils/enumParser.js';
import { isExplicitEnumRule } from '../utils/enum-rule-detection.js';

export class EnumTestDataRuleValidator {
  constructor() {
    this.validationError = '';
  }

  validate(aTestDataRule) {
    this.validationError = '';

    try {
      const ruleSpec = String(aTestDataRule.ruleSpec || '');
      const enumValues = EnumParser.extractEnumValues(ruleSpec);
      const minimumValues = isExplicitEnumRule(ruleSpec) ? 1 : 2;

      // Explicit enum(...) syntax supports a single value, while implicit CSV enums still need at least two.
      if (enumValues.length < minimumValues) {
        this.validationError = `Enum must have at least ${minimumValues} value${minimumValues === 1 ? '' : 's'}`;
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
