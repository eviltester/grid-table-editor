import { getDomainKeywordHelpByAlias } from './domain-keywords.js';

const DOMAIN_NON_SCALAR_RETURN_TYPES = new Set(['array', 'object']);

function normaliseReturnType(returnType) {
  return String(returnType || '')
    .trim()
    .toLowerCase();
}

function isDomainCommandVisibleByDefault(command) {
  const commandHelp = getDomainKeywordHelpByAlias(command);
  const returnType = normaliseReturnType(commandHelp?.returnType);
  if (!returnType) {
    return true;
  }
  return !DOMAIN_NON_SCALAR_RETURN_TYPES.has(returnType);
}

function getVisibleDomainCommands({ commands = [], currentCommand = '' } = {}) {
  const visible = (Array.isArray(commands) ? commands : []).filter((command) =>
    isDomainCommandVisibleByDefault(command)
  );
  const selected = String(currentCommand || '').trim();
  if (selected && commands.includes(selected) && !visible.includes(selected)) {
    visible.push(selected);
    visible.sort((a, b) => a.localeCompare(b));
  }
  return visible;
}

export { DOMAIN_NON_SCALAR_RETURN_TYPES, isDomainCommandVisibleByDefault, getVisibleDomainCommands };
