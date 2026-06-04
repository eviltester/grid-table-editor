import { getNumberArrayFrom } from '@anywaydata/core/utils/number-convertor.js';
import { applySharedOptionTips, applyUiPanelOnlyTips } from './format-option-help.js';
import { DEFAULT_DELIMITER_MAPPINGS } from './format-option-panel-definition-shared.js';
import { escapeHtml, selectorForName, setSelectValue, optionHtml } from './format-option-panel-dom.js';
import { BASE_FORMAT_OPTION_DEFINITIONS, CORE_FORMAT_ORDER } from './base/index.js';
import { CODE_FORMAT_OPTION_DEFINITIONS, CODE_FORMAT_ORDER } from './code/index.js';
import { createTestFrameworkDefinition } from './code-unit-test/test-framework-definition.js';

function resolveMappedValue(value, mappings, fallback) {
  if (value === undefined) {
    if (fallback && typeof fallback === 'object') {
      return {
        selected: fallback.selected || 'custom',
        custom: fallback.custom || '',
      };
    }
    return { selected: 'custom', custom: '' };
  }
  const foundKey = Object.keys(mappings).find((key) => mappings[key] === value);
  return foundKey ? { selected: foundKey, custom: '' } : { selected: 'custom', custom: value };
}

function readMappedValue({ root, field, fallback }) {
  const select = root.querySelector(selectorForName(field.name));
  const selected = select?.value || field.defaultSelection || 'tab';
  if (selected === 'custom') {
    return root.querySelector(selectorForName(field.customName))?.value ?? '';
  }
  return field.mappings?.[selected] ?? fallback;
}

function readField(root, field) {
  const elem = root.querySelector(selectorForName(field.name));
  if (!elem) {
    return field.defaultValue;
  }

  if (field.type === 'checkbox') {
    return elem.checked;
  }
  if (field.type === 'select') {
    return elem.value || field.defaultValue;
  }
  if (field.type === 'number') {
    const parsed = Number.parseInt(elem.value, 10);
    return Number.isNaN(parsed) ? field.defaultValue : parsed;
  }
  if (field.type === 'numberArrayText') {
    return getNumberArrayFrom(elem.value || '');
  }
  if (field.type === 'selectCustom') {
    return readMappedValue({ root, field, fallback: field.defaultValue });
  }
  return elem.value || field.defaultValue || '';
}

function writeField(root, field, options) {
  const elem = root.querySelector(selectorForName(field.name));
  const value = options?.[field.key] ?? field.defaultValue;
  if (!elem) {
    return;
  }

  if (field.type === 'checkbox') {
    elem.checked = value === true;
    return;
  }
  if (field.type === 'select') {
    setSelectValue(elem, value, field.defaultValue);
    return;
  }
  if (field.type === 'numberArrayText') {
    elem.value = Array.isArray(value) ? value.join(' ') : value || '';
    return;
  }
  if (field.type === 'selectCustom') {
    const mappings = field.mappings || DEFAULT_DELIMITER_MAPPINGS;
    const resolved = resolveMappedValue(value, mappings, field.defaultValue);
    setSelectValue(elem, resolved.selected, field.defaultSelection || 'tab');
    const custom = root.querySelector(selectorForName(field.customName));
    if (custom) {
      custom.value = resolved.custom;
    }
    return;
  }
  elem.value = value ?? '';
}

function renderField(field) {
  const help = field.help
    ? `<span class="helpicon option-help-icon" data-help="${escapeHtml(field.help)}"></span>`
    : '';
  const childClass = field.child ? ' option-child' : '';
  const className = `${field.className || field.name}${childClass}`;

  if (field.type === 'checkbox') {
    return `
      <div class="${escapeHtml(className)}">
        <label>
          ${help}
          <input type="checkbox" name="${escapeHtml(field.name)}" ${field.defaultValue === true ? 'checked' : ''}>
          ${escapeHtml(field.label)}
        </label>
        <br>
      </div>`;
  }

  if (field.type === 'select' || field.type === 'selectCustom') {
    const options =
      field.type === 'selectCustom'
        ? [...(field.options || []), { value: 'custom', label: 'Custom Value' }]
        : field.options;
    const customHtml =
      field.type === 'selectCustom'
        ? `
      <div class="${escapeHtml(field.customClassName || `custom-${field.name}`)} option-child">
        <label>
          <span class="helpicon option-help-icon" data-help="${escapeHtml(field.customHelp)}"></span>
          ${escapeHtml(field.customLabel || 'Custom')}
          <input type="text" name="${escapeHtml(field.customName)}" value="" style="width:${escapeHtml(field.customWidth || '8em')}">
        </label>
        <br>
      </div>`
        : '';
    return `
      <div class="${escapeHtml(className)}">
        <label>
          ${help}
          ${escapeHtml(field.label)}
          <select name="${escapeHtml(field.name)}" ${field.disabled ? 'disabled' : ''}>
            ${optionHtml(options)}
          </select>
        </label>
        <br>
      </div>${customHtml}`;
  }

  if (field.type === 'textarea') {
    return `
      <div class="${escapeHtml(className)}">
        <label>
          ${help}
          ${escapeHtml(field.label)}
          <textarea name="${escapeHtml(field.name)}" rows="${field.rows || 3}" style="width:${escapeHtml(field.width || '100%')}"></textarea>
        </label>
        <br>
      </div>`;
  }

  return `
    <div class="${escapeHtml(className)}">
      <label>
        ${help}
        ${escapeHtml(field.label)}
        <input type="${field.type === 'number' ? 'number' : 'text'}" name="${escapeHtml(field.name)}" value="${escapeHtml(
          field.defaultValue ?? ''
        )}" ${field.min !== undefined ? `min="${escapeHtml(field.min)}"` : ''} style="width:${escapeHtml(
          field.width || '8em'
        )}">
      </label>
      <br>
    </div>`;
}

