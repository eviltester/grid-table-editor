import RandExp from 'randexp';
import { faker } from '@faker-js/faker';
import { createThemeToggleComponent } from '../../../packages/core-ui/js/gui_components/shared/theme-toggle.js';
import { createSharedSchemaDefinitionComponent } from '../../../packages/core-ui/js/gui_components/shared/schema-definition/index.js';
import {
  schemaTextToDataRules,
  dataRulesToSchemaText,
  schemaRowsToDataRules,
} from '@anywaydata/core/data_generation/schema-rules-adapter.js';
import { validateSchemaRows as validateSharedSchemaRows } from '../../../packages/core-ui/js/gui_components/shared/test-data/schema/schema-editor-core.js';
import { mapDataRuleToSchemaRow } from '../../../packages/core-ui/js/gui_components/shared/test-data/schema/schema-row-mapper.js';
import {
  buildRuleSpecFromSchemaRow,
  extractEnumValueFromRuleSpec,
} from '../../../packages/core-ui/js/gui_components/shared/schema-row-rule-mapper.js';
import { TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT } from '../../../packages/core-ui/js/gui_components/shared/test-data/schema/schema-examples.js';
import {
  identifyFakerCommands,
  getMethodPickerOptions,
  getFakerCommands,
  getDomainCommands,
} from '../../../packages/core-ui/js/gui_components/app/test-data-grid/schema/test-data-command-catalog.js';
import { getDomainCommandHelp } from '../../../packages/core-ui/js/gui_components/shared/domain-command-help-metadata.js';
import { getVisibleDomainCommands } from '../../../packages/core-ui/js/gui_components/shared/test-data/help/domain-command-provider.js';
import { renderIconHtml } from '../../../packages/core-ui/js/gui_components/shared/primitives/icon/icon-core.js';

const DEFAULT_PROMPT = 'Create 10 fields that represent the inventory of a bookshop';
const WRITER_SUPPORTED_SOURCE_TYPES = new Set(['domain', 'enum', 'literal', 'regex']);
const WRITER_DATE_FIELD_HINT =
  /\b(date|time|timestamp|day|month|year|birthday|dob|created|updated|published|expires?)\b/i;
const WRITER_DATE_LITERAL_PLACEHOLDER =
  /^(yyyy[-/]mm[-/]dd|yyyy-mm-dd|mm[-/]dd[-/]yyyy|dd[-/]mm[-/]yyyy|iso[-_ ]?date|date string|timestamp)$/i;
const WRITER_DOMAIN_GUIDE_DOMAINS = [
  'book',
  'commerce',
  'company',
  'person',
  'date',
  'location',
  'internet',
  'phone',
  'finance',
  'number',
  'string',
];

function setStatus(statusElement, message, options = {}) {
  if (!statusElement) {
    return;
  }

  statusElement.textContent = message;
  statusElement.classList.remove('is-loading');

  if (options.isLoading) {
    statusElement.classList.add('is-loading');
  }

  if (options.severity) {
    statusElement.setAttribute('data-severity', options.severity);
  } else {
    statusElement.removeAttribute('data-severity');
  }
}

function setJsonOutput(element, value) {
  if (!element) {
    return;
  }

  if (typeof value === 'string') {
    element.textContent = value;
    return;
  }

  element.textContent = JSON.stringify(value, null, 2);
}

function setTextOutput(element, value, fallback = '') {
  if (!element) {
    return;
  }

  const text = String(value ?? '').trim();
  element.textContent = text || fallback;
}

function clearProgressOutput(element, documentObj = globalThis.document) {
  if (!element) {
    return;
  }

  element.innerHTML = '';

  const item = documentObj?.createElement?.('li');
  if (!item) {
    return;
  }

  item.textContent = 'No generation activity yet.';
  element.append(item);
}

function appendProgressOutput(element, message, documentObj = globalThis.document) {
  if (!element || !documentObj) {
    return;
  }

  if (element.children.length === 1 && element.firstElementChild?.textContent === 'No generation activity yet.') {
    element.innerHTML = '';
  }

  const item = documentObj.createElement('li');
  item.textContent = message;
  element.append(item);
}

function createWriterGenerationError(message, details = {}) {
  const error = new Error(message);
  Object.assign(error, details);
  return error;
}

function buildWriterRequestDetails({ promptText, sharedContext, taskContext, writeOptions }) {
  return {
    promptText,
    sharedContext,
    taskContext,
    writeOptions,
  };
}

