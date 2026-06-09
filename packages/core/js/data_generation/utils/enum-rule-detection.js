import { EnumParser } from './enumParser.js';

function isExplicitEnumRule(ruleSpec) {
  const spec = String(ruleSpec || '').trim();
  return (
    EnumParser.isAwdEnumFormat(spec) ||
    EnumParser.isShorthandEnumFormat(spec) ||
    (spec.startsWith('(') && spec.endsWith(')') && spec.includes(','))
  );
}

export { isExplicitEnumRule };
