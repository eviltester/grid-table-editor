import { mapDataRuleToSchemaRow } from '../../shared/test-data/schema/schema-row-mapper.js';
import { createSchemaRowValidation } from '../../shared/test-data/schema/schema-row-validation.js';
import { getVisibleDomainCommands } from '../../shared/test-data/help/domain-command-provider.js';
import { buildSchemaHelpModel } from '../../shared/test-data/help/help-model-builder.js';

function createGeneratorSchemaDefinitionSupport({
  createBlankRow,
  fakerCommands = [],
  domainCommands = [],
  buildModeHelpHtml = () => '',
  validateSchemaRows = (rows) => ({ rows, errors: [] }),
} = {}) {
  const getVisibleGeneratorDomainCommands = (currentValue = '') =>
    getVisibleDomainCommands({
      commands: domainCommands,
      currentCommand: String(currentValue || '').trim(),
    });

  const mapRuleToRow = (rule, leadingTextLines = []) => {
    const row = mapDataRuleToSchemaRow(rule, {
      createBlankSchemaRow: createBlankRow,
    });
    row.leadingTextLines = Array.isArray(leadingTextLines) ? leadingTextLines.slice() : [];
    return row;
  };

  const getSchemaHelpData = (sourceType, commandValue) => buildSchemaHelpModel(sourceType, commandValue);

  const getMethodPickerOptions = (currentValue = '') => [
    {
      sourceType: 'enum',
      command: 'enum',
      helpModel: getSchemaHelpData('enum', 'enum'),
    },
    {
      sourceType: 'literal',
      command: 'literal',
      helpModel: getSchemaHelpData('literal', 'literal'),
    },
    {
      sourceType: 'regex',
      command: 'regex',
      helpModel: getSchemaHelpData('regex', 'regex'),
    },
    ...getVisibleGeneratorDomainCommands(currentValue).map((command) => ({
      sourceType: 'domain',
      command,
      helpModel: getSchemaHelpData('domain', command),
    })),
    ...fakerCommands.map((command) => ({
      sourceType: 'faker',
      command,
      helpModel: getSchemaHelpData('faker', command),
    })),
  ];

  return {
    createBlankRow,
    mapRuleToRow,
    getVisibleDomainCommands: getVisibleGeneratorDomainCommands,
    getMethodPickerOptions,
    buildModeHelpHtml,
    validateSchemaRows,
    createSchemaRowValidation,
  };
}

export { createGeneratorSchemaDefinitionSupport };