function createCopyApiRequestPrompt(requestDetails = {}) {
  const promptText = String(requestDetails.promptText || '').trim();
  const sharedContext = String(requestDetails.sharedContext || '').trim();
  const taskContext = String(requestDetails.taskContext || '').trim();
  const writeOptionsJson = JSON.stringify(requestDetails.writeOptions || {}, null, 2);

  return [
    'Generate an AnyWayData schema response using the following request details.',
    'Return JSON only, with no markdown fences or explanation.',
    '',
    'User prompt:',
    promptText,
    '',
    'Shared context:',
    sharedContext,
    '',
    'Task context:',
    taskContext,
    '',
    'Write options:',
    writeOptionsJson,
  ].join('\n');
}

async function copyTextToClipboard(text, { navigatorObj = globalThis.navigator } = {}) {
  const clipboard = navigatorObj?.clipboard;
  if (typeof clipboard?.writeText !== 'function') {
    throw new Error('Clipboard copy is not available in this browser session.');
  }

  await clipboard.writeText(String(text ?? ''));
}

function createBlankRowFactory(prefix = 'writer-schema-row') {
  let counter = 0;
  return () => ({
    id: `${prefix}-${counter++}`,
    name: '',
    sourceType: 'regex',
    command: '',
    params: '',
    value: '',
    comments: '',
    leadingTextLines: [],
  });
}

function validateSchemaRows(schemaRows) {
  return validateSharedSchemaRows({
    schemaRows,
    schemaRowsToDataRules,
  });
}

function buildModeHelpHtml({ inTextMode }) {
  if (inTextMode) {
    return `
      <p><strong>Edit as Schema</strong></p>
      <p>Switch back to row mode after reviewing the generated schema text or making manual edits.</p>
      <button type="button" class="shared-schema-sample-button">Insert Example Schema</button>
    `;
  }

  return `
    <p><strong>Edit as Text</strong></p>
    <p>Switch to text mode when you want to inspect the generated schema spec directly.</p>
    <button type="button" class="shared-schema-sample-button">Insert Example Schema</button>
  `;
}

function createSchemaDefinitionProps() {
  identifyFakerCommands();
  const createBlankRow = createBlankRowFactory();
  const domainCommands = getDomainCommands();
  const fakerCommands = getFakerCommands().filter((command) => command !== 'RegEx' && command.startsWith('helpers.'));

  return {
    headingText: 'Schema',
    schemaTextToDataRules,
    dataRulesToSchemaText,
    faker,
    RandExp,
    createBlankRow,
    mapRuleToRow: (rule, leadingTextLines = []) => {
      const row = mapDataRuleToSchemaRow(rule, {
        createBlankSchemaRow: createBlankRow,
      });
      row.leadingTextLines = Array.isArray(leadingTextLines) ? leadingTextLines.slice() : [];
      return row;
    },
    getMethodPickerOptions,
    getVisibleDomainCommands: (currentValue = '') =>
      getVisibleDomainCommands({
        commands: domainCommands,
        currentCommand: String(currentValue || '').trim(),
      }),
    fakerCommands,
    sampleSchemaText: TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT,
    buildModeHelpHtml,
    validateSchemaRows,
    writerContextDomainCommands: getVisibleDomainCommands({
      commands: domainCommands,
      currentCommand: '',
    }),
  };
}

function createExampleStructuredSchema() {
  return {
    schemaFields: [
      { name: 'Book Title', sourceType: 'domain', command: 'commerce.productName' },
      { name: 'Author Name', sourceType: 'domain', command: 'person.fullName' },
      { name: 'Genre', sourceType: 'enum', values: ['Fiction', 'Non-fiction', 'Sci-fi', 'Children'] },
      { name: 'ISBN', sourceType: 'regex', pattern: '[0-9]{3}-[0-9]{10}' },
      { name: 'In Stock', sourceType: 'enum', values: ['Yes', 'No'] },
      { name: 'Price Band', sourceType: 'enum', values: ['Budget', 'Standard', 'Premium'] },
    ],
  };
}

