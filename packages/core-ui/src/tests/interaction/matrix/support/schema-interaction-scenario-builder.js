import { getAllowedFakerCommandsAlphabetical } from '../../../../../js/gui_components/shared/faker-commands.js';
import { getFakerCommandHelp } from '@anywaydata/core/faker/faker-helper-keyword-definitions.js';
import { faker } from '@faker-js/faker';
import RandExp from 'randexp';
import { TestDataGenerator } from '@anywaydata/core/data_generation/testDataGenerator.js';
import { Exporter } from '@anywaydata/core/grid/exporter.js';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import {
  getKnownDomainCommandsAlphabetical,
  getDomainKeywordByCommand,
} from '../../../../../js/gui_components/shared/domain-commands.js';
import { DomainKeywordInvocationParser } from '@anywaydata/core/domain/parser/DomainKeywordInvocationParser.js';
import { getVisibleDomainCommands } from '../../../../../js/gui_components/shared/test-data/help/domain-command-provider.js';
import { getDomainCommandHelp } from '../../../../../js/gui_components/shared/domain-command-help-metadata.js';
import {
  createConfiguredGeneratorFromSchemaRows,
  createPreviewDataTable,
} from '../../../../../js/gui_components/shared/test-data/generation/generation-controller.js';
import {
  validateSchemaRows,
  schemaRowsToSpec,
} from '../../../../../js/gui_components/shared/test-data/schema/schema-editor-core.js';
import {
  SOURCE_TYPE_ENUM,
  SOURCE_TYPE_LITERAL,
  SOURCE_TYPE_REGEX,
  SOURCE_TYPE_FAKER,
  SOURCE_TYPE_DOMAIN,
  buildRuleSpecFromSchemaRow,
  buildDataRuleFromSchemaRow,
} from '../../../../../js/gui_components/shared/schema-row-rule-mapper.js';
import { schemaRowsToDataRules, dataRulesToSchemaText } from '@anywaydata/core/data_generation/schema-rules-adapter.js';
import { hasPermissiveAllowedType } from '../../support/generated-value-quality.js';

const CUSTOM_SOURCE_TYPES = [
  SOURCE_TYPE_ENUM,
  SOURCE_TYPE_LITERAL,
  SOURCE_TYPE_REGEX,
  SOURCE_TYPE_FAKER,
  SOURCE_TYPE_DOMAIN,
];
const DOMAIN_INVOCATION_PARSER = new DomainKeywordInvocationParser();
const DEFAULT_ROW_NAME = 'Value';
const FAKER_INTERACTION_COMMANDS = getAllowedFakerCommandsAlphabetical().filter(
  (command) => command !== 'RegEx' && command.startsWith('helpers.')
);

const CUSTOM_SCENARIOS = [
  {
    id: 'custom-enum-base',
    sourceType: SOURCE_TYPE_ENUM,
    label: 'enum',
    rows: [{ name: 'Status', sourceType: SOURCE_TYPE_ENUM, value: 'active,inactive,pending' }],
    coveredArgs: [],
    origins: ['custom'],
  },
  {
    id: 'custom-enum-pairwise',
    sourceType: SOURCE_TYPE_ENUM,
    label: 'enum pairwise',
    rows: [
      { name: 'Status', sourceType: SOURCE_TYPE_ENUM, value: 'active,inactive,pending' },
      { name: 'Priority', sourceType: SOURCE_TYPE_ENUM, value: 'high,medium,low' },
    ],
    coveredArgs: [],
    origins: ['custom', 'pairwise'],
    pairwiseEligible: true,
  },
  {
    id: 'custom-literal-base',
    sourceType: SOURCE_TYPE_LITERAL,
    label: 'literal',
    rows: [{ name: 'Status', sourceType: SOURCE_TYPE_LITERAL, value: 'Pending' }],
    coveredArgs: [],
    origins: ['custom'],
  },
  {
    id: 'custom-literal-empty',
    sourceType: SOURCE_TYPE_LITERAL,
    label: 'literal empty',
    rows: [{ name: 'Status', sourceType: SOURCE_TYPE_LITERAL, value: '' }],
    coveredArgs: [],
    origins: ['custom', 'empty'],
  },
  {
    id: 'custom-regex-base',
    sourceType: SOURCE_TYPE_REGEX,
    label: 'regex',
    rows: [{ name: 'Code', sourceType: SOURCE_TYPE_REGEX, value: '[A-Z]{2}[0-9]{2}' }],
    coveredArgs: [],
    origins: ['custom'],
  },
  {
    id: 'custom-regex-empty',
    sourceType: SOURCE_TYPE_REGEX,
    label: 'regex empty',
    rows: [{ name: 'Code', sourceType: SOURCE_TYPE_REGEX, value: '' }],
    coveredArgs: [],
    origins: ['custom', 'empty'],
  },
];

