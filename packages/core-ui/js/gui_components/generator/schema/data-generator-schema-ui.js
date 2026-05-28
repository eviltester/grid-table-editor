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
import { applySchemaSourceTypeChange } from '../../shared/test-data/schema/schema-row-mapper.js';

const SCHEMA_ROW_DRAGGING_CLASS = 'generator-schema-row-dragging';
const SCHEMA_ROW_DROP_BEFORE_CLASS = 'generator-schema-row-drop-before';
const SCHEMA_ROW_DROP_AFTER_CLASS = 'generator-schema-row-drop-after';

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
  syncSchemaRowsFromTextMode,
  renderSchemaRows,
}) {
  const textArea = documentObj.getElementById('generatorSchemaText');
  if (textArea) {
    textArea.value = sampleSchemaText;
  }
  syncSchemaRowsFromTextMode({ showErrors: true });
  const rowsContainer = documentObj.getElementById('generatorSchemaRows');
  const isSchemaModeVisible = rowsContainer && rowsContainer.style.display !== 'none';
  if (isSchemaModeVisible) {
    setIsTextMode(true);
    syncSchemaRowsFromTextMode({ showErrors: true });
    setIsTextMode(false);
    renderSchemaRows();
    return;
  }
  syncSchemaRowsFromTextMode({ showErrors: true });
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
    const validationIssues = Array.isArray(row?.validation?.issues) ? row.validation.issues : [];
    const validationMessage = String(row?.validation?.message || '').trim();
    const hasNameValidationError = validationIssues.some((issue) => issue?.field === 'name');
    const hasCommandValidationError = validationIssues.some((issue) => issue?.field === 'command');
    const hasParamsValidationError = validationIssues.some((issue) => issue?.field === 'params');
    const schemaHelp = getSchemaHelpData(normalisedSourceType, row.command);
    const rowElem = documentObj.createElement('div');
    rowElem.className = `generator-schema-row ${isCommandSource ? 'generator-schema-row-faker' : 'generator-schema-row-non-faker'} ${
      row?.validation?.valid === false ? 'generator-schema-row-invalid' : ''
    }`;
    rowElem.setAttribute('data-row-id', row.id);
    rowElem.setAttribute('data-row-index', String(index));
    rowElem.innerHTML = `
                <div class="generator-row-actions">
                    <button class="icon-button generator-schema-drag-handle" type="button" data-action="drag" data-row-id="${row.id}" title="Drag to reorder" draggable="true" aria-label="Drag field to reorder">&#x2630;</button>
                    <button class="icon-button" data-action="add" data-row-id="${row.id}" title="Add field">+</button>
                    <button class="icon-button" data-action="remove" data-row-id="${row.id}" title="Remove field">-</button>
                    <button class="icon-button" data-action="up" data-row-id="${row.id}" title="Move up" ${index === 0 ? 'disabled' : ''}>&uarr;</button>
                    <button class="icon-button" data-action="down" data-row-id="${row.id}" title="Move down" ${index === schemaRows.length - 1 ? 'disabled' : ''}>&darr;</button>
                </div>
                <input type="text" data-field="name" class="${hasNameValidationError ? 'generator-schema-field-invalid' : ''}" placeholder="Column Name" value="${escapeHtml(row.name)}">
                <select data-field="sourceType" class="${hasCommandValidationError ? 'generator-schema-field-invalid' : ''}">
                    <option value="${SOURCE_TYPE_ENUM}" ${normalisedSourceType === SOURCE_TYPE_ENUM ? 'selected' : ''}>enum</option>
                    <option value="${SOURCE_TYPE_LITERAL}" ${normalisedSourceType === SOURCE_TYPE_LITERAL ? 'selected' : ''}>literal</option>
                    <option value="${SOURCE_TYPE_REGEX}" ${normalisedSourceType === SOURCE_TYPE_REGEX ? 'selected' : ''}>regex</option>
                    <option value="${SOURCE_TYPE_DOMAIN}" ${normalisedSourceType === SOURCE_TYPE_DOMAIN ? 'selected' : ''}>domain</option>
                    <option value="${SOURCE_TYPE_FAKER}" ${normalisedSourceType === SOURCE_TYPE_FAKER ? 'selected' : ''}>faker</option>
                </select>
                ${
                  isCommandSource
                    ? `<div class="generator-command-picker-control">
                        <button type="button" data-action="pick-command" data-row-id="${row.id}" class="generator-command-picker-button ${hasCommandValidationError ? 'generator-schema-field-invalid' : ''}">${escapeHtml(
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
                    ? `<input type="text" data-field="params" class="${hasParamsValidationError ? 'generator-schema-field-invalid' : ''}" placeholder="Params e.g. (10)" value="${escapeHtml(row.params)}">`
                    : `<input type="text" data-field="value" placeholder="Value / Regex" value="${escapeHtml(row.value)}">`
                }
                ${
                  validationMessage
                    ? `<div class="generator-schema-row-validation" role="status">${escapeHtml(validationMessage)}</div>`
                    : ''
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

function clearSchemaRowDragClasses(documentObj) {
  const rows = documentObj?.querySelectorAll?.('.generator-schema-row');
  rows?.forEach?.((rowElem) => {
    rowElem.classList.remove(SCHEMA_ROW_DRAGGING_CLASS, SCHEMA_ROW_DROP_BEFORE_CLASS, SCHEMA_ROW_DROP_AFTER_CLASS);
  });
}

function getSchemaRowDropInstruction({ event, schemaRows, draggedRowId }) {
  if (!draggedRowId || !Array.isArray(schemaRows) || schemaRows.length === 0) {
    return null;
  }
  const draggedIndex = schemaRows.findIndex((row) => row.id === draggedRowId);
  if (draggedIndex < 0) {
    return null;
  }

  const targetRowElem = event?.target?.closest?.('.generator-schema-row');
  if (!targetRowElem) {
    const container = event?.currentTarget;
    if (!container?.classList?.contains?.('generator-schema-rows')) {
      return null;
    }
    const lastIndex = schemaRows.length - 1;
    if (lastIndex < 0) {
      return null;
    }
    const finalIndex = draggedIndex < lastIndex ? lastIndex : draggedIndex;
    return {
      draggedRowId,
      draggedIndex,
      targetRowId: schemaRows[lastIndex].id,
      targetIndex: lastIndex,
      placement: 'after',
      finalIndex,
      targetRowElem: container.querySelector(`.generator-schema-row[data-row-id="${schemaRows[lastIndex].id}"]`),
    };
  }

  const targetRowId = targetRowElem.getAttribute('data-row-id');
  const targetIndex = schemaRows.findIndex((row) => row.id === targetRowId);
  if (targetIndex < 0) {
    return null;
  }

  const rect = typeof targetRowElem.getBoundingClientRect === 'function' ? targetRowElem.getBoundingClientRect() : null;
  const placement =
    rect && typeof event?.clientY === 'number' && event.clientY > rect.top + rect.height / 2 ? 'after' : 'before';
  let finalIndex = placement === 'after' ? targetIndex + 1 : targetIndex;
  if (draggedIndex < finalIndex) {
    finalIndex -= 1;
  }
  finalIndex = Math.max(0, Math.min(schemaRows.length - 1, finalIndex));

  return {
    draggedRowId,
    draggedIndex,
    targetRowId,
    targetIndex,
    placement,
    finalIndex,
    targetRowElem,
  };
}

function applySchemaRowDropInstructionIndicator({ documentObj, draggedRowId, dropInstruction }) {
  clearSchemaRowDragClasses(documentObj);
  const draggedRowElem = documentObj?.querySelector?.(`.generator-schema-row[data-row-id="${draggedRowId}"]`);
  draggedRowElem?.classList?.add?.(SCHEMA_ROW_DRAGGING_CLASS);
  if (!dropInstruction?.targetRowElem || dropInstruction.finalIndex === dropInstruction.draggedIndex) {
    return;
  }
  dropInstruction.targetRowElem.classList.add(
    dropInstruction.placement === 'after' ? SCHEMA_ROW_DROP_AFTER_CLASS : SCHEMA_ROW_DROP_BEFORE_CLASS
  );
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

  const updatedRow = schemaSession.updateRowAtIndex(index, (currentRow) => {
    if (fieldName === 'sourceType') {
      return applySchemaSourceTypeChange(currentRow, event.target.value);
    }
    return {
      ...currentRow,
      [fieldName]: event.target.value,
    };
  });
  if (!updatedRow) {
    return;
  }

  if (fieldName === 'sourceType') {
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
  if (!action || action === 'drag') {
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
  SCHEMA_ROW_DRAGGING_CLASS,
  SCHEMA_ROW_DROP_BEFORE_CLASS,
  SCHEMA_ROW_DROP_AFTER_CLASS,
  buildSchemaModeHelpHtml,
  hideVisibleHelpTooltips,
  updateSchemaEditModeView,
  insertExampleSchema,
  renderGeneratorSchemaRows,
  clearSchemaRowDragClasses,
  getSchemaRowDropInstruction,
  applySchemaRowDropInstructionIndicator,
  handleGeneratorRowInputChange,
  handleGeneratorRowButtonClick,
};
