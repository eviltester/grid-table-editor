const RECENT_STORAGE_KEY = 'anywaydata.method-picker.recent';
const MAX_RECENT = 8;
const CORE_COMMANDS = new Set(['enum', 'literal', 'regex']);

function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeRecentEntries(entries) {
  return Array.isArray(entries) ? entries.map((entry) => String(entry || '').trim()).filter(Boolean) : [];
}

function readRecent(windowObj) {
  try {
    const value = windowObj?.localStorage?.getItem?.(RECENT_STORAGE_KEY);
    if (!value) {
      return [];
    }
    return normalizeRecentEntries(JSON.parse(value));
  } catch {
    return [];
  }
}

function writeRecent(windowObj, entries) {
  try {
    windowObj?.localStorage?.setItem?.(
      RECENT_STORAGE_KEY,
      JSON.stringify(normalizeRecentEntries(entries).slice(0, MAX_RECENT))
    );
  } catch {
    // ignore storage failures
  }
}

function createMethodPickerRecentStore(windowObj) {
  return {
    read: () => readRecent(windowObj),
    write: (entries) => writeRecent(windowObj, entries),
  };
}

function getNextRecentEntries(command, recentEntries = []) {
  const selectedCommand = String(command || '').trim();
  if (!selectedCommand) {
    return normalizeRecentEntries(recentEntries).slice(0, MAX_RECENT);
  }
  return [selectedCommand, ...normalizeRecentEntries(recentEntries).filter((item) => item !== selectedCommand)].slice(
    0,
    MAX_RECENT
  );
}

function toExampleList(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry ?? '').trim()).filter(Boolean);
  }
  const single = String(value ?? '').trim();
  return single ? [single] : [];
}

function safeStringify(value) {
  try {
    return JSON.stringify(value);
  } catch {
    try {
      return String(value);
    } catch {
      return '[Unserializable value]';
    }
  }
}

function normalizeReturnExampleValue(value) {
  if (typeof value === 'bigint') {
    return `${value}n`;
  }
  if (Array.isArray(value)) {
    return safeStringify(value);
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (value && typeof value === 'object') {
    return safeStringify(value);
  }
  return String(value);
}

function toSafeDocsUrl(value) {
  const raw = String(value ?? '').trim();
  if (!raw) {
    return '';
  }
  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }
  if (/^\/(?!\/)/.test(raw)) {
    return raw;
  }
  return '';
}

function getUsageFunctionCalls(model) {
  return (Array.isArray(model?.usageExamples) ? model.usageExamples : [])
    .map((usageExample) => String(usageExample?.functionCall || '').trim())
    .filter(Boolean);
}

function getReturnExamples(model) {
  const unique = new Set();
  const usageExamples = Array.isArray(model?.usageExamples) ? model.usageExamples : [];
  usageExamples.forEach((usageExample) => {
    if (Object.prototype.hasOwnProperty.call(usageExample || {}, 'sampleReturnValue')) {
      unique.add(normalizeReturnExampleValue(usageExample.sampleReturnValue).trim());
    }
  });
  toExampleList(model?.returnExamples).forEach((entry) => {
    unique.add(entry);
  });
  return [...unique].filter(Boolean);
}

function buildSearchText(option) {
  const params = Array.isArray(option?.helpModel?.params) ? option.helpModel.params.map((p) => p?.name || '') : [];
  const usageExamples = getUsageFunctionCalls(option?.helpModel);
  const returnExamples = getReturnExamples(option?.helpModel);
  return [
    option?.command || '',
    option?.helpModel?.summary || '',
    usageExamples.join(' '),
    returnExamples.join(' '),
    params.join(' '),
  ].join(' ');
}

function prepareMethodPickerOptions(options = []) {
  return (Array.isArray(options) ? options : []).map((option) => ({
    ...option,
    command: String(option?.command || '').trim(),
    sourceType: String(option?.sourceType || '').trim(),
    searchText: buildSearchText(option).toLowerCase(),
  }));
}

function buildMethodPickerTabSpecs(options = []) {
  const domainCategories = [
    ...new Set(
      options
        .filter((option) => option.sourceType === 'domain' && String(option.command || '').includes('.'))
        .map((option) => String(option.command).split('.')[0])
    ),
  ].sort((left, right) => left.localeCompare(right));

  return [
    { id: 'all', label: 'All' },
    { id: 'core', label: 'Core' },
    ...domainCategories.map((category) => ({ id: `domain:${category}`, label: category })),
    { id: 'faker', label: 'Faker' },
    { id: 'recent', label: 'Recently used' },
  ];
}

function normalizeActiveTab(tabSpecs, initialTab = '') {
  return tabSpecs.some((tab) => tab.id === initialTab) ? initialTab : 'all';
}

function filterMethodPickerOptions({ options = [], activeTab = 'all', searchTerm = '', recentEntries = [] } = {}) {
  const normalizedSearch = String(searchTerm || '')
    .trim()
    .toLowerCase();
  const recent = normalizeRecentEntries(recentEntries);

  return options.filter((option) => {
    const command = String(option.command || '');
    if (activeTab === 'core' && !CORE_COMMANDS.has(command.toLowerCase())) {
      return false;
    }
    if (activeTab === 'faker' && option.sourceType !== 'faker') {
      return false;
    }
    if (activeTab === 'recent' && !recent.includes(command)) {
      return false;
    }
    if (activeTab.startsWith('domain:')) {
      const category = activeTab.split(':')[1] || '';
      if (option.sourceType !== 'domain' || !command.startsWith(`${category}.`)) {
        return false;
      }
    }
    return !normalizedSearch || String(option.searchText || '').includes(normalizedSearch);
  });
}