function buildWriterDomainCommandGuide(domainCommands = []) {
  const commandsByDomain = new Map();

  domainCommands.forEach((command) => {
    const domainName = String(command || '')
      .trim()
      .split('.')[0];
    if (!domainName) {
      return;
    }

    if (!commandsByDomain.has(domainName)) {
      commandsByDomain.set(domainName, []);
    }
    commandsByDomain.get(domainName).push(command);
  });

  return WRITER_DOMAIN_GUIDE_DOMAINS.filter((domainName) => commandsByDomain.has(domainName))
    .map((domainName) => {
      const entries = commandsByDomain
        .get(domainName)
        .slice(0, 6)
        .map((command) => {
          const help = getDomainCommandHelp(command);
          const example = String(help?.example || '').trim();
          const summary = String(help?.summary || '')
            .trim()
            .replace(/\s+/g, ' ');
          const parts = [command];
          if (example) {
            parts.push(`example: ${example}`);
          }
          if (summary) {
            parts.push(summary);
          }
          return `- ${parts.join(' | ')}`;
        });

      return `${domainName} commands:\n${entries.join('\n')}`;
    })
    .join('\n\n');
}

function buildWriterSharedContext({ domainCommands = [], sampleSchemaText = TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT } = {}) {
  const domainCommandGuide = buildWriterDomainCommandGuide(domainCommands);

  return [
    'You create schemas for AnyWayData, a schema-based test data generator.',
    'The app will parse your response into a schema editor.',
    'Return JSON only. Do not wrap the JSON in markdown fences. Do not add explanation before or after the JSON.',
    'Supported sourceType values are exactly: domain, enum, literal, regex.',
    'A domain command is valid only if it exactly matches one of the allowed commands. Never invent or rename commands.',
    'If you are unsure about the exact domain command, prefer enum, literal, or regex instead of guessing a domain command.',
    'Use domain commands when they fit the prompt naturally. Use enum for small closed sets, literal for one fixed value, and regex for pattern-shaped identifiers.',
    'For date-like fields, prefer date domain commands such as date.recent, date.past, date.future, date.birthdate, date.anytime, date.month, or date.weekday when one fits.',
    'Do not use literal placeholders like YYYY-MM-DD, MM/DD/YYYY, date string, or timestamp for date fields.',
    'For enum fields, provide a values array of strings.',
    'For literal fields, provide a value string.',
    'For regex fields, provide a pattern string.',
    'For domain fields, provide a command string and optional params string without surrounding parentheses.',
    'Do not create commands like commerce.publisher if they are not explicitly listed. For example, use book.publisher if that is the listed command.',
    'Output shape:',
    JSON.stringify(createExampleStructuredSchema(), null, 2),
    'Compact command guide:',
    domainCommandGuide,
    'Only use domain commands from this list:',
    domainCommands.join(', '),
    'Example AnyWayData schema text:',
    sampleSchemaText,
  ].join('\n\n');
}

function buildWriterTaskContext() {
  return [
    'Respond with a single JSON object containing a schemaFields array.',
    'Write the response in English.',
    'Each schemaFields item must include a user-facing field name and one supported sourceType.',
    'Prefer between 6 and 12 fields unless the prompt clearly requests another count.',
    'Keep field names concise and realistic for the requested domain.',
  ].join(' ');
}

function extractJsonPayload(text) {
  const source = String(text || '').trim();
  if (!source) {
    throw new Error('Writer API returned an empty response.');
  }

  const fencedMatch = source.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const objectStart = source.indexOf('{');
  const objectEnd = source.lastIndexOf('}');
  if (objectStart >= 0 && objectEnd > objectStart) {
    return source.slice(objectStart, objectEnd + 1).trim();
  }

  return source;
}

