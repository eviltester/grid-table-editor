const RECENT_STORAGE_KEY = 'anywaydata.method-picker.recent';
const MAX_RECENT = 8;
const STYLE_ID = 'method-picker-modal-styles';
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
  return [option.command, option.helpModel?.summary || '', option.helpModel?.example || '', params.join(' ')].join(' ');
}

function ensureStyles(documentObj) {
  if (!documentObj?.head || documentObj.getElementById(STYLE_ID)) {
    return;
  }
  const style = documentObj.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    body.theme-light {
      --mp-bg: #ffffff;
      --mp-elevated: #f7f8fb;
      --mp-border: #d6dce8;
      --mp-text: #121620;
      --mp-muted: #495066;
      --mp-subtle: #495066;
      --mp-accent: #1f6feb;
      --mp-accent-soft: #e9f1ff;
      --mp-focus: #1f6feb;
      --mp-overlay: rgba(15, 23, 42, 0.45);
      --mp-code-bg: #eef2f8;
    }
    body.theme-dark {
      --mp-bg: #121722;
      --mp-elevated: #1b2231;
      --mp-border: #2e3a51;
      --mp-text: #ebf0ff;
      --mp-muted: #cfd8ef;
      --mp-subtle: #d2deea;
      --mp-accent: #73a7ff;
      --mp-accent-soft: #22314c;
      --mp-focus: #8bb6ff;
      --mp-overlay: rgba(0, 0, 0, 0.62);
      --mp-code-bg: #1f2738;
    }
    .method-picker-overlay {
      position: fixed;
      inset: 0;
      background: var(--mp-overlay, rgba(0, 0, 0, 0.55));
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 6000;
      padding: 20px;
    }
    .method-picker-modal {
      width: min(1200px, 100%);
      max-height: calc(100vh - 40px);
      display: flex;
      flex-direction: column;
      background: var(--mp-bg, #fff);
      color: var(--mp-text, #111);
      border: 1px solid var(--mp-border, #ddd);
      border-radius: 12px;
      overflow: hidden;
    }
    .method-picker-header,
    .method-picker-toolbar,
    .method-picker-footer {
      padding: 12px 16px;
      border-bottom: 1px solid var(--mp-border, #ddd);
    }
    .method-picker-header,
    .method-picker-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .method-picker-header h3 {
      margin: 0;
      font-size: 18px;
    }
    .method-picker-close {
      border: 1px solid var(--mp-border, #ddd);
      background: var(--mp-elevated, #f5f5f5);
      color: var(--mp-text, #111);
      border-radius: 8px;
      width: 32px;
      height: 32px;
      font-size: 20px;
      line-height: 1;
      cursor: pointer;
    }
    .method-picker-toolbar {
      display: grid;
      grid-template-columns: minmax(220px, 1fr);
      gap: 10px;
      background: var(--mp-elevated, #f7f7f7);
    }
    .method-picker-search {
      width: 100%;
      border: 1px solid var(--mp-border, #ddd);
      border-radius: 10px;
      background: var(--mp-bg, #fff);
      color: var(--mp-text, #111);
      padding: 10px 12px;
      min-width: 0;
    }
    .method-picker-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .method-picker-tabs button {
      border: 1px solid var(--mp-border, #ddd);
      border-radius: 999px;
      background: var(--mp-bg, #fff);
      color: var(--mp-text, #111);
      padding: 6px 12px;
      cursor: pointer;
    }
    .method-picker-tabs button.is-active {
      border-color: var(--mp-accent, #3366ff);
      background: var(--mp-accent-soft, #e8efff);
      color: var(--mp-accent, #3366ff);
    }
    .method-picker-content {
      display: grid;
      grid-template-columns: minmax(260px, 1.1fr) minmax(280px, 1fr);
      gap: 0;
      min-height: 0;
      flex: 1;
    }
    .method-picker-list,
    .method-picker-detail {
      overflow: auto;
      min-height: 0;
      padding: 12px;
    }
    .method-picker-list {
      border-right: 1px solid var(--mp-border, #ddd);
      background: var(--mp-elevated, #f7f7f7);
    }
    .method-picker-tile {
      width: 100%;
      text-align: left;
      border: 1px solid var(--mp-border, #ddd);
      background: var(--mp-bg, #fff);
      color: var(--mp-text, #111);
      border-radius: 10px;
      padding: 10px;
      margin-bottom: 8px;
      display: grid;
      gap: 6px;
      cursor: pointer;
    }
    .method-picker-tile.is-selected {
      border-color: var(--mp-accent, #3366ff);
      background: var(--mp-accent-soft, #e8efff);
    }
    .method-picker-tile-command {
      font-weight: 600;
      word-break: break-word;
    }
    .method-picker-tile-summary,
    .method-picker-tile-tag {
      color: var(--mp-subtle, #555);
      font-size: 12px;
      word-break: break-word;
    }
    .method-picker-detail h4,
    .method-picker-detail h5 {
      margin: 0 0 8px 0;
    }
    .method-picker-detail p {
      margin: 0 0 10px 0;
      color: var(--mp-subtle, #555);
      line-height: 1.4;
      word-break: break-word;
    }
    .method-picker-detail pre {
      margin: 0;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-word;
      border: 1px solid var(--mp-border, #ddd);
      background: var(--mp-code-bg, #f2f2f2);
      border-radius: 8px;
      padding: 10px;
      color: var(--mp-text, #111);
    }
    .method-picker-detail code {
      white-space: pre-wrap;
      word-break: break-word;
    }
    .method-picker-table-wrap {
      margin: 0 0 12px 0;
    }
    .method-picker-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      border: 1px solid var(--mp-border, #ddd);
      border-radius: 8px;
      overflow: hidden;
    }
    .method-picker-table th,
    .method-picker-table td {
      border-bottom: 1px solid var(--mp-border, #ddd);
      text-align: left;
      vertical-align: top;
      padding: 8px;
      color: var(--mp-text, #111);
      overflow-wrap: anywhere;
    }
    .method-picker-table th {
      background: var(--mp-elevated, #f7f7f7);
      font-size: 12px;
      letter-spacing: 0.02em;
    }
    .method-picker-table tr:last-child td {
      border-bottom: 0;
    }
    .method-picker-footer {
      border-top: 1px solid var(--mp-border, #ddd);
      border-bottom: 0;
      justify-content: flex-end;
    }
    .method-picker-footer button {
      border: 1px solid var(--mp-border, #ddd);
      border-radius: 8px;
      background: var(--mp-bg, #fff);
      color: var(--mp-text, #111);
      padding: 8px 14px;
      cursor: pointer;
    }
    .method-picker-apply {
      border-color: var(--mp-accent, #3366ff) !important;
      background: var(--mp-accent, #3366ff) !important;
      color: #fff !important;
    }
    .method-picker-modal button:focus-visible,
    .method-picker-modal input:focus-visible {
      outline: 2px solid var(--mp-focus, #4a80ff);
      outline-offset: 2px;
    }
    .method-picker-empty {
      color: var(--mp-subtle, #555);
    }
    @media (max-width: 980px) {
      .method-picker-content {
        grid-template-columns: 1fr;
      }
      .method-picker-list {
        border-right: 0;
        border-bottom: 1px solid var(--mp-border, #ddd);
        max-height: 40vh;
      }
    }
  `;
  documentObj.head.appendChild(style);
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

function openMethodPickerModal({
  documentObj = document,
  windowObj = globalThis.window,
  options = [],
  currentCommand = '',
  initialTab = '',
  title = 'Choose Method',
} = {}) {
  ensureStyles(documentObj);
  const overlay = documentObj.createElement('div');
  overlay.className = 'method-picker-overlay';
  overlay.innerHTML = `
    <div class="method-picker-modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}">
      <header class="method-picker-header">
        <h3>${escapeHtml(title)}</h3>
        <button type="button" class="method-picker-close" data-action="close" aria-label="Close">×</button>
      </header>
      <div class="method-picker-toolbar">
        <input type="search" class="method-picker-search" placeholder="Filter domain or method..." aria-label="Filter methods" />
        <div class="method-picker-tabs"></div>
      </div>
      <div class="method-picker-content">
        <section class="method-picker-list" aria-label="Methods"></section>
        <aside class="method-picker-detail" aria-label="Method details"></aside>
      </div>
      <footer class="method-picker-footer">
        <button type="button" data-action="cancel">Cancel</button>
        <button type="button" data-action="apply" class="method-picker-apply">Apply</button>
      </footer>
    </div>
  `;

  const searchInput = overlay.querySelector('.method-picker-search');
  const listElem = overlay.querySelector('.method-picker-list');
  const detailElem = overlay.querySelector('.method-picker-detail');
  const tabsElem = overlay.querySelector('.method-picker-tabs');
  const applyButton = overlay.querySelector('[data-action="apply"]');

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

  function renderTabs() {
    tabsElem.innerHTML = tabSpecs
      .map((tab) => `<button type="button" data-tab="${escapeHtml(tab.id)}">${escapeHtml(tab.label)}</button>`)
      .join('');
    tabButtons = Array.from(tabsElem.querySelectorAll('button'));
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
    detailElem.innerHTML = `
      <h4>${escapeHtml(selected.command)}</h4>
      <p>${escapeHtml(model.summary || 'No summary available.')}</p>
      <p><strong>Schema:</strong> <code>${escapeHtml(model.heading || selected.command)}()</code></p>
      <h5>Parameter Details</h5>
      <div class="method-picker-table-wrap">${renderParameterDetailsTable(model)}</div>
      <h5>Parameter Types</h5>
      <div class="method-picker-table-wrap">${renderParameterTypesTable(model)}</div>
      <h5>Example</h5>
      <pre><code>${escapeHtml(model.example || 'Example varies by parameters')}</code></pre>
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
          <button type="button" class="method-picker-tile ${isSelected ? 'is-selected' : ''}" data-command="${escapeHtml(
            option.command
          )}">
            <span class="method-picker-tile-command">${escapeHtml(option.command)}</span>
            <span class="method-picker-tile-summary">${escapeHtml(option.helpModel?.summary || '')}</span>
            <span class="method-picker-tile-tag">${escapeHtml(option.sourceType)}</span>
          </button>`;
      })
      .join('');
    renderDetail();
    applyButton.disabled = !selectedCommand;
  }

  return new Promise((resolve) => {
    function close(result) {
      overlay.remove();
      resolve(result || null);
    }

    overlay.addEventListener('click', (event) => {
      const closeAction = event.target?.getAttribute?.('data-action');
      if (event.target === overlay || closeAction === 'close' || closeAction === 'cancel') {
        close(null);
        return;
      }
      if (closeAction === 'apply') {
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
