/**
 * Enum for TestDataRule types
 */
export const RuleType = {
  UNKNOWN: '',
  REGEX: 'regex',
  FAKER: 'faker',
  LITERAL: 'literal',
  BOOLEAN: 'boolean',
  ENUM: 'enum',
};

class TestDataRule {
  constructor(aName, aRule = '') {
    this.name = aName;
    this.ruleSpec = aRule;
    // we don't know what the command is until we compile it
    this.fakerCommand = '';
    this.type = RuleType.UNKNOWN; // by default unknown type,
    // can be assigned using RuleType enum values
    // new types can be added to the RuleType enum
  }

  /**
   * Set the rule type using the RuleType enum
   * @param {string} ruleType - Value from RuleType enum
   */
  setType(ruleType) {
    if (Object.values(RuleType).includes(ruleType)) {
      this.type = ruleType;
    } else {
      throw new Error(`Invalid rule type: ${ruleType}. Must be one of: ${Object.values(RuleType).join(', ')}`);
    }
  }

  /**
   * Check if the rule is of a specific type
   * @param {string} ruleType - Value from RuleType enum
   * @returns {boolean}
   */
  isType(ruleType) {
    return this.type === ruleType;
  }

  /**
   * Get all available rule types
   * @returns {Object} RuleType enum
   */
  static getRuleTypes() {
    return RuleType;
  }
}

export { TestDataRule };
