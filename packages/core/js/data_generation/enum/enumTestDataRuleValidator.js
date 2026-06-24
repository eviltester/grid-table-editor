import { EnumParser } from '../utils/enumParser.js';

export class EnumTestDataRuleValidator {
  constructor() {
    this.validationError = '';
  }

  validate(aTestDataRule) {
    this.validationError = '';

    try {
      const ruleSpec = String(aTestDataRule.ruleSpec || '');
      let parsed = EnumParser.parseEnumRuleSpec(ruleSpec);
      if (!parsed.ok && !parsed.explicit) {
        parsed = {
          ok: true,
          values: EnumParser.extractEnumValues(ruleSpec),
          explicit: false,
          source: 'legacy-enum-type',
          error: '',
        };
      }

      if (!parsed.ok) {
        this.validationError = parsed.error;
        return false;
      }

      const enumValues = parsed.values;
      const minimumValues = parsed.explicit ? 1 : 2;

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
