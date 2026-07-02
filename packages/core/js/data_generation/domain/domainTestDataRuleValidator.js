import { Faker } from '@faker-js/faker';
import { parseKeywordInvocation } from '../../domain/domain-keyword-parser.js';
import {
  DOMAIN_KEYWORD_ALIAS_INDEX,
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../domain/domain-keywords.js';

class DomainTestDataRuleValidator {
  constructor(aFaker = null) {
    this.faker = aFaker;
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

    if (
      this.faker &&
      keywordDefinition.delegate?.type === 'faker' &&
      hasFakerDelegateTarget(this.faker, keywordDefinition.delegate?.target)
    ) {
      const validationFaker = createIsolatedFaker(this.faker);
      try {
        executeDomainKeyword(recognizedKeyword, {
          faker: validationFaker,
          args: parsed.args,
          autoIncrementState: {},
        });
      } catch (error) {
        this.validationError = error?.message || 'Domain keyword failed during validation';
        return false;
      }
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

function createIsolatedFaker(fakerInstance) {
  const rawDefinitions = fakerInstance?.rawDefinitions;
  const isolatedFaker = new Faker({ locale: rawDefinitions });
  isolatedFaker.seed(1);
  return isolatedFaker;
}

function hasFakerDelegateTarget(fakerInstance, target) {
  const parts = String(target || '')
    .split('.')
    .filter((part) => part.length > 0);
  let node = fakerInstance;

  for (const part of parts) {
    node = node?.[part];
  }

  return typeof node === 'function';
}

export { DomainTestDataRuleValidator };
