import { createHelpTooltipService } from '../../../../help/help-tooltips.js';
import { getDefaultDocumentObj, getDefaultWindowObj, resolveWindowObj } from '../../dom/default-objects.js';

const STYLE_ID = 'params-editor-modal-styles-link';
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function ensureStyles(documentObj) {
  if (!documentObj?.head || documentObj.getElementById(STYLE_ID)) {
    return;
  }
  const link = documentObj.createElement('link');
  link.id = STYLE_ID;
  link.rel = 'stylesheet';
  link.href = new URL('./params-editor-modal.css', import.meta.url).href;
  documentObj.head.appendChild(link);
}

function stripOuterParens(text) {
  const value = String(text ?? '').trim();
  if (value.startsWith('(') && value.endsWith(')') && value.length >= 2) {
    return value.slice(1, -1);
  }
  return value;
}

function toExampleList(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry || '').trim()).filter(Boolean);
  }
  const single = String(value || '').trim();
  return single ? [single] : [];
}

function splitTopLevelCommaSeparated(text) {
  const value = String(text ?? '');
  const items = [];
  let current = '';
  let quote = '';
  let depthParen = 0;
  let depthBracket = 0;
  let depthBrace = 0;

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    const previous = value[index - 1];

    if (quote) {
      current += char;
      if (char === quote && previous !== '\\') {
        quote = '';
      }
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      current += char;
      continue;
    }

    if (char === '(') depthParen += 1;
    if (char === ')') depthParen -= 1;
    if (char === '[') depthBracket += 1;
    if (char === ']') depthBracket -= 1;
    if (char === '{') depthBrace += 1;
    if (char === '}') depthBrace -= 1;

    if (depthParen < 0 || depthBracket < 0 || depthBrace < 0) {
      return { values: [], error: 'Current params contain unmatched closing brackets.' };
    }

    if (char === ',' && depthParen === 0 && depthBracket === 0 && depthBrace === 0) {
      items.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  if (quote) {
    return { values: [], error: 'Current params contain an unclosed quoted value.' };
  }
  if (depthParen !== 0 || depthBracket !== 0 || depthBrace !== 0) {
    return { values: [], error: 'Current params contain unbalanced brackets.' };
  }

  const finalValue = current.trim();
  if (finalValue.length > 0 || items.length > 0) {
    items.push(finalValue);
  }
  return { values: items.filter((item, index, array) => item.length > 0 || index < array.length - 1), error: '' };
}

function splitTopLevelNamedAssignment(text) {
  const value = String(text ?? '').trim();
  let quote = '';
  let depthParen = 0;
  let depthBracket = 0;
  let depthBrace = 0;

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    const previous = value[index - 1];

    if (quote) {
      if (char === quote && previous !== '\\') {
        quote = '';
      }
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (char === '(') depthParen += 1;
    if (char === ')') depthParen -= 1;
    if (char === '[') depthBracket += 1;
    if (char === ']') depthBracket -= 1;
    if (char === '{') depthBrace += 1;
    if (char === '}') depthBrace -= 1;

    if (char === '=' && depthParen === 0 && depthBracket === 0 && depthBrace === 0) {
      return {
        name: value.slice(0, index).trim(),
        rawValue: value.slice(index + 1).trim(),
      };
    }
  }

  return null;
}

function unquoteValue(value) {
  const trimmed = String(value ?? '').trim();
  if (trimmed.length < 2) {
    return trimmed;
  }
  const quote = trimmed[0];
  if ((quote !== '"' && quote !== "'") || trimmed[trimmed.length - 1] !== quote) {
    return trimmed;
  }
  if (quote === '"') {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed.slice(1, -1).replace(/\\"/g, '"');
    }
  }
  return trimmed.slice(1, -1).replace(/\\'/g, "'");
}

function inferEditorMode(rawValue, paramType = '') {
  const trimmed = String(rawValue ?? '').trim();
  if (!trimmed) {
    return 'auto';
  }
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return 'text';
  }
  const type = String(paramType || '').toLowerCase();
  if (
    trimmed.startsWith('[') ||
    trimmed.startsWith('{') ||
    trimmed.includes('=') ||
    /^-?\d+(?:\.\d+)?$/u.test(trimmed) ||
    /^(true|false|null|undefined)$/iu.test(trimmed) ||
    /\b(array|list|object|json|record|map|tuple|regex|function|expression|comma-separated)\b/u.test(type)
  ) {
    return 'raw';
  }
  return 'auto';
}

function parseInitialParamEntries({ params = [], initialParams = '' } = {}) {
  const metadata = Array.isArray(params) ? params : [];
  const variadicIndex = metadata.findIndex((param) => param?.variadic === true);
  const hasVariadicTail = variadicIndex >= 0 && variadicIndex === metadata.length - 1;
  const trimmed = stripOuterParens(initialParams);
  if (!trimmed) {
    return {
      entries: metadata.map((param) => ({
        name: param?.name || '',
        type: param?.type || '',
        optional: param?.optional === true,
        variadic: param?.variadic === true,
        positionalOnly: param?.positionalOnly === true,
        description: param?.description || '',
        example: param?.example || '',
        examples: Array.isArray(param?.examples) ? param.examples : [],
        defaultValue: String(param?.defaultValue ?? ''),
        min: param?.min,
        minimum: param?.minimum,
        max: param?.max,
        maximum: param?.maximum,
        pattern: param?.pattern,
        multipleOf: param?.multipleOf,
        allowedValues: Array.isArray(param?.allowedValues) ? param.allowedValues : [],
        choices: Array.isArray(param?.choices) ? param.choices : [],
        enumValues: Array.isArray(param?.enumValues) ? param.enumValues : [],
        value: String(param?.defaultValue ?? ''),
        mode: 'auto',
      })),
      error: '',
    };
  }

  const split = splitTopLevelCommaSeparated(trimmed);
  if (split.error) {
    return { entries: [], error: split.error };
  }
  const namedParamIndex = new Map(
    metadata
      .map((param, index) => [
        String(param?.name || '')
          .trim()
          .toLowerCase(),
        index,
      ])
      .filter(([name]) => Boolean(name))
  );
  const assignedValues = new Array(metadata.length).fill('');
  const explicitlyAssigned = new Set();
  const positionalValues = [];

  split.values.forEach((value) => {
    const namedAssignment = splitTopLevelNamedAssignment(value);
    const paramIndex = namedAssignment ? namedParamIndex.get(namedAssignment.name.toLowerCase()) : undefined;
    if (namedAssignment && paramIndex !== undefined) {
      assignedValues[paramIndex] = namedAssignment.rawValue;
      explicitlyAssigned.add(paramIndex);
      return;
    }
    positionalValues.push(value);
  });

  if (positionalValues.length > metadata.length && !hasVariadicTail) {
    return {
      entries: [],
      error:
        'Current params use more values than the documented fields. Edit the raw params text directly for this command.',
    };
  }

  let positionalCursor = 0;
  metadata.forEach((param, index) => {
    if (explicitlyAssigned.has(index)) {
      return;
    }
    if (hasVariadicTail && index === variadicIndex) {
      assignedValues[index] = positionalValues.slice(positionalCursor).join(',');
      positionalCursor = positionalValues.length;
      return;
    }
    assignedValues[index] = positionalValues[positionalCursor] || '';
    positionalCursor += 1;
  });

  if (positionalCursor < positionalValues.length && !hasVariadicTail) {
    return {
      entries: [],
      error:
        'Current params use more values than the documented fields. Edit the raw params text directly for this command.',
    };
  }

  return {
    entries: metadata.map((param, index) => {
      const rawValue = assignedValues[index] || '';
      return {
        name: param?.name || '',
        type: param?.type || '',
        optional: param?.optional === true,
        variadic: param?.variadic === true,
        positionalOnly: param?.positionalOnly === true,
        description: param?.description || '',
        example: param?.example || '',
        examples: Array.isArray(param?.examples) ? param.examples : [],
        defaultValue: String(param?.defaultValue ?? ''),
        min: param?.min,
        minimum: param?.minimum,
        max: param?.max,
        maximum: param?.maximum,
        pattern: param?.pattern,
        multipleOf: param?.multipleOf,
        allowedValues: Array.isArray(param?.allowedValues) ? param.allowedValues : [],
        choices: Array.isArray(param?.choices) ? param.choices : [],
        enumValues: Array.isArray(param?.enumValues) ? param.enumValues : [],
        value: rawValue ? unquoteValue(rawValue) : '',
        mode: inferEditorMode(rawValue, param?.type || ''),
      };
    }),
    error: '',
  };
}

function isRawPreferredType(paramType = '') {
  return /\b(number|int|integer|float|double|decimal|bool|boolean|array|list|object|json|record|map|tuple|regex|function|expression|comma-separated)\b/iu.test(
    String(paramType || '')
  );
}

function validateBalancedRawValue(value) {
  return splitTopLevelCommaSeparated(`[${String(value ?? '').trim()}]`).error.replace(/^Current params/u, 'Raw value');
}

function formatEditorValue(value, mode, paramType = '') {
  const rawValue = String(value ?? '');
  if (rawValue.trim().length === 0) {
    return '';
  }

  const resolvedMode = mode === 'auto' ? (isRawPreferredType(paramType) ? 'raw' : 'text') : mode;
  if (resolvedMode === 'raw') {
    return rawValue.trim();
  }
  return JSON.stringify(unquoteValue(rawValue));
}

function buildParamsTextFromEditorEntries({ entries = [], validateParams = null } = {}) {
  const normalizedEntries = Array.isArray(entries) ? entries : [];
  const lastFilledIndex = normalizedEntries.reduce(
    (lastIndex, entry, index) => (String(entry?.value ?? '').trim().length > 0 ? index : lastIndex),
    -1
  );
  const errors = [];
  if (lastFilledIndex < 0) {
    const requiredMissing = normalizedEntries.some((entry) => entry?.optional !== true);
    if (requiredMissing) {
      errors.push('Add a value for each required param before applying.');
    }
    return {
      paramsText: '',
      errors,
    };
  }

  const formattedValues = [];
  for (let index = 0; index <= lastFilledIndex; index += 1) {
    const entry = normalizedEntries[index] || {};
    const rawValue = String(entry.value ?? '');
    const trimmedValue = rawValue.trim();
    if (!trimmedValue) {
      if (entry.optional === true) {
        continue;
      }
      errors.push(`Param ${entry.name || index + 1} must be filled before later params can be used.`);
      continue;
    }
    if (entry.mode === 'raw') {
      const rawError = validateBalancedRawValue(trimmedValue);
      if (rawError) {
        errors.push(`${entry.name || `Param ${index + 1}`}: ${rawError}.`);
        continue;
      }
    }
    const formattedValue = formatEditorValue(rawValue, entry.mode || 'auto', entry.type || '');
    const useNamedParam = entry.name && entry.variadic !== true && entry.positionalOnly !== true;
    formattedValues.push(useNamedParam ? `${entry.name}=${formattedValue}` : formattedValue);
  }

  const paramsText = formattedValues.length > 0 ? `(${formattedValues.join(',')})` : '';
  const validationResult = typeof validateParams === 'function' ? validateParams(paramsText) : [];
  const semanticIssues = (
    Array.isArray(validationResult) ? validationResult : validationResult ? [validationResult] : []
  )
    .map((issue) => {
      if (!issue) {
        return null;
      }
      if (typeof issue === 'string') {
        return { message: issue, severity: 'error' };
      }
      const message = String(issue?.message || issue || '').trim();
      if (!message) {
        return null;
      }
      const severity =
        String(issue?.severity || issue?.level || 'error').toLowerCase() === 'warning' ? 'warning' : 'error';
      return { message, severity };
    })
    .filter(Boolean);

  const semanticErrors = semanticIssues.filter((issue) => issue.severity !== 'warning').map((issue) => issue.message);
  const semanticWarnings = semanticIssues.filter((issue) => issue.severity === 'warning').map((issue) => issue.message);
  const result = {
    paramsText,
    errors: [...errors, ...semanticErrors],
  };
  if (semanticWarnings.length > 0) {
    result.warnings = semanticWarnings;
  }
  return result;
}

function buildParamValidationRules(entry = {}) {
  const rules = [entry.optional ? 'Optional.' : 'Required.'];
  const defaultValue = String(entry.defaultValue ?? '').trim();
  if (defaultValue) {
    rules.push(`Default: ${defaultValue}`);
  }
  if (entry.variadic) {
    rules.push('Accepts multiple values in this one field.');
  }

  const numericRules = [
    ['Minimum', entry.minimum ?? entry.min],
    ['Maximum', entry.maximum ?? entry.max],
    ['Multiple of', entry.multipleOf],
  ];
  numericRules.forEach(([label, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      rules.push(`${label}: ${value}`);
    }
  });

  const pattern = String(entry.pattern ?? '').trim();
  if (pattern) {
    rules.push(`Pattern: ${pattern}`);
  }

  const allowedValues = entry.allowedValues || entry.choices || entry.enumValues || [];
  if (Array.isArray(allowedValues) && allowedValues.length > 0) {
    rules.push(`Allowed values: ${allowedValues.join(', ')}`);
  }

  return rules;
}

function buildParamHelpHtml(entry = {}) {
  const description = String(entry.description || '').trim();
  const examples = [...new Set([...toExampleList(entry.example), ...toExampleList(entry.examples)])];
  const rules = buildParamValidationRules(entry);
  const sections = [`<p><strong>${escapeHtml(entry.name || 'Param')}</strong></p>`];

  if (description) {
    sections.push(`<p>${escapeHtml(description)}</p>`);
  }

  sections.push(`<p><strong>Type:</strong> <code>${escapeHtml(entry.type || 'unknown')}</code></p>`);

  if (examples.length > 0) {
    sections.push(
      `<p><strong>Examples:</strong></p><ul>${examples
        .map((example) => `<li><code>${escapeHtml(example)}</code></li>`)
        .join('')}</ul>`
    );
  }

  if (rules.length > 0) {
    sections.push(
      `<p><strong>Rules:</strong></p><ul>${rules.map((rule) => `<li>${escapeHtml(rule)}</li>`).join('')}</ul>`
    );
  }

  return sections.join('');
}

function buildCommandHelpHtml(helpModel = {}, commandLabel = '') {
  const title = String(helpModel.heading || commandLabel || 'Command').trim();
  const description = String(helpModel.summary || helpModel.description || '').trim();
  const docsUrl = String(helpModel.docsUrl || '').trim();
  const sections = [`<p><strong>${escapeHtml(title)}</strong></p>`];

  if (description) {
    sections.push(`<p>${escapeHtml(description)}</p>`);
  }

  if (docsUrl) {
    sections.push(
      `<p><a class="helplink" href="${escapeHtml(docsUrl)}" target="_blank" rel="noopener noreferrer">Learn more</a></p>`
    );
  }

  return sections.join('');
}

function isBooleanParamType(paramType = '') {
  return /\b(bool|boolean)\b/iu.test(String(paramType || ''));
}

function renderValueEditor(entry, index) {
  if (isBooleanParamType(entry.type || '')) {
    const value = String(entry.value ?? '')
      .trim()
      .toLowerCase();
    const radioName = `params-editor-boolean-${index}`;
    const hasUnsetOption = entry.optional === true;

    return `
      <fieldset class="params-editor-boolean-group" data-role="params-editor-boolean-group">
        <legend class="params-editor-boolean-legend sr-only">${escapeHtml(entry.name)} value</legend>
        ${
          hasUnsetOption
            ? `<label class="params-editor-boolean-option">
                <input
                  type="radio"
                  name="${radioName}"
                  data-role="params-editor-boolean"
                  data-index="${index}"
                  value=""
                  ${value !== 'true' && value !== 'false' ? 'checked' : ''}
                />
                <span>Unset</span>
              </label>`
            : ''
        }
        <label class="params-editor-boolean-option">
          <input
            type="radio"
            name="${radioName}"
            data-role="params-editor-boolean"
            data-index="${index}"
            value="true"
            ${value === 'true' ? 'checked' : ''}
          />
          <span>True</span>
        </label>
        <label class="params-editor-boolean-option">
          <input
            type="radio"
            name="${radioName}"
            data-role="params-editor-boolean"
            data-index="${index}"
            value="false"
            ${value === 'false' ? 'checked' : ''}
          />
          <span>False</span>
        </label>
      </fieldset>
    `;
  }

  return `
    <input
      id="params-editor-value-${index}"
      data-role="params-editor-value"
      data-index="${index}"
      type="text"
      value="${escapeHtml(entry.value)}"
      placeholder="${escapeHtml(entry.example || '')}"
      aria-label="${escapeHtml(entry.name)} value"
    />
  `;
}

function readRenderedEntryValue(rootElement, entry, index) {
  if (isBooleanParamType(entry?.type || '')) {
    const checkedBooleanOption = rootElement.querySelector(
      `[data-role="params-editor-boolean"][data-index="${index}"]:checked`
    );
    return checkedBooleanOption?.value ?? '';
  }

  return (
    rootElement.querySelector(`[data-role="params-editor-value"][data-index="${index}"]`)?.value ?? entry?.value ?? ''
  );
}

function renderEntryRows(entries = []) {
  return entries
    .map((entry, index) => {
      const helpHtml = buildParamHelpHtml(entry);
      const nameLabel = isBooleanParamType(entry.type || '')
        ? `<code>${escapeHtml(entry.name)}</code>`
        : `<label for="params-editor-value-${index}"><code>${escapeHtml(entry.name)}</code></label>`;
      return `
        <tr>
          <td>
            <div class="params-editor-name-cell">
              ${nameLabel}
              <span
                class="helpicon params-editor-help-icon"
                data-role="params-editor-param-help"
                data-help-role="help-icon"
                data-help="params-editor-param-help-${index}"
                data-help-text="${escapeHtml(helpHtml)}"
              ></span>
            </div>
          </td>
          <td><code>${escapeHtml(entry.type || 'unknown')}</code></td>
          <td>
            <label class="params-editor-required-checkbox-label" aria-label="Required ${escapeHtml(entry.name)}">
              <input
                data-role="params-editor-required"
                data-index="${index}"
                type="checkbox"
                ${entry.optional ? '' : 'checked'}
                disabled
              />
            </label>
          </td>
          <td>
            ${renderValueEditor(entry, index)}
            ${
              entry.defaultValue
                ? `<p class="params-editor-default-hint">Default: <code>${escapeHtml(entry.defaultValue)}</code></p>`
                : ''
            }
          </td>
        </tr>
      `;
    })
    .join('');
}

function isFocusableElement(element) {
  if (!element || typeof element.focus !== 'function') {
    return false;
  }
  if (element.hidden || element.getAttribute?.('aria-hidden') === 'true') {
    return false;
  }
  return true;
}

function getFocusableElements(rootElement) {
  return Array.from(rootElement?.querySelectorAll?.(FOCUSABLE_SELECTOR) || []).filter(isFocusableElement);
}

function trapTabFocus(event, dialogElement, documentObj) {
  if (event.key !== 'Tab') {
    return false;
  }

  const focusableElements = getFocusableElements(dialogElement);
  if (focusableElements.length === 0) {
    event.preventDefault();
    dialogElement?.focus?.();
    return true;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  const activeElement = documentObj?.activeElement;

  if (!dialogElement.contains(activeElement)) {
    event.preventDefault();
    (event.shiftKey ? lastElement : firstElement).focus();
    return true;
  }

  if (event.shiftKey && activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
    return true;
  }

  if (!event.shiftKey && activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
    return true;
  }

  return false;
}

function openParamsEditorModal({
  documentObj = getDefaultDocumentObj(),
  windowObj = getDefaultWindowObj(),
  commandLabel = 'Params',
  helpModel = {},
  initialParams = '',
  validateParams = null,
} = {}) {
  if (!documentObj?.body || typeof documentObj.createElement !== 'function') {
    return Promise.resolve(null);
  }
  windowObj = resolveWindowObj(windowObj, documentObj);
  ensureStyles(documentObj);
  const previouslyFocusedElement = documentObj.activeElement;

  const parsed = parseInitialParamEntries({
    params: helpModel?.params || [],
    initialParams,
  });
  const overlay = documentObj.createElement('div');
  overlay.className = 'params-editor-overlay';
  overlay.setAttribute('data-role', 'params-editor-overlay');
  const commandHelpHtml = buildCommandHelpHtml(helpModel, commandLabel);
  overlay.innerHTML = `
    <div class="params-editor-modal" data-role="params-editor-dialog" role="dialog" aria-modal="true" tabindex="-1" aria-label="${escapeHtml(
      `Edit params for ${commandLabel}`
    )}">
      <header class="params-editor-header">
        <div>
          <h3>Edit Params</h3>
          <div class="params-editor-subtitle-row">
            <p class="params-editor-subtitle">${escapeHtml(commandLabel)}</p>
            ${
              commandHelpHtml
                ? `<span
                    class="helpicon params-editor-help-icon"
                    data-role="params-editor-command-help"
                    data-help-role="help-icon"
                    data-help="params-editor-command-help"
                    data-help-text="${escapeHtml(commandHelpHtml)}"
                  ></span>`
                : ''
            }
          </div>
        </div>
        <button type="button" class="params-editor-close" data-role="params-editor-close-button" aria-label="Close">×</button>
      </header>
      <div class="params-editor-body">
        <p class="params-editor-summary">${escapeHtml(helpModel?.summary || 'Provide param values and review the generated syntax before applying.')}</p>
        ${
          parsed.error
            ? `<p class="params-editor-warning" data-role="params-editor-warning">${escapeHtml(parsed.error)}</p>`
            : `<div class="params-editor-table-wrap">
                <table class="params-editor-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Req</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>${renderEntryRows(parsed.entries)}</tbody>
                </table>
              </div>`
        }
        <div class="params-editor-preview-block">
          <label for="params-editor-preview"><strong>Generated params</strong></label>
          <output id="params-editor-preview" data-role="params-editor-preview" class="params-editor-preview"></output>
        </div>
        <p data-role="params-editor-error" class="params-editor-error" role="status" aria-live="polite"></p>
        <p data-role="params-editor-validation-warning" class="params-editor-warning" role="status" aria-live="polite"></p>
      </div>
      <footer class="params-editor-footer">
        <button type="button" data-role="params-editor-cancel-button">Cancel</button>
        <button type="button" data-role="params-editor-apply-button" class="params-editor-apply">Apply</button>
      </footer>
    </div>
  `;

  const previewElement = overlay.querySelector('[data-role="params-editor-preview"]');
  const errorElement = overlay.querySelector('[data-role="params-editor-error"]');
  const validationWarningElement = overlay.querySelector('[data-role="params-editor-validation-warning"]');
  const applyButton = overlay.querySelector('[data-role="params-editor-apply-button"]');
  const dialogElement = overlay.querySelector('[data-role="params-editor-dialog"]');
  const valueInputs = () => Array.from(overlay.querySelectorAll('[data-role="params-editor-value"]'));
  const booleanInputs = () => Array.from(overlay.querySelectorAll('[data-role="params-editor-boolean"]'));
  const helpTooltipService = createHelpTooltipService({
    documentObj,
    windowObj,
    rootElement: overlay,
    entries: {},
    useGlobalInlineHelpContainer: false,
    resolveHelpElements: () => overlay.querySelectorAll('[data-help-role][data-help]'),
  });
  const warningVisible = Boolean(parsed.error);
  let currentEntries = parsed.entries.map((entry) => ({ ...entry }));

  function setErrorMessage(message = '') {
    const resolvedMessage = String(message || '');
    errorElement.textContent = resolvedMessage;
    errorElement.hidden = resolvedMessage.length === 0;
  }

  function setValidationWarningMessage(message = '') {
    const resolvedMessage = String(message || '');
    validationWarningElement.textContent = resolvedMessage;
    validationWarningElement.hidden = resolvedMessage.length === 0;
  }

  function syncPreview() {
    if (warningVisible) {
      previewElement.textContent = initialParams || '';
      setErrorMessage('');
      setValidationWarningMessage('');
      applyButton.disabled = true;
      applyButton.setAttribute('aria-disabled', 'true');
      return;
    }

    currentEntries = currentEntries.map((entry, index) => ({
      ...entry,
      value: readRenderedEntryValue(overlay, entry, index),
    }));
    const result = buildParamsTextFromEditorEntries({
      entries: currentEntries,
      validateParams,
    });
    previewElement.textContent = result.paramsText || '()';
    setErrorMessage(result.errors[0] || '');
    setValidationWarningMessage(result.warnings?.[0] || '');
    const hasErrors = result.errors.length > 0;
    applyButton.disabled = hasErrors;
    applyButton.setAttribute('aria-disabled', hasErrors ? 'true' : 'false');
    return result;
  }

  return new Promise((resolve) => {
    function restorePreviousFocus() {
      if (
        previouslyFocusedElement &&
        previouslyFocusedElement !== documentObj.body &&
        documentObj.contains?.(previouslyFocusedElement)
      ) {
        previouslyFocusedElement.focus?.();
      }
    }

    function close(result) {
      helpTooltipService.destroy();
      overlay.remove();
      restorePreviousFocus();
      resolve(result ?? null);
    }

    overlay.addEventListener('click', (event) => {
      const closeButton = event.target?.closest?.('[data-role="params-editor-close-button"]');
      const cancelButton = event.target?.closest?.('[data-role="params-editor-cancel-button"]');
      const applyActionButton = event.target?.closest?.('[data-role="params-editor-apply-button"]');
      if (event.target === overlay || closeButton || cancelButton) {
        close(null);
        return;
      }
      if (applyActionButton) {
        const result = syncPreview();
        if (result?.errors?.length) {
          return;
        }
        close(result?.paramsText || '');
      }
    });

    overlay.addEventListener('keydown', (event) => {
      if (trapTabFocus(event, dialogElement, documentObj)) {
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        close(null);
        return;
      }
      if (event.key === 'Enter' && !applyButton.disabled) {
        const tagName = String(event.target?.tagName || '').toLowerCase();
        if (tagName === 'input' || tagName === 'select') {
          event.preventDefault();
          const result = syncPreview();
          if (!result?.errors?.length) {
            close(result?.paramsText || '');
          }
        }
      }
    });

    valueInputs().forEach((input) => input.addEventListener('input', syncPreview));
    booleanInputs().forEach((input) => input.addEventListener('change', syncPreview));

    documentObj.body.appendChild(overlay);
    helpTooltipService.update();
    syncPreview();
    const firstInput = valueInputs()[0] || booleanInputs()[0];
    const focusFn = windowObj?.requestAnimationFrame?.bind(windowObj) || windowObj?.setTimeout?.bind(windowObj);
    focusFn?.(() => (firstInput || getFocusableElements(dialogElement)[0] || dialogElement)?.focus?.());
  });
}

export {
  splitTopLevelCommaSeparated,
  parseInitialParamEntries,
  inferEditorMode,
  buildParamsTextFromEditorEntries,
  openParamsEditorModal,
};
