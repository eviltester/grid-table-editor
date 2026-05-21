/*
 * Responsibilities:
 * - Shared parsing of faker/domain command specs into command + params fragments.
 * - Supports alias-aware domain command resolution via injected keyword lookup.
 */

function extractFakerCommandAndParams(ruleSpec, { normaliseFakerCommand, fakerCommandsLongestFirst } = {}) {
  const normalisedSpec = normaliseFakerCommand
    ? normaliseFakerCommand(String(ruleSpec ?? '').trim())
    : String(ruleSpec ?? '').trim();

  const commands = Array.isArray(fakerCommandsLongestFirst) ? fakerCommandsLongestFirst : [];
  for (const command of commands) {
    if (normalisedSpec === command) {
      return { command, params: '' };
    }
    if (normalisedSpec.startsWith(command)) {
      return {
        command,
        params: normalisedSpec.slice(command.length),
      };
    }
  }

  return { command: '', params: normalisedSpec };
}

function extractDomainCommandAndParams(
  ruleSpec,
  { normaliseDomainCommand, getDomainKeywordByCommand, domainCommandsLongestFirst } = {}
) {
  const fullRule = normaliseDomainCommand
    ? normaliseDomainCommand(String(ruleSpec ?? '').trim())
    : String(ruleSpec ?? '').trim();
  if (!fullRule) {
    return { command: '', params: '' };
  }

  const toDisplayCommand = (keywordEntry) =>
    String(keywordEntry?.shortestUniqueAlias || keywordEntry?.keyword || '').trim();

  const exactKeyword = getDomainKeywordByCommand?.(fullRule);
  if (exactKeyword) {
    return { command: toDisplayCommand(exactKeyword), params: '' };
  }

  const openParenIndex = fullRule.indexOf('(');
  if (openParenIndex > 0) {
    const commandPart = fullRule.slice(0, openParenIndex).trim();
    const commandKeyword = getDomainKeywordByCommand?.(commandPart);
    if (commandKeyword) {
      return {
        command: toDisplayCommand(commandKeyword),
        params: fullRule.slice(openParenIndex),
      };
    }
  }

  const commands = Array.isArray(domainCommandsLongestFirst) ? domainCommandsLongestFirst : [];
  for (const command of commands) {
    if (!fullRule.startsWith(command)) {
      continue;
    }
    const remainder = fullRule.slice(command.length);
    if (remainder.length === 0 || remainder.startsWith('(')) {
      return { command, params: remainder };
    }
  }

  return { command: '', params: fullRule };
}

export { extractFakerCommandAndParams, extractDomainCommandAndParams };
