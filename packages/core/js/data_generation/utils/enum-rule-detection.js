import { EnumParser } from './enumParser.js';

function isExplicitEnumRule(ruleSpec) {
  return EnumParser.parseEnumRuleSpec(ruleSpec, { allowImplicitCsv: false }).explicit === true;
}

export { isExplicitEnumRule };
