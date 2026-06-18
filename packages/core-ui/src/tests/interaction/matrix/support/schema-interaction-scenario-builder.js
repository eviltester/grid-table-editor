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

const FAKER_PARAM_OVERRIDES = {
  'helpers.arrayElement': ['["A", "B"]'],
  'helpers.arrayElements': ['["A", "B", "C"]', '2'],
  'date.between': ['{ from: "2020-01-01T00:00:00.000Z", to: "2020-12-31T00:00:00.000Z" }'],
  'date.betweens': ['{ from: "2020-01-01T00:00:00.000Z", to: "2020-12-31T00:00:00.000Z", count: 2 }'],
  'helpers.fake': ['"{{person.firstName}}"'],
  'helpers.mustache': ['"{{name}}"', '{ name: "Ada" }'],
  'helpers.fromRegExp': ['"[A-Z]{2}"'],
  'helpers.rangeToNumber': ['{ min: 1, max: 2 }'],
  'helpers.shuffle': ['["A", "B", "C"]'],
  'helpers.weightedArrayElement': ['[{ "weight": 1, "value": "A" }, { "weight": 2, "value": "B" }]'],
  'string.fromCharacters': ['"ABC123"', '4'],
};

const DOMAIN_PARAM_OVERRIDES = {
  'datatype.enum': {
    defaults: ['"active"', '"inactive"', '"pending"'],
  },
  'date.between': {
    defaults: ['1577836800000', '1609372800000'],
    named: { from: '1577836800000', to: '1609372800000' },
  },
  'date.betweens': {
    defaults: ['2', '1577836800000', '1609372800000'],
    named: { count: '2', from: '1577836800000', to: '1609372800000' },
  },
  'string.counterString': {
    defaults: ['1', '25', '"*"'],
    named: { min: '2', max: '5', delimiter: '"#"' },
  },
  'autoIncrement.sequence': {
    defaults: ['1', '5', '"filename"', '".txt"', '3'],
    named: { start: '10', step: '5', prefix: '"T-"', suffix: '""', zeropadding: '2' },
  },
  'string.fromCharacters': {
    defaults: ['"ABC123"', '4'],
    named: { characters: '"ABC123"', length: '4' },
  },
};

