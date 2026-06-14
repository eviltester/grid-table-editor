/*
 * Responsibilities:
 * - Shared schema-editor row rendering and interaction helpers.
 * - Keeps shared schema row markup, drag/drop indicators, and row action handling out of page-specific modules.
 */

import { escapeHtml } from '../../html-escape.js';
import {
  SOURCE_TYPE_FAKER,
  SOURCE_TYPE_DOMAIN,
  SOURCE_TYPE_REGEX,
  SOURCE_TYPE_LITERAL,
  SOURCE_TYPE_ENUM,
  normaliseFakerCommand,
  normaliseDomainCommand,
  normaliseSourceType,
} from '../../schema-row-rule-mapper.js';
import { applySchemaSourceTypeChange } from './schema-row-mapper.js';
import { renderIconHtml } from '../../primitives/icon/icon-core.js';

const SCHEMA_ROW_DRAGGING_CLASS = 'shared-schema-row-dragging';
const SCHEMA_ROW_DROP_BEFORE_CLASS = 'shared-schema-row-drop-before';
const SCHEMA_ROW_DROP_AFTER_CLASS = 'shared-schema-row-drop-after';
const SHARED_SCHEMA_ROW_CLASS = 'shared-schema-row';
const SHARED_SCHEMA_ROWS_CLASS = 'shared-schema-rows';
const SHARED_SCHEMA_ROW_INVALID_CLASS = 'shared-schema-row-invalid';
const SHARED_SCHEMA_FIELD_INVALID_CLASS = 'shared-schema-field-invalid';
const SHARED_SCHEMA_ROW_VALIDATION_CLASS = 'shared-schema-row-validation';
const SHARED_SCHEMA_HELP_LINK_CLASS = 'shared-schema-help-link';
const SHARED_SCHEMA_HELP_DATA_HELP = 'shared-schema-help';
const SHARED_SCHEMA_ROW_ACTIONS_CLASS = 'shared-schema-row-actions';
const SHARED_SCHEMA_DRAG_HANDLE_CLASS = 'shared-schema-drag-handle';
const SHARED_SCHEMA_COMMAND_PICKER_CONTROL_CLASS = 'shared-schema-command-picker-control';
const SHARED_SCHEMA_COMMAND_PICKER_BUTTON_CLASS = 'shared-schema-command-picker-button';
const SHARED_SCHEMA_COMMAND_PICKER_SHADOW_SELECT_CLASS = 'shared-schema-command-picker-shadow-select';
const SHARED_SCHEMA_COMMAND_ROW_CLASS = 'shared-schema-row-command';
const SHARED_SCHEMA_VALUE_ROW_CLASS = 'shared-schema-row-value';
const SHARED_SCHEMA_PARAMS_CONTROL_CLASS = 'shared-schema-params-control';
const SHARED_SCHEMA_PARAMS_BUTTON_CLASS = 'shared-schema-params-button';
const SHARED_SCHEMA_ROW_SELECTOR = '.shared-schema-row';
const SHARED_SCHEMA_ROWS_SELECTOR = '.shared-schema-rows';

function getRowSelectorForId(rowId) {
  return `.shared-schema-row[data-row-id="${rowId}"]`;
}

function hideVisibleHelpTooltips({ modeHelpIconElement, windowObj, documentObj }) {
  modeHelpIconElement?._tippy?.hide?.();

  const resolvedWindowObj = windowObj || modeHelpIconElement?.ownerDocument?.defaultView || documentObj?.defaultView;
  const tippyFn = resolvedWindowObj?.tippy || globalThis?.tippy;
  tippyFn?.hideAll?.({ duration: 0 });
}

