import { getDomainKeywordHelpByAlias } from '@anywaydata/core/domain/domain-keywords.js';
import { normalizeUsageExamples } from '@anywaydata/core/command-help/command-help-contract.js';
import { validateEnumMemberValue } from '@anywaydata/core/command-help/command-help-validators.js';

const ANYWAYDATA_DOMAIN_DOCS_BASE = 'https://anywaydata.com/docs/test-data/domain';

const SYNTHETIC_DOMAIN_HELP = Object.freeze({
  'datatype.enum': {
    canonical: 'awd.domain.datatype.enum',
    summary:
      'Enum helper accepts a list of values and returns one value at random. Supports enum(value1,value2), enum value1,value2, or datatype.enum(value1,value2).',
    docsUrl: `${ANYWAYDATA_DOMAIN_DOCS_BASE}/datatype`,
    usageExamples: [
      {
        functionCall: 'datatype.enum(active,inactive,pending)',
        sampleReturnValue: 'active',
        description: 'Shows the canonical datatype enum helper with three discrete values.',
      },
    ],
    returnType: 'string',
    validator: validateEnumMemberValue,
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

function normalizeSyntheticDomainHelp(command, definition) {
  const args = Array.isArray(definition?.args) ? definition.args : [];
  const usageExamples = normalizeUsageExamples({
    command,
    returnType: definition?.returnType,
    usageExamples: definition?.usageExamples,
  });

  return {
    canonical: definition.canonical,
    summary: definition.summary,
    docsUrl: definition.docsUrl,
    fakerDocsUrl: String(definition.fakerDocsUrl || '').trim(),
    usageExamples,
    validator: definition?.validator,
    returnType: definition.returnType,
    args,
  };
}

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
  const normalizedCommand = String(command || '').trim();
  const synthetic = SYNTHETIC_DOMAIN_HELP[normalizedCommand];
  if (synthetic) {
    return normalizeSyntheticDomainHelp(normalizedCommand, synthetic);
  }
  const commandHelp = getDomainKeywordHelpByAlias(command);
  if (!commandHelp) {
    return null;
  }

  return {
    canonical: commandHelp.canonical,
    summary: commandHelp.summary || '',
    docsUrl: resolveDomainDocsUrl(command, commandHelp.docsUrl || ''),
    fakerDocsUrl: String(commandHelp.fakerDocsUrl || '').trim(),
    usageExamples: Array.isArray(commandHelp.usageExamples) ? commandHelp.usageExamples : [],
    validator: commandHelp.validator,
    returnType: commandHelp.returnType || '',
    args: Array.isArray(commandHelp.args) ? commandHelp.args : [],
  };
}

export { getDomainCommandHelp };
