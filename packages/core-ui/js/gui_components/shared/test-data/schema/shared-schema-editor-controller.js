import { openMethodPickerModal } from '../ui/method-picker-modal.js';
import { openParamsEditorModal } from '../ui/params-editor-modal.js';
import { buildSchemaHelpModel, renderSchemaHelpHtml } from '../help/help-model-builder.js';
import {
  SOURCE_TYPE_DOMAIN,
  SOURCE_TYPE_ENUM,
  SOURCE_TYPE_FAKER,
  SOURCE_TYPE_LITERAL,
  SOURCE_TYPE_REGEX,
  normaliseDomainCommand,
  normaliseFakerCommand,
  normaliseSourceType,
  buildDataRuleFromSchemaRow,
} from '../../schema-row-rule-mapper.js';
import {
  createSchemaEditingSession,
  parseSchemaTextToRows,
  buildConstraintTextFromTokens,
} from './schema-controller.js';
import { applySchemaCommandSelection } from './schema-row-mapper.js';
import { schemaRowsToSpecWithTokens } from './schema-editor-core.js';
import { schemaErrorsToText } from './schema-error-text.js';
import { getSchemaRowSemanticValidationIssues } from './schema-row-validation.js';
import { captureActiveFieldState, restoreActiveFieldState } from './schema-focus-state.js';
import { getDefaultDocumentObj, resolveWindowObj } from '../../dom/default-objects.js';
import {
  renderSharedSchemaRows,
  clearSchemaRowDragClasses,
  getSchemaRowDropInstruction,
  applySchemaRowDropInstructionIndicator,
  handleSharedSchemaRowInputChange,
  handleSharedSchemaRowButtonClick,
  hideVisibleHelpTooltips,
  SHARED_SCHEMA_ROW_SELECTOR,
} from './shared-schema-editor-ui.js';

const SCHEMA_ROWS_ROLE = 'schema-rows-region';
const SCHEMA_TEXT_CONTAINER_ROLE = 'schema-text-region';
const SCHEMA_TEXT_ROLE = 'schema-textbox';
const SCHEMA_ADD_BUTTON_ROLE = 'schema-add-field';
const SCHEMA_MODE_TOGGLE_ROLE = 'schema-mode-toggle';
const SCHEMA_MODE_HELP_ROLE = 'schema-mode-help';
const SCHEMA_CONSTRAINTS_REGION_ROLE = 'schema-constraints-region';
const SCHEMA_CONSTRAINTS_SUMMARY_ROLE = 'schema-constraints-summary';
const SCHEMA_CONSTRAINTS_TEXT_ROLE = 'schema-constraints-textbox';

