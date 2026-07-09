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

    const executionValidation = validateDomainKeywordExecution({
      keyword: recognizedKeyword,
      keywordDefinition,
      args: parsed.args,
      faker: this.faker,
    });
    if (!executionValidation.ok) {
      this.validationError = executionValidation.error || 'Domain keyword failed during validation';
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

function createIsolatedFaker(fakerInstance) {
  const rawDefinitions = fakerInstance?.rawDefinitions;
  if (!rawDefinitions || typeof rawDefinitions !== 'object') {
    return fakerInstance;
  }

  const isolatedFaker = new Faker({ locale: rawDefinitions });
  isolatedFaker.seed(1);
  return isolatedFaker;
}

function validateDomainKeywordExecution({ keyword, keywordDefinition, args = [], faker = null } = {}) {
  const executionContext = createValidationExecutionContext(keywordDefinition, faker);
  if (!executionContext) {
    return { ok: true };
  }

  try {
    executeDomainKeyword(keyword, {
      ...executionContext,
      args,
      autoIncrementState: {},
    });
  } catch (error) {
    return {
      ok: false,
      error: error?.message || 'Domain keyword failed during validation',
    };
  }

  return { ok: true };
}

function createValidationExecutionContext(keywordDefinition, fakerInstance) {
  const delegateType = String(keywordDefinition?.delegate?.type || '').trim();

  if (delegateType === 'faker') {
    if (!fakerInstance || !hasFakerDelegateTarget(fakerInstance, keywordDefinition?.delegate?.target)) {
      return null;
    }

    return {
      faker: createIsolatedFaker(fakerInstance),
    };
  }

  if (delegateType === 'custom') {
    return fakerInstance
      ? {
          faker: createIsolatedFaker(fakerInstance),
        }
      : {};
  }

  return null;
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
