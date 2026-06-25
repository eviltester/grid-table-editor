import { DOMAIN_KEYWORD_ALIAS_INDEX, getDomainKeywordHelpByAlias } from './domain-keywords.js';

const ANYWAYDATA_DOMAIN_DOCS_BASE = 'https://anywaydata.com/docs/test-data/domain';

function getDomainPageFromCommand(command) {
  const value = String(command || '').trim();
  if (!value.includes('.')) {
    return '';
  }
  const domain = value.split('.')[0];
  if (!domain) {
    return '';
  }
  return `${ANYWAYDATA_DOMAIN_DOCS_BASE}/${domain}`;
}

function resolveDomainDocsUrl(command, keywordDocsUrl) {
  const explicitDocsUrl = String(keywordDocsUrl || '').trim();
  if (
    explicitDocsUrl.startsWith('https://anywaydata.com/') ||
    explicitDocsUrl.startsWith('/docs/') ||
    explicitDocsUrl.startsWith('docs/')
  ) {
    return explicitDocsUrl;
  }
  const domainPage = getDomainPageFromCommand(command);
  if (domainPage) {
    return domainPage;
  }
  return explicitDocsUrl || `${ANYWAYDATA_DOMAIN_DOCS_BASE}/domain-test-data`;
}

function getDomainKeywordEntries() {
  const entries = Object.values(DOMAIN_KEYWORD_ALIAS_INDEX.byCanonical || {});
  return entries.sort((a, b) => String(a.keyword || '').localeCompare(String(b.keyword || '')));
}

function getKnownDomainCommandsAlphabetical() {
  return getDomainKeywordEntries()
    .map((entry) => {
      const shortest = String(entry.shortestUniqueAlias || '').trim();
      return shortest || String(entry.keyword || '').trim();
    })
    .sort((a, b) => a.localeCompare(b));
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

function getDomainCommandHelp(command) {
  const normalizedCommand = String(command || '').trim();
  const commandHelp = getDomainKeywordHelpByAlias(command);
  if (!commandHelp) {
    return null;
  }

  return {
    canonical: String(commandHelp.canonical || '').trim(),
    keyword: String(commandHelp.keyword || normalizedCommand).trim(),
    summary: String(commandHelp.summary || '').trim(),
    docsUrl: resolveDomainDocsUrl(command, commandHelp.docsUrl || ''),
    fakerDocsUrl: String(commandHelp.fakerDocsUrl || '').trim(),
    usageExamples: Array.isArray(commandHelp.usageExamples) ? commandHelp.usageExamples : [],
    validator: commandHelp.validator,
    returnType: String(commandHelp.returnType || '').trim(),
    args: Array.isArray(commandHelp.args) ? commandHelp.args : [],
  };
}

export {
  getDomainCommandHelp,
  getDomainKeywordByCommand,
  getKnownDomainCommandsAlphabetical,
  getKnownDomainCommandsLongestFirst,
  resolveDomainDocsUrl,
};
