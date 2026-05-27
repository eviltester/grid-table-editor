import { openMethodPickerModal } from '../ui/index.js';
import { buildSchemaHelpModel, renderSchemaHelpHtml } from '../help/index.js';
import {
  SOURCE_TYPE_DOMAIN,
  SOURCE_TYPE_ENUM,
  SOURCE_TYPE_FAKER,
  SOURCE_TYPE_LITERAL,
  SOURCE_TYPE_REGEX,
  normaliseDomainCommand,
  normaliseFakerCommand,
  buildDataRuleFromSchemaRow,
} from '../../schema-row-rule-mapper.js';
import { createSchemaEditingSession, parseSchemaTextToRows } from './schema-controller.js';
import { schemaRowsToSpecWithTokens } from './schema-editor-core.js';
import { schemaErrorsToText } from './schema-error-text.js';
import {
  renderGeneratorSchemaRows,
  handleGeneratorRowInputChange,
  handleGeneratorRowButtonClick,
  hideVisibleHelpTooltips,
} from '../../../generator/schema/data-generator-schema-ui.js';

function createSchemaDomAdapter(documentObj, idMap = {}) {
  return {
    createElement: (...args) => documentObj.createElement(...args),
    querySelector: (...args) => documentObj.querySelector(...args),
    defaultView: documentObj.defaultView,
    getElementById: (id) => documentObj.getElementById(idMap[id] || id),
  };
}

