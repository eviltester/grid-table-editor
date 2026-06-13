import { executeDomainKeyword } from '../../domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../domain/domain-keyword-parser.js';
import { dataResponse, errorResponse } from '../ruleResponse.js';

class DomainTestDataGenerator {
  constructor(aFaker) {
    this.faker = aFaker;
    this.autoIncrementStates = new Map();
    this.ruleAutoIncrementKeys = new WeakMap();
    this.nextAutoIncrementRuleId = 1;
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
        autoIncrementState: this.#getAutoIncrementStateForRule(aRule),
      });
      return dataResponse(result);
    } catch (error) {
      return errorResponse(error?.message || String(error));
    }
  }

  resetState() {
    this.autoIncrementStates = new Map();
    this.ruleAutoIncrementKeys = new WeakMap();
    this.nextAutoIncrementRuleId = 1;
  }

  captureState() {
    return {
      autoIncrementStates: Array.from(this.autoIncrementStates.entries()).map(([key, value]) => [key, { ...value }]),
      nextAutoIncrementRuleId: this.nextAutoIncrementRuleId,
    };
  }

  restoreState(snapshot = null) {
    if (!snapshot) {
      this.resetState();
      return;
    }

    this.autoIncrementStates = new Map(
      Array.isArray(snapshot.autoIncrementStates)
        ? snapshot.autoIncrementStates.map(([key, value]) => [key, { ...value }])
        : []
    );
    this.nextAutoIncrementRuleId = Number.isInteger(snapshot.nextAutoIncrementRuleId)
      ? snapshot.nextAutoIncrementRuleId
      : 1;
  }

  #getAutoIncrementStateForRule(aRule) {
    if (!aRule || typeof aRule !== 'object') {
      return {};
    }

    let stateKey = this.ruleAutoIncrementKeys.get(aRule);
    if (!stateKey) {
      stateKey = `autoIncrementRule:${this.nextAutoIncrementRuleId}`;
      this.nextAutoIncrementRuleId += 1;
      this.ruleAutoIncrementKeys.set(aRule, stateKey);
    }

    if (!this.autoIncrementStates.has(stateKey)) {
      this.autoIncrementStates.set(stateKey, {});
    }

    return this.autoIncrementStates.get(stateKey);
  }
}

export { DomainTestDataGenerator };