function parseWriterStructuredOutput(text) {
  const jsonPayload = extractJsonPayload(text);

  try {
    return JSON.parse(jsonPayload);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Writer API returned non-JSON output: ${message}`, {
      cause: error,
    });
  }
}

function quoteEnumValue(value) {
  return JSON.stringify(String(value ?? ''));
}

function isDatePlaceholderLiteral(name, value) {
  const fieldName = String(name || '').trim();
  const literalValue = String(value || '').trim();

  if (!fieldName || !literalValue) {
    return false;
  }

  return WRITER_DATE_FIELD_HINT.test(fieldName) && WRITER_DATE_LITERAL_PLACEHOLDER.test(literalValue);
}

function suggestAllowedDomainCommands(command, allowedDomainCommands = []) {
  const normalizedCommand = String(command || '')
    .trim()
    .toLowerCase();
  const [domainName = '', suffix = ''] = normalizedCommand.split('.');

  const sameDomain = allowedDomainCommands.filter((candidate) => candidate.toLowerCase().startsWith(`${domainName}.`));
  const suffixMatches = allowedDomainCommands.filter((candidate) => candidate.toLowerCase().endsWith(`.${suffix}`));
  return [...new Set([...sameDomain, ...suffixMatches])].slice(0, 5);
}

function inferSourceTypeFromField(field = {}) {
  const explicitSourceType = String(field.sourceType || '')
    .trim()
    .toLowerCase();
  if (WRITER_SUPPORTED_SOURCE_TYPES.has(explicitSourceType)) {
    return explicitSourceType;
  }

  if (Array.isArray(field.values)) {
    return 'enum';
  }
  if (typeof field.pattern === 'string' && field.pattern.trim()) {
    return 'regex';
  }
  if (typeof field.command === 'string' && field.command.trim()) {
    return 'domain';
  }

  const rule = String(field.rule || '').trim();
  if (!rule) {
    return '';
  }
  if (/^(enum|datatype\.enum|awd\.datatype\.enum)\s*\(/i.test(rule)) {
    return 'enum';
  }
  if (/^(literal|datatype\.literal|awd\.datatype\.literal)\s*\(/i.test(rule)) {
    return 'literal';
  }
  if (/^(regex|datatype\.regex|awd\.datatype\.regex)\s*\(/i.test(rule)) {
    return 'regex';
  }
  if (/^[A-Za-z_][\w]*(?:\.[A-Za-z_][\w]*)+/.test(rule)) {
    return 'domain';
  }

  return '';
}

function normalizeStructuredField(field, index = 0, { allowedDomainCommands = [] } = {}) {
  const name = String(field?.name || '')
    .trim()
    .replace(/\s+/g, ' ');
  if (!name) {
    throw new Error(`Generated field ${index + 1} is missing a name.`);
  }

  const sourceType = inferSourceTypeFromField(field);
  if (!WRITER_SUPPORTED_SOURCE_TYPES.has(sourceType)) {
    throw new Error(`Generated field "${name}" used an unsupported sourceType.`);
  }

  const row = {
    id: `writer-schema-generated-${index}`,
    name,
    sourceType,
    command: '',
    params: '',
    value: '',
    comments: '',
    leadingTextLines: [],
  };

  if (sourceType === 'domain') {
    const command = String(field.command || field.rule || '')
      .trim()
      .replace(/\s*\([\s\S]*\)\s*$/, '');
    if (!command) {
      throw new Error(`Generated domain field "${name}" is missing a command.`);
    }
    if (
      Array.isArray(allowedDomainCommands) &&
      allowedDomainCommands.length > 0 &&
      !allowedDomainCommands.includes(command)
    ) {
      const suggestions = suggestAllowedDomainCommands(command, allowedDomainCommands);
      const suggestionText =
        suggestions.length > 0 ? ` Try one of: ${suggestions.join(', ')}.` : ' Use one of the listed allowed commands.';
      throw new Error(`Generated domain field "${name}" used unsupported command "${command}".${suggestionText}`);
    }
    row.command = command;
    row.params = String(field.params || '').trim();
    return row;
  }

  if (sourceType === 'enum') {
    if (Array.isArray(field.values) && field.values.length > 0) {
      row.value = field.values.map((value) => quoteEnumValue(value)).join(',');
      return row;
    }

    const enumSpec = String(field.value || field.rule || '').trim();
    row.value = extractEnumValueFromRuleSpec(enumSpec);
    if (!row.value) {
      throw new Error(`Generated enum field "${name}" is missing values.`);
    }
    return row;
  }

  if (sourceType === 'regex') {
    row.value = String(field.pattern || field.value || field.rule || '').trim();
    if (!row.value) {
      throw new Error(`Generated regex field "${name}" is missing a pattern.`);
    }
    return row;
  }

  row.value = String(field.value || field.literal || field.rule || '');
  if (isDatePlaceholderLiteral(name, row.value)) {
    throw new Error(
      `Generated field "${name}" used placeholder literal "${row.value}" for a date-like field. Use an allowed date.* domain command instead.`
    );
  }
  return row;
}

function normalizeStructuredSchemaPayload(payload, { allowedDomainCommands = [] } = {}) {
  if (!payload || typeof payload !== 'object' || !Array.isArray(payload.schemaFields)) {
    throw new Error('Writer API output must be a JSON object with a schemaFields array.');
  }

  if (payload.schemaFields.length === 0) {
    throw new Error('Writer API output did not contain any schema fields.');
  }

  const schemaRows = [];
  const normalizationErrors = [];

  payload.schemaFields.forEach((field, index) => {
    try {
      schemaRows.push(
        normalizeStructuredField(field, index, {
          allowedDomainCommands,
        })
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      normalizationErrors.push({
        index,
        field,
        message,
      });
    }
  });

  if (schemaRows.length === 0 && normalizationErrors.length > 0) {
    throw createWriterGenerationError(
      normalizationErrors.map((item) => item.message).join('; '),
      {
        normalizationErrors,
      }
    );
  }

  return {
    schemaRows,
    normalizationErrors,
  };
}

async function resolveWriterAvailability(WriterCtor) {
  if (!WriterCtor?.availability) {
    return 'unavailable';
  }

  return WriterCtor.availability();
}

async function createWriterInstance(WriterCtor, { onStatus, sharedContext }) {
  const createOptions = {
    format: 'plain-text',
    length: 'medium',
    tone: 'neutral',
    expectedInputLanguages: ['en'],
    expectedContextLanguages: ['en'],
    outputLanguage: 'en',
    sharedContext,
    monitor(monitorHandle) {
      monitorHandle.addEventListener('downloadprogress', (event) => {
        const loadedPercent = typeof event?.loaded === 'number' ? Math.round(event.loaded * 100) : null;
        onStatus?.(
          loadedPercent === null
            ? 'Downloading the local Writer model...'
            : `Downloading the local Writer model... ${loadedPercent}%`,
          { isLoading: true, severity: 'info' }
        );
      });
    },
  };
  const writer = await WriterCtor.create(createOptions);

  onStatus?.('Writer model ready. Generating structured schema output...', {
    isLoading: true,
    severity: 'info',
  });

  return {
    writer,
    createOptions,
  };
}

async function runWriterSchemaGeneration({ WriterCtor, promptText, domainCommands, sampleSchemaText, onStatus }) {
  let responseText = '';

  const sharedContext = buildWriterSharedContext({
    domainCommands,
    sampleSchemaText,
  });
  const taskContext = buildWriterTaskContext();
  const { writer, createOptions } = await createWriterInstance(WriterCtor, { onStatus, sharedContext });
  const writeOptions = {
    context: taskContext,
    expectedInputLanguages: ['en'],
    expectedContextLanguages: ['en'],
    outputLanguage: 'en',
  };
  const requestDetails = buildWriterRequestDetails({
    promptText,
    sharedContext,
    taskContext,
    writeOptions,
  });

  try {
    onStatus?.('Writer session ready. Requesting schema output...', {
      isLoading: true,
      severity: 'info',
      requestDetails,
    });

    if (typeof writer.writeStreaming === 'function') {
      onStatus?.('Streaming Writer response...', {
        isLoading: true,
        severity: 'info',
        requestDetails,
      });

      for await (const chunk of writer.writeStreaming(promptText, writeOptions)) {
        responseText += String(chunk || '');
        onStatus?.(`Streaming Writer response... ${responseText.length} characters received.`, {
          isLoading: true,
          severity: 'info',
          rawResponseText: responseText,
          requestDetails,
        });
      }
    } else {
      onStatus?.('Waiting for Writer response...', {
        isLoading: true,
        severity: 'info',
        requestDetails,
      });

      responseText = await writer.write(promptText, writeOptions);
      onStatus?.('Writer response received. Parsing structured schema output...', {
        isLoading: true,
        severity: 'info',
        rawResponseText: responseText,
        requestDetails,
      });
    }

    const parsedPayload = parseWriterStructuredOutput(responseText);
    onStatus?.('Structured output parsed. Validating generated schema fields...', {
      isLoading: true,
      severity: 'info',
      rawResponseText: responseText,
      requestDetails,
    });

    const { schemaRows, normalizationErrors } = normalizeStructuredSchemaPayload(parsedPayload, {
      allowedDomainCommands: domainCommands,
    });

    return {
      parsedPayload,
      schemaRows,
      normalizationErrors,
      responseText,
      requestDetails: {
        ...requestDetails,
        createOptions,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw createWriterGenerationError(message, {
      cause: error,
      writerResponseText: responseText,
      writerRequestDetails: {
        ...requestDetails,
        createOptions,
      },
    });
  } finally {
    writer.destroy?.();
  }
}

async function bootstrapWriterSchemaPage({
  documentObj = globalThis.document,
  WriterCtor = globalThis.Writer,
  navigatorObj = globalThis.navigator,
  createThemeToggleComponentFn = createThemeToggleComponent,
  createSharedSchemaDefinitionComponentFn = createSharedSchemaDefinitionComponent,
} = {}) {
  if (!documentObj) {
    return null;
  }

  const supportStatusElement = documentObj.getElementById('writer-schema-support-status');
  const generationStatusElement = documentObj.getElementById('writer-schema-generation-status');
  const jsonOutputElement = documentObj.getElementById('writer-schema-json-output');
  const rawOutputElement = documentObj.getElementById('writer-schema-raw-output');
  const errorOutputElement = documentObj.getElementById('writer-schema-error-output');
  const progressOutputElement = documentObj.getElementById('writer-schema-progress-output');
  const requestOutputElement = documentObj.getElementById('writer-schema-request-output');
  const processResponseElement = documentObj.getElementById('writer-schema-process-response');
  const promptElement = documentObj.getElementById('writer-schema-prompt');
  const generateButton = documentObj.getElementById('writer-schema-generate');
  const examplePromptButton = documentObj.getElementById('writer-schema-example-prompt');
  const copyRequestButton = documentObj.getElementById('writer-schema-copy-request');
  const copyPromptButton = documentObj.getElementById('writer-schema-copy-prompt');
  const createSchemaFromResponseButton = documentObj.getElementById('writer-schema-create-schema');
  const schemaRoot = documentObj.getElementById('writer-schema-editor-root');

  copyRequestButton?.insertAdjacentHTML(
    'afterbegin',
    `${renderIconHtml('copy', { className: 'app-icon writer-schema-action-icon' })}<span>Copy JSON</span>`
  );
  copyPromptButton?.insertAdjacentHTML(
    'afterbegin',
    `${renderIconHtml('clipboard-paste', { className: 'app-icon writer-schema-action-icon' })}<span>Copy Prompt</span>`
  );

  const schemaDefinitionProps = createSchemaDefinitionProps();
  const schemaComponent = createSharedSchemaDefinitionComponentFn({
    root: schemaRoot,
    documentObj,
    props: schemaDefinitionProps,
    callbacks: {
      onSchemaError: (message) => {
        const errorElement = schemaRoot?.querySelector?.('[data-role="schema-error"]');
        if (errorElement) {
          errorElement.textContent = message;
          errorElement.style.display = message ? 'inline-block' : 'none';
        }
      },
      onSchemaClear: () => {
        const errorElement = schemaRoot?.querySelector?.('[data-role="schema-error"]');
        if (errorElement) {
          errorElement.textContent = '';
          errorElement.style.display = 'none';
        }
      },
    },
  });

  const themeToggle = createThemeToggleComponentFn({
    documentObj,
    hostElement: documentObj.querySelector('[data-role="theme-toggle-host"]'),
  });

  promptElement.value = DEFAULT_PROMPT;
  setJsonOutput(jsonOutputElement, 'No output yet.');
  setTextOutput(rawOutputElement, '', 'No raw Writer response yet.');
  setTextOutput(errorOutputElement, '', 'No errors yet.');
  setJsonOutput(requestOutputElement, 'No Writer request has been sent yet.');
  clearProgressOutput(progressOutputElement, documentObj);

  const availability = await resolveWriterAvailability(WriterCtor);
  if (!WriterCtor) {
    setStatus(
      supportStatusElement,
      'Writer API is not available in this browser session. Open this page in a supported Chrome build with the Writer API flags or origin trial enabled.',
      { severity: 'warning' }
    );
  } else if (availability === 'available') {
    setStatus(supportStatusElement, 'Writer API is available in this browser session.', { severity: 'info' });
  } else if (availability === 'downloadable') {
    setStatus(
      supportStatusElement,
      'Writer API support is present, but the local model still needs to download the first time you run it.',
      { severity: 'warning' }
    );
  } else {
    setStatus(
      supportStatusElement,
      `Writer API is currently reported as "${availability}". Check Chrome support, local hardware requirements, and the relevant flags.`,
      { severity: 'warning' }
    );
  }

  let isGenerating = false;
  let latestRequestDetails = null;

  function applySchemaResult(result, { sourceLabel = 'schema response', keepRawResponse = true } = {}) {
    setJsonOutput(jsonOutputElement, result.parsedPayload);
    if (keepRawResponse) {
      setTextOutput(rawOutputElement, result.responseText, 'No raw Writer response yet.');
    }

    const normalizationErrors = Array.isArray(result.normalizationErrors) ? result.normalizationErrors : [];
    setTextOutput(
      errorOutputElement,
      normalizationErrors.length > 0 ? normalizationErrors.map((item) => item.message).join('\n\n') : '',
      'No errors yet.'
    );
    if (result.requestDetails) {
      latestRequestDetails = result.requestDetails;
      setJsonOutput(requestOutputElement, result.requestDetails);
    }
    schemaComponent.setTextMode?.(false);
    schemaComponent.replaceRows?.(result.schemaRows);
    schemaComponent.render?.();
    schemaComponent.syncTextFromRows?.();

    const validation = schemaComponent.validateRows?.() || { errors: [] };
    const renderedSchemaText =
      typeof schemaComponent.getSchemaText === 'function'
        ? schemaComponent.getSchemaText()
        : result.schemaRows.map((row) => `${row.name}\n${buildRuleSpecFromSchemaRow(row)}`).join('\n\n');

    if (Array.isArray(validation.errors) && validation.errors.length > 0) {
      throw new Error(validation.errors.map((error) => error?.message || String(error)).join('; '));
    }

    if (normalizationErrors.length > 0) {
      setStatus(
        generationStatusElement,
        `Processed ${sourceLabel} into ${result.schemaRows.length} schema fields. ${normalizationErrors.length} generated field${normalizationErrors.length === 1 ? '' : 's'} could not be mapped and were left out.`,
        { severity: 'warning' }
      );
      appendProgressOutput(
        progressOutputElement,
        `Processed ${sourceLabel} with partial recovery. ${normalizationErrors.length} field${normalizationErrors.length === 1 ? '' : 's'} were rejected during normalization.`,
        documentObj
      );
    } else {
      setStatus(generationStatusElement, `Processed ${sourceLabel} into ${result.schemaRows.length} schema fields.`, {
        severity: 'info',
      });
      appendProgressOutput(progressOutputElement, `Processed ${sourceLabel} successfully.`, documentObj);
    }

    return {
      ...result,
      renderedSchemaText,
    };
  }

  function parseSchemaFromAiResponse(responseText) {
    const parsedPayload = parseWriterStructuredOutput(responseText);
    const { schemaRows, normalizationErrors } = normalizeStructuredSchemaPayload(parsedPayload, {
      allowedDomainCommands: schemaDefinitionProps.writerContextDomainCommands,
    });

    return {
      parsedPayload,
      schemaRows,
      normalizationErrors,
      responseText,
      requestDetails: latestRequestDetails,
    };
  }

  async function generateFromPrompt() {
    const promptText = String(promptElement?.value || '').trim();
    if (!promptText) {
      setStatus(generationStatusElement, 'Enter a prompt before generating a schema.', { severity: 'warning' });
      return null;
    }

    if (!WriterCtor) {
      setStatus(generationStatusElement, 'Writer API is not available in this browser session.', { severity: 'error' });
      return null;
    }

    if (isGenerating) {
      return null;
    }

    isGenerating = true;
    generateButton.disabled = true;
    setJsonOutput(jsonOutputElement, 'No structured output parsed yet.');
    setTextOutput(rawOutputElement, '', 'Waiting for Writer response...');
    setTextOutput(errorOutputElement, '', 'No errors yet.');
    setJsonOutput(requestOutputElement, 'Preparing Writer request details...');
    clearProgressOutput(progressOutputElement, documentObj);
    appendProgressOutput(progressOutputElement, 'Starting schema generation request.', documentObj);
    setStatus(generationStatusElement, 'Generating structured schema output...', {
      isLoading: true,
      severity: 'info',
    });

    try {
      const result = await runWriterSchemaGeneration({
        WriterCtor,
        promptText,
        domainCommands: schemaDefinitionProps.writerContextDomainCommands,
        sampleSchemaText: schemaDefinitionProps.sampleSchemaText,
        onStatus: (message, options = {}) => {
          setStatus(generationStatusElement, message, options);
          appendProgressOutput(progressOutputElement, message, documentObj);
          if (typeof options.rawResponseText === 'string') {
            setTextOutput(rawOutputElement, options.rawResponseText, 'No raw Writer response yet.');
          }
          if (options.requestDetails) {
            setJsonOutput(requestOutputElement, options.requestDetails);
          }
        },
      });
      return applySchemaResult(result, { sourceLabel: 'Writer API output' });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const fullErrorText =
        error instanceof Error && error.stack ? error.stack : `Error: ${message}`;
      const rawResponseText =
        typeof error?.writerResponseText === 'string' ? error.writerResponseText : '';
      const requestDetails = error?.writerRequestDetails ?? 'Writer request details were not captured.';

      setTextOutput(errorOutputElement, fullErrorText, 'No errors yet.');
      setTextOutput(rawOutputElement, rawResponseText, 'No raw Writer response was returned.');
      setJsonOutput(requestOutputElement, requestDetails);
      appendProgressOutput(progressOutputElement, `Generation failed: ${message}`, documentObj);
      setStatus(generationStatusElement, `Unable to generate a schema from the prompt: ${message}`, {
        severity: 'error',
      });
      throw error;
    } finally {
      isGenerating = false;
      generateButton.disabled = false;
    }
  }

  async function copyLatestRequestJson() {
    if (!latestRequestDetails) {
      setStatus(generationStatusElement, 'Generate a schema before copying the full request.', {
        severity: 'warning',
      });
      return false;
    }

    await copyTextToClipboard(JSON.stringify(latestRequestDetails, null, 2), { navigatorObj });
    setStatus(generationStatusElement, 'Copied the full request JSON to the clipboard.', {
      severity: 'info',
    });
    return true;
  }

  async function copyLatestRequestAsPrompt() {
    if (!latestRequestDetails) {
      setStatus(generationStatusElement, 'Generate a schema before copying the request as a prompt.', {
        severity: 'warning',
      });
      return false;
    }

    await copyTextToClipboard(createCopyApiRequestPrompt(latestRequestDetails), { navigatorObj });
    setStatus(generationStatusElement, 'Copied the API request as a reusable prompt.', {
      severity: 'info',
    });
    return true;
  }

  async function createSchemaFromResponse() {
    const responseText = String(processResponseElement?.value || '').trim();
    if (!responseText) {
      setStatus(generationStatusElement, 'Paste an AI response before creating a schema.', {
        severity: 'warning',
      });
      return null;
    }

    setTextOutput(rawOutputElement, responseText, 'No raw Writer response yet.');
    appendProgressOutput(progressOutputElement, 'Processing pasted AI response into schema rows.', documentObj);

    try {
      const result = parseSchemaFromAiResponse(responseText);
      return applySchemaResult(result, { sourceLabel: 'pasted AI response' });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setTextOutput(
        errorOutputElement,
        error instanceof Error && error.stack ? error.stack : `Error: ${message}`,
        'No errors yet.'
      );
      appendProgressOutput(progressOutputElement, `Processing pasted AI response failed: ${message}`, documentObj);
      setStatus(generationStatusElement, `Unable to process the pasted AI response: ${message}`, {
        severity: 'error',
      });
      throw error;
    }
  }

  examplePromptButton?.addEventListener('click', () => {
    promptElement.value = DEFAULT_PROMPT;
    promptElement.focus();
  });
  copyRequestButton?.addEventListener('click', () => {
    void copyLatestRequestJson().catch((error) => {
      const message = error instanceof Error ? error.message : String(error);
      setStatus(generationStatusElement, `Unable to copy the full request: ${message}`, {
        severity: 'error',
      });
    });
  });
  copyPromptButton?.addEventListener('click', () => {
    void copyLatestRequestAsPrompt().catch((error) => {
      const message = error instanceof Error ? error.message : String(error);
      setStatus(generationStatusElement, `Unable to copy the request prompt: ${message}`, {
        severity: 'error',
      });
    });
  });
  generateButton?.addEventListener('click', () => {
    void generateFromPrompt().catch(() => {});
  });
  createSchemaFromResponseButton?.addEventListener('click', () => {
    void createSchemaFromResponse().catch(() => {});
  });

  return {
    destroy() {
      themeToggle?.destroy?.();
      schemaComponent?.destroy?.();
    },
    copyLatestRequestAsPrompt,
    copyLatestRequestJson,
    createSchemaFromResponse,
    generateFromPrompt,
    getSchemaComponent() {
      return schemaComponent;
    },
  };
}

export {
  DEFAULT_PROMPT,
  bootstrapWriterSchemaPage,
  buildWriterSharedContext,
  buildWriterTaskContext,
  extractJsonPayload,
  normalizeStructuredSchemaPayload,
  parseWriterStructuredOutput,
  runWriterSchemaGeneration,
};
