/*
 * Responsibilities:
 * - Generator-page schema editor rendering and interaction helpers.
 * - Keeps row markup, schema-mode visuals, and schema-specific event handling out of the page controller.
 */

import { escapeHtml } from '../../shared/html-escape.js';
import {
  SOURCE_TYPE_FAKER,
  SOURCE_TYPE_DOMAIN,
  SOURCE_TYPE_REGEX,
  SOURCE_TYPE_LITERAL,
  SOURCE_TYPE_ENUM,
  normaliseFakerCommand,
  normaliseDomainCommand,
  normaliseSourceType,
} from '../../shared/schema-row-rule-mapper.js';

function refreshHelpHints(documentObj) {
  const windowObj = documentObj?.defaultView || globalThis.window;
  if (typeof windowObj?.updateHelpHints === 'function') {
    windowObj.updateHelpHints();
  }
}

function buildSchemaModeHelpHtml({ inTextMode, generateToFileHelpUrl }) {
  if (inTextMode) {
    return `
        <p><strong>Edit as Schema</strong></p>
        <p>You are currently editing as text. Click <strong>Edit as Schema</strong> to return to row-based editing.</p>
        <p>Text schema uses name/rule pairs, for example:</p>
        <pre>First Name
person.firstName

Status
enum(active,inactive,pending)</pre>
        <button type="button" class="generator-schema-sample-button">Insert Example Schema</button>
      `;
  }

  return `
      <p><strong>Edit as Text</strong></p>
      <p>You are currently using row-based schema editing. Click <strong>Edit as Text</strong> to switch to text schema mode.</p>
      <p><a class="helplink" href="${generateToFileHelpUrl}" target="_blank" rel="noopener noreferrer">Generate To File docs</a></p>
      <button type="button" class="generator-schema-sample-button">Insert Example Schema</button>
    `;
}

function hideVisibleHelpTooltips({ documentObj }) {
  const modeHelpIcon = documentObj.getElementById('schemaModeHelpIcon');
  modeHelpIcon?._tippy?.hide?.();

  const tippyFn = documentObj?.defaultView?.tippy || globalThis?.tippy;
  tippyFn?.hideAll?.({ duration: 0 });
}

function updateSchemaEditModeView({ documentObj, isTextMode, generateToFileHelpUrl, sampleSchemaText }) {
  const rowsContainer = documentObj.getElementById('generatorSchemaRows');
  const textContainer = documentObj.getElementById('generatorSchemaTextContainer');
  const footer = documentObj.querySelector('.generator-schema-footer');
  const toggleButton = documentObj.getElementById('schemaModeToggleButton');
  const modeHelpIcon = documentObj.getElementById('schemaModeHelpIcon');
  const addSchemaRowButton = documentObj.getElementById('addSchemaRowButton');

  rowsContainer.style.display = isTextMode ? 'none' : 'flex';
  textContainer.style.display = isTextMode ? 'block' : 'none';
  footer.style.display = 'block';
  if (addSchemaRowButton) {
    addSchemaRowButton.style.display = isTextMode ? 'none' : 'inline-block';
  }
  toggleButton.textContent = isTextMode ? 'Edit as Schema' : 'Edit as Text';
  if (modeHelpIcon) {
    const modeHelpHtml = buildSchemaModeHelpHtml({ inTextMode: isTextMode, generateToFileHelpUrl, sampleSchemaText });
    modeHelpIcon.setAttribute('data-help-text', modeHelpHtml);
    modeHelpIcon._tippy?.setContent?.(modeHelpHtml);
  }

  refreshHelpHints(documentObj);
}

function insertExampleSchema({
  documentObj,
  sampleSchemaText,
  setIsTextMode,
  updateSchemaEditModeViewFn,
  syncSchemaRowsFromTextMode,
  renderSchemaRows,
}) {
  const textArea = documentObj.getElementById('generatorSchemaText');
  if (textArea) {
    textArea.value = sampleSchemaText;
  }
  setIsTextMode(true);
  updateSchemaEditModeViewFn();
  syncSchemaRowsFromTextMode({ showErrors: true });
  renderSchemaRows();
}

