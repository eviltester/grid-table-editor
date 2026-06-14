import { getDefaultDocumentObj, getDefaultWindowObj, resolveWindowObj } from '../../dom/default-objects.js';

const STYLE_ID = 'params-editor-modal-styles-link';

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
        example: param?.example || '',
        value: '',
        mode: 'auto',
      })),
      error: '',
    };
  }

  const split = splitTopLevelCommaSeparated(trimmed);
  if (split.error) {
    return { entries: [], error: split.error };
  }
  if (split.values.length > metadata.length && !hasVariadicTail) {
    return {
      entries: [],
      error:
        'Current params use more values than the documented fields. Edit the raw params text directly for this command.',
    };
  }

  return {
    entries: metadata.map((param, index) => {
      const rawValue =
        hasVariadicTail && index === variadicIndex ? split.values.slice(index).join(',') : split.values[index] || '';
      return {
        name: param?.name || '',
        type: param?.type || '',
        optional: param?.optional === true,
        example: param?.example || '',
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
  return JSON.stringify(rawValue);
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
    formattedValues.push(formatEditorValue(rawValue, entry.mode || 'auto', entry.type || ''));
  }

  const paramsText = formattedValues.length > 0 ? `(${formattedValues.join(',')})` : '';
  const validationResult = typeof validateParams === 'function' ? validateParams(paramsText) : [];
  const semanticErrors = Array.isArray(validationResult)
    ? validationResult
    : validationResult
      ? [String(validationResult)]
      : [];

  return {
    paramsText,
    errors: [...errors, ...semanticErrors.filter(Boolean)],
  };
}

function renderEntryRows(entries = []) {
  return entries
    .map(
      (entry, index) => `
        <tr>
          <td><label for="params-editor-value-${index}"><code>${escapeHtml(entry.name)}</code></label></td>
          <td><code>${escapeHtml(entry.type || 'unknown')}</code></td>
          <td>${entry.optional ? 'Optional' : 'Required'}</td>
          <td>
            <select data-role="params-editor-mode" data-index="${index}" aria-label="Format ${escapeHtml(entry.name)}">
              <option value="auto" ${entry.mode === 'auto' ? 'selected' : ''}>Auto</option>
              <option value="text" ${entry.mode === 'text' ? 'selected' : ''}>Quote text</option>
              <option value="raw" ${entry.mode === 'raw' ? 'selected' : ''}>Raw expression</option>
            </select>
          </td>
          <td>
            <input
              id="params-editor-value-${index}"
              data-role="params-editor-value"
              data-index="${index}"
              type="text"
              value="${escapeHtml(entry.value)}"
              placeholder="${escapeHtml(entry.example || '')}"
              aria-label="${escapeHtml(entry.name)} value"
            />
          </td>
        </tr>
      `
    )
    .join('');
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

  const parsed = parseInitialParamEntries({
    params: helpModel?.params || [],
    initialParams,
  });
  const overlay = documentObj.createElement('div');
  overlay.className = 'params-editor-overlay';
  overlay.setAttribute('data-role', 'params-editor-overlay');
  overlay.innerHTML = `
    <div class="params-editor-modal" data-role="params-editor-dialog" role="dialog" aria-modal="true" aria-label="${escapeHtml(
      `Edit params for ${commandLabel}`
    )}">
      <header class="params-editor-header">
        <div>
          <h3>Edit Params</h3>
          <p class="params-editor-subtitle">${escapeHtml(commandLabel)}</p>
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
                      <th>Format</th>
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
      </div>
      <footer class="params-editor-footer">
        <button type="button" data-role="params-editor-cancel-button">Cancel</button>
        <button type="button" data-role="params-editor-apply-button" class="params-editor-apply">Apply</button>
      </footer>
    </div>
  `;

  const previewElement = overlay.querySelector('[data-role="params-editor-preview"]');
  const errorElement = overlay.querySelector('[data-role="params-editor-error"]');
  const applyButton = overlay.querySelector('[data-role="params-editor-apply-button"]');
  const valueInputs = () => Array.from(overlay.querySelectorAll('[data-role="params-editor-value"]'));
  const modeInputs = () => Array.from(overlay.querySelectorAll('[data-role="params-editor-mode"]'));
  const warningVisible = Boolean(parsed.error);
  let currentEntries = parsed.entries.map((entry) => ({ ...entry }));

  function syncPreview() {
    if (warningVisible) {
      previewElement.textContent = initialParams || '';
      errorElement.textContent = parsed.error;
      applyButton.disabled = true;
      applyButton.setAttribute('aria-disabled', 'true');
      return;
    }

    currentEntries = currentEntries.map((entry, index) => ({
      ...entry,
      value: valueInputs()[index]?.value ?? entry.value,
      mode: modeInputs()[index]?.value ?? entry.mode,
    }));
    const result = buildParamsTextFromEditorEntries({
      entries: currentEntries,
      validateParams,
    });
    previewElement.textContent = result.paramsText || '()';
    errorElement.textContent = result.errors[0] || '';
    const hasErrors = result.errors.length > 0;
    applyButton.disabled = hasErrors;
    applyButton.setAttribute('aria-disabled', hasErrors ? 'true' : 'false');
    return result;
  }

  return new Promise((resolve) => {
    function close(result) {
      overlay.remove();
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
    modeInputs().forEach((select) => select.addEventListener('change', syncPreview));

    documentObj.body.appendChild(overlay);
    syncPreview();
    const firstInput = valueInputs()[0];
    const focusFn = windowObj?.requestAnimationFrame?.bind(windowObj) || windowObj?.setTimeout?.bind(windowObj);
    focusFn?.(() => firstInput?.focus?.());
  });
}

export {
  splitTopLevelCommaSeparated,
  parseInitialParamEntries,
  inferEditorMode,
  buildParamsTextFromEditorEntries,
  openParamsEditorModal,
};
