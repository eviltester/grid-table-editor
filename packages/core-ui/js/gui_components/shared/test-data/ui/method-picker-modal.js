import { getDefaultDocumentObj, getDefaultWindowObj, resolveWindowObj } from '../../dom/default-objects.js';

const RECENT_STORAGE_KEY = 'anywaydata.method-picker.recent';
const MAX_RECENT = 8;
const STYLE_ID = 'method-picker-modal-styles-link';
const CORE_COMMANDS = new Set(['enum', 'literal', 'regex']);

function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function readRecent(windowObj) {
  try {
    const value = windowObj?.localStorage?.getItem?.(RECENT_STORAGE_KEY);
    if (!value) {
      return [];
    }
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRecent(windowObj, entries) {
  try {
    windowObj?.localStorage?.setItem?.(RECENT_STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_RECENT)));
  } catch {
    // ignore
  }
}

function buildSearchText(option) {
  const params = Array.isArray(option?.helpModel?.params) ? option.helpModel.params.map((p) => p?.name || '') : [];
  const usageExamples = toExampleList(option?.helpModel?.examples);
  const returnExamples = getReturnExamples(option?.helpModel);
  return [
    option.command,
    option.helpModel?.summary || '',
    option.helpModel?.example || '',
    usageExamples.join(' '),
    returnExamples.join(' '),
    params.join(' '),
  ].join(' ');
}

function toExampleList(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry || '').trim()).filter(Boolean);
  }
  const single = String(value || '').trim();
  return single ? [single] : [];
}

