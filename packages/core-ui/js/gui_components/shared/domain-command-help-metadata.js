import { getDomainKeywordByCommand } from './domain-commands.js';

function getDomainCommandHelp(command) {
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
