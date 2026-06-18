import React from 'react';
import { Canvas, Controls, Description, Title } from '@storybook/addon-docs/blocks';
import { expect, fn, userEvent, within } from 'storybook/test';
import { openMethodPickerModal } from '../../../../packages/core-ui/js/gui_components/shared/test-data/ui/method-picker-modal.js';
import { buildSchemaHelpModel } from '../../../../packages/core-ui/js/gui_components/shared/test-data/help/help-model-builder.js';

const METHOD_PICKER_RECENT_STORAGE_KEY = 'anywaydata.method-picker.recent';
const METHOD_PICKER_STYLE_ID = 'storybook-method-picker-modal-styles-link';
const CORE_COMMANDS = new Set(['enum', 'literal', 'regex']);

const METHOD_OPTION_SPECS = Object.freeze([
  { sourceType: 'regex', command: 'regex', helpCommand: '' },
  { sourceType: 'faker', command: 'helpers.arrayElement', helpCommand: 'helpers.arrayElement' },
  { sourceType: 'domain', command: 'internet.password', helpCommand: 'internet.password' },
  { sourceType: 'domain', command: 'commerce.price', helpCommand: 'commerce.price' },
]);

function buildMethodOptions() {
  return METHOD_OPTION_SPECS.map(({ sourceType, command, helpCommand }) => ({
    sourceType,
    command,
    helpModel: buildSchemaHelpModel(sourceType, helpCommand),
  }));
}

const METHOD_OPTIONS = buildMethodOptions();

function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toExampleList(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry || '').trim()).filter(Boolean);
  }
  const single = String(value || '').trim();
  return single ? [single] : [];
}

function getReturnExamples(model) {
  const unique = new Set();
  const usageExamples = Array.isArray(model?.usageExamples) ? model.usageExamples : [];
  usageExamples.forEach((usageExample) => {
    if (Object.prototype.hasOwnProperty.call(usageExample || {}, 'sampleReturnValue')) {
      unique.add(String(usageExample.sampleReturnValue ?? '').trim());
    }
  });
  toExampleList(model?.returnExamples).forEach((entry) => unique.add(entry));
  return [...unique].filter(Boolean);
}

function getUsageFunctionCalls(model) {
  return (Array.isArray(model?.usageExamples) ? model.usageExamples : [])
    .map((usageExample) => String(usageExample?.functionCall || '').trim())
    .filter(Boolean);
}

function buildSearchText(option) {
  const params = Array.isArray(option?.helpModel?.params) ? option.helpModel.params.map((p) => p?.name || '') : [];
  const usageExamples = getUsageFunctionCalls(option?.helpModel);
  const returnExamples = getReturnExamples(option?.helpModel);
  return [
    option.command,
    option.helpModel?.summary || '',
    usageExamples.join(' '),
    returnExamples.join(' '),
    params.join(' '),
  ]
    .join(' ')
    .toLowerCase();
}

function ensureMethodPickerStyles(documentObj) {
  if (!documentObj?.head || documentObj.getElementById(METHOD_PICKER_STYLE_ID)) {
    return;
  }
  const link = documentObj.createElement('link');
  link.id = METHOD_PICKER_STYLE_ID;
  link.rel = 'stylesheet';
  link.href = new URL(
    '../../../../packages/core-ui/js/gui_components/shared/test-data/ui/method-picker-modal.css',
    import.meta.url
  ).href;
  documentObj.head.appendChild(link);
}

