/*
 * Responsibilities:
 * - Provides shared metadata-driven filtering for domain command visibility.
 * - Centralizes return-type normalization for domain command dropdown filtering.
 */

import { getDomainCommandHelp } from '../../domain-command-help-metadata.js';

const DOMAIN_NON_SCALAR_RETURN_TYPES = new Set(['array', 'object']);

function normaliseReturnType(returnType) {
  return String(returnType || '')
    .trim()
    .toLowerCase();
}

function isDomainCommandVisibleByDefault(command) {
  const commandHelp = getDomainCommandHelp(command);
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

export { isDomainCommandVisibleByDefault, getVisibleDomainCommands };
