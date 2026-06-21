import { parseKeywordInvocation } from '../../domain/domain-keyword-parser.js';
import {
  DOMAIN_KEYWORD_ALIAS_INDEX,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../domain/domain-keywords.js';

class DomainTestDataRuleValidator {
  constructor() {
    this.validationError = '';
    this.lastParsed = null;
  }

  validate(aTestDataRule) {
    this.validationError = '';
    this.lastParsed = null;

    const ruleSpec = String(aTestDataRule?.ruleSpec || '').trim();
    if (
      ruleSpec.startsWith('helpers.') ||
      ruleSpec.startsWith('awd.domain.helpers.') ||
      ruleSpec.startsWith('domain.helpers.')
    ) {
      this.validationError = 'helpers_not_supported_in_domain: helpers.* is faker-only; use faker.helpers.*';
      return false;
    }

    const parsed = parseKeywordInvocation(ruleSpec);
    const recognizedKeyword = String(parsed?.keyword || '').trim();
    this.lastParsed = {
      keyword: recognizedKeyword,
      recognized: Boolean(recognizedKeyword && DOMAIN_KEYWORD_ALIAS_INDEX.byAlias?.[recognizedKeyword]),
      args: Array.isArray(parsed?.args) ? parsed.args : [],
      errors: Array.isArray(parsed?.errors) ? parsed.errors : [],
    };
    if (!Array.isArray(parsed?.errors) || parsed.errors.length > 0) {
      this.validationError = Array.isArray(parsed?.errors)
        ? parsed.errors[0] || 'Invalid domain rule'
        : 'Invalid domain rule';
      return false;
    }

    const keywordDefinition = getDomainKeywordByAlias(recognizedKeyword);
    if (!keywordDefinition) {
      this.validationError = `Unknown keyword: ${recognizedKeyword}`;
      return false;
    }

    const argsValidation = validateDomainKeywordArgs(keywordDefinition, parsed.args);
    if (!argsValidation.ok) {
      this.validationError = argsValidation.error || 'Invalid keyword arguments';
      return false;
    }

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