const DOMAIN_SCENARIO_EXECUTION_CACHE = new Map();
const FAKER_SCENARIO_EXECUTION_CACHE = new Map();
const UI_REPRESENTATIVE_SCENARIO_IDS = new Set([
  'custom-enum-base',
  'custom-enum-pairwise',
  'custom-literal-base',
  'custom-literal-empty',
  'custom-regex-base',
  'custom-regex-empty',
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
const DOMAIN_ARG_COMPANION_OVERRIDES = {
  'date.between': {
    from: { to: '1609372800000' },
    to: { from: '1577836800000' },
  },
  'date.birthdate': {
    max: { min: '18', mode: '"age"' },
    min: { max: '65', mode: '"age"' },
    mode: { min: '18', max: '65' },
    refDate: { min: '18', max: '65', mode: '"age"' },
  },
};
const ERROR_PATTERNS = [
  /\*\*ERROR\*\*/i,
  /Invalid Faker API Call/i,
  /Could not find Faker API Command/i,
  /Unsafe faker rule syntax/i,
  /\bException\b/i,
];

function slugify(value) {
  return String(value || '')
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function quoteString(value) {
  return JSON.stringify(String(value));
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

function buildNamedParams(namedValues) {
  const entries = Object.entries(namedValues).filter(([, value]) => typeof value !== 'undefined');
  if (entries.length === 0) {
    return '()';
  }
  return `(${entries.map(([name, value]) => `${name}=${value}`).join(', ')})`;
}

function buildPositionalParams(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return '()';
  }
  return `(${values.join(', ')})`;
}

function renderExampleParamValue(exampleValue) {
  if (typeof exampleValue === 'string') return quoteString(exampleValue);
  if (typeof exampleValue === 'number' || typeof exampleValue === 'boolean') return String(exampleValue);
  if (exampleValue === null) return 'null';
  if (Array.isArray(exampleValue) || typeof exampleValue === 'object') return JSON.stringify(exampleValue);
  return quoteString(String(exampleValue));
}

function buildGenericParamValue({ paramName, paramType, command, sourceType, index, argExamples = [] }) {
  const normalisedName = String(paramName || '').trim();
  const lowerName = normalisedName.toLowerCase();
  const typeText = String(paramType || '')
    .trim()
    .toLowerCase();

  if (Array.isArray(argExamples) && argExamples.length > 0) {
    return renderExampleParamValue(argExamples[0]);
  }

  if (sourceType === SOURCE_TYPE_DOMAIN) {
    const domainOverride = DOMAIN_PARAM_OVERRIDES[command]?.named?.[normalisedName];
    if (typeof domainOverride !== 'undefined') {
      return domainOverride;
    }
  }

  if (lowerName === 'min') return '1';
  if (lowerName === 'max') return '3';
  if (lowerName === 'count') return '2';
  if (lowerName === 'linecount') return '2';
  if (lowerName === 'linecountmin') return '1';
  if (lowerName === 'linecountmax') return '2';
  if (lowerName === 'length') return '4';
  if (lowerName === 'linelength') return '4';
  if (lowerName === 'prefix') return '"#"';
  if (lowerName === 'suffix') return '".txt"';
  if (lowerName === 'separator') return '"-"';
  if (lowerName === 'delimiter') return '"*"';
  if (lowerName === 'zeropadding') return '3';
  if (lowerName === 'variant') return '"13"';
  if (lowerName === 'protocol') return '"https"';
  if (lowerName === 'provider') return '"example.com"';
  if (lowerName === 'firstname') return '"Ada"';
  if (lowerName === 'lastname') return '"Lovelace"';
  if (lowerName === 'sex') return '"male"';
  if (lowerName === 'version') return '7';
  if (lowerName === 'refdate') return '1';
  if (!typeText.includes('integer') && !typeText.includes('number') && lowerName === 'from') {
    return '"2020-01-01T00:00:00.000Z"';
  }
  if (!typeText.includes('integer') && !typeText.includes('number') && lowerName === 'to') {
    return '"2020-12-31T00:00:00.000Z"';
  }
  if (lowerName === 'pattern') return '"[A-Z]{2}"';
  if (lowerName === 'text') return '"{{name}}"';
  if (lowerName === 'characters') return '"ABC123"';
  if (lowerName === 'casing') return '"upper"';
  if (lowerName === 'format') return '"css"';
  if (lowerName === 'appendslash') return 'true';
  if (lowerName === 'allowleadingzeros') return 'true';
  if (lowerName === 'includealpha') return 'true';
  if (lowerName === 'usefulladdress') return 'true';

  if (typeText.includes('boolean')) return 'true';
  if (typeText.includes('integer')) return String(index + 2);
  if (typeText.includes('number')) return String(index + 2);
  if (typeText.includes('array')) return '["A", "B"]';
  if (typeText.includes('regexp')) return '"[A-Z]{2}"';
  if (typeText.includes('object')) return '{}';
  if (typeText.includes('string'))
    return quoteString(`${slugify(command || sourceType || 'value') || 'value'}-${normalisedName || index}`);

  return quoteString(`${slugify(command || sourceType || 'value') || 'value'}-${normalisedName || index}`);
}

function buildFakerBaseParams(command, params) {
  const override = FAKER_PARAM_OVERRIDES[command];
  if (override) {
    return buildPositionalParams(override);
  }
  const requiredCount = params.filter((param) => param.optional === false).length;
  if (requiredCount === 0) {
    return '()';
  }
  const values = params.slice(0, requiredCount).map((param, index) =>
    buildGenericParamValue({
      paramName: param.name,
      paramType: param.type,
      command,
      sourceType: SOURCE_TYPE_FAKER,
      index,
      argExamples: param.examples,
    })
  );
  return buildPositionalParams(values);
}

function buildFakerArgumentScenarios(command, metadata) {
  const params = Array.isArray(metadata?.params) ? metadata.params : [];
  const scenarios = [];
  params.forEach((param, index) => {
    const values = [];
    for (let paramIndex = 0; paramIndex <= index; paramIndex += 1) {
      const current = params[paramIndex];
      values.push(
        buildGenericParamValue({
          paramName: current.name,
          paramType: current.type,
          command,
          sourceType: SOURCE_TYPE_FAKER,
          index: paramIndex,
          argExamples: current.examples,
        })
      );
    }
    scenarios.push(
      createScenario({
        id: `faker-${slugify(command)}-arg-${slugify(param.name)}`,
        sourceType: SOURCE_TYPE_FAKER,
        command,
        label: `${command} arg ${param.name}`,
        rows: [
          { name: DEFAULT_ROW_NAME, sourceType: SOURCE_TYPE_FAKER, command, params: buildPositionalParams(values) },
        ],
        coveredArgs: [param.name],
        origins: ['arg'],
        metadata,
      })
    );
  });

  if (params.length >= 2) {
    for (let index = 0; index < params.length - 1; index += 1) {
      const left = params[index];
      const right = params[index + 1];
      const values = params.slice(0, index + 2).map((param, paramIndex) =>
        buildGenericParamValue({
          paramName: param.name,
          paramType: param.type,
          command,
          sourceType: SOURCE_TYPE_FAKER,
          index: paramIndex,
          argExamples: param.examples,
        })
      );
      scenarios.push(
        createScenario({
          id: `faker-${slugify(command)}-pair-${slugify(left.name)}-${slugify(right.name)}`,
          sourceType: SOURCE_TYPE_FAKER,
          command,
          label: `${command} pair ${left.name}/${right.name}`,
          rows: [
            { name: DEFAULT_ROW_NAME, sourceType: SOURCE_TYPE_FAKER, command, params: buildPositionalParams(values) },
          ],
          coveredArgs: [left.name, right.name],
          origins: ['pair'],
          metadata,
        })
      );
    }
  }

  return scenarios;
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

function buildDomainBaseParams(command, metadata) {
  const args = Array.isArray(metadata?.args) ? metadata.args : [];
  if (DOMAIN_PARAM_OVERRIDES[command]?.defaults) {
    return buildPositionalParams(DOMAIN_PARAM_OVERRIDES[command].defaults);
  }
  const requiredArgs = args.filter((arg) => arg.required === true);
  if (requiredArgs.length === 0) {
    return '()';
  }
  const namedValues = {};
  requiredArgs.forEach((arg, index) => {
    namedValues[arg.name] = buildGenericParamValue({
      paramName: arg.name,
      paramType: arg.type,
      command,
      sourceType: SOURCE_TYPE_DOMAIN,
      index,
      argExamples: arg.examples,
    });
  });
  return buildNamedParams(namedValues);
}

function buildDomainArgumentScenarios(command, metadata) {
  const args = Array.isArray(metadata?.args) ? metadata.args : [];
  const scenarios = [];
  const requiredArgs = args.filter((arg) => arg.required === true);

  args.forEach((arg, index) => {
    const namedValues = {};
    requiredArgs.forEach((requiredArg, requiredIndex) => {
      namedValues[requiredArg.name] = buildGenericParamValue({
        paramName: requiredArg.name,
        paramType: requiredArg.type,
        command,
        sourceType: SOURCE_TYPE_DOMAIN,
        index: requiredIndex,
        argExamples: requiredArg.examples,
      });
    });
    namedValues[arg.name] = buildGenericParamValue({
      paramName: arg.name,
      paramType: arg.type,
      command,
      sourceType: SOURCE_TYPE_DOMAIN,
      index,
      argExamples: arg.examples,
    });
    Object.assign(namedValues, DOMAIN_ARG_COMPANION_OVERRIDES[command]?.[arg.name] || {});
    scenarios.push(
      createScenario({
        id: `domain-${slugify(command)}-arg-${slugify(arg.name)}`,
        sourceType: SOURCE_TYPE_DOMAIN,
        command,
        label: `${command} arg ${arg.name}`,
        rows: [
          { name: DEFAULT_ROW_NAME, sourceType: SOURCE_TYPE_DOMAIN, command, params: buildNamedParams(namedValues) },
        ],
        coveredArgs: [arg.name],
        origins: ['arg'],
        metadata,
      })
    );
  });

  if (args.length >= 2) {
    for (let index = 0; index < args.length - 1; index += 1) {
      const left = args[index];
      const right = args[index + 1];
      const namedValues = {};
      requiredArgs.forEach((requiredArg, requiredIndex) => {
        namedValues[requiredArg.name] = buildGenericParamValue({
          paramName: requiredArg.name,
          paramType: requiredArg.type,
          command,
          sourceType: SOURCE_TYPE_DOMAIN,
          index: requiredIndex,
          argExamples: requiredArg.examples,
        });
      });
      namedValues[left.name] = buildGenericParamValue({
        paramName: left.name,
        paramType: left.type,
        command,
        sourceType: SOURCE_TYPE_DOMAIN,
        index,
        argExamples: left.examples,
      });
      namedValues[right.name] = buildGenericParamValue({
        paramName: right.name,
        paramType: right.type,
        command,
        sourceType: SOURCE_TYPE_DOMAIN,
        index: index + 1,
        argExamples: right.examples,
      });
      Object.assign(namedValues, DOMAIN_ARG_COMPANION_OVERRIDES[command]?.[left.name] || {});
      Object.assign(namedValues, DOMAIN_ARG_COMPANION_OVERRIDES[command]?.[right.name] || {});
      scenarios.push(
        createScenario({
          id: `domain-${slugify(command)}-pair-${slugify(left.name)}-${slugify(right.name)}`,
          sourceType: SOURCE_TYPE_DOMAIN,
          command,
          label: `${command} pair ${left.name}/${right.name}`,
          rows: [
            { name: DEFAULT_ROW_NAME, sourceType: SOURCE_TYPE_DOMAIN, command, params: buildNamedParams(namedValues) },
          ],
          coveredArgs: [left.name, right.name],
          origins: ['pair'],
          metadata,
        })
      );
    }
  }

  return scenarios;
}

function buildFakerScenarios() {
  const scenarios = [];

  FAKER_INTERACTION_COMMANDS.forEach((command) => {
    const metadata = getFakerCommandHelp(command) || { params: [], docsUrl: '', example: '' };
    scenarios.push(
      createScenario({
        id: `faker-${slugify(command)}-base`,
        sourceType: SOURCE_TYPE_FAKER,
        command,
        label: command,
        rows: [
          {
            name: DEFAULT_ROW_NAME,
            sourceType: SOURCE_TYPE_FAKER,
            command,
            params: buildFakerBaseParams(command, metadata.params || []),
          },
        ],
        coveredArgs: [],
        origins: ['base'],
        metadata,
      })
    );
    const curatedExamples = Array.isArray(metadata.examples) ? metadata.examples : [];
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
          coveredArgs: Array.isArray(metadata.params) ? metadata.params.map((param) => param.name) : [],
          origins: ['example'],
          metadata,
        })
      );
    });
    scenarios.push(...buildFakerArgumentScenarios(command, metadata));
  });

  return scenarios;
}

