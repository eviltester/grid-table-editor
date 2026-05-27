import { getDomainKeywordByCommand } from './domain-commands.js';

const ANYWAYDATA_DOMAIN_DOCS_BASE = 'https://anywaydata.com/docs/test-data/domain';

const SYNTHETIC_DOMAIN_HELP = Object.freeze({
  'datatype.enum': {
    canonical: 'awd.domain.datatype.enum',
    summary:
      'Enum helper accepts a list of values and returns one value at random. Supports enum(value1,value2), enum value1,value2, or datatype.enum(value1,value2).',
    docsUrl: `${ANYWAYDATA_DOMAIN_DOCS_BASE}/datatype`,
    example: 'datatype.enum(active,inactive,pending)',
    examples: ['datatype.enum(active,inactive,pending)'],
    exampleReturnValues: ['active', 'inactive', 'pending'],
    returnType: 'string',
    args: [],
  },
});

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
  const domainPage = getDomainPageFromCommand(command);
  if (domainPage) {
    return domainPage;
  }
  const fallback = String(keywordDocsUrl || '').trim();
  return fallback || `${ANYWAYDATA_DOMAIN_DOCS_BASE}/domain-test-data`;
}

function getDomainCommandHelp(command) {
  const synthetic = SYNTHETIC_DOMAIN_HELP[String(command || '').trim()];
  if (synthetic) {
    return synthetic;
  }
  const keyword = getDomainKeywordByCommand(command);
  if (!keyword) {
    return null;
  }

  return {
    canonical: keyword.canonical,
    summary: keyword.help?.summary || '',
    docsUrl: resolveDomainDocsUrl(command, keyword.help?.docsUrl || ''),
    example: keyword.help?.example || '',
    examples: Array.isArray(keyword.help?.examples) ? keyword.help.examples : [],
    exampleReturnValues: Array.isArray(keyword.help?.exampleReturnValues)
      ? keyword.help.exampleReturnValues
      : Array.isArray(keyword.help?.returnExamples)
        ? keyword.help.returnExamples
        : [],
    returnType: keyword.help?.returnType || '',
    args: Array.isArray(keyword.help?.args) ? keyword.help.args : [],
  };
}

export { getDomainCommandHelp };
