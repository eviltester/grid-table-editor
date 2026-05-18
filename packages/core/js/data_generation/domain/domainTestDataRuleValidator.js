import { parseKeywordInvocation } from '../../domain/domain-keyword-parser.js';

class DomainTestDataRuleValidator {
  constructor() {
    this.validationError = '';
    this.lastParsed = null;
  }

  validate(aTestDataRule) {
    this.validationError = '';
    this.lastParsed = null;

    const ruleSpec = String(aTestDataRule?.ruleSpec || '').trim();
    const parsed = parseKeywordInvocation(ruleSpec);
    if (!Array.isArray(parsed?.errors) || parsed.errors.length > 0) {
      this.validationError = Array.isArray(parsed?.errors)
        ? parsed.errors[0] || 'Invalid domain rule'
        : 'Invalid domain rule';
      return false;
    }

    this.lastParsed = {
      keyword: parsed.keyword,
      args: Array.isArray(parsed.args) ? parsed.args : [],
    };
    return true;
  }

  isValid() {
    return this.validationError.length === 0;
  }

  getValidationError() {
    return this.validationError;
  }
}

export { DomainTestDataRuleValidator };
