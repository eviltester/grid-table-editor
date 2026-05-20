/*
 * Responsibilities:
 * - Converts command/type metadata into a shared help model for test-data UIs.
 * - Renders escaped HTML snippets for tooltip/help affordances from one source of truth.
 * - Keeps command help behavior unit-testable without booting full pages.
 */

import { getFakerCommandHelp } from '../faker-command-help-metadata.js';
import { getDomainCommandHelp } from '../domain-command-help-metadata.js';
import { escapeHtml } from '../html-escape.js';
import {
  SOURCE_TYPE_FAKER,
  SOURCE_TYPE_DOMAIN,
  SOURCE_TYPE_REGEX,
  SOURCE_TYPE_LITERAL,
  SOURCE_TYPE_ENUM,
  normaliseFakerCommand,
  normaliseDomainCommand,
  normaliseSourceType,
} from '../schema-row-rule-mapper.js';

const HELP_URLS = Object.freeze({
  regex: 'https://anywaydata.com/docs/test-data/regex-test-data',
  faker: 'https://anywaydata.com/docs/test-data/faker-test-data',
  domain: 'https://anywaydata.com/docs/test-data/domain/domain-test-data',
  literal: 'https://anywaydata.com/docs/category/generating-data',
  enum: 'https://anywaydata.com/docs/category/generating-data',
});

function cleanParamText(text) {
  return String(text || '')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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

  if (model.example) {
    sections.push(`<p><strong>Example:</strong> <code>${escapeHtml(model.example)}</code></p>`);
  } else if (model.kind === 'command') {
    sections.push('<p><strong>Example:</strong> Output depends on your selected params.</p>');
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

function buildTypeHelpModel(typeName, summary, docsUrl) {
  return {
    show: true,
    kind: 'type',
    title: `${typeName} data help`,
    heading: typeName,
    summary,
    docsUrl,
    params: [],
    example: '',
  };
}

function buildSchemaHelpModel(sourceType, commandValue) {
  const normalisedSourceType = normaliseSourceType(sourceType);

  if (normalisedSourceType === SOURCE_TYPE_REGEX) {
    return buildTypeHelpModel(
      'Regex',
      'Regex patterns generate random values that match the specified expression.',
      HELP_URLS.regex
    );
  }

  if (normalisedSourceType === SOURCE_TYPE_LITERAL) {
    return buildTypeHelpModel(
      'Literal',
      'Literal data repeats the exact text you enter for every generated row.',
      HELP_URLS.literal
    );
  }

  if (normalisedSourceType === SOURCE_TYPE_ENUM) {
    return buildTypeHelpModel(
      'Enum',
      'Enum values allow you to specify a list of discrete options. Use formats like "Red,Blue,Green" or "enum("Option1", "Option2")".',
      HELP_URLS.enum
    );
  }

  if (normalisedSourceType === SOURCE_TYPE_FAKER) {
    const command = normaliseFakerCommand(commandValue);
    if (!command) {
      return buildTypeHelpModel(
        'Faker',
        'Faker commands generate realistic random values such as names, addresses, and dates.',
        HELP_URLS.faker
      );
    }
    const commandHelp = getFakerCommandHelp(command);
    return {
      show: true,
      kind: 'command',
      title: `Faker command help: ${command}`,
      heading: `faker.${command}`,
      summary: commandHelp?.summary || `Generates data using faker.${command}.`,
      docsUrl: commandHelp?.docsUrl || HELP_URLS.faker,
      params: commandHelp?.params || [],
      example: commandHelp?.example || '',
    };
  }

  if (normalisedSourceType === SOURCE_TYPE_DOMAIN) {
    const command = normaliseDomainCommand(commandValue);
    if (!command) {
      return buildTypeHelpModel(
        'Domain',
        'Domain commands provide a controlled interface for data generation.',
        HELP_URLS.domain
      );
    }
    const commandHelp = getDomainCommandHelp(command);
    return {
      show: true,
      kind: 'command',
      title: `Domain command help: ${command}`,
      heading: commandHelp?.canonical || command,
      summary: commandHelp?.summary || `Generates data using ${commandHelp?.canonical || command}.`,
      docsUrl: commandHelp?.docsUrl || HELP_URLS.domain,
      params: commandHelp?.args || [],
      example: commandHelp?.example || '',
    };
  }

  return { show: false, kind: 'type', title: '', heading: '', summary: '', docsUrl: '', params: [], example: '' };
}

export { HELP_URLS, buildSchemaHelpModel, renderSchemaHelpHtml, buildCallSignature, buildSchemaParamsHint };
