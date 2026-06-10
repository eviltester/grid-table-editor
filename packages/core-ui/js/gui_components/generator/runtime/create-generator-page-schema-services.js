import { getKnownFakerCommandsAlphabetical } from '../../shared/faker-commands.js';
import { getKnownDomainCommandsAlphabetical } from '../../shared/domain-commands.js';
import { buildSchemaModeHelpHtml } from '../../shared/test-data/help/schema-mode-help-builder.js';
import { createSchemaEditingSession } from '../../shared/test-data/schema/schema-controller.js';
import { GENERATE_TO_FILE_HELP_URL } from '../constants.js';
import { createGeneratorSchemaGenerationService } from '../generation/generator-schema-generation-service.js';
import { createGeneratorSchemaDefinitionSupport } from '../schema-support/create-generator-schema-definition-support.js';
import { createGeneratorSchemaRowFactory } from '../schema-support/create-generator-schema-row-factory.js';
import { createGeneratorSchemaRuntimeService } from './generator-schema-runtime-service.js';
import { createGeneratorSchemaStateService } from './generator-schema-state-service.js';

function createGeneratorPageSchemaServices({
  runtime,
  faker,
  RandExp,
  TestDataGeneratorClass,
  schemaTextToDataRules,
  schemaRowsToSpec,
  schemaRowsToSpecWithTokens,
  validateSchemaRows = (rows) => ({ rows, errors: [] }),
  mapRuleToRow,
  dataRulesToSchemaText,
  sampleSchemaText,
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

  const schemaSession = createSchemaEditingSession({
    createBlankSchemaRow: generatorSchemaDefinitionSupport.createBlankRow,
    schemaTextToDataRules,
    faker,
    RandExp,
    mapRuleToRow,
    schemaRowsToSpecWithTokens,
  });

  const generatorSchemaRuntime = createGeneratorSchemaRuntimeService({
    getSchemaDefinition: () => runtime?.schemaDefinition,
    getSchemaRows: () => runtime?.schemaRows,
    getSchemaTextTokens: () => runtime?.schemaTextTokens,
    validateSchemaRows,
    showSchemaErrorStatus: (message) => runtime?.schemaErrorDisplay?.show?.(message),
    clearSchemaErrorStatus: () => runtime?.schemaErrorDisplay?.clear?.(),
    setGenerationStatus: (message, options) => runtime?.generatorViewState?.setGenerationStatus(message, options),
    scheduleClearGenerationStatus: (delay) => runtime?.generatorViewState?.scheduleClearGenerationStatus(delay),
  });

  const generatorSchemaGenerationService = createGeneratorSchemaGenerationService({
    syncSchemaRowsFromTextMode: (options) => runtime?.generatorSchemaRuntime?.syncSchemaRowsFromTextMode(options),
    validateSchemaRows,
    schemaRowsToSpec,
    schemaTextToDataRules,
    getSchemaText: () => runtime?.schemaDefinition?.getSchemaText?.() || '',
    TestDataGeneratorClass,
    faker,
    RandExp,
  });

  const generatorSchemaState = createGeneratorSchemaStateService({
    getSchemaDefinition: () => runtime?.schemaDefinition,
    getSchemaSession: () => runtime?.schemaSession,
    updatePairwiseButtonVisibility: () => runtime?.updateAllPairsButtonVisibility?.(),
  });

  return {
    fakerCommands,
    domainCommands,
    generatorSchemaDefinitionSupport,
    schemaSession,
    generatorSchemaRuntime,
    generatorSchemaGenerationService,
    generatorSchemaState,
    schemaTextToDataRules,
    dataRulesToSchemaText,
    sampleSchemaText,
  };
}

export { createGeneratorPageSchemaServices };