const DOMAIN_SCENARIO_EXECUTION_CACHE = new Map();
const FAKER_SCENARIO_EXECUTION_CACHE = new Map();
const CUSTOM_SCENARIO_EXECUTION_CACHE = new Map();
const UI_REPRESENTATIVE_SCENARIO_IDS = new Set([
  'custom-enum-base',
  'custom-enum-pairwise',
  'custom-literal-base',
  'custom-literal-empty',
  'custom-regex-base',
  'faker-helpers-arrayElement-base',
  'faker-helpers-fake-base',
  'faker-helpers-fromRegExp-example-1',
  'faker-helpers-mustache-base',
  'faker-helpers-uniqueArray-example-1',
  'faker-helpers-weightedArrayElement-example-1',
  'domain-airline-seat-example-1',
  'domain-commerce-price-example-1',
  'domain-date-birthdate-example-1',
  'domain-internet-password-example-1',
  'domain-autoIncrement-sequence-example-1',
  'domain-literal-value-example-1',
  'domain-string-counterString-example-1',
  'domain-string-fromCharacters-base',
]);
const ERROR_PATTERNS = [
  /\*\*ERROR\*\*/i,
  /Invalid Faker API Call/i,
  /Could not find Faker API Command/i,
  /Unsafe faker rule syntax/i,
  /\bException\b/i,
];
const PRIMITIVE_TYPE_TOKENS = new Set([
  'string',
  'number',
  'integer',
  'boolean',
  'array',
  'object',
  'date',
  'regexp',
  'unknown',
  'bigint',
]);

