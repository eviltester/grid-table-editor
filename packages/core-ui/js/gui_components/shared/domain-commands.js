import { DOMAIN_KEYWORD_ALIAS_INDEX } from '@anywaydata/core/domain/domain-keywords.js';

const SYNTHETIC_DOMAIN_COMMANDS = Object.freeze(['datatype.enum']);

function getDomainKeywordEntries() {
  const entries = Object.values(DOMAIN_KEYWORD_ALIAS_INDEX.byCanonical || {});
  return entries.sort((a, b) => String(a.keyword || '').localeCompare(String(b.keyword || '')));
}

function getKnownDomainCommandsAlphabetical() {
  const commands = getDomainKeywordEntries().map((entry) => {
    const shortest = String(entry.shortestUniqueAlias || '').trim();
    return shortest || String(entry.keyword || '').trim();
  });
  SYNTHETIC_DOMAIN_COMMANDS.forEach((command) => {
    if (!commands.includes(command)) {
      commands.push(command);
    }
  });
  return commands.sort((a, b) => a.localeCompare(b));
}

function getKnownDomainCommandsLongestFirst() {
  return [...getKnownDomainCommandsAlphabetical()].sort((a, b) => b.length - a.length || a.localeCompare(b));
}

function getDomainKeywordByCommand(command) {
  const key = String(command || '').trim();
  if (!key) {
    return null;
  }
  return DOMAIN_KEYWORD_ALIAS_INDEX.byAlias[key] || null;
}

export { getKnownDomainCommandsAlphabetical, getKnownDomainCommandsLongestFirst, getDomainKeywordByCommand };
