import { getKnownFakerCommandsAlphabetical } from '../../shared/faker-commands.js';
import { getKnownDomainCommandsAlphabetical } from '../../shared/domain-commands.js';
import { buildSchemaModeHelpHtml } from '../../shared/test-data/help/schema-mode-help-builder.js';
import { GENERATE_TO_FILE_HELP_URL } from '../constants.js';
import { createGeneratorSchemaDefinitionSupport } from '../schema-support/create-generator-schema-definition-support.js';
import { createGeneratorSchemaRowFactory } from '../schema-support/create-generator-schema-row-factory.js';
import { createGeneratorRuntimeSchemaSessionDependencies } from './create-generator-runtime-schema-session-dependencies.js';

function createGeneratorRuntimeSchemaSupportDependencies({
  faker,
  RandExp,
  schemaTextToDataRules,
  schemaRowsToSpecWithTokens,
  validateSchemaRows,
  mapRuleToRow,
} = {}) {
  const fakerCommands = getKnownFakerCommandsAlphabetical().filter(
    (command) => command !== 'RegEx' && command.startsWith('helpers.')
  );
  const domainCommands = getKnownDomainCommandsAlphabetical();
  const createBlankGeneratorSchemaRow = createGeneratorSchemaRowFactory();
  const generatorSchemaDefinitionSupport = createGeneratorSchemaDefinitionSupport({
    createBlankRow: createBlankGeneratorSchemaRow,
    fakerCommands,
    domainCommands,
    buildModeHelpHtml: ({ inTextMode }) =>
      buildSchemaModeHelpHtml({
        inTextMode,
        supplementalLinkUrl: GENERATE_TO_FILE_HELP_URL,
        supplementalLinkText: 'Generate To File docs',
      }),
    validateSchemaRows,
  });

  return {
    fakerCommands,
    domainCommands,
    generatorSchemaDefinitionSupport,
    ...createGeneratorRuntimeSchemaSessionDependencies({
      generatorSchemaDefinitionSupport,
      faker,
      RandExp,
      schemaTextToDataRules,
      schemaRowsToSpecWithTokens,
      mapRuleToRow,
    }),
  };
}

export { createGeneratorRuntimeSchemaSupportDependencies };
