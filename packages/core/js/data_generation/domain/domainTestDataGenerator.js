import { executeDomainKeyword } from '../../domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../domain/domain-keyword-parser.js';
import { dataResponse, errorResponse } from '../ruleResponse.js';

class DomainTestDataGenerator {
  constructor(aFaker) {
    this.faker = aFaker;
  }

  generateFrom(aRule) {
    const ruleSpec = String(aRule?.ruleSpec || '').trim();
    const parsed = parseKeywordInvocation(ruleSpec);
    if (Array.isArray(parsed?.errors) && parsed.errors.length > 0) {
      return errorResponse(parsed.errors[0]);
    }

    try {
      const result = executeDomainKeyword(parsed.keyword, {
        faker: this.faker,
        args: Array.isArray(parsed.args) ? parsed.args : [],
      });
      return dataResponse(result);
    } catch (error) {
      return errorResponse(error?.message || String(error));
    }
  }
}

export { DomainTestDataGenerator };
