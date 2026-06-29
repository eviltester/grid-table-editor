export class RegexTestDataRuleValidator {
  constructor(aRandExp) {
    this.RandExp = aRandExp;
    this.validationError = '';
  }

  validate(aTestDataRule) {
    this.validationError = '';
    const ruleSpec = String(aTestDataRule?.ruleSpec ?? '');
    const forcedValidationError = String(aTestDataRule?._regexValidationError ?? '');
    if (forcedValidationError.length > 0) {
      this.validationError = forcedValidationError;
      return false;
    }

    if (ruleSpec.trim().length === 0) {
      this.validationError = 'Regex pattern is required and cannot be blank';
      return false;
    }

    try {
      new this.RandExp(ruleSpec).gen();
      return true;
    } catch (err) {
      this.validationError = err;
      return false;
    }
  }

  isValid() {
    return !this.validationError;
  }

  getValidationError() {
    return this.validationError;
  }
}
