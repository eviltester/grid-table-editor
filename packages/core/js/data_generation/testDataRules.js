import { TestDataRule } from './testDataRule.js';

class TestDataRules {
  constructor() {
    this.rules = [];
    this.constraints = [];
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

  addConstraint(constraint) {
    this.constraints.push({
      sourceText: String(constraint?.sourceText ?? ''),
      ast: constraint?.ast || null,
      terminator: constraint?.terminator || ';',
      referencedParameters: Array.isArray(constraint?.referencedParameters)
        ? constraint.referencedParameters.map((name) => String(name ?? '').trim())
        : [],
      line: constraint?.line,
    });
  }
}

export { TestDataRules };
