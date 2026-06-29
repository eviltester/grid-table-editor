const JS_REGEX_FLAGS_PATTERN = /^[dgimsuvy]*$/;

function findClosingSlash(text) {
  let inCharacterClass = false;
  for (let index = 1; index < text.length; index += 1) {
    const char = text[index];
    if (char === '\\') {
      index += 1;
      continue;
    }
    if (char === '[') {
      inCharacterClass = true;
      continue;
    }
    if (char === ']' && inCharacterClass) {
      inCharacterClass = false;
      continue;
    }
    if (char === '/' && !inCharacterClass) {
      return index;
    }
  }
  return -1;
}

function parseJavaScriptRegexLiteral(ruleSpec) {
  const spec = String(ruleSpec || '').trim();
  if (!spec.startsWith('/') || spec.length < 2) {
    return { ok: false, pattern: spec, flags: '', error: 'not a JavaScript regex literal' };
  }

  const closingSlashIndex = findClosingSlash(spec);
  if (closingSlashIndex <= 0) {
    return { ok: false, pattern: spec, flags: '', error: 'missing closing slash' };
  }

  const pattern = spec.slice(1, closingSlashIndex);
  const flags = spec.slice(closingSlashIndex + 1);
  if (!JS_REGEX_FLAGS_PATTERN.test(flags)) {
    return { ok: false, pattern, flags, error: `unsupported JavaScript regex flags "${flags}"` };
  }

  if (flags.length > 0) {
    return { ok: false, pattern, flags, error: 'JavaScript regex flags are not supported' };
  }

  if (pattern.length === 0) {
    return { ok: false, pattern, flags, error: 'Regex pattern is required and cannot be blank' };
  }

  return { ok: true, pattern, flags, error: '' };
}

function isJavaScriptRegexLiteral(ruleSpec) {
  return parseJavaScriptRegexLiteral(ruleSpec).ok;
}

function looksLikeJavaScriptRegexLiteral(ruleSpec) {
  const spec = String(ruleSpec || '').trim();
  return spec.startsWith('/') && findClosingSlash(spec) > 0;
}

function looksLikeRegexShorthand(ruleSpec) {
  const spec = String(ruleSpec || '').trim();
  if (spec.length === 0) {
    return false;
  }
  if (looksLikeJavaScriptRegexLiteral(spec)) {
    return true;
  }
  return /[\\[\]{}()*+?|^$]/.test(spec);
}

function normalizeRegexRuleSpec(ruleSpec) {
  const parsed = parseJavaScriptRegexLiteral(ruleSpec);
  return parsed.ok ? parsed.pattern : String(ruleSpec || '').trim();
}

export {
  looksLikeJavaScriptRegexLiteral,
  looksLikeRegexShorthand,
  normalizeRegexRuleSpec,
  parseJavaScriptRegexLiteral,
  isJavaScriptRegexLiteral,
};
