/*
 * Responsibilities:
 * - Converts command/type metadata into a shared help model for test-data UIs.
 * - Renders escaped HTML snippets for tooltip/help affordances from one source of truth.
 * - Keeps command help behavior unit-testable without booting full pages.
 */

import { getFakerCommandHelp } from '@anywaydata/core/faker/faker-helper-keyword-definitions.js';
import { buildDocsUrl, resolveOwnedSiteUrl } from '@anywaydata/site-config';
import { getDomainCommandHelp } from '../../domain-command-help-metadata.js';
import { escapeHtml } from '../../html-escape.js';
import {
  SOURCE_TYPE_FAKER,
  SOURCE_TYPE_DOMAIN,
  SOURCE_TYPE_REGEX,
  SOURCE_TYPE_LITERAL,
  SOURCE_TYPE_ENUM,
  normaliseFakerCommand,
  normaliseDomainCommand,
  normaliseSourceType,
} from '../../schema-row-rule-mapper.js';

const HELP_URLS = Object.freeze({
  regex: buildDocsUrl('test-data/regex-test-data'),
  faker: buildDocsUrl('test-data/faker-test-data'),
  domain: buildDocsUrl('test-data/domain/domain-test-data'),
  literal: buildDocsUrl('category/generating-data'),
  enum: buildDocsUrl('category/generating-data'),
});

const ENUM_VALUE_PARAM = Object.freeze({
  name: 'values',
  type: 'comma-separated list',
  variadic: true,
  optional: false,
  description: 'List of allowed values chosen at random during generation.',
  example: 'active,inactive,pending',
});

function resolveFakerDocsUrl(command, docsUrl) {
  const normalizedCommand = String(command || '').trim();
  if (normalizedCommand.startsWith('helpers.')) {
    return buildDocsUrl('test-data/faker/helpers');
  }
  return String(docsUrl || '').trim() || HELP_URLS.faker;
}