function buildDomainScenarios() {
  const commands = getVisibleDomainCommands({ commands: getKnownDomainCommandsAlphabetical(), currentCommand: '' });
  const scenarios = [];

  commands.forEach((command) => {
    const metadata = getDomainCommandHelp(command) || { args: [], docsUrl: '', example: '' };
    scenarios.push(
      createScenario({
        id: `domain-${slugify(command)}-base`,
        sourceType: SOURCE_TYPE_DOMAIN,
        command,
        label: command,
        rows: [
          {
            name: DEFAULT_ROW_NAME,
            sourceType: SOURCE_TYPE_DOMAIN,
            command,
            params: buildDomainBaseParams(command, metadata),
          },
        ],
        coveredArgs: [],
        origins: ['base'],
        metadata,
      })
    );

    const curatedExamples = Array.isArray(getDomainKeywordByCommand(command)?.help?.examples)
      ? getDomainKeywordByCommand(command).help.examples
      : [];
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
          coveredArgs: Array.isArray(metadata.args) ? metadata.args.map((arg) => arg.name) : [],
          origins: ['example'],
          metadata,
        })
      );
    });

    scenarios.push(...buildDomainArgumentScenarios(command, metadata));
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

function scenarioRowLooksValid(row, value) {
  if (hasErrorIndicators(value)) {
    return false;
  }

  if (row?.sourceType === SOURCE_TYPE_DOMAIN && row?.command === 'string.counterString') {
    return typeof value === 'string' && value.length > 0;
  }

  const allowedTypes = getAllowedTypesForScenarioRow(row);
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

function getScenarioExecutionStatus(scenario) {
  if (!scenario) {
    return 'review-only';
  }
  if (scenario.sourceType === SOURCE_TYPE_DOMAIN) {
    return canGenerateDomainScenarioPreview(scenario) ? 'generated' : 'non-executable';
  }
  if (scenario.sourceType === SOURCE_TYPE_FAKER) {
    return canGenerateFakerScenarioPreview(scenario) ? 'generated' : 'non-executable';
  }
  if (scenario.origins.includes('custom') || scenario.origins.includes('example')) {
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
    scenario.coveredArgs.forEach((argName) => bucket.coveredArgs.add(argName));
    scenario.origins.forEach((origin) => bucket.origins.add(origin));
  });
  return { scenarios, byCommand };
}

export {
  CUSTOM_SOURCE_TYPES,
  buildSchemaInteractionScenarios,
  buildRuntimeInteractionScenarios,
  buildUiInteractionScenarios,
  buildScenarioCoverageSummary,
  buildExpectedSchemaText,
  buildExpectedUiSchemaText,
  FAKER_INTERACTION_COMMANDS,
  getScenarioExecutionStatus,
};