function renderExampleList(examples, emptyText) {
  if (!examples.length) {
    return `<p class="method-picker-empty">${escapeHtml(emptyText)}</p>`;
  }
  const rows = examples.map((example) => `<li><code>${escapeHtml(example)}</code></li>`).join('');
  return `<ul class="method-picker-example-list">${rows}</ul>`;
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

function createVisualMethodPickerStory(root, args) {
  ensureMethodPickerStyles(document);

  const prepared = METHOD_OPTIONS.map((option) => ({
    ...option,
    searchText: buildSearchText(option),
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

  let activeTab = args.initialTab || 'all';
  let selectedCommand = args.currentCommand || 'helpers.arrayElement';
  let searchValue = '';

  root.style.display = 'grid';
  root.style.gap = '0.75rem';
  root.innerHTML = `
    <div data-role="visual-method-picker-frame" style="position:relative; min-height:780px;">
      <div class="method-picker-overlay" data-role="method-picker-overlay" style="position:absolute; inset:0;">
        <div class="method-picker-modal" data-role="method-picker-dialog" role="dialog" aria-modal="true" aria-label="${escapeHtml(
          args.title
        )}">
          <header class="method-picker-header">
            <h3>${escapeHtml(args.title)}</h3>
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
      </div>
    </div>
    <output data-role="visual-method-picker-log" aria-label="Method picker action log">No actions yet.</output>
  `;

  const overlay = root.querySelector('[data-role="method-picker-overlay"]');
  const searchInput = root.querySelector('[data-role="method-picker-search"]');
  const tabsElem = root.querySelector('[data-role="method-picker-tabs"]');
  const listElem = root.querySelector('[data-role="method-picker-list"]');
  const detailElem = root.querySelector('[data-role="method-picker-detail"]');
  const applyButton = root.querySelector('[data-role="method-picker-apply-button"]');
  const log = root.querySelector('[data-role="visual-method-picker-log"]');

  function writeLog(actionName) {
    log.textContent = `action:${actionName}`;
  }

  function emitAction(actionName, payload) {
    writeLog(actionName);
    if (actionName === 'apply') {
      args.onApply?.(payload);
    } else if (actionName === 'cancel') {
      args.onCancel?.();
    } else if (actionName === 'close') {
      args.onClose?.();
    } else if (actionName === 'backdrop') {
      args.onBackdrop?.();
    }
  }

  function getSelected() {
    return prepared.find((option) => option.command === selectedCommand) || null;
  }

  function getFiltered() {
    return prepared.filter((option) => {
      if (activeTab === 'core' && !CORE_COMMANDS.has(String(option.command || '').toLowerCase())) {
        return false;
      }
      if (activeTab === 'faker' && option.sourceType !== 'faker') {
        return false;
      }
      if (activeTab === 'recent') {
        return option.command === selectedCommand;
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
      if (!searchValue) {
        return true;
      }
      return option.searchText.includes(searchValue);
    });
  }

  function renderDetail() {
    const selected = getSelected();
    if (!selected) {
      detailElem.innerHTML = '<p class="method-picker-empty">No method selected</p>';
      return;
    }
    const model = selected.helpModel || {};
    const usageExamples = getUsageFunctionCalls(model);
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

  function syncApplyButtonState() {
    applyButton.disabled = !selectedCommand;
    applyButton.setAttribute('aria-disabled', applyButton.disabled ? 'true' : 'false');
  }

  function renderTabs() {
    tabsElem.innerHTML = tabSpecs
      .map(
        (tab) =>
          `<button type="button" data-role="method-picker-tab" data-tab="${escapeHtml(tab.id)}" class="${
            tab.id === activeTab ? 'is-active' : ''
          }">${escapeHtml(tab.label)}</button>`
      )
      .join('');
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

  function rerender() {
    renderTabs();
    renderList();
  }

  tabsElem.addEventListener('click', (event) => {
    const tabId = event.target?.closest?.('[data-tab]')?.getAttribute?.('data-tab');
    if (!tabId) {
      return;
    }
    activeTab = tabId;
    rerender();
  });

  listElem.addEventListener('click', (event) => {
    const command = event.target?.closest?.('[data-command]')?.getAttribute?.('data-command');
    if (!command) {
      return;
    }
    selectedCommand = command;
    renderList();
  });

  searchInput.addEventListener('input', () => {
    searchValue = String(searchInput.value || '')
      .trim()
      .toLowerCase();
    renderList();
  });

  overlay.addEventListener('click', (event) => {
    const selected = getSelected();
    if (event.target === overlay) {
      emitAction('backdrop');
      return;
    }
    if (event.target?.closest?.('[data-role="method-picker-close-button"]')) {
      emitAction('close');
      return;
    }
    if (event.target?.closest?.('[data-role="method-picker-cancel-button"]')) {
      emitAction('cancel');
      return;
    }
    if (event.target?.closest?.('[data-role="method-picker-apply-button"]')) {
      if (selected) {
        emitAction('apply', { sourceType: selected.sourceType, command: selected.command });
      }
    }
  });

  rerender();
}

function renderMethodPickerDialogStory(args) {
  const root = document.createElement('section');
  root.style.display = 'grid';
  root.style.gap = '0.75rem';
  root.innerHTML = `
    <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
      <button type="button" data-action="open">Open method picker</button>
    </div>
    <output data-result>Pending</output>
  `;

  const result = root.querySelector('[data-result]');
  const windowObj = document.defaultView;

  const openDialog = async () => {
    const selection = await openMethodPickerModal({
      documentObj: document,
      windowObj,
      title: args.title,
      options: METHOD_OPTIONS,
      currentCommand: args.currentCommand,
      initialTab: args.initialTab,
    });
    result.textContent = selection ? `${selection.sourceType}:${selection.command}` : 'Cancelled';
  };

  root.querySelector('[data-action="open"]')?.addEventListener('click', openDialog);

  root.__storybookCleanup = () => {
    windowObj?.localStorage?.removeItem?.(METHOD_PICKER_RECENT_STORAGE_KEY);
  };

  return root;
}

function renderVisualMethodPickerDialogStory(args) {
  const root = document.createElement('section');
  createVisualMethodPickerStory(root, args);
  root.__storybookCleanup = () => {
    document.defaultView?.localStorage?.removeItem?.(METHOD_PICKER_RECENT_STORAGE_KEY);
  };
  return root;
}

const meta = {
  title: 'Shared/Method Picker Dialog',
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: () =>
        React.createElement(
          React.Fragment,
          null,
          React.createElement(Title),
          React.createElement(Description),
          React.createElement(Controls),
          React.createElement(Canvas, { of: VisualAlwaysOpen }),
          React.createElement(Canvas, { of: ChooseFakerMethod }),
          React.createElement(Canvas, { of: FilterAndChooseDomainMethod }),
          React.createElement(Canvas, { of: CancelMethodSelection })
        ),
      description: {
        component:
          'Storybook coverage for the shared method-picker dialog. The visual always-open example is reviewer-facing and non-dismissing so the UI can be inspected directly, while the other stories still demonstrate the real promise-based open/apply/cancel service flow.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Dialog title shown in the method-picker header.',
    },
    currentCommand: {
      control: 'text',
      description: 'Currently selected command when the picker opens.',
    },
    initialTab: {
      control: 'select',
      options: ['all', 'core', 'faker', 'domain:commerce', 'domain:internet', 'recent'],
      description: 'Initial tab shown when the picker opens.',
    },
    onApply: {
      description: 'Storybook action fired when the visual always-open example simulates Apply.',
      table: { category: 'Events' },
    },
    onCancel: {
      description: 'Storybook action fired when the visual always-open example simulates Cancel.',
      table: { category: 'Events' },
    },
    onClose: {
      description: 'Storybook action fired when the visual always-open example simulates the close button.',
      table: { category: 'Events' },
    },
    onBackdrop: {
      description: 'Storybook action fired when the visual always-open example simulates a backdrop click.',
      table: { category: 'Events' },
    },
  },
  args: {
    title: 'Choose Method',
    currentCommand: 'helpers.arrayElement',
    initialTab: 'all',
    onApply: fn(),
    onCancel: fn(),
    onClose: fn(),
    onBackdrop: fn(),
  },
};

export default meta;

export const VisualAlwaysOpen = {
  render: renderVisualMethodPickerDialogStory,
  parameters: {
    docs: {
      description: {
        story:
          'This reviewer-facing example renders the method picker immediately and intentionally never closes. **Apply**, **Cancel**, the close button, and the backdrop all report what would have happened in the log and the Actions panel, while the dialog stays visible for visual inspection.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('dialog', { name: 'Choose Method' })).toBeVisible();
    await expect(
      canvas.getByRole('button', {
        name: 'helpers.arrayElement Returns one random element from the supplied array. faker',
      })
    ).toHaveClass('is-selected');

    await userEvent.click(canvas.getByRole('button', { name: 'Apply' }));
    await expect(canvas.getByText('action:apply')).toBeVisible();
    await expect(canvas.getByRole('dialog', { name: 'Choose Method' })).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
    await expect(canvas.getByText('action:cancel')).toBeVisible();
    await expect(canvas.getByRole('dialog', { name: 'Choose Method' })).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'Close' }));
    await expect(canvas.getByText('action:close')).toBeVisible();
    await expect(canvas.getByRole('dialog', { name: 'Choose Method' })).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'All' }).closest('[data-role="method-picker-overlay"]'));
    await expect(canvas.getByText('action:backdrop')).toBeVisible();
    await expect(canvas.getByRole('dialog', { name: 'Choose Method' })).toBeVisible();
  },
};

export const ChooseFakerMethod = {
  render: renderMethodPickerDialogStory,
  parameters: {
    docs: {
      description: {
        story:
          'Click **Open method picker**, choose **helpers.arrayElement**, then confirm with **Apply**. This shows the normal confirmed-selection path and the visible promise result beneath the trigger button.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open method picker' }));
    const dialog = within(document.body);
    await userEvent.click(
      dialog.getByRole('button', {
        name: 'helpers.arrayElement Returns one random element from the supplied array. faker',
      })
    );
    await userEvent.click(dialog.getByRole('button', { name: 'Apply' }));
    await expect(canvas.getByText('faker:helpers.arrayElement')).toBeVisible();
  },
};

export const FilterAndChooseDomainMethod = {
  render: renderMethodPickerDialogStory,
  args: {
    currentCommand: '',
    initialTab: 'all',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Open the picker, type `commerce` into the filter, choose **commerce.price**, and apply. This demonstrates that the Storybook surface covers the searchable list behavior, not just a preselected tile.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open method picker' }));
    const dialog = within(document.body);
    await userEvent.type(dialog.getByRole('searchbox', { name: 'Filter methods' }), 'commerce');
    await userEvent.click(
      dialog.getByRole('button', { name: 'commerce.price Generates a price between min and max (inclusive). domain' })
    );
    await userEvent.click(dialog.getByRole('button', { name: 'Apply' }));
    await expect(canvas.getByText('domain:commerce.price')).toBeVisible();
  },
};

export const CancelMethodSelection = {
  render: renderMethodPickerDialogStory,
  parameters: {
    docs: {
      description: {
        story:
          'Open the picker and choose **Cancel**. This demonstrates the dismissed overlay path and shows the `Cancelled` result in the story output.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open method picker' }));
    const dialog = within(document.body);
    await userEvent.click(dialog.getByRole('button', { name: 'Cancel' }));
    await expect(canvas.getByText('Cancelled')).toBeVisible();
  },
};