function ensureStyles(documentObj) {
  if (!documentObj?.head || documentObj.getElementById(STYLE_ID)) {
    return;
  }
  const link = documentObj.createElement('link');
  link.id = STYLE_ID;
  link.rel = 'stylesheet';
  link.href = new URL('./method-picker-modal.css', import.meta.url).href;
  documentObj.head.appendChild(link);
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

function getReturnExamples(model) {
  const unique = new Set();
  const add = (value) => {
    toExampleList(value).forEach((entry) => unique.add(entry));
  };
  add(model?.example);
  add(model?.exampleReturnValues);
  add(model?.returnExamples);
  return [...unique];
}

function openMethodPickerModal({
  documentObj = getDefaultDocumentObj(),
  windowObj = getDefaultWindowObj(),
  options = [],
  currentCommand = '',
  initialTab = '',
  title = 'Choose Method',
} = {}) {
  if (!documentObj?.body || typeof documentObj.createElement !== 'function') {
    return Promise.resolve(null);
  }
  windowObj = resolveWindowObj(windowObj, documentObj);
  ensureStyles(documentObj);
  const overlay = documentObj.createElement('div');
  overlay.className = 'method-picker-overlay';
  overlay.setAttribute('data-role', 'method-picker-overlay');
  overlay.innerHTML = `
    <div class="method-picker-modal" data-role="method-picker-dialog" role="dialog" aria-modal="true" aria-label="${escapeHtml(
      title
    )}">
      <header class="method-picker-header">
        <h3>${escapeHtml(title)}</h3>
        <button type="button" class="method-picker-close" data-role="method-picker-close-button" aria-label="Close">×</button>
      </header>
      <div class="method-picker-toolbar">
        <input
          type="search"
          class="method-picker-search"
          data-role="method-picker-search"
          placeholder="Filter domain or method..."
          aria-label="Filter methods"
        />
        <div class="method-picker-tabs" data-role="method-picker-tabs"></div>
      </div>
      <div class="method-picker-content">
        <section class="method-picker-list" data-role="method-picker-list" aria-label="Methods"></section>
        <aside class="method-picker-detail" data-role="method-picker-detail" aria-label="Method details"></aside>
      </div>
      <footer class="method-picker-footer">
        <button type="button" data-role="method-picker-cancel-button">Cancel</button>
        <button type="button" data-role="method-picker-apply-button" class="method-picker-apply">Apply</button>
      </footer>
    </div>
  `;

  const searchInput = overlay.querySelector('[data-role="method-picker-search"]');
  const listElem = overlay.querySelector('[data-role="method-picker-list"]');
  const detailElem = overlay.querySelector('[data-role="method-picker-detail"]');
  const tabsElem = overlay.querySelector('[data-role="method-picker-tabs"]');
  const applyButton = overlay.querySelector('[data-role="method-picker-apply-button"]');

  const recent = readRecent(windowObj);
  const prepared = (Array.isArray(options) ? options : []).map((option) => ({
    ...option,
    searchText: buildSearchText(option).toLowerCase(),
  }));
  const domainCategories = [
    ...new Set(
      prepared
        .filter((option) => option.sourceType === 'domain' && String(option.command || '').includes('.'))
        .map((option) => String(option.command).split('.')[0])
    ),
  ].sort((left, right) => left.localeCompare(right));
  const tabSpecs = [
    { id: 'all', label: 'All' },
    { id: 'core', label: 'Core' },
    ...domainCategories.map((category) => ({ id: `domain:${category}`, label: category })),
    { id: 'faker', label: 'Faker' },
    { id: 'recent', label: 'Recently used' },
  ];
  let activeTab = tabSpecs.some((tab) => tab.id === initialTab) ? initialTab : 'all';
  let selectedCommand = prepared.some((o) => o.command === currentCommand)
    ? currentCommand
    : prepared[0]?.command || '';
  let tabButtons = [];

  function syncApplyButtonState() {
    applyButton.disabled = !selectedCommand;
    applyButton.setAttribute('aria-disabled', applyButton.disabled ? 'true' : 'false');
  }

  function renderTabs() {
    tabsElem.innerHTML = tabSpecs
      .map(
        (tab) =>
          `<button type="button" data-role="method-picker-tab" data-tab="${escapeHtml(tab.id)}">${escapeHtml(
            tab.label
          )}</button>`
      )
      .join('');
    tabButtons = Array.from(tabsElem.querySelectorAll('[data-role="method-picker-tab"]'));
    tabButtons.forEach((button) => {
      const tabId = button.getAttribute('data-tab') || '';
      button.classList.toggle('is-active', tabId === activeTab);
      button.addEventListener('click', () => {
        activeTab = tabId || 'all';
        tabButtons.forEach((entry) => entry.classList.toggle('is-active', entry === button));
        renderList();
      });
    });
  }

  function getSelected() {
    return prepared.find((option) => option.command === selectedCommand);
  }

  function renderDetail() {
    const selected = getSelected();
    if (!selected) {
      detailElem.innerHTML = '<p class="method-picker-empty">No method selected</p>';
      return;
    }
    const model = selected.helpModel || {};
    const usageExamples = toExampleList(model.examples);
    const returnExamples = getReturnExamples(model);
    const docsUrl = String(model.docsUrl || '').trim();
    const hasParams = Array.isArray(model.params) && model.params.length > 0;
    detailElem.innerHTML = `
      <h4>${escapeHtml(selected.command)}</h4>
      <p>${escapeHtml(model.summary || 'No summary available.')}</p>
      <p><strong>Schema:</strong> <code>${escapeHtml(model.heading || selected.command)}()</code></p>
      <h5>Parameter Details</h5>
      <div class="method-picker-table-wrap">${renderParameterDetailsTable(model)}</div>
      ${hasParams ? `<h5>Parameter Types</h5><div class="method-picker-table-wrap">${renderParameterTypesTable(model)}</div>` : ''}
      ${usageExamples.length ? `<h5>Usage Examples</h5>${renderExampleList(usageExamples, '')}` : ''}
      <h5>Return Examples</h5>
      ${renderExampleList(returnExamples, 'No return examples available')}
      ${
        docsUrl
          ? `<p class="method-picker-docs-link"><a href="${escapeHtml(docsUrl)}" target="_blank" rel="noopener noreferrer">Open documentation</a></p>`
          : ''
      }
    `;
  }

  function getFiltered() {
    const search = String(searchInput.value || '')
      .trim()
      .toLowerCase();
    return prepared.filter((option) => {
      if (activeTab === 'core' && !CORE_COMMANDS.has(String(option.command || '').toLowerCase())) {
        return false;
      }
      if (activeTab === 'faker' && option.sourceType !== 'faker') {
        return false;
      }
      if (activeTab === 'recent' && !recent.includes(option.command)) {
        return false;
      }
      if (activeTab.startsWith('domain:')) {
        if (option.sourceType !== 'domain') {
          return false;
        }
        const category = activeTab.split(':')[1] || '';
        if (!String(option.command || '').startsWith(`${category}.`)) {
          return false;
        }
      }
      if (!search) {
        return true;
      }
      return option.searchText.includes(search);
    });
  }

  function renderList() {
    const filtered = getFiltered();
    if (!filtered.some((option) => option.command === selectedCommand)) {
      selectedCommand = filtered[0]?.command || '';
    }
    listElem.innerHTML = filtered
      .map((option) => {
        const isSelected = option.command === selectedCommand;
        return `
          <button
            type="button"
            class="method-picker-tile ${isSelected ? 'is-selected' : ''}"
            data-role="method-picker-tile"
            data-command="${escapeHtml(option.command)}"
          >
            <span class="method-picker-tile-command" data-role="method-picker-command">${escapeHtml(option.command)}</span>
            <span class="method-picker-tile-summary">${escapeHtml(option.helpModel?.summary || '')}</span>
            <span class="method-picker-tile-tag">${escapeHtml(option.sourceType)}</span>
          </button>`;
      })
      .join('');
    renderDetail();
    syncApplyButtonState();
  }

  return new Promise((resolve) => {
    function close(result) {
      overlay.remove();
      resolve(result || null);
    }

    overlay.addEventListener('click', (event) => {
      const closeButton = event.target?.closest?.('[data-role="method-picker-close-button"]');
      const cancelButton = event.target?.closest?.('[data-role="method-picker-cancel-button"]');
      const applyActionButton = event.target?.closest?.('[data-role="method-picker-apply-button"]');
      if (event.target === overlay || closeButton || cancelButton) {
        close(null);
        return;
      }
      if (applyActionButton) {
        const selected = getSelected();
        if (!selected) {
          return;
        }
        const nextRecent = [selected.command, ...recent.filter((item) => item !== selected.command)];
        writeRecent(windowObj, nextRecent);
        close({ sourceType: selected.sourceType, command: selected.command });
        return;
      }
      const command = event.target?.closest?.('[data-command]')?.getAttribute?.('data-command');
      if (command) {
        selectedCommand = command;
        renderList();
      }
    });

    overlay.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close(null);
      }
      if (event.key === '/' && documentObj.activeElement !== searchInput) {
        event.preventDefault();
        searchInput.focus();
      }
      if (event.key === 'Enter' && documentObj.activeElement === searchInput) {
        event.preventDefault();
        const first = getFiltered()[0];
        if (first) {
          selectedCommand = first.command;
          renderList();
        }
      }
    });

    searchInput.addEventListener('input', () => renderList());
    documentObj.body.appendChild(overlay);
    renderTabs();
    renderList();
    searchInput.focus();
  });
}

export { openMethodPickerModal };
