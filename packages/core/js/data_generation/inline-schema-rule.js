import { looksLikeRegexShorthand } from './utils/regex-rule-detection.js';

function startsConstraint(trimmedLine) {
  return /^IF\s+(?:\[|\(|NOT\b)/i.test(trimmedLine);
}

function looksLikeInlineRuleSpec(ruleText) {
  const trimmed = String(ruleText ?? '').trim();
  if (trimmed.length === 0 || startsConstraint(trimmed)) {
    return false;
  }

  if (
    /^(?:enum|literal|regex|datatype\.(?:enum|literal|regex)|awd\.datatype\.(?:enum|literal|regex))\s*\(/i.test(trimmed)
  ) {
    return true;
  }

  if (/^(?:faker\.)?[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)+(?:\s*\(.*\)\s*|\s*)$/i.test(trimmed)) {
    return true;
  }

  if (looksLikeRegexShorthand(trimmed)) {
    return true;
  }

  if (!trimmed.includes(',')) {
    return false;
  }

  const values = trimmed.split(',').map((value) => value.trim());
  if (values.length < 2 || values.some((value) => value.length === 0 || value.length > 50)) {
    return false;
  }

  return !values.some((value) => /[[\]{}()^$*+?|\\]/.test(value) || (value.includes('.') && /[A-Z]/.test(value)));
}

export { startsConstraint, looksLikeInlineRuleSpec };