class DeclarativeFormatOptionPanel {
  constructor(definition, { root } = {}) {
    this.definition = definition;
    this.root = root;
    this.applyCallback = null;
    this.dirtyCallback = null;
    this.boundApply = null;
    this.boundDirty = null;
    this.cleanupCallbacks = [];
  }

  render() {
    this.destroyBindings();
    this.root.innerHTML = `
      <div class="${escapeHtml(this.definition.panelClassName)}" style="width:100%" data-format-options-panel="${escapeHtml(
        this.definition.format
      )}">
        <div><p><strong>Options</strong> <span data-help="${escapeHtml(this.definition.titleHelp)}" class="helpicon"></span></p></div>
        ${this.definition.fields.map((field) => renderField(field)).join('')}
        <div class="apply">
          <button class="apply-options">Apply</button>
        </div>
      </div>`;
    this.write(this.definition.createDefaultOptions?.() || {});
    this.bind();
    this.applyTips();
    this.definition.afterRender?.(this);
  }

  bind() {
    const panelRoot = this.root.firstElementChild;
    const button = this.root.querySelector('.apply-options');
    this.boundDirty = (event) => {
      if (event?.target?.closest?.('.apply-options')) {
        return;
      }
      this.setDirty(true);
    };
    this.boundApply = () => {
      this.applyCallback?.(this.read());
    };
    panelRoot?.addEventListener('input', this.boundDirty);
    panelRoot?.addEventListener('change', this.boundDirty);
    button?.addEventListener('click', this.boundApply);
    this.cleanupCallbacks.push(() => panelRoot?.removeEventListener('input', this.boundDirty));
    this.cleanupCallbacks.push(() => panelRoot?.removeEventListener('change', this.boundDirty));
    this.cleanupCallbacks.push(() => button?.removeEventListener('click', this.boundApply));
  }

  applyTips() {
    const bindings = this.definition.fields
      .filter((field) => field.help && field.key)
      .map((field) => ({ selector: `[data-help='${field.help}']`, key: field.tipKey || field.key }));
    applySharedOptionTips(this.root, this.definition.tipFormat || this.definition.format, bindings);
    const uiTipIds = this.definition.fields
      .filter((field) => field.type === 'selectCustom' && field.customHelp)
      .map((field) => field.customHelp);
    applyUiPanelOnlyTips(this.root, [...(this.definition.uiTipIds || []), ...uiTipIds]);
  }

  read() {
    const optionPayload = this.definition.createDefaultOptions?.() || { options: {} };
    optionPayload.outputFormat = this.definition.outputFormat || this.definition.format;
    optionPayload.options = { ...(optionPayload.options || {}) };
    for (const field of this.definition.fields) {
      if (!field.key) {
        continue;
      }
      optionPayload.options[field.key] = readField(this.root, field);
    }
    this.definition.afterRead?.(optionPayload.options, optionPayload, this);
    return optionPayload;
  }

  write(mainOptions = {}) {
    const options = mainOptions?.options ?? mainOptions ?? {};
    for (const field of this.definition.fields) {
      if (!field.key) {
        continue;
      }
      writeField(this.root, field, options);
    }
    this.definition.afterWrite?.(options, mainOptions, this);
  }

  validate() {
    return { valid: true, errors: [] };
  }

  setDirty(isDirty) {
    this.dirtyCallback?.(isDirty === true);
  }

  onApply(callback) {
    this.applyCallback = callback;
  }

  onDirty(callback) {
    this.dirtyCallback = callback;
  }

  destroyBindings() {
    this.cleanupCallbacks.forEach((cleanup) => cleanup());
    this.cleanupCallbacks = [];
  }

  destroy() {
    this.destroyBindings();
    this.root.innerHTML = '';
  }
}

const FORMAT_OPTION_DEFINITIONS = {
  ...BASE_FORMAT_OPTION_DEFINITIONS,
  ...CODE_FORMAT_OPTION_DEFINITIONS,
};

function createFormatOptionPanel(definition, { root } = {}) {
  return new DeclarativeFormatOptionPanel(definition, { root });
}

function getFormatOptionDefinition(format) {
  return FORMAT_OPTION_DEFINITIONS[format] || null;
}

export {
  CODE_FORMAT_ORDER,
  CORE_FORMAT_ORDER,
  FORMAT_OPTION_DEFINITIONS,
  DeclarativeFormatOptionPanel,
  createFormatOptionPanel,
  createTestFrameworkDefinition,
  getFormatOptionDefinition,
};
