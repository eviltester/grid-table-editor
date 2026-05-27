/*
 * Responsibilities:
 * - Owns test-data command catalogs and command-editor option composition.
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
import { getVisibleDomainCommands } from '../../../shared/test-data/help/index.js';
import { buildSchemaHelpModel } from '../../../shared/test-data/help/help-model-builder.js';

const FAKER_COMMANDS = [];
const FAKER_COMMANDS_LONGEST_FIRST = [];
const DOMAIN_COMMANDS = [];
const DOMAIN_COMMANDS_LONGEST_FIRST = [];
const TOP_LEVEL_TYPE_OPTIONS = ['enum', 'literal', 'regex'];
const FAKER_SECTION_LABEL = '-- faker (helpers) --';
const FAKER_SECTION_VALUE = '__faker_section__';
const DOMAIN_SECTION_LABEL = '-- domain --';
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
    .filter((command) => command !== 'RegEx' && command.startsWith('helpers.'))
    .forEach((command) => FAKER_COMMANDS.push(command));
  getKnownFakerCommandsLongestFirst()
    .filter((command) => command.startsWith('helpers.'))
    .forEach((command) => FAKER_COMMANDS_LONGEST_FIRST.push(command));
  getKnownDomainCommandsAlphabetical().forEach((command) => DOMAIN_COMMANDS.push(command));
  getKnownDomainCommandsLongestFirst().forEach((command) => DOMAIN_COMMANDS_LONGEST_FIRST.push(command));
}

function getVisibleDomainCommandOptions(currentValue = '') {
  const visible = getVisibleDomainCommands({
    commands: getKnownDomainCommandsAlphabetical(),
    currentCommand: String(currentValue || '').trim(),
  });
  return visible.map((command) => ({ value: command, label: command }));
}

function getTabulatorCommandEditorValues(currentValue = '') {
  const typeValues = TOP_LEVEL_TYPE_OPTIONS.map((typeOption) => ({ value: typeOption, label: typeOption }));
  const fakerHeader = {
    value: FAKER_SECTION_VALUE,
    label: FAKER_SECTION_LABEL,
    elementAttributes: { disabled: true },
  };
  const fakerCommandValues = getKnownFakerCommandsAlphabetical()
    .filter((command) => command !== 'RegEx' && command.startsWith('helpers.'))
    .map((command) => ({ value: command, label: command }));
  const domainHeader = {
    value: DOMAIN_SECTION_VALUE,
    label: DOMAIN_SECTION_LABEL,
    elementAttributes: { disabled: true },
  };
  const domainCommandValues = getVisibleDomainCommandOptions(currentValue);
  return [...typeValues, domainHeader, ...domainCommandValues, fakerHeader, ...fakerCommandValues];
}

function getAgGridCommandEditorValues(currentValue = '') {
  const values = [...FAKER_COMMANDS];
  const domainValues = getVisibleDomainCommandOptions(currentValue).map((entry) => entry.value);
  const seen = new Set(values);
  domainValues.forEach((value) => {
    if (!seen.has(value)) {
      values.push(value);
      seen.add(value);
    }
  });
  return values;
}

function getMethodPickerOptions(currentValue = '') {
  const typeOptions = TOP_LEVEL_TYPE_OPTIONS.map((typeOption) => ({
    sourceType: typeOption,
    command: typeOption,
    label: typeOption,
    helpModel: buildSchemaHelpModel(typeOption, ''),
  }));
  const domainCommands = getVisibleDomainCommands({
    commands: getKnownDomainCommandsAlphabetical(),
    currentCommand: String(currentValue || '').trim(),
  });
  const fakerCommands = getKnownFakerCommandsAlphabetical().filter(
    (command) => command !== 'RegEx' && command.startsWith('helpers.')
  );
  const options = [...typeOptions];

  domainCommands.forEach((command) => {
    options.push({
      sourceType: 'domain',
      command,
      label: command,
      helpModel: buildSchemaHelpModel('domain', command),
    });
  });

  fakerCommands.forEach((command) => {
    options.push({
      sourceType: 'faker',
      command,
      label: command,
      helpModel: buildSchemaHelpModel('faker', command),
    });
  });

  return options;
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
  getVisibleDomainCommandOptions,
  getTabulatorCommandEditorValues,
  getAgGridCommandEditorValues,
  getMethodPickerOptions,
  getFakerCommands,
  getDomainCommands,
};