function createSharedSchemaEditorController({
  documentObj = getDefaultDocumentObj(),
  schemaTextToDataRules,
  dataRulesToSchemaText,
  faker,
  RandExp,
  createBlankRow,
  mapRuleToRow,
  getMethodPickerOptions = () => [],
  getVisibleDomainCommands = () => [],
  fakerCommands = [],
  sampleSchemaText = '',
  buildModeHelpHtml = () => '',
  schemaErrorDisplay,
  onSchemaError,
  onSchemaClear,
  onSchemaParseError,
  onRowsChanged,
  onSchemaTextChanged,
  validateSchemaRows,
  updatePairwiseButtonVisibility = () => {},
  updateHelpHints,
  elements = {},
  rootElement = documentObj?.body,
  timerApi = documentObj?.defaultView || globalThis,
}) {
  const semanticValidationTimers = new Map();
  let dragState = null;
  const SEMANTIC_VALIDATION_DEBOUNCE_MS = 1000;
  const session = createSchemaEditingSession({
    createBlankSchemaRow: createBlankRow,
    schemaTextToDataRules,
    faker,
    RandExp,
    mapRuleToRow,
    schemaRowsToSpecWithTokens: (rows, tokens) =>
      schemaRowsToSpecWithTokens({
        schemaRows: rows,
        schemaTokens: tokens,
        buildDataRuleFromSchemaRow,
        dataRulesToSchemaText,
      }),
  });
  const getElementByRole = (role) => rootElement?.querySelector?.(`[data-role="${role}"]`);
  const getRowsElement = () => elements.rowsElement || getElementByRole(SCHEMA_ROWS_ROLE);
  const getTextElement = () => elements.textElement || getElementByRole(SCHEMA_TEXT_ROLE);
  const getTextContainerElement = () => elements.textContainerElement || getElementByRole(SCHEMA_TEXT_CONTAINER_ROLE);
  const getAddButtonElement = () => elements.addButtonElement || getElementByRole(SCHEMA_ADD_BUTTON_ROLE);
  const getToggleButtonElement = () => elements.toggleButtonElement || getElementByRole(SCHEMA_MODE_TOGGLE_ROLE);
  const getModeHelpIconElement = () => elements.helpIconElement || getElementByRole(SCHEMA_MODE_HELP_ROLE);
  const getConstraintsRegionElement = () =>
    elements.constraintsRegionElement || getElementByRole(SCHEMA_CONSTRAINTS_REGION_ROLE);
  const getConstraintsSummaryElement = () =>
    elements.constraintsSummaryElement || getElementByRole(SCHEMA_CONSTRAINTS_SUMMARY_ROLE);
  const getConstraintsTextElement = () =>
    elements.constraintsTextElement || getElementByRole(SCHEMA_CONSTRAINTS_TEXT_ROLE);

  const refreshHelpHints = () => {
    updateHelpHints?.();
  };

  const getCurrentSchemaText = () =>
    session.getTextMode() ? String(getTextElement()?.value || '') : composeSchemaText();

  const emitSchemaTextChanged = () => {
    onSchemaTextChanged?.(getCurrentSchemaText());
  };

  const setSchemaError = (message) => {
    const text = String(message || '');
    schemaErrorDisplay?.show?.(text);
    onSchemaError?.(text);
  };

  const clearSchemaError = () => {
    schemaErrorDisplay?.clear?.();
    onSchemaClear?.();
  };

  const getConstraintEditorHint = () =>
    'Edit IF ... THEN schema constraints in the Schema Constraints section while using row mode.';

  const getRuleOnlyTokens = () => {
    const tokens = session.getTokens();
    const lastRuleIndex = tokens.reduce(
      (latestIndex, token, index) => (token?.kind === 'rule' ? index : latestIndex),
      -1
    );
    return lastRuleIndex >= 0 ? tokens.slice(0, lastRuleIndex + 1) : [];
  };

  const serialiseRowsOnlyToText = () => {
    const rowsForSerialization = session.getRows().map((row) => {
      if (String(row?.sourceType || '').toLowerCase() !== SOURCE_TYPE_FAKER) {
        return row;
      }
      const command = String(row?.command || '').trim();
      if (!command || command.startsWith('faker.') || command.startsWith('helpers.')) {
        return row;
      }
      return { ...row, command: `faker.${command}` };
    });
    return (
      schemaRowsToSpecWithTokens({
        schemaRows: rowsForSerialization,
        schemaTokens: getRuleOnlyTokens(),
        buildDataRuleFromSchemaRow,
        dataRulesToSchemaText,
      }) || ''
    );
  };

  const composeSchemaText = ({ constraintText = session.getConstraintText() } = {}) => {
    const rulesText = serialiseRowsOnlyToText();
    const normalizedRulesText = String(rulesText ?? '').replace(/\n+$/u, '');
    const normalizedConstraintText = String(constraintText ?? '').replace(/^\n+/u, '');
    if (normalizedConstraintText.trim().length === 0) {
      return rulesText;
    }
    if (normalizedRulesText.trim().length === 0) {
      return normalizedConstraintText;
    }
    return `${normalizedRulesText}\n\n${normalizedConstraintText}`;
  };

  const getSchemaHelpData = (sourceType, commandValue) => {
    const model = buildSchemaHelpModel(sourceType, commandValue, {
      windowObj: resolveWindowObj(null, documentObj),
    });
    return {
      show: model.show === true,
      title: model.title || '',
      docsUrl: model.docsUrl || '#',
      html: renderSchemaHelpHtml(model),
      params: Array.isArray(model.params) ? model.params : [],
    };
  };

  const getMethodOptionForRow = (row) => {
    const command = String(row?.command || '').trim();
    if (!command) {
      return null;
    }
    if (typeof getMethodPickerOptions !== 'function') {
      return null;
    }
    const sourceType = normaliseSourceType(row?.sourceType);
    return (getMethodPickerOptions(command) || []).find(
      (option) =>
        String(option?.command || '').trim() === command && normaliseSourceType(option?.sourceType) === sourceType
    );
  };

  const validateParamsForRow = (row, paramsText) => {
    const rowIndex = session.getRows().findIndex((entry) => entry.id === row?.id);
    if (rowIndex < 0) {
      return [];
    }
    const candidateRow = {
      ...row,
      params: paramsText,
      semanticValidationIssues: [],
    };
    return getSchemaRowSemanticValidationIssues(candidateRow, rowIndex, {
      schemaTextToDataRules,
      faker,
      RandExp,
      includeBracketGuidance: false,
    })
      .map((issue) => ({
        message: issue?.message,
        severity: /Unsafe faker rule syntax detected/iu.test(String(issue?.message || '')) ? 'warning' : 'error',
      }))
      .filter((issue) => issue.message);
  };

  const revalidateRows = () => {
    if (typeof validateSchemaRows !== 'function') {
      return { rows: session.getRows(), errors: [] };
    }
    const validation = validateSchemaRows(session.getRows());
    if (Array.isArray(validation?.rows) && validation.rows.length > 0) {
      session.setRows(validation.rows);
    }
    return validation || { rows: session.getRows(), errors: [] };
  };

  const clearSemanticValidationTimer = (rowId) => {
    const timerId = semanticValidationTimers.get(rowId);
    if (timerId) {
      timerApi?.clearTimeout?.(timerId);
      semanticValidationTimers.delete(rowId);
    }
  };

  const clearAllSemanticValidationTimers = () => {
    [...semanticValidationTimers.keys()].forEach((rowId) => clearSemanticValidationTimer(rowId));
  };

  const clearDragState = () => {
    dragState = null;
    clearSchemaRowDragClasses({ rootElement });
  };

  const applySemanticValidationForRow = (rowId) => {
    clearSemanticValidationTimer(rowId);
    const activeFieldState = captureActiveFieldState(documentObj);
    const rowIndex = session.getRows().findIndex((row) => row.id === rowId);
    if (rowIndex < 0) {
      return;
    }
    const currentRow = session.getRows()[rowIndex];
    const semanticValidationIssues = getSchemaRowSemanticValidationIssues(currentRow, rowIndex, {
      schemaTextToDataRules,
      faker,
      RandExp,
    });
    session.updateRowAtIndex(rowIndex, (row) => ({
      ...row,
      semanticValidationIssues,
    }));
    revalidateRows();
    renderRows();
    restoreActiveFieldState(documentObj, activeFieldState);
    updatePairwiseButtonVisibility();
    onRowsChanged?.(session.getRows());
  };

  const applySemanticValidationForAllRows = () => {
    clearAllSemanticValidationTimers();
    const nextRows = session.getRows().map((row, rowIndex) => ({
      ...row,
      semanticValidationIssues: getSchemaRowSemanticValidationIssues(row, rowIndex, {
        schemaTextToDataRules,
        faker,
        RandExp,
      }),
    }));
    session.setRows(nextRows);
    revalidateRows();
    renderRows();
    updatePairwiseButtonVisibility();
    onRowsChanged?.(session.getRows());
  };

  const scheduleSemanticValidationForRow = (rowId, { immediate = false } = {}) => {
    clearSemanticValidationTimer(rowId);
    if (immediate) {
      applySemanticValidationForRow(rowId);
      return;
    }
    const timerId = timerApi?.setTimeout?.(() => applySemanticValidationForRow(rowId), SEMANTIC_VALIDATION_DEBOUNCE_MS);
    semanticValidationTimers.set(rowId, timerId);
  };

  const updateTextElementFromRows = () => {
    const textElement = getTextElement();
    if (textElement) {
      textElement.value = composeSchemaText();
    }
  };

  const syncTextFromRows = () => {
    updateTextElementFromRows();
    updatePairwiseButtonVisibility();
    onRowsChanged?.(session.getRows());
    emitSchemaTextChanged();
  };

  const updateConstraintsView = () => {
    const constraintsRegionElement = getConstraintsRegionElement();
    const constraintsSummaryElement = getConstraintsSummaryElement();
    const constraintsTextElement = getConstraintsTextElement();
    const constraintCount = session.getConstraints().length;
    const constraintText = session.getConstraintText();

    if (constraintsRegionElement) {
      constraintsRegionElement.style.display = session.getTextMode() ? 'none' : 'block';
      constraintsRegionElement.open = constraintText.trim().length > 0;
      constraintsRegionElement.title = getConstraintEditorHint();
    }
    if (constraintsSummaryElement) {
      constraintsSummaryElement.textContent = `Schema Constraints (${constraintCount})`;
    }
    if (constraintsTextElement && documentObj?.activeElement !== constraintsTextElement) {
      constraintsTextElement.value = constraintText;
    }
  };

  const renderRows = () => {
    renderSharedSchemaRows({
      documentObj,
      rowsElement: getRowsElement(),
      schemaRows: session.getRows(),
      fakerCommands,
      getVisibleDomainCommands,
      getSchemaHelpData,
      updateAllPairsButtonVisibility: () => {},
      updateHelpHints: refreshHelpHints,
    });
  };

  const updateModeHelp = () => {
    const modeHelpIcon = getModeHelpIconElement();
    if (!modeHelpIcon) {
      return;
    }
    const modeHelpHtml = buildModeHelpHtml({ inTextMode: session.getTextMode() });
    modeHelpIcon.setAttribute('data-help-text', modeHelpHtml);
    modeHelpIcon._tippy?.setContent?.(modeHelpHtml);
    refreshHelpHints();
  };

  const updateModeView = () => {
    const isTextMode = session.getTextMode();
    const rowsElement = getRowsElement();
    const textContainerElement = getTextContainerElement();
    const addButtonElement = getAddButtonElement();
    const toggleButtonElement = getToggleButtonElement();
    if (rowsElement && textContainerElement) {
      rowsElement.style.display = isTextMode ? 'none' : 'flex';
      textContainerElement.style.display = isTextMode ? 'block' : 'none';
    }
    if (addButtonElement) {
      addButtonElement.style.display = isTextMode ? 'none' : 'inline-block';
    }
    if (toggleButtonElement) {
      toggleButtonElement.textContent = isTextMode ? 'Edit as Schema' : 'Edit as Text';
      toggleButtonElement.disabled = false;
      toggleButtonElement.title = 'Toggle schema text mode';
    }
    updateConstraintsView();
    updateModeHelp();
  };

  const getPickerInitialTab = (sourceType) => {
    const type = String(sourceType || '').toLowerCase();
    if (type === SOURCE_TYPE_FAKER) return 'faker';
    if (type === SOURCE_TYPE_ENUM || type === SOURCE_TYPE_LITERAL || type === SOURCE_TYPE_REGEX) return 'core';
    return 'all';
  };

  const syncFromText = ({ showErrors = false, force = false, refreshTextFromRows = false } = {}) => {
    if (!force && !session.getTextMode()) {
      return { rows: session.getRows(), errors: [], tokens: session.getTokens() };
    }
    const textArea = getTextElement();
    const schemaText = String(textArea?.value || '');
    if (schemaText.trim().length === 0) {
      clearAllSemanticValidationTimers();
      clearSchemaError();
      session.setRows([], { allowEmpty: true });
      session.setTokens([]);
      session.setConstraints([]);
      session.setConstraintText('');
      revalidateRows();
      renderRows();
      updateConstraintsView();
      updatePairwiseButtonVisibility();
      onRowsChanged?.(session.getRows());
      emitSchemaTextChanged();
      return { rows: session.getRows(), errors: [], tokens: session.getTokens(), constraints: [] };
    }
    const parsed = parseSchemaTextToRows({
      schemaTextToDataRules,
      schemaText,
      faker,
      RandExp,
      previousRows: session.getRows(),
      mapRuleToRow: (rule, leadingTextLines = []) => {
        const mapped =
          typeof mapRuleToRow === 'function' ? mapRuleToRow(rule, leadingTextLines) : createBlankRow(leadingTextLines);
        if (mapped?.id) {
          return mapped;
        }
        return { ...createBlankRow(), ...mapped };
      },
    });
    if (parsed.errors.length > 0) {
      if (showErrors) {
        setSchemaError(schemaErrorsToText(parsed.errors));
      }
      onSchemaParseError?.(parsed.errors);
      emitSchemaTextChanged();
      return parsed;
    }
    clearSchemaError();
    clearAllSemanticValidationTimers();
    session.setRows(parsed.rows || []);
    session.setTokens(parsed.tokens || []);
    session.setConstraints(parsed.constraints || []);
    session.setConstraintText(buildConstraintTextFromTokens(parsed.tokens || [], parsed.constraints || []));
    updateModeView();
    revalidateRows();
    applySemanticValidationForAllRows();
    if (refreshTextFromRows && session.getTextMode()) {
      updateTextElementFromRows();
    }
    emitSchemaTextChanged();
    return { rows: session.getRows(), errors: [], tokens: session.getTokens() };
  };

  const syncConstraintsFromEditor = ({ showErrors = false } = {}) => {
    const constraintsTextElement = getConstraintsTextElement();
    if (!constraintsTextElement) {
      return {
        rows: session.getRows(),
        errors: [],
        tokens: session.getTokens(),
        constraints: session.getConstraints(),
      };
    }
    const constraintText = String(constraintsTextElement.value || '');
    session.setConstraintText(constraintText);
    updateConstraintsView();
    const parsed = parseSchemaTextToRows({
      schemaTextToDataRules,
      schemaText: composeSchemaText({ constraintText }),
      faker,
      RandExp,
      previousRows: session.getRows(),
      mapRuleToRow: (rule, leadingTextLines = []) => {
        const mapped =
          typeof mapRuleToRow === 'function' ? mapRuleToRow(rule, leadingTextLines) : createBlankRow(leadingTextLines);
        if (mapped?.id) {
          return mapped;
        }
        return { ...createBlankRow(), ...mapped };
      },
    });
    if (parsed.errors.length > 0) {
      if (showErrors) {
        setSchemaError(schemaErrorsToText(parsed.errors));
      }
      onSchemaParseError?.(parsed.errors);
      return parsed;
    }
    clearSchemaError();
    session.setTokens(parsed.tokens || []);
    session.setConstraints(parsed.constraints || []);
    session.setConstraintText(constraintText);
    updateConstraintsView();
    syncTextFromRows();
    return { rows: session.getRows(), errors: [], tokens: session.getTokens(), constraints: session.getConstraints() };
  };

  const toggleMode = () => {
    hideVisibleHelpTooltips({
      modeHelpIconElement: getModeHelpIconElement(),
      windowObj: documentObj?.defaultView,
      documentObj,
    });
    if (session.getTextMode()) {
      const parsed = syncFromText({ showErrors: true });
      if (parsed?.errors?.length > 0) {
        return parsed;
      }
      session.setTextMode(false);
      updateModeView();
      applySemanticValidationForAllRows();
      return { rows: session.getRows(), errors: [], tokens: session.getTokens() };
    }
    syncTextFromRows();
    clearAllSemanticValidationTimers();
    session.setTextMode(true);
    updateModeView();
    return { rows: session.getRows(), errors: [], tokens: session.getTokens() };
  };

  const insertSampleSchema = () => {
    const textArea = getTextElement();
    if (textArea) {
      textArea.value = sampleSchemaText;
    }
    const isTextMode = session.getTextMode();
    if (isTextMode) {
      syncFromText({ showErrors: true });
      session.setTextMode(true);
      updateModeView();
      return;
    }
    session.setTextMode(true);
    const parsed = syncFromText({ showErrors: true });
    session.setTextMode(false);
    updateModeView();
    if (!parsed?.errors?.length) {
      applySemanticValidationForAllRows();
    }
  };

  const loadSchemaText = (schemaText, { showErrors = true, preferRowMode } = {}) => {
    const previousTextMode = session.getTextMode();
    const textArea = getTextElement();
    if (textArea) {
      textArea.value = String(schemaText ?? '');
    }

    session.setTextMode(true);
    updateModeView();
    const parsed = syncFromText({ showErrors, force: true });
    if (parsed?.errors?.length > 0) {
      if (preferRowMode === undefined && !previousTextMode) {
        session.setTextMode(false);
        updateModeView();
      }
      return { ...parsed, applied: false };
    }

    const shouldUseRowMode = preferRowMode === undefined ? !previousTextMode : Boolean(preferRowMode);

    if (shouldUseRowMode) {
      session.setTextMode(false);
      updateModeView();
      applySemanticValidationForAllRows();
    } else {
      session.setTextMode(true);
      updateModeView();
    }

    return {
      rows: session.getRows(),
      errors: [],
      tokens: session.getTokens(),
      applied: true,
    };
  };

  const handleInput = (event) => {
    const rowElem = event?.target?.closest?.(SHARED_SCHEMA_ROW_SELECTOR);
    const rowId = rowElem?.getAttribute?.('data-row-id');
    const fieldName = event?.target?.getAttribute?.('data-field');
    handleSharedSchemaRowInputChange({
      event,
      schemaRows: session.getRows(),
      schemaSession: session,
      renderSchemaRows: () => {
        revalidateRows();
        renderRows();
        syncTextFromRows();
      },
      updateAllPairsButtonVisibility: () => {
        revalidateRows();
        syncTextFromRows();
      },
    });
    if (rowId && (fieldName === 'name' || fieldName === 'command' || fieldName === 'params' || fieldName === 'value')) {
      const rowIndex = session.getRows().findIndex((row) => row.id === rowId);
      if (rowIndex >= 0) {
        session.updateRowAtIndex(rowIndex, (row) => ({
          ...row,
          semanticValidationIssues: [],
        }));
      }
      scheduleSemanticValidationForRow(rowId);
    }
  };

  const handleFocusOut = (event) => {
    const fieldName = event?.target?.getAttribute?.('data-field');
    if (fieldName !== 'name' && fieldName !== 'command' && fieldName !== 'params' && fieldName !== 'value') {
      return;
    }
    const rowElem = event?.target?.closest?.(SHARED_SCHEMA_ROW_SELECTOR);
    const rowId = rowElem?.getAttribute?.('data-row-id');
    if (!rowId) {
      return;
    }
    scheduleSemanticValidationForRow(rowId, { immediate: true });
  };

  const handleClick = async (event) => {
    const pickerButton = event?.target?.closest?.('[data-action="pick-command"]');
    if (pickerButton) {
      const rowId = pickerButton.getAttribute('data-row-id');
      const index = session.getRows().findIndex((entry) => entry.id === rowId);
      if (index >= 0) {
        const row = session.getRows()[index];
        try {
          const selected = await openMethodPickerModal({
            documentObj,
            windowObj: resolveWindowObj(null, documentObj),
            options: getMethodPickerOptions(row.command),
            currentCommand: row.command,
            initialTab: getPickerInitialTab(row.sourceType),
            title: 'Select schema method',
          });
          if (selected?.command) {
            session.updateRowAtIndex(index, (currentRow) =>
              applySchemaCommandSelection(currentRow, {
                sourceType: selected.sourceType || currentRow.sourceType,
                command:
                  selected.sourceType === SOURCE_TYPE_DOMAIN
                    ? normaliseDomainCommand(selected.command)
                    : normaliseFakerCommand(selected.command),
              })
            );
            revalidateRows();
            renderRows();
            syncTextFromRows();
            scheduleSemanticValidationForRow(rowId, { immediate: true });
          }
        } catch (error) {
          console.error('Failed opening schema method picker.', error);
          return;
        }
      }
      return;
    }

    const paramsButton = event?.target?.closest?.('[data-action="edit-params"]');
    if (paramsButton) {
      const rowId = paramsButton.getAttribute('data-row-id');
      const index = session.getRows().findIndex((entry) => entry.id === rowId);
      if (index >= 0) {
        const row = session.getRows()[index];
        try {
          const methodOption = getMethodOptionForRow(row);
          const paramsText = await openParamsEditorModal({
            documentObj,
            windowObj: resolveWindowObj(null, documentObj),
            commandLabel: methodOption?.helpModel?.heading || row.command,
            helpModel: methodOption?.helpModel || buildSchemaHelpModel(row.sourceType, row.command),
            initialParams: row.params,
            validateParams: (nextParamsText) => validateParamsForRow(row, nextParamsText),
          });
          if (paramsText !== null) {
            session.updateRowAtIndex(index, (currentRow) => ({
              ...currentRow,
              params: paramsText,
              semanticValidationIssues: [],
            }));
            revalidateRows();
            renderRows();
            syncTextFromRows();
            scheduleSemanticValidationForRow(rowId, { immediate: true });
          }
        } catch (error) {
          console.error('Failed opening params editor dialog.', error);
          return;
        }
      }
      return;
    }

    handleSharedSchemaRowButtonClick({
      event,
      schemaRows: session.getRows(),
      addRowAfter: (index) => {
        session.addRowAfterIndex(index);
        revalidateRows();
        renderRows();
        syncTextFromRows();
      },
      removeRow: (index) => {
        const rowId = session.getRows()[index]?.id;
        session.removeRowAtIndex(index);
        clearSemanticValidationTimer(rowId);
        revalidateRows();
        renderRows();
        syncTextFromRows();
      },
      moveRow: (index, direction) => {
        session.moveRowAtIndex(index, direction);
        revalidateRows();
        renderRows();
        syncTextFromRows();
      },
    });
  };

  const moveRowToIndex = (fromIndex, toIndex) => {
    session.moveRowToIndex(fromIndex, toIndex);
    revalidateRows();
    renderRows();
    syncTextFromRows();
  };

  const handleDragStart = (event) => {
    const dragHandle = event?.target?.closest?.('[data-action="drag"]');
    if (!dragHandle) {
      return;
    }
    const rowId = dragHandle.getAttribute('data-row-id');
    const rowIndex = session.getRows().findIndex((row) => row.id === rowId);
    if (rowIndex < 0) {
      return;
    }
    dragState = { rowId, rowIndex };
    event.dataTransfer?.setData?.('text/plain', rowId);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
    applySchemaRowDropInstructionIndicator({
      rootElement,
      draggedRowId: rowId,
      dropInstruction: null,
    });
  };

  const handleDragOver = (event) => {
    if (!dragState?.rowId) {
      return;
    }
    const dropInstruction = getSchemaRowDropInstruction({
      event,
      schemaRows: session.getRows(),
      draggedRowId: dragState.rowId,
    });
    if (!dropInstruction) {
      clearSchemaRowDragClasses({ rootElement });
      return;
    }
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    applySchemaRowDropInstructionIndicator({
      rootElement,
      draggedRowId: dragState.rowId,
      dropInstruction,
    });
  };

  const handleDrop = (event) => {
    if (!dragState?.rowId) {
      return;
    }
    const dropInstruction = getSchemaRowDropInstruction({
      event,
      schemaRows: session.getRows(),
      draggedRowId: dragState.rowId,
    });
    event.preventDefault();
    if (dropInstruction && dropInstruction.finalIndex !== dropInstruction.draggedIndex) {
      moveRowToIndex(dropInstruction.draggedIndex, dropInstruction.finalIndex);
    }
    clearDragState();
  };

  const handleDragEnd = () => {
    clearDragState();
  };

  const addRow = () => {
    session.addRowAfterIndex(session.getRows().length - 1);
    revalidateRows();
    renderRows();
    syncTextFromRows();
  };

  const addRowAfter = (index) => {
    session.addRowAfterIndex(index);
    revalidateRows();
    renderRows();
    syncTextFromRows();
  };

  const removeRowAt = (index) => {
    session.removeRowAtIndex(index);
    revalidateRows();
    renderRows();
    syncTextFromRows();
  };

  const moveRowAt = (index, direction) => {
    session.moveRowAtIndex(index, direction);
    revalidateRows();
    renderRows();
    syncTextFromRows();
  };

  const replaceRows = (rows) => {
    session.setRows(rows, { allowEmpty: Array.isArray(rows) && rows.length === 0 });
    session.setTokens([]);
    const validation = revalidateRows();
    renderRows();
    syncTextFromRows();
    updateModeView();
    return validation;
  };

  const init = () => {
    if (session.getRows().length === 0) {
      session.addRowAfterIndex(-1);
    }
    session.setTextMode(false);
    revalidateRows();
    renderRows();
    syncTextFromRows();
    updateModeView();
  };

  return {
    init,
    destroy: () => {
      clearAllSemanticValidationTimers();
      clearDragState();
    },
    handleInput,
    handleClick,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    toggleMode,
    insertSampleSchema,
    loadSchemaText,
    parseTextToRows: (schemaText) => session.parseTextToRows(schemaText),
    syncFromText,
    validateRows: () => revalidateRows(),
    handleFocusOut,
    syncTextFromRows,
    getSchemaText: () => getCurrentSchemaText(),
    syncConstraintsFromEditor,
    addRow,
    addRowAfter,
    removeRowAt,
    moveRowAt,
    render: () => renderRows(),
    setRows: (rows, options) => session.setRows(rows, options),
    replaceRows,
    setTokens: (tokens) => session.setTokens(tokens),
    getTokens: () => session.getTokens(),
    setTextMode: (isTextMode) => session.setTextMode(isTextMode),
    applySemanticValidationForRow,
    getState: () => ({ ...session.getState() }),
  };
}

export { createSharedSchemaEditorController };
