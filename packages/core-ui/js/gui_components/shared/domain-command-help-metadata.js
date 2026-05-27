import { getDomainKeywordByCommand } from './domain-commands.js';

const SYNTHETIC_DOMAIN_HELP = Object.freeze({
  'datatype.enum': {
    canonical: 'awd.domain.datatype.enum',
    summary:
      'Enum helper accepts a list of values and returns one value at random. Supports enum(value1,value2), enum value1,value2, or datatype.enum(value1,value2).',
    docsUrl: 'https://anywaydata.com/docs/category/generating-data',
    example: 'datatype.enum(active,inactive,pending)',
    returnType: 'string',
    args: [],
  },
});

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
    docsUrl: keyword.help?.docsUrl || '',
    example: keyword.help?.example || '',
    returnType: keyword.help?.returnType || '',
    args: Array.isArray(keyword.help?.args) ? keyword.help.args : [],
  };
}

export { getDomainCommandHelp };