function renderSharedSchemaRows({
  documentObj,
  rowsElement,
  schemaRows,
  fakerCommands = [],
  getVisibleDomainCommands = () => [],
  getSchemaHelpData,
  updateAllPairsButtonVisibility,
  updateHelpHints,
}) {
  const resolvedDocument = documentObj || rowsElement?.ownerDocument;
  if (!resolvedDocument || !rowsElement) {
    return;
  }

  rowsElement.innerHTML = '';

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
    const hasDocumentedParams = Array.isArray(schemaHelp?.params) && schemaHelp.params.length > 0;
    const rowElem = resolvedDocument.createElement('div');
    rowElem.className = `${SHARED_SCHEMA_ROW_CLASS} ${
      isCommandSource ? SHARED_SCHEMA_COMMAND_ROW_CLASS : SHARED_SCHEMA_VALUE_ROW_CLASS
    } ${row?.validation?.valid === false ? SHARED_SCHEMA_ROW_INVALID_CLASS : ''}`;
    rowElem.setAttribute('data-row-id', row.id);
    rowElem.setAttribute('data-row-index', String(index));
    rowElem.innerHTML = `
                <div class="${SHARED_SCHEMA_ROW_ACTIONS_CLASS}">
                    <button class="icon-button ${SHARED_SCHEMA_DRAG_HANDLE_CLASS}" type="button" data-action="drag" data-row-id="${row.id}" title="Drag field to reorder" draggable="true" aria-label="Drag field to reorder">${renderIconHtml('grip-vertical')}</button>
                    <button class="icon-button" type="button" data-action="add" data-row-id="${row.id}" title="Add field" aria-label="Insert field after this row">${renderIconHtml('plus')}</button>
                    <button class="icon-button" type="button" data-action="remove" data-row-id="${row.id}" title="Remove field" aria-label="Remove field">${renderIconHtml('minus')}</button>
                    <button class="icon-button" type="button" data-action="up" data-row-id="${row.id}" title="Move up" aria-label="Move up" ${index === 0 ? 'disabled' : ''}>${renderIconHtml('arrow-up')}</button>
                    <button class="icon-button" type="button" data-action="down" data-row-id="${row.id}" title="Move down" aria-label="Move down" ${index === schemaRows.length - 1 ? 'disabled' : ''}>${renderIconHtml('arrow-down')}</button>
                </div>
                <input type="text" data-field="name" class="${hasNameValidationError ? SHARED_SCHEMA_FIELD_INVALID_CLASS : ''}" placeholder="Column Name" value="${escapeHtml(row.name)}">
                <select data-field="sourceType" class="${hasCommandValidationError ? SHARED_SCHEMA_FIELD_INVALID_CLASS : ''}">
                    <option value="${SOURCE_TYPE_ENUM}" ${normalisedSourceType === SOURCE_TYPE_ENUM ? 'selected' : ''}>enum</option>
                    <option value="${SOURCE_TYPE_LITERAL}" ${normalisedSourceType === SOURCE_TYPE_LITERAL ? 'selected' : ''}>literal</option>
                    <option value="${SOURCE_TYPE_REGEX}" ${normalisedSourceType === SOURCE_TYPE_REGEX ? 'selected' : ''}>regex</option>
                    <option value="${SOURCE_TYPE_DOMAIN}" ${normalisedSourceType === SOURCE_TYPE_DOMAIN ? 'selected' : ''}>domain</option>
                    <option value="${SOURCE_TYPE_FAKER}" ${normalisedSourceType === SOURCE_TYPE_FAKER ? 'selected' : ''}>faker</option>
                </select>
                ${
                  isCommandSource
                    ? `<div class="${SHARED_SCHEMA_COMMAND_PICKER_CONTROL_CLASS}">
                        <button type="button" data-action="pick-command" data-row-id="${row.id}" class="${SHARED_SCHEMA_COMMAND_PICKER_BUTTON_CLASS} ${hasCommandValidationError ? SHARED_SCHEMA_FIELD_INVALID_CLASS : ''}">${escapeHtml(
                          row.command || (isDomainSource ? 'Select domain command' : 'Select faker command')
                        )}</button>
                        <select data-field="command" class="${SHARED_SCHEMA_COMMAND_PICKER_SHADOW_SELECT_CLASS}">
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
                    class="helpicon ${SHARED_SCHEMA_HELP_LINK_CLASS}"
                    data-help-role="help-icon"
                    data-help="${SHARED_SCHEMA_HELP_DATA_HELP}"
                    href="${escapeHtml(schemaHelp.docsUrl)}"
                    aria-label="${escapeHtml(schemaHelp.title)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    ${schemaHelp.show ? '' : 'hidden'}
                ></a>
                ${
                  isCommandSource
                    ? `<div class="${SHARED_SCHEMA_PARAMS_CONTROL_CLASS}">
                        <input type="text" data-field="params" class="${hasParamsValidationError ? SHARED_SCHEMA_FIELD_INVALID_CLASS : ''}" placeholder="Params e.g. (10)" value="${escapeHtml(row.params)}">
                        <button
                          type="button"
                          data-action="edit-params"
                          data-row-id="${row.id}"
                          class="icon-button ${SHARED_SCHEMA_PARAMS_BUTTON_CLASS}"
                          aria-label="Edit params for ${escapeHtml(row.command || 'selected command')}"
                          title="${hasDocumentedParams ? 'Edit params in dialog' : 'No documented params available'}"
                          ${hasDocumentedParams ? '' : 'disabled'}
                        >${renderIconHtml('pencil')}</button>
                      </div>`
                    : `<input type="text" data-field="value" placeholder="Value / Regex" value="${escapeHtml(row.value)}">`
                }
                ${
                  validationMessage
                    ? `<div class="${SHARED_SCHEMA_ROW_VALIDATION_CLASS}" role="status">${escapeHtml(validationMessage)}</div>`
                    : ''
                }
            `;

    const schemaHelpElement = rowElem.querySelector('[data-field="faker-doc-link"]');
    if (schemaHelpElement) {
      schemaHelpElement.setAttribute('data-help-text', schemaHelp.html);
    }
    rowsElement.appendChild(rowElem);
  });

  updateHelpHints?.();
  updateAllPairsButtonVisibility();
}

function clearSchemaRowDragClasses({ rootElement }) {
  const rows = rootElement?.querySelectorAll?.(SHARED_SCHEMA_ROW_SELECTOR);
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

  const targetRowElem = event?.target?.closest?.(SHARED_SCHEMA_ROW_SELECTOR);
  if (!targetRowElem) {
    const container = event?.currentTarget;
    const isSchemaRowsContainer = container?.matches?.(SHARED_SCHEMA_ROWS_SELECTOR);
    if (!isSchemaRowsContainer) {
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
      targetRowElem: container.querySelector(getRowSelectorForId(schemaRows[lastIndex].id)),
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

function applySchemaRowDropInstructionIndicator({ rootElement, draggedRowId, dropInstruction }) {
  clearSchemaRowDragClasses({ rootElement });
  const draggedRowElem = rootElement?.querySelector?.(getRowSelectorForId(draggedRowId));
  draggedRowElem?.classList?.add?.(SCHEMA_ROW_DRAGGING_CLASS);
  if (!dropInstruction?.targetRowElem || dropInstruction.finalIndex === dropInstruction.draggedIndex) {
    return;
  }
  dropInstruction.targetRowElem.classList.add(
    dropInstruction.placement === 'after' ? SCHEMA_ROW_DROP_AFTER_CLASS : SCHEMA_ROW_DROP_BEFORE_CLASS
  );
}

function handleSharedSchemaRowInputChange({
  event,
  schemaRows,
  schemaSession,
  renderSchemaRows,
  updateAllPairsButtonVisibility,
}) {
  const rowElem = event.target.closest(SHARED_SCHEMA_ROW_SELECTOR);
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

function handleSharedSchemaRowButtonClick({ event, schemaRows, addRowAfter, removeRow, moveRow }) {
  const actionElement =
    event.target && typeof event.target.closest === 'function' ? event.target.closest('[data-action]') : null;
  const action = actionElement?.getAttribute('data-action');
  if (!action || action === 'drag') {
    return;
  }

  const rowId = actionElement.getAttribute('data-row-id');
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
  SHARED_SCHEMA_ROW_CLASS,
  SHARED_SCHEMA_ROWS_CLASS,
  SHARED_SCHEMA_ROW_INVALID_CLASS,
  SHARED_SCHEMA_FIELD_INVALID_CLASS,
  SHARED_SCHEMA_ROW_VALIDATION_CLASS,
  SHARED_SCHEMA_HELP_LINK_CLASS,
  SHARED_SCHEMA_HELP_DATA_HELP,
  SHARED_SCHEMA_ROW_ACTIONS_CLASS,
  SHARED_SCHEMA_DRAG_HANDLE_CLASS,
  SHARED_SCHEMA_COMMAND_PICKER_CONTROL_CLASS,
  SHARED_SCHEMA_COMMAND_PICKER_BUTTON_CLASS,
  SHARED_SCHEMA_COMMAND_PICKER_SHADOW_SELECT_CLASS,
  SHARED_SCHEMA_COMMAND_ROW_CLASS,
  SHARED_SCHEMA_VALUE_ROW_CLASS,
  SHARED_SCHEMA_PARAMS_CONTROL_CLASS,
  SHARED_SCHEMA_PARAMS_BUTTON_CLASS,
  SHARED_SCHEMA_ROW_SELECTOR,
  SHARED_SCHEMA_ROWS_SELECTOR,
  hideVisibleHelpTooltips,
  renderSharedSchemaRows,
  clearSchemaRowDragClasses,
  getSchemaRowDropInstruction,
  applySchemaRowDropInstructionIndicator,
  handleSharedSchemaRowInputChange,
  handleSharedSchemaRowButtonClick,
};