function cleanParamText(text) {
  return String(text || '')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractSimpleDefaultValue(param = {}) {
  if (Object.prototype.hasOwnProperty.call(param, 'defaultValue')) {
    return param.defaultValue;
  }
  if (Object.prototype.hasOwnProperty.call(param, 'default')) {
    return param.default;
  }

  const description = cleanParamText(param.description);
  const match = description.match(/defaults?\s+to\s+("[^"]*"|'[^']*'|-?\d+(?:\.\d+)?|true|false|null)\.?$/iu);
  if (!match) {
    return '';
  }

  const value = match[1];
  if (value.startsWith('"') || value.startsWith("'")) {
    return value.slice(1, -1);
  }
  return value;
}

function normalizeHelpParam(param = {}) {
  return {
    ...param,
    optional: param.optional === true || param.required === false,
    defaultValue: extractSimpleDefaultValue(param),
  };
}

function normalizeHelpParams(params = []) {
  return (Array.isArray(params) ? params : []).map((param) => normalizeHelpParam(param));
}

function resolveDomainHelpParams(command, commandHelp) {
  const normalized = normalizeHelpParams(commandHelp?.args || []);
  if (normalized.length > 0) {
    return normalized;
  }
  if (
    String(command || '')
      .trim()
      .toLowerCase() === 'datatype.enum'
  ) {
    return normalizeHelpParams([ENUM_VALUE_PARAM]);
  }
  return [];
}

function buildCallSignature(heading, params) {
  if (!Array.isArray(params) || params.length === 0) {
    return `${heading}()`;
  }
  return `${heading}(${params.map((param) => `${param.name}${param.optional ? '?' : ''}`).join(', ')})`;
}

function buildSchemaParamsHint(params) {
  if (!Array.isArray(params) || params.length === 0) {
    return '()';
  }
  return `(${params.map((param) => param.name).join(', ')})`;
}

function getPrimaryUsageExampleModel(model = {}) {
  const usageExamples = Array.isArray(model?.usageExamples) ? model.usageExamples : [];
  const firstUsageExample = usageExamples.find(
    (usageExample) => typeof usageExample?.functionCall === 'string' && usageExample.functionCall.trim().length > 0
  );
  if (firstUsageExample) {
    return {
      functionCall: firstUsageExample.functionCall.trim(),
      description: String(firstUsageExample.description || '').trim(),
    };
  }
  const example = String(model?.example || '').trim();
  return example ? { functionCall: example, description: '' } : null;
}

function getUsageExampleModels(model = {}) {
  return (Array.isArray(model?.usageExamples) ? model.usageExamples : [])
    .map((usageExample) => ({
      functionCall: String(usageExample?.functionCall || '').trim(),
      description: String(usageExample?.description || '').trim(),
    }))
    .filter((usageExample) => usageExample.functionCall);
}

function renderUsageExampleHtml(usageExample) {
  const descriptionHtml = usageExample.description ? ` - ${escapeHtml(usageExample.description)}` : '';
  return `<code>${escapeHtml(usageExample.functionCall)}</code>${descriptionHtml}`;
}

function renderSchemaHelpHtml(model) {
  if (!model?.show) {
    return '';
  }

  const sections = [`<p><strong>${escapeHtml(model.heading || model.title || '')}</strong></p>`];
  if (model.summary) {
    sections.push(`<p>${escapeHtml(model.summary)}</p>`);
  }

  if (model.kind === 'command') {
    sections.push(
      `<p><strong>Call:</strong> <code>${escapeHtml(buildCallSignature(model.heading, model.params))}</code></p>`
    );
  }

  if (Array.isArray(model.params) && model.params.length > 0) {
    const paramItems = model.params
      .map((param) => {
        const paramName = `${param.name}${param.optional ? '?' : ''}`;
        const paramType = cleanParamText(param.type);
        const paramDescription = cleanParamText(param.description);
        const descriptionHtml = paramDescription ? ` - ${escapeHtml(paramDescription)}` : '';
        return `<li><code>${escapeHtml(paramName)}</code>: <code>${escapeHtml(paramType)}</code>${descriptionHtml}</li>`;
      })
      .join('');
    sections.push(
      `<p><strong>Schema params field:</strong> <code>${escapeHtml(buildSchemaParamsHint(model.params))}</code></p>`
    );
    sections.push(`<p><strong>Params:</strong></p><ul>${paramItems}</ul>`);
  }

  const usageExampleModels = getUsageExampleModels(model);
  if (model.showUsageExampleList && usageExampleModels.length > 1) {
    const exampleItems = usageExampleModels
      .map((usageExample) => `<li>${renderUsageExampleHtml(usageExample)}</li>`)
      .join('');
    sections.push(`<p><strong>Examples:</strong></p><ul>${exampleItems}</ul>`);
  } else if (usageExampleModels.length > 0) {
    sections.push(`<p><strong>Example:</strong> ${renderUsageExampleHtml(usageExampleModels[0])}</p>`);
  } else {
    const primaryUsageExample = getPrimaryUsageExampleModel(model);
    if (primaryUsageExample) {
      sections.push(`<p><strong>Example:</strong> ${renderUsageExampleHtml(primaryUsageExample)}</p>`);
    } else if (model.kind === 'command') {
      sections.push('<p><strong>Example:</strong> Output depends on your selected params.</p>');
    }
  }

  if (model.docsUrl) {
    sections.push(
      `<p><a class="helplink" href="${escapeHtml(model.docsUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(
        model.kind === 'command' ? `Learn more: ${model.heading}` : 'Learn more'
      )}</a></p>`
    );
  }

  return sections.join('');
}

function buildUsageExample(functionCall, description = '') {
  return {
    functionCall,
    description,
  };
}

function buildTypeHelpModel(
  typeName,
  summary,
  docsUrl,
  { params = [], example = '', usageExamples = [], showUsageExampleList = false } = {}
) {
  const normalizedUsageExamples =
    Array.isArray(usageExamples) && usageExamples.length > 0
      ? usageExamples
      : example
        ? [
            {
              functionCall: example,
              description: `${typeName} example usage.`,
            },
          ]
        : [];

  return {
    show: true,
    kind: 'type',
    title: `${typeName} data help`,
    heading: typeName,
    summary,
    docsUrl,
    params,
    example,
    usageExamples: normalizedUsageExamples,
    showUsageExampleList,
  };
}

function buildFakerTopLevelHelpModel() {
  return buildTypeHelpModel(
    'Faker',
    'Faker helper commands allow use of more complex generation than the domain commands. See help for details.',
    HELP_URLS.faker,
    {
      usageExamples: [
        buildUsageExample(
          'helpers.rangeToNumber({ min: 1, max: 10 })',
          'Generate a number from a helper range object.'
        ),
      ],
    }
  );
}

function buildDomainTopLevelHelpModel() {
  return buildTypeHelpModel(
    'Domain',
    'Domain commands provide a controlled interface for common data generation tasks.',
    HELP_URLS.domain,
    {
      usageExamples: [
        buildUsageExample('person.fullName()', 'Generate a person name.'),
        buildUsageExample('number.int(1,10)', 'Generate a number within a range.'),
        buildUsageExample('internet.email()', 'Generate an email address.'),
      ],
      showUsageExampleList: true,
    }
  );
}

function buildSchemaHelpModel(sourceType, commandValue, options = {}) {
  void options;
  const normalisedSourceType = normaliseSourceType(sourceType);

  if (normalisedSourceType === SOURCE_TYPE_REGEX) {
    return buildTypeHelpModel(
      'Regex',
      'Regex patterns generate random values that match the specified expression.',
      HELP_URLS.regex,
      {
        params: [
          {
            name: 'pattern',
            type: 'regex string',
            optional: false,
            description: 'The regular expression used to generate each value.',
            example: '[A-Z]{3}',
          },
        ],
        example: 'regex([A-Z]{3})',
      }
    );
  }

  if (normalisedSourceType === SOURCE_TYPE_LITERAL) {
    return buildTypeHelpModel(
      'Literal',
      'Literal data repeats the exact text you enter for every generated row.',
      HELP_URLS.literal,
      {
        params: [
          {
            name: 'value',
            type: 'string',
            optional: false,
            description: 'The exact value emitted for every generated row.',
            example: 'Pending Review',
          },
        ],
        example: 'literal(Pending Review)',
      }
    );
  }

  if (normalisedSourceType === SOURCE_TYPE_ENUM) {
    return buildTypeHelpModel(
      'Enum',
      'Enum values allow you to specify a list of discrete options. Use comma-separated values with no quotes, for example "active,inactive,pending" or "enum active,inactive,pending".',
      HELP_URLS.enum,
      {
        params: [
          {
            ...ENUM_VALUE_PARAM,
            description: 'List of allowed values randomly selected during generation.',
          },
        ],
        example: 'enum active,inactive,pending',
      }
    );
  }

  if (normalisedSourceType === SOURCE_TYPE_FAKER) {
    const command = normaliseFakerCommand(commandValue);
    if (!command) {
      return buildFakerTopLevelHelpModel();
    }
    const commandHelp = getFakerCommandHelp(command);
    return {
      show: true,
      kind: 'command',
      title: `Faker command help: ${command}`,
      heading: `faker.${command}`,
      summary: commandHelp?.summary || `Generates data using faker.${command}.`,
      docsUrl: resolveOwnedSiteUrl(resolveFakerDocsUrl(command, commandHelp?.docsUrl)),
      fakerDocsUrl: String(commandHelp?.fakerDocsUrl || '').trim(),
      params: normalizeHelpParams(commandHelp?.params || []),
      usageExamples: Array.isArray(commandHelp?.usageExamples) ? commandHelp.usageExamples : [],
    };
  }

  if (normalisedSourceType === SOURCE_TYPE_DOMAIN) {
    const command = normaliseDomainCommand(commandValue);
    if (!command) {
      return buildDomainTopLevelHelpModel();
    }
    const commandHelp = getDomainCommandHelp(command);
    return {
      show: true,
      kind: 'command',
      title: `Domain command help: ${command}`,
      heading: commandHelp?.canonical || command,
      summary: commandHelp?.summary || `Generates data using ${commandHelp?.canonical || command}.`,
      docsUrl: resolveOwnedSiteUrl(commandHelp?.docsUrl || HELP_URLS.domain),
      fakerDocsUrl: String(commandHelp?.fakerDocsUrl || '').trim(),
      params: resolveDomainHelpParams(command, commandHelp),
      usageExamples: Array.isArray(commandHelp?.usageExamples) ? commandHelp.usageExamples : [],
    };
  }

  return { show: false, kind: 'type', title: '', heading: '', summary: '', docsUrl: '', params: [], example: '' };
}

export {
  HELP_URLS,
  resolveFakerDocsUrl,
  buildSchemaHelpModel,
  renderSchemaHelpHtml,
  buildCallSignature,
  buildSchemaParamsHint,
};
