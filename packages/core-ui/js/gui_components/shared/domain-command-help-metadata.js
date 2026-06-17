import { getDomainKeywordHelpByAlias } from '@anywaydata/core/domain/domain-keywords.js';

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
    args: [
      {
        name: 'values',
        type: 'comma-separated list',
        variadic: true,
        optional: false,
        description: 'List of allowed enum values chosen at random during generation.',
        example: 'active,inactive,pending',
      },
    ],
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

function getDomainCommandHelp(command) {
  const synthetic = SYNTHETIC_DOMAIN_HELP[String(command || '').trim()];
  if (synthetic) {
    return synthetic;
  }
  const commandHelp = getDomainKeywordHelpByAlias(command);
  if (!commandHelp) {
    return null;
  }

  return {
    canonical: commandHelp.canonical,
    summary: commandHelp.summary || '',
    docsUrl: resolveDomainDocsUrl(command, commandHelp.docsUrl || ''),
    example: commandHelp.example || '',
    examples: Array.isArray(commandHelp.examples) ? commandHelp.examples : [],
    exampleReturnValues: Array.isArray(commandHelp.exampleReturnValues)
      ? commandHelp.exampleReturnValues
      : Array.isArray(commandHelp.returnExamples)
        ? commandHelp.returnExamples
        : [],
    returnType: commandHelp.returnType || '',
    args: Array.isArray(commandHelp.args) ? commandHelp.args : [],
  };
}

export { getDomainCommandHelp };