function createSharedSchemaEditorController({
  documentObj = document,
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
  updatePairwiseButtonVisibility = () => {},
  idMap = {},
  modeHelpIconId,
}) {
  const session = createSchemaEditingSession({
    createBlankSchemaRow: createBlankRow,
    schemaTextToDataRules,
    faker,
    RandExp,
    schemaRowsToSpecWithTokens: (rows, tokens) =>
      schemaRowsToSpecWithTokens({
        schemaRows: rows,
        schemaTokens: tokens,
        buildDataRuleFromSchemaRow,
        dataRulesToSchemaText,
      }),
  });

  const getElement = (id) => documentObj.getElementById(idMap[id] || id);
  const getRowsElement = () => getElement('generatorSchemaRows');
  const getTextElement = () => getElement('generatorSchemaText');
  const getTextContainerElement = () => getElement('generatorSchemaTextContainer');
  const getAddButtonElement = () => getElement('addSchemaRowButton');
  const getToggleButtonElement = () => getElement('schemaModeToggleButton');
  const getModeHelpIconElement = () => getElement(modeHelpIconId || 'schemaModeHelpIcon');

  const refreshHelpHints = () => {
    const windowObj = documentObj?.defaultView || globalThis.window;
    if (typeof windowObj?.updateHelpHints === 'function') {
      windowObj.updateHelpHints();
    }
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

  const getSchemaHelpData = (sourceType, commandValue) => {
    const model = buildSchemaHelpModel(sourceType, commandValue);
    return {
      show: model.show === true,
      title: model.title || '',
      docsUrl: model.docsUrl || '#',
      html: renderSchemaHelpHtml(model),
    };
  };

  const serialiseRowsToText = () => {
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
        schemaTokens: session.getTokens(),
        buildDataRuleFromSchemaRow,
        dataRulesToSchemaText,
      }) || ''
    );
  };

  const syncTextFromRows = () => {
    const textElement = getTextElement();
    if (textElement) {
      textElement.value = serialiseRowsToText();
    }
    updatePairwiseButtonVisibility();
    onRowsChanged?.(session.getRows());
  };

  const renderRows = () => {
    renderGeneratorSchemaRows({
      documentObj: createSchemaDomAdapter(documentObj, idMap),
      schemaRows: session.getRows(),
      fakerCommands,
      getVisibleDomainCommands,
      getSchemaHelpData,
      updateAllPairsButtonVisibility: () => {},
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
    }
    updateModeHelp();
  };

  const getPickerInitialTab = (sourceType) => {
    const type = String(sourceType || '').toLowerCase();
    if (type === SOURCE_TYPE_FAKER) return 'faker';
    if (type === SOURCE_TYPE_ENUM || type === SOURCE_TYPE_LITERAL || type === SOURCE_TYPE_REGEX) return 'core';
    return 'all';
  };

  const syncFromText = ({ showErrors = false, force = false } = {}) => {
    if (!force && !session.getTextMode()) {
      return { rows: session.getRows(), errors: [], tokens: session.getTokens() };
    }
    const textArea = getTextElement();
    const parsed = parseSchemaTextToRows({
      schemaTextToDataRules,
      schemaText: textArea?.value || '',
      faker,
      RandExp,
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
    session.setRows(parsed.rows || []);
    session.setTokens(parsed.tokens || []);
    renderRows();
    updatePairwiseButtonVisibility();
    onRowsChanged?.(session.getRows());
    return { rows: session.getRows(), errors: [], tokens: session.getTokens() };
  };

  const toggleMode = () => {
    hideVisibleHelpTooltips({ documentObj: createSchemaDomAdapter(documentObj, idMap) });
    if (session.getTextMode()) {
      const parsed = syncFromText({ showErrors: true });
      if (parsed?.errors?.length > 0) {
        return parsed;
      }
      session.setTextMode(false);
      updateModeView();
      renderRows();
      return { rows: session.getRows(), errors: [], tokens: session.getTokens() };
    }
    syncTextFromRows();
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
      renderRows();
    }
  };

  const handleInput = (event) => {
    handleGeneratorRowInputChange({
      event,
      schemaRows: session.getRows(),
      schemaSession: session,
      renderSchemaRows: () => {
        renderRows();
        syncTextFromRows();
      },
      updateAllPairsButtonVisibility: () => {
        syncTextFromRows();
      },
    });
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
            windowObj: documentObj?.defaultView || globalThis.window,
            options: getMethodPickerOptions(row.command),
            currentCommand: row.command,
            initialTab: getPickerInitialTab(row.sourceType),
            title: 'Select schema method',
          });
          if (selected?.command) {
            session.updateRowAtIndex(index, (currentRow) => ({
              ...currentRow,
              sourceType: selected.sourceType || currentRow.sourceType,
              command:
                selected.sourceType === SOURCE_TYPE_DOMAIN
                  ? normaliseDomainCommand(selected.command)
                  : normaliseFakerCommand(selected.command),
            }));
            renderRows();
            syncTextFromRows();
          }
        } catch {
          return;
        }
      }
      return;
    }

    handleGeneratorRowButtonClick({
      event,
      schemaRows: session.getRows(),
      addRowAfter: (index) => {
        session.addRowAfterIndex(index);
        renderRows();
        syncTextFromRows();
      },
      removeRow: (index) => {
        session.removeRowAtIndex(index);
        renderRows();
        syncTextFromRows();
      },
      moveRow: (index, direction) => {
        session.moveRowAtIndex(index, direction);
        renderRows();
        syncTextFromRows();
      },
    });
  };

  const addRow = () => {
    session.addRowAfterIndex(session.getRows().length - 1);
    renderRows();
    syncTextFromRows();
  };

  const addRowAfter = (index) => {
    session.addRowAfterIndex(index);
    renderRows();
    syncTextFromRows();
  };

  const removeRowAt = (index) => {
    session.removeRowAtIndex(index);
    renderRows();
    syncTextFromRows();
  };

  const moveRowAt = (index, direction) => {
    session.moveRowAtIndex(index, direction);
    renderRows();
    syncTextFromRows();
  };

  const init = () => {
    if (session.getRows().length === 0) {
      session.addRowAfterIndex(-1);
    }
    session.setTextMode(false);
    renderRows();
    syncTextFromRows();
    updateModeView();
  };

  return {
    init,
    handleInput,
    handleClick,
    toggleMode,
    insertSampleSchema,
    syncFromText,
    syncTextFromRows,
    addRow,
    addRowAfter,
    removeRowAt,
    moveRowAt,
    render: () => renderRows(),
    setRows: (rows) => session.setRows(rows),
    setTokens: (tokens) => session.setTokens(tokens),
    getTokens: () => session.getTokens(),
    setTextMode: (isTextMode) => session.setTextMode(isTextMode),
    getState: () => ({ ...session.getState() }),
  };
}

export { createSharedSchemaEditorController };