function renderGeneratorSchemaRows({
  documentObj,
  schemaRows,
  fakerCommands = [],
  getVisibleDomainCommands = () => [],
  getSchemaHelpData,
  updateAllPairsButtonVisibility,
}) {
  const container = documentObj.getElementById('generatorSchemaRows');
  if (!container) {
    return;
  }

  container.innerHTML = '';

  schemaRows.forEach((row, index) => {
    const normalisedSourceType = normaliseSourceType(row.sourceType);
    const isFakerSource = normalisedSourceType === SOURCE_TYPE_FAKER;
    const isDomainSource = normalisedSourceType === SOURCE_TYPE_DOMAIN;
    const isCommandSource = isFakerSource || isDomainSource;
    const schemaHelp = getSchemaHelpData(normalisedSourceType, row.command);
    const rowElem = documentObj.createElement('div');
    rowElem.className = `generator-schema-row ${isCommandSource ? 'generator-schema-row-faker' : 'generator-schema-row-non-faker'}`;
    rowElem.setAttribute('data-row-id', row.id);
    rowElem.innerHTML = `
                <div class="generator-row-actions">
                    <button class="icon-button" data-action="add" data-row-id="${row.id}" title="Add field">+</button>
                    <button class="icon-button" data-action="remove" data-row-id="${row.id}" title="Remove field">-</button>
                    <button class="icon-button" data-action="up" data-row-id="${row.id}" title="Move up" ${index === 0 ? 'disabled' : ''}>&uarr;</button>
                    <button class="icon-button" data-action="down" data-row-id="${row.id}" title="Move down" ${index === schemaRows.length - 1 ? 'disabled' : ''}>&darr;</button>
                </div>
                <input type="text" data-field="name" placeholder="Column Name" value="${escapeHtml(row.name)}">
                <select data-field="sourceType">
                    <option value="${SOURCE_TYPE_ENUM}" ${normalisedSourceType === SOURCE_TYPE_ENUM ? 'selected' : ''}>enum</option>
                    <option value="${SOURCE_TYPE_LITERAL}" ${normalisedSourceType === SOURCE_TYPE_LITERAL ? 'selected' : ''}>literal</option>
                    <option value="${SOURCE_TYPE_REGEX}" ${normalisedSourceType === SOURCE_TYPE_REGEX ? 'selected' : ''}>regex</option>
                    <option value="${SOURCE_TYPE_DOMAIN}" ${normalisedSourceType === SOURCE_TYPE_DOMAIN ? 'selected' : ''}>domain</option>
                    <option value="${SOURCE_TYPE_FAKER}" ${normalisedSourceType === SOURCE_TYPE_FAKER ? 'selected' : ''}>faker</option>
                </select>
                ${
                  isCommandSource
                    ? `<div class="generator-command-picker-control">
                        <button type="button" data-action="pick-command" data-row-id="${row.id}" class="generator-command-picker-button">${escapeHtml(
                          row.command || (isDomainSource ? 'Select domain command' : 'Select faker command')
                        )}</button>
                        <select data-field="command" class="generator-command-picker-shadow-select">
                          <option value="">${isDomainSource ? 'Select domain command' : 'Select faker command'}</option>
                          ${(isDomainSource ? getVisibleDomainCommands(row.command) : fakerCommands)
                            .map((command) => {
                              const selected = command === row.command ? 'selected' : '';
                              return `<option value="${escapeHtml(command)}" ${selected}>${escapeHtml(command)}</option>`;
                            })
                            .join('')}
                        </select>
                    </div>`
                    : ''
                }
                <a
                    data-field="faker-doc-link"
                    class="helpicon generator-schema-help-link"
                    data-help="generator-schema-help"
                    href="${escapeHtml(schemaHelp.docsUrl)}"
                    aria-label="${escapeHtml(schemaHelp.title)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    ${schemaHelp.show ? '' : 'hidden'}
                ></a>
                ${
                  isCommandSource
                    ? `<input type="text" data-field="params" placeholder="Params e.g. (10)" value="${escapeHtml(row.params)}">`
                    : `<input type="text" data-field="value" placeholder="Value / Regex" value="${escapeHtml(row.value)}">`
                }
            `;

    const schemaHelpElement = rowElem.querySelector('[data-field="faker-doc-link"]');
    if (schemaHelpElement) {
      schemaHelpElement.setAttribute('data-help-text', schemaHelp.html);
    }
    container.appendChild(rowElem);
  });

  refreshHelpHints(documentObj);
  updateAllPairsButtonVisibility();
}

function handleGeneratorRowInputChange({
  event,
  schemaRows,
  schemaSession,
  renderSchemaRows,
  updateAllPairsButtonVisibility,
}) {
  const rowElem = event.target.closest('.generator-schema-row');
  if (!rowElem) {
    return;
  }

  const rowId = rowElem.getAttribute('data-row-id');
  const index = schemaRows.findIndex((entry) => entry.id === rowId);
  if (index < 0) {
    return;
  }

  const fieldName = event.target.getAttribute('data-field');
  if (!fieldName) {
    return;
  }

  const updatedRow = schemaSession.updateRowAtIndex(index, (currentRow) => ({
    ...currentRow,
    [fieldName]: event.target.value,
  }));
  if (!updatedRow) {
    return;
  }

  if (fieldName === 'sourceType') {
    updatedRow.sourceType = normaliseSourceType(updatedRow.sourceType);
    renderSchemaRows();
    return;
  }

  if (fieldName === 'command') {
    updatedRow.command =
      updatedRow.sourceType === SOURCE_TYPE_DOMAIN
        ? normaliseDomainCommand(updatedRow.command)
        : normaliseFakerCommand(updatedRow.command);
    renderSchemaRows();
  }

  updateAllPairsButtonVisibility();
}

function handleGeneratorRowButtonClick({ event, schemaRows, addRowAfter, removeRow, moveRow }) {
  const action = event.target.getAttribute('data-action');
  if (!action) {
    return;
  }

  const rowId = event.target.getAttribute('data-row-id');
  const index = schemaRows.findIndex((row) => row.id === rowId);
  if (index < 0) {
    return;
  }

  if (action === 'add') {
    addRowAfter(index);
    return;
  }
  if (action === 'remove') {
    removeRow(index);
    return;
  }
  if (action === 'up') {
    moveRow(index, -1);
    return;
  }
  if (action === 'down') {
    moveRow(index, 1);
  }
}

export {
  buildSchemaModeHelpHtml,
  hideVisibleHelpTooltips,
  updateSchemaEditModeView,
  insertExampleSchema,
  renderGeneratorSchemaRows,
  handleGeneratorRowInputChange,
  handleGeneratorRowButtonClick,
};
