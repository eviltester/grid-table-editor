/*
 * Responsibilities:
 * - Owns test-data type catalogs and dropdown option composition.
 * - Centralizes faker/domain command discovery and visibility filtering.
 * - Provides pure helpers for command extraction from parsed rule specs.
 */

import { getKnownFakerCommandsAlphabetical, getKnownFakerCommandsLongestFirst } from '../../shared/faker-commands.js';
import {
  getKnownDomainCommandsAlphabetical,
  getKnownDomainCommandsLongestFirst,
  getDomainKeywordByCommand,
} from '../../shared/domain-commands.js';
import { getDomainCommandHelp } from '../../shared/domain-command-help-metadata.js';

const FAKER_COMMANDS = [];
const FAKER_COMMANDS_LONGEST_FIRST = [];
const DOMAIN_COMMANDS = [];
const DOMAIN_COMMANDS_LONGEST_FIRST = [];
const TOP_LEVEL_TYPE_OPTIONS = ['enum', 'literal', 'regex'];
const FAKER_SECTION_LABEL = '-- faker (incl helpers) --';
const FAKER_SECTION_VALUE = '__faker_section__';
const DOMAIN_SECTION_LABEL = '-- domain (no helpers) --';
const DOMAIN_SECTION_VALUE = '__domain_section__';
const DOMAIN_NON_SCALAR_RETURN_TYPES = new Set(['array', 'object']);

function findFakerCommand(aString) {
  for (let command of FAKER_COMMANDS_LONGEST_FIRST) {
    if (aString.startsWith(command)) {
      return command;
    }
  }
  return null;
}

function extractDomainCommandAndParams(ruleSpec) {
  const fullRule = String(ruleSpec || '').trim();
  if (!fullRule) {
    return { command: '', params: '' };
  }

  const exactKeyword = getDomainKeywordByCommand(fullRule);
  if (exactKeyword) {
    return {
      command: String(exactKeyword.shortestUniqueAlias || exactKeyword.keyword || '').trim(),
      params: '',
    };
  }

  const openParenIndex = fullRule.indexOf('(');
  if (openParenIndex > 0) {
    const commandPart = fullRule.slice(0, openParenIndex).trim();
    const commandKeyword = getDomainKeywordByCommand(commandPart);
    if (commandKeyword) {
      return {
        command: String(commandKeyword.shortestUniqueAlias || commandKeyword.keyword || '').trim(),
        params: fullRule.slice(openParenIndex),
      };
    }
  }

  for (let command of DOMAIN_COMMANDS_LONGEST_FIRST) {
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

function identifyFakerCommands() {
  FAKER_COMMANDS.length = 0;
  FAKER_COMMANDS_LONGEST_FIRST.length = 0;
  DOMAIN_COMMANDS.length = 0;
  DOMAIN_COMMANDS_LONGEST_FIRST.length = 0;

  TOP_LEVEL_TYPE_OPTIONS.forEach((typeOption) => FAKER_COMMANDS.push(typeOption));
  getKnownFakerCommandsAlphabetical()
    .filter((command) => command !== 'RegEx')
    .forEach((command) => FAKER_COMMANDS.push(command));
  getKnownFakerCommandsLongestFirst().forEach((command) => FAKER_COMMANDS_LONGEST_FIRST.push(command));
  getKnownDomainCommandsAlphabetical().forEach((command) => DOMAIN_COMMANDS.push(command));
  getKnownDomainCommandsLongestFirst().forEach((command) => DOMAIN_COMMANDS_LONGEST_FIRST.push(command));
}

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

function getVisibleDomainTypeOptions(currentValue = '') {
  const visible = getKnownDomainCommandsAlphabetical().filter((command) => isDomainCommandVisibleByDefault(command));
  const selected = String(currentValue || '').trim();
  if (selected && DOMAIN_COMMANDS.includes(selected) && !visible.includes(selected)) {
    visible.push(selected);
    visible.sort((a, b) => a.localeCompare(b));
  }
  return visible.map((command) => ({ value: command, label: command }));
}

function getTabulatorTypeEditorValues(currentValue = '') {
  const typeValues = TOP_LEVEL_TYPE_OPTIONS.map((typeOption) => ({ value: typeOption, label: typeOption }));
  const fakerHeader = {
    value: FAKER_SECTION_VALUE,
    label: FAKER_SECTION_LABEL,
    elementAttributes: { disabled: true },
  };
  const fakerCommandValues = getKnownFakerCommandsAlphabetical()
    .filter((command) => command !== 'RegEx')
    .map((command) => ({ value: command, label: command }));
  const domainHeader = {
    value: DOMAIN_SECTION_VALUE,
    label: DOMAIN_SECTION_LABEL,
    elementAttributes: { disabled: true },
  };
  const domainCommandValues = getVisibleDomainTypeOptions(currentValue);
  return [...typeValues, fakerHeader, ...fakerCommandValues, domainHeader, ...domainCommandValues];
}

function getAgGridTypeEditorValues(currentValue = '') {
  const values = [...FAKER_COMMANDS];
  const domainValues = getVisibleDomainTypeOptions(currentValue).map((entry) => entry.value);
  const seen = new Set(values);
  domainValues.forEach((value) => {
    if (!seen.has(value)) {
      values.push(value);
      seen.add(value);
    }
  });
  return values;
}

function getFakerCommands() {
  return [...FAKER_COMMANDS];
}

function getDomainCommands() {
  return [...DOMAIN_COMMANDS];
}

export {
  FAKER_COMMANDS,
  DOMAIN_COMMANDS,
  FAKER_SECTION_VALUE,
  DOMAIN_SECTION_VALUE,
  findFakerCommand,
  extractDomainCommandAndParams,
  identifyFakerCommands,
  getVisibleDomainTypeOptions,
  getTabulatorTypeEditorValues,
  getAgGridTypeEditorValues,
  getFakerCommands,
  getDomainCommands,
};
