/*
 * Responsibilities:
 * - Owns test-data type catalogs and dropdown option composition.
 * - Centralizes faker/domain command discovery and visibility filtering.
 * - Provides pure helpers for command extraction from parsed rule specs.
 */

import {
  getKnownFakerCommandsAlphabetical,
  getKnownFakerCommandsLongestFirst,
} from '../../../shared/faker-commands.js';
import {
  getKnownDomainCommandsAlphabetical,
  getKnownDomainCommandsLongestFirst,
} from '../../../shared/domain-commands.js';
import { getVisibleDomainCommands } from '../../../shared/test-data/help/domain-command-provider.js';

const FAKER_COMMANDS = [];
const FAKER_COMMANDS_LONGEST_FIRST = [];
const DOMAIN_COMMANDS = [];
const DOMAIN_COMMANDS_LONGEST_FIRST = [];
const TOP_LEVEL_TYPE_OPTIONS = ['enum', 'literal', 'regex'];
const FAKER_SECTION_LABEL = '-- faker (incl helpers) --';
const FAKER_SECTION_VALUE = '__faker_section__';
const DOMAIN_SECTION_LABEL = '-- domain (no helpers) --';
const DOMAIN_SECTION_VALUE = '__domain_section__';

function findFakerCommand(aString) {
  for (let command of FAKER_COMMANDS_LONGEST_FIRST) {
    if (aString.startsWith(command)) {
      return command;
    }
  }
  return null;
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

function getVisibleDomainTypeOptions(currentValue = '') {
  const visible = getVisibleDomainCommands({
    commands: getKnownDomainCommandsAlphabetical(),
    currentCommand: String(currentValue || '').trim(),
  });
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
  identifyFakerCommands,
  getVisibleDomainTypeOptions,
  getTabulatorTypeEditorValues,
  getAgGridTypeEditorValues,
  getFakerCommands,
  getDomainCommands,
};
