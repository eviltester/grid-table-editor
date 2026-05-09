import { TestDataRule } from './testDataRule.js';

class TestDataRules {
  constructor() {
    this.rules = [];
    this.errors = [];
  }

  getRules() {
    return JSON.parse(JSON.stringify(this.rules));
  }

  getRule(aName) {
    const normalizedName = String(aName ?? '')
      .toLowerCase()
      .trim();
    const retRules = this.rules.filter(
      (rule) =>
        String(rule.name ?? '')
          .toLowerCase()
          .trim() === normalizedName
    );
    return retRules[0];
  }

  addRule(aName, aRule, options = {}) {
    this.rules.push(new TestDataRule(aName.trim(), aRule, options));
  }
}

export { TestDataRules };