function selectInitialCommand(options = [], currentCommand = '') {
  const command = String(currentCommand || '').trim();
  return options.some((option) => option.command === command) ? command : options[0]?.command || '';
}

function resolveSelectedCommandForFiltered(selectedCommand = '', filteredOptions = []) {
  return filteredOptions.some((option) => option.command === selectedCommand)
    ? selectedCommand
    : filteredOptions[0]?.command || '';
}

function splitFunctionCall(functionCall, command = '') {
  const text = String(functionCall || '').trim();
  const normalizedCommand = String(command || '').trim();
  if (!text) {
    return { command: normalizedCommand, params: '' };
  }
  if (normalizedCommand && text === normalizedCommand) {
    return { command: normalizedCommand, params: '' };
  }
  if (normalizedCommand && text.startsWith(`${normalizedCommand}(`) && text.endsWith(')')) {
    return { command: normalizedCommand, params: text.slice(normalizedCommand.length) };
  }

  const openParenIndex = text.indexOf('(');
  if (openParenIndex > 0 && text.endsWith(')')) {
    return {
      command: text.slice(0, openParenIndex).trim(),
      params: text.slice(openParenIndex).trim(),
    };
  }

  return { command: normalizedCommand || text, params: '' };
}

function formatParamsFieldValue(command, params) {
  const trimmedCommand = String(command || '')
    .trim()
    .toLowerCase();
  const trimmedParams = String(params || '').trim();
  if (!trimmedParams || trimmedParams === '()') {
    return 'Leave blank';
  }
  if (trimmedCommand === 'datatype.enum' && trimmedParams.startsWith('(') && trimmedParams.endsWith(')')) {
    return trimmedParams.slice(1, -1).trim();
  }
  return trimmedParams;
}

function renderParameterDetailsTable(model) {
  if (!Array.isArray(model?.params) || model.params.length === 0) {
    return '<p class="method-picker-empty">No params</p>';
  }
  const rows = model.params
    .map((param) => {
      const description = String(param.description || '').trim();
      const example = String(param.example || param.examples || '').trim();
      const details = [description, example ? `Example: ${example}` : ''].filter(Boolean).join(' ');
      return `<tr><td><code>${escapeHtml(param.name)}</code></td><td>${escapeHtml(details || '-')}</td></tr>`;
    })
    .join('');
  return `<table class="method-picker-table method-picker-param-details"><thead><tr><th>Name</th><th>Details</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function renderParameterTypesTable(model) {
  if (!Array.isArray(model?.params) || model.params.length === 0) {
    return '<p class="method-picker-empty">No params</p>';
  }
  const rows = model.params
    .map((param) => {
      const optional = param.optional ? 'optional' : 'required';
      return `<tr><td><code>${escapeHtml(param.name)}</code></td><td><code>${escapeHtml(
        param.type || 'unknown'
      )}</code></td><td>${optional}</td></tr>`;
    })
    .join('');
  return `<table class="method-picker-table method-picker-param-types"><thead><tr><th>Name</th><th>Type</th><th>Req</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function renderExampleList(examples, emptyText) {
  if (!examples.length) {
    return `<p class="method-picker-empty">${escapeHtml(emptyText)}</p>`;
  }
  const rows = examples.map((example) => `<li><code>${escapeHtml(example)}</code></li>`).join('');
  return `<ul class="method-picker-example-list">${rows}</ul>`;
}

function renderUsageExamples(model, selectedCommand) {
  const usageExamples = Array.isArray(model?.usageExamples) ? model.usageExamples : [];
  if (usageExamples.length === 0) {
    return '';
  }

  return usageExamples
    .map((usageExample) => {
      const functionCall = String(usageExample?.functionCall || '').trim();
      if (!functionCall) {
        return '';
      }
      const description = String(usageExample?.description || '').trim();
      const split = splitFunctionCall(functionCall, selectedCommand);
      const paramsFieldValue = formatParamsFieldValue(split.command, split.params);
      const hasSampleReturnValue = Object.prototype.hasOwnProperty.call(usageExample || {}, 'sampleReturnValue');
      const sampleReturnValue = hasSampleReturnValue
        ? normalizeReturnExampleValue(usageExample.sampleReturnValue).trim()
        : '';

      return `
        <div class="method-picker-usage-example">
          ${description ? `<p>${escapeHtml(description)}</p>` : ''}
          <p><strong>Command:</strong> <code>${escapeHtml(split.command || selectedCommand || '')}</code></p>
          <p><strong>Params field:</strong> <code>${escapeHtml(paramsFieldValue)}</code></p>
          <p><strong>Full call:</strong> <code>${escapeHtml(functionCall)}</code></p>
          ${sampleReturnValue ? `<p><strong>Returns:</strong> <code>${escapeHtml(sampleReturnValue)}</code></p>` : ''}
        </div>
      `;
    })
    .join('');
}

export {
  CORE_COMMANDS,
  MAX_RECENT,
  RECENT_STORAGE_KEY,
  buildMethodPickerTabSpecs,
  buildSearchText,
  createMethodPickerRecentStore,
  escapeHtml,
  filterMethodPickerOptions,
  formatParamsFieldValue,
  getNextRecentEntries,
  getReturnExamples,
  getUsageFunctionCalls,
  normalizeActiveTab,
  normalizeRecentEntries,
  prepareMethodPickerOptions,
  readRecent,
  renderExampleList,
  renderParameterDetailsTable,
  renderParameterTypesTable,
  renderUsageExamples,
  resolveSelectedCommandForFiltered,
  selectInitialCommand,
  toSafeDocsUrl,
  splitFunctionCall,
  writeRecent,
};