function slugify(value) {
  return String(value || '')
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildExpectedSchemaText(rows) {
  return dataRulesToSchemaText({
    dataRules: schemaRowsToDataRules({ schemaRows: rows }).dataRules,
  }).text;
}

function buildExpectedUiSchemaText(rows) {
  return dataRulesToSchemaText({
    dataRules: rows.map((row) => buildDataRuleFromSchemaRow(row)).filter(Boolean),
  }).text;
}

function normaliseScenarioRows(rows) {
  return rows.map((row) => ({
    name: String(row.name || '').trim(),
    sourceType: row.sourceType,
    command: String(row.command || '').trim(),
    params: String(row.params || '').trim(),
    value: String(row.value ?? ''),
  }));
}

function createScenario({
  id,
  sourceType,
  command = '',
  label = '',
  rows,
  coveredArgs = [],
  origins = [],
  metadata = null,
}) {
  const scenarioRows = normaliseScenarioRows(rows);
  const expectedSchemaText = buildExpectedSchemaText(scenarioRows);
  const returnType = String(metadata?.returnType || '')
    .trim()
    .toLowerCase();
  return {
    id,
    sourceType,
    command,
    label: label || command || sourceType,
    rows: scenarioRows,
    expectedSchemaText,
    expectedUiSchemaText: buildExpectedUiSchemaText(scenarioRows),
    expectedFileExtension: '.csv',
    pairwiseEligible: scenarioRows.filter((row) => row.sourceType === SOURCE_TYPE_ENUM).length >= 2,
    expectStructuredSerialization: returnType === 'object' || returnType === 'array',
    coveredArgs: [...coveredArgs],
    origins: [...origins],
  };
}

function parseLiteralTypeToken(token) {
  const trimmed = String(token || '').trim();
  if (!trimmed) {
    return undefined;
  }
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  if (/^[+-]?\d+(\.\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }
  return trimmed;
}

function splitTopLevelArguments(argsText = '') {
  const args = [];
  let current = '';
  let depth = 0;
  let quote = '';
  let escaping = false;

  for (const character of String(argsText || '')) {
    if (escaping) {
      current += character;
      escaping = false;
      continue;
    }

    if (quote) {
      current += character;
      if (character === '\\') {
        escaping = true;
        continue;
      }
      if (character === quote) {
        quote = '';
      }
      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
      current += character;
      continue;
    }

    if (character === '(' || character === '[' || character === '{') {
      depth += 1;
      current += character;
      continue;
    }

    if (character === ')' || character === ']' || character === '}') {
      depth = Math.max(0, depth - 1);
      current += character;
      continue;
    }

    if (character === ',' && depth === 0) {
      if (current.trim()) {
        args.push(current.trim());
      }
      current = '';
      continue;
    }

    current += character;
  }

  if (current.trim()) {
    args.push(current.trim());
  }

  return args;
}

function getHelperExampleArgCount(functionCall) {
  const trimmed = String(functionCall || '').trim();
  const openParenIndex = trimmed.indexOf('(');
  if (openParenIndex === -1) {
    return 0;
  }

  const inner = trimmed.slice(openParenIndex + 1, -1).trim();
  if (!inner) {
    return 0;
  }

  return splitTopLevelArguments(inner).length;
}

function getLiteralUnionValues(typeName) {
  const typeTokens = String(typeName || '')
    .split('|')
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (typeTokens.length === 0) {
    return [];
  }

  const literalValues = [];
  for (const typeToken of typeTokens) {
    if (PRIMITIVE_TYPE_TOKENS.has(typeToken)) {
      return [];
    }
    const literalValue = parseLiteralTypeToken(typeToken);
    if (typeof literalValue === 'undefined') {
      return [];
    }
    literalValues.push(literalValue);
  }

  return literalValues;
}

function parseExampleInvocation(example, command) {
  const text = String(example || '').trim();
  const keyword = getDomainKeywordByCommand(command);
  const aliases = [command, keyword?.keyword, keyword?.canonical, ...(keyword?.aliases || [])]
    .map((value) => String(value || '').trim())
    .filter(Boolean);
  for (const alias of aliases) {
    if (text === alias) {
      return '()';
    }
    const prefix = `${alias}(`;
    if (text.startsWith(prefix) && text.endsWith(')')) {
      return text.slice(alias.length);
    }
  }
  return null;
}

function parseFakerExampleInvocation(example, command) {
  const text = String(example || '').trim();
  if (text === command) {
    return '()';
  }
  const prefix = `${command}(`;
  if (text.startsWith(prefix) && text.endsWith(')')) {
    return text.slice(command.length);
  }
  return null;
}

function getUsageExampleFunctionCalls(metadata = {}) {
  return (Array.isArray(metadata?.usageExamples) ? metadata.usageExamples : [])
    .map((usageExample) => String(usageExample?.functionCall || '').trim())
    .filter(Boolean);
}

function isRequiredMetadataArg(arg) {
  return arg?.required === true || arg?.optional === false;
}

function findMinimalFakerExample(command, metadata = {}) {
  const requiredArgCount = Array.isArray(metadata?.params)
    ? metadata.params.filter((param) => param.optional === false).length
    : 0;
  return getUsageExampleFunctionCalls(metadata).find((example) => {
    const params = parseFakerExampleInvocation(example, command);
    return params !== null && getHelperExampleArgCount(example) === requiredArgCount;
  });
}

function findMinimalDomainExample(command, metadata = {}) {
  const args = Array.isArray(metadata?.args) ? metadata.args : [];
  const requiredParamNames = new Set(args.filter((arg) => isRequiredMetadataArg(arg)).map((arg) => arg.name));
  return getUsageExampleFunctionCalls(metadata).find((example) => {
    const paramsText = parseExampleInvocation(example, command);
    if (args.length === 1 && requiredParamNames.size === 1 && paramsText && paramsText !== '()') {
      const parsedMinimal = DOMAIN_INVOCATION_PARSER.parse(example);
      const namedArgs = (parsedMinimal.arguments || []).filter((argument) => argument.kind === 'named');
      if (namedArgs.length === 0) {
        return true;
      }
    }

    const parsed = DOMAIN_INVOCATION_PARSER.parse(example);
    if (!parsed.ok || parsed.keyword !== command) {
      return false;
    }
    const namedArgs = (parsed.arguments || []).filter((argument) => argument.kind === 'named').map((arg) => arg.name);
    if (namedArgs.length !== requiredParamNames.size) {
      return false;
    }
    return [...requiredParamNames].every((name) => namedArgs.includes(name));
  });
}

function getFakerCoveredArgsForExample(functionCall, metadata = {}) {
  const count = getHelperExampleArgCount(functionCall);
  return (Array.isArray(metadata?.params) ? metadata.params : []).slice(0, count).map((param) => param.name);
}

function getDomainCoveredArgsForExample(functionCall, command) {
  const metadata = getDomainCommandHelp(command) || { args: [] };
  const paramsText = parseExampleInvocation(functionCall, command);
  const parsed = DOMAIN_INVOCATION_PARSER.parse(functionCall);
  if (!parsed.ok || parsed.keyword !== command) {
    if (paramsText && paramsText !== '()' && Array.isArray(metadata.args) && metadata.args.length === 1) {
      return [metadata.args[0].name];
    }
    return [];
  }
  const namedArgs = (parsed.arguments || []).filter((argument) => argument.kind === 'named').map((arg) => arg.name);
  if (namedArgs.length > 0) {
    return namedArgs;
  }
  if ((parsed.arguments || []).length > 0 && Array.isArray(metadata.args) && metadata.args.length === 1) {
    return [metadata.args[0].name];
  }
  return [];
}

function buildFakerScenarios() {
  const scenarios = [];

  FAKER_INTERACTION_COMMANDS.forEach((command) => {
    const metadata = getFakerCommandHelp(command) || { params: [], docsUrl: '', usageExamples: [] };
    const minimalExample = findMinimalFakerExample(command, metadata);
    const baseParams = parseFakerExampleInvocation(minimalExample || '', command) || '()';
    scenarios.push(
      createScenario({
        id: `faker-${slugify(command)}-base`,
        sourceType: SOURCE_TYPE_FAKER,
        command,
        label: command,
        rows: [{ name: DEFAULT_ROW_NAME, sourceType: SOURCE_TYPE_FAKER, command, params: baseParams }],
        coveredArgs: minimalExample ? getFakerCoveredArgsForExample(minimalExample, metadata) : [],
        origins: ['base'],
        metadata,
      })
    );
    const curatedExamples = getUsageExampleFunctionCalls(metadata);
    curatedExamples.forEach((example, exampleIndex) => {
      const params = parseFakerExampleInvocation(example, command);
      if (!params) {
        return;
      }
      scenarios.push(
        createScenario({
          id: `faker-${slugify(command)}-example-${exampleIndex + 1}`,
          sourceType: SOURCE_TYPE_FAKER,
          command,
          label: `${command} example ${exampleIndex + 1}`,
          rows: [{ name: DEFAULT_ROW_NAME, sourceType: SOURCE_TYPE_FAKER, command, params }],
          coveredArgs: getFakerCoveredArgsForExample(example, metadata),
          origins: ['example'],
          metadata,
        })
      );
    });
  });

  return scenarios;
}

function buildDomainScenarios() {
  const commands = getVisibleDomainCommands({ commands: getKnownDomainCommandsAlphabetical(), currentCommand: '' });
  const scenarios = [];

  commands.forEach((command) => {
    const metadata = getDomainCommandHelp(command) || { args: [], docsUrl: '', usageExamples: [] };
    const minimalExample = findMinimalDomainExample(command, metadata);
    const baseParams = parseExampleInvocation(minimalExample || '', command) || '()';
    scenarios.push(
      createScenario({
        id: `domain-${slugify(command)}-base`,
        sourceType: SOURCE_TYPE_DOMAIN,
        command,
        label: command,
        rows: [{ name: DEFAULT_ROW_NAME, sourceType: SOURCE_TYPE_DOMAIN, command, params: baseParams }],
        coveredArgs: minimalExample ? getDomainCoveredArgsForExample(minimalExample, command) : [],
        origins: ['base'],
        metadata,
      })
    );

    const curatedExamples = getUsageExampleFunctionCalls(getDomainKeywordByCommand(command)?.help);
    curatedExamples.forEach((example, exampleIndex) => {
      const params = parseExampleInvocation(example, command);
      if (!params) {
        return;
      }
      scenarios.push(
        createScenario({
          id: `domain-${slugify(command)}-example-${exampleIndex + 1}`,
          sourceType: SOURCE_TYPE_DOMAIN,
          command,
          label: `${command} example ${exampleIndex + 1}`,
          rows: [{ name: DEFAULT_ROW_NAME, sourceType: SOURCE_TYPE_DOMAIN, command, params }],
          coveredArgs: getDomainCoveredArgsForExample(example, command),
          origins: ['example'],
          metadata,
        })
      );
    });
  });

  return scenarios;
}

function dedupeScenarios(scenarios) {
  const seen = new Set();
  return scenarios.filter((scenario) => {
    if (seen.has(scenario.id)) {
      return false;
    }
    seen.add(scenario.id);
    return true;
  });
}

function buildSchemaInteractionScenarios() {
  return dedupeScenarios([
    ...CUSTOM_SCENARIOS.map((scenario) => createScenario(scenario)),
    ...buildFakerScenarios(),
    ...buildDomainScenarios(),
  ]);
}

function hasErrorIndicators(value) {
  const text =
    typeof value === 'string' ? value : typeof value === 'bigint' ? value.toString() : JSON.stringify(value ?? '');
  return ERROR_PATTERNS.some((pattern) => pattern.test(String(text || '')));
}

function inferValueType(value) {
  if (value === null || typeof value === 'undefined') {
    return 'unknown';
  }
  if (typeof value === 'bigint') {
    return 'number';
  }
  if (Array.isArray(value)) {
    return 'array';
  }
  if (typeof value === 'boolean') {
    return 'boolean';
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? 'number' : 'unknown';
  }
  if (typeof value === 'object') {
    return 'object';
  }
  const text = String(value).trim();
  if (text === 'true' || text === 'false') return 'boolean';
  if (text.startsWith('[') && text.endsWith(']')) return 'array';
  if (text.startsWith('{') && text.endsWith('}')) return 'object';
  if (/^"?\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z"?$/.test(text)) return 'date';
  if (/^[+-]?\d+(\.\d+)?$/.test(text)) return 'number';
  return 'string';
}

function getAllowedTypesForScenarioRow(row) {
  if (row?.sourceType !== SOURCE_TYPE_DOMAIN) {
    return ['string'];
  }
  return String(getDomainCommandHelp(row.command)?.returnType || 'string')
    .split('|')
    .map((entry) => entry.trim())
    .map((entry) => (entry === 'integer' ? 'number' : entry))
    .filter(Boolean);
}

function getLiteralUnionValuesForScenarioRow(row) {
  return getLiteralUnionValues(getDomainCommandHelp(row.command)?.returnType || 'string');
}

function scenarioRowLooksValid(row, value) {
  if (hasErrorIndicators(value)) {
    return false;
  }

  if (row?.sourceType === SOURCE_TYPE_DOMAIN && row?.command === 'string.counterString') {
    return typeof value === 'string' && value.length > 0;
  }

  const allowedTypes = getAllowedTypesForScenarioRow(row);
  const literalUnionValues = getLiteralUnionValuesForScenarioRow(row);
  if (literalUnionValues.length > 0) {
    return literalUnionValues.map((item) => String(item)).includes(String(value));
  }
  if (hasPermissiveAllowedType(allowedTypes)) {
    return true;
  }

  return allowedTypes.includes(inferValueType(value));
}

function canGenerateDomainScenarioPreview(scenario) {
  if (DOMAIN_SCENARIO_EXECUTION_CACHE.has(scenario.id)) {
    return DOMAIN_SCENARIO_EXECUTION_CACHE.get(scenario.id);
  }

  let isExecutable = false;
  try {
    const configured = createConfiguredGeneratorFromSchemaRows({
      schemaRows: scenario.rows,
      validateSchemaRows: (rows) => validateSchemaRows({ schemaRows: rows, schemaRowsToDataRules }),
      schemaRowsToSpec: (rows) =>
        schemaRowsToSpec({
          schemaRows: rows,
          schemaRowsToDataRules,
          dataRulesToSchemaText,
        }),
      TestDataGeneratorClass: TestDataGenerator,
      faker,
      RandExp,
      buildRuleSpecFromSchemaRow,
      extractLiteralValueFromRuleSpec: (ruleSpec) => ruleSpec,
      extractRegexValueFromRuleSpec: (ruleSpec) => ruleSpec,
      SOURCE_TYPE_FAKER,
      SOURCE_TYPE_DOMAIN,
      SOURCE_TYPE_LITERAL,
      SOURCE_TYPE_ENUM,
      SOURCE_TYPE_REGEX,
    });
    if (configured.errors.length === 0) {
      const previewTable = createPreviewDataTable({
        rowCount: scenario.pairwiseEligible ? 2 : 1,
        generator: configured.generator,
        GenericDataTableClass: GenericDataTable,
      });
      const exporter = new Exporter({
        getGridAsGenericDataTable: () => previewTable,
        getHeadersFromGrid: () => previewTable.getHeaders(),
      });
      const csvText = exporter.getDataTableAs('csv', previewTable) || '';
      isExecutable =
        !hasErrorIndicators(csvText) &&
        scenario.rows.every((row, columnIndex) => scenarioRowLooksValid(row, previewTable.getCell(0, columnIndex)));
    }
  } catch {
    isExecutable = false;
  }

  DOMAIN_SCENARIO_EXECUTION_CACHE.set(scenario.id, isExecutable);
  return isExecutable;
}

function canGenerateFakerScenarioPreview(scenario) {
  if (FAKER_SCENARIO_EXECUTION_CACHE.has(scenario.id)) {
    return FAKER_SCENARIO_EXECUTION_CACHE.get(scenario.id);
  }

  let isExecutable = false;
  try {
    const configured = createConfiguredGeneratorFromSchemaRows({
      schemaRows: scenario.rows,
      validateSchemaRows: (rows) => validateSchemaRows({ schemaRows: rows, schemaRowsToDataRules }),
      schemaRowsToSpec: (rows) =>
        schemaRowsToSpec({
          schemaRows: rows,
          schemaRowsToDataRules,
          dataRulesToSchemaText,
        }),
      TestDataGeneratorClass: TestDataGenerator,
      faker,
      RandExp,
      buildRuleSpecFromSchemaRow,
      extractLiteralValueFromRuleSpec: (ruleSpec) => ruleSpec,
      extractRegexValueFromRuleSpec: (ruleSpec) => ruleSpec,
      SOURCE_TYPE_FAKER,
      SOURCE_TYPE_DOMAIN,
      SOURCE_TYPE_LITERAL,
      SOURCE_TYPE_ENUM,
      SOURCE_TYPE_REGEX,
    });
    if (configured.errors.length === 0) {
      const previewTable = createPreviewDataTable({
        rowCount: scenario.pairwiseEligible ? 2 : 1,
        generator: configured.generator,
        GenericDataTableClass: GenericDataTable,
      });
      const exporter = new Exporter({
        getGridAsGenericDataTable: () => previewTable,
        getHeadersFromGrid: () => previewTable.getHeaders(),
      });
      const csvText = exporter.getDataTableAs('csv', previewTable) || '';
      isExecutable =
        !hasErrorIndicators(csvText) &&
        scenario.rows.every((row, columnIndex) => scenarioRowLooksValid(row, previewTable.getCell(0, columnIndex)));
    }
  } catch {
    isExecutable = false;
  }

  FAKER_SCENARIO_EXECUTION_CACHE.set(scenario.id, isExecutable);
  return isExecutable;
}

function canGenerateCustomScenarioPreview(scenario) {
  if (CUSTOM_SCENARIO_EXECUTION_CACHE.has(scenario.id)) {
    return CUSTOM_SCENARIO_EXECUTION_CACHE.get(scenario.id);
  }

  let isExecutable = false;
  try {
    const validation = validateSchemaRows({ schemaRows: scenario.rows, schemaRowsToDataRules });
    if (validation.errors.length === 0) {
      const configured = createConfiguredGeneratorFromSchemaRows({
        schemaRows: scenario.rows,
        validateSchemaRows: (rows) => validateSchemaRows({ schemaRows: rows, schemaRowsToDataRules }),
        schemaRowsToSpec: (rows) =>
          schemaRowsToSpec({
            schemaRows: rows,
            schemaRowsToDataRules,
            dataRulesToSchemaText,
          }),
        TestDataGeneratorClass: TestDataGenerator,
        faker,
        RandExp,
        buildRuleSpecFromSchemaRow,
        extractLiteralValueFromRuleSpec: (ruleSpec) => ruleSpec,
        extractRegexValueFromRuleSpec: (ruleSpec) => ruleSpec,
        SOURCE_TYPE_FAKER,
        SOURCE_TYPE_DOMAIN,
        SOURCE_TYPE_LITERAL,
        SOURCE_TYPE_ENUM,
        SOURCE_TYPE_REGEX,
      });
      if (configured.errors.length === 0) {
        const previewTable = createPreviewDataTable({
          rowCount: scenario.pairwiseEligible ? 2 : 1,
          generator: configured.generator,
          GenericDataTableClass: GenericDataTable,
        });
        const exporter = new Exporter({
          getGridAsGenericDataTable: () => previewTable,
          getHeadersFromGrid: () => previewTable.getHeaders(),
        });
        const csvText = exporter.getDataTableAs('csv', previewTable) || '';
        isExecutable =
          !hasErrorIndicators(csvText) &&
          scenario.rows.every((row, columnIndex) => scenarioRowLooksValid(row, previewTable.getCell(0, columnIndex)));
      }
    }
  } catch {
    isExecutable = false;
  }

  CUSTOM_SCENARIO_EXECUTION_CACHE.set(scenario.id, isExecutable);
  return isExecutable;
}

function getScenarioExecutionStatus(scenario) {
  if (!scenario) {
    return 'review-only';
  }
  if (scenario.origins.includes('custom')) {
    return canGenerateCustomScenarioPreview(scenario) ? 'generated' : 'non-executable';
  }
  if (scenario.sourceType === SOURCE_TYPE_DOMAIN) {
    return canGenerateDomainScenarioPreview(scenario) ? 'generated' : 'non-executable';
  }
  if (scenario.sourceType === SOURCE_TYPE_FAKER) {
    return canGenerateFakerScenarioPreview(scenario) ? 'generated' : 'non-executable';
  }
  if (scenario.origins.includes('example')) {
    return 'generated';
  }
  return 'non-executable';
}

function buildRuntimeInteractionScenarios() {
  return buildSchemaInteractionScenarios().filter((scenario) => getScenarioExecutionStatus(scenario) === 'generated');
}

function buildUiInteractionScenarios() {
  return buildRuntimeInteractionScenarios().filter((scenario) => UI_REPRESENTATIVE_SCENARIO_IDS.has(scenario.id));
}

function selectPageSmokeScenario(scenarios, label, predicate) {
  const scenario = scenarios.find(predicate);
  if (!scenario) {
    throw new Error(`page-wiring smoke scenario is missing ${label} coverage`);
  }
  return scenario;
}

function buildPageWiringSmokeInteractionScenarios() {
  const scenarios = buildUiInteractionScenarios();
  return [
    selectPageSmokeScenario(
      scenarios,
      'literal',
      (scenario) => scenario.sourceType === SOURCE_TYPE_LITERAL && scenario.origins.includes('custom')
    ),
    selectPageSmokeScenario(
      scenarios,
      'regex',
      (scenario) => scenario.sourceType === SOURCE_TYPE_REGEX && scenario.origins.includes('custom')
    ),
    selectPageSmokeScenario(
      scenarios,
      'faker helpers.arrayElement',
      (scenario) => scenario.sourceType === SOURCE_TYPE_FAKER && scenario.command === 'helpers.arrayElement'
    ),
    selectPageSmokeScenario(
      scenarios,
      'domain commerce.price example',
      (scenario) =>
        scenario.sourceType === SOURCE_TYPE_DOMAIN &&
        scenario.command === 'commerce.price' &&
        scenario.origins.includes('example')
    ),
    selectPageSmokeScenario(
      scenarios,
      'enum pairwise',
      (scenario) => scenario.sourceType === SOURCE_TYPE_ENUM && scenario.pairwiseEligible === true
    ),
  ];
}

function buildScenarioCoverageSummary() {
  const scenarios = buildSchemaInteractionScenarios();
  const byCommand = new Map();
  scenarios.forEach((scenario) => {
    const key = scenario.command
      ? `${scenario.sourceType}:${scenario.command}`
      : `${scenario.sourceType}:${scenario.label}`;
    if (!byCommand.has(key)) {
      byCommand.set(key, { scenarios: [], coveredArgs: new Set(), origins: new Set() });
    }
    const bucket = byCommand.get(key);
    bucket.scenarios.push(scenario);
    scenario.coveredArgs.forEach((argName) => {
      bucket.coveredArgs.add(argName);
    });
    scenario.origins.forEach((origin) => {
      bucket.origins.add(origin);
    });
  });
  return { scenarios, byCommand };
}

export {
  CUSTOM_SOURCE_TYPES,
  buildSchemaInteractionScenarios,
  buildRuntimeInteractionScenarios,
  buildUiInteractionScenarios,
  buildPageWiringSmokeInteractionScenarios,
  buildScenarioCoverageSummary,
  buildExpectedSchemaText,
  buildExpectedUiSchemaText,
  FAKER_INTERACTION_COMMANDS,
  getScenarioExecutionStatus,
};
