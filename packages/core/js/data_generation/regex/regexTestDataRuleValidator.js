export class RegexTestDataRuleValidator {
  constructor(aRandExp) {
    this.RandExp = aRandExp;
    this.validationError = '';
  }

  validate(aTestDataRule) {
    this.validationError = '';

    try {
      new this.RandExp(aTestDataRule.ruleSpec).gen();
      return true;
    } catch (err) {
      this.validationError = err;
      return false;
    }
  }

  isValid() {
    return this.validationError.length == 0;
  }

  getValidationError() {
    return this.validationError;
  }
}
