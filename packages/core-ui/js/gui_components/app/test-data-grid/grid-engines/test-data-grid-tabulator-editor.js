/*
 * Responsibilities:
 * - Encapsulates Tabulator-specific setup for the test-data schema editor.
 * - Manages in-flight cell draft tracking so schema text reflects uncommitted edits.
 * - Exposes a normalized bridge API for row CRUD and current row reads.
 */

import { GridExtension as TabulatorGridExtension } from '../../../data-grid-editor/tabulator/gridExtension-tabulator.js';
import { createTabulatorDraftSync } from '../../../shared/test-data/grid-sync/index.js';
import { openMethodPickerModal } from '../../../shared/test-data/ui/index.js';

function createTabulatorCommandSelectEditor({ getMethodPickerOptions, FAKER_SECTION_VALUE, DOMAIN_SECTION_VALUE }) {
  return function tabulatorCommandSelectEditor(cell, onRendered, success, cancel) {
    const editor = document.createElement('button');
    editor.type = 'button';
    editor.className = 'test-data-grid-command-picker-trigger';
    editor.textContent = String(cell.getValue() || 'Pick method');
    let completed = false;

    onRendered(() => {
      editor.focus();
    });

    const finishWithValue = (nextValue) => {
      if (completed) {
        return;
      }
      const selectedValue = String(nextValue ?? '').trim();
      if (selectedValue === FAKER_SECTION_VALUE || selectedValue === DOMAIN_SECTION_VALUE) {
        completed = true;
        cancel();
        return;
      }
      completed = true;
      success(selectedValue);
    };

    editor.addEventListener('click', async () => {
      try {
        const selected = await openMethodPickerModal({
          documentObj: document,
          windowObj: globalThis.window,
          options: getMethodPickerOptions(cell.getValue()),
          currentCommand: String(cell.getValue() ?? '').trim(),
          title: 'Select schema method',
        });
        if (!selected?.command) {
          completed = true;
          cancel();
          return;
        }
        finishWithValue(selected.command);
      } catch {
        if (!completed) {
          completed = true;
          cancel();
        }
      }
    });

    return editor;
  };
}

function setupTabulatorSchemaGridEditor({
  tableDiv,
  TabulatorCtor,
  getMethodPickerOptions,
  FAKER_SECTION_VALUE,
  DOMAIN_SECTION_VALUE,
  onSchemaChanged,
  onDraftCellEditChange,
}) {
  const tabulatorCommandSelectEditor = createTabulatorCommandSelectEditor({
    getMethodPickerOptions,
    FAKER_SECTION_VALUE,
    DOMAIN_SECTION_VALUE,
  });

  const { beginDraftTracking, clearDraftTracking } = createTabulatorDraftSync({
    onDraftCellEditChange,
    onSchemaChanged,
  });

  const schemaGridApi = new TabulatorCtor(tableDiv, {
    data: [],
    layout: 'fitColumns',
    columns: [
      { title: 'columnName', field: 'columnName', editor: 'input', headerSort: false, widthGrow: 1 },
      {
        title: 'type',
        field: 'type',
        editor: tabulatorCommandSelectEditor,
        headerSort: false,
        widthGrow: 1,
      },
      { title: 'value', field: 'value', editor: 'input', headerSort: false, widthGrow: 2 },
    ],
    selectableRows: true,
    selectableRowsRangeMode: 'click',
    movableRows: true,
    columnDefaults: { resizable: true },
    cellEditing: (cell) => {
      beginDraftTracking(cell);
    },
    cellEdited: (cell) => {
      const field = cell?.getField?.() || cell?.getColumn?.()?.getDefinition?.()?.field;
      if (field === 'type') {
        const selectedValue = String(cell?.getValue?.() ?? '').trim();
        if (selectedValue === FAKER_SECTION_VALUE) {
          const previousValue = cell?.getOldValue?.();
          cell?.setValue?.(previousValue || '', true);
        }
      }
      onSchemaChanged();
    },
    rowMoved: () => {
      onSchemaChanged();
    },
  });

  tableDiv.addEventListener('focusout', () => {
    setTimeout(() => {
      clearDraftTracking();
      onSchemaChanged();
    }, 0);
  });

  tableDiv.addEventListener('change', () => {
    setTimeout(() => {
      clearDraftTracking();
      onSchemaChanged();
    }, 0);
  });

  const schemaGridExtras = new TabulatorGridExtension(schemaGridApi);
  const schemaGridBridge = {
    clearRows: () => schemaGridApi.setData([]),
    addRows: (rows) => {
      if (rows && rows.length > 0) {
        schemaGridApi.addData(rows);
      }
    },
    getRows: () => schemaGridApi.getData(),
  };

  return { schemaGridApi, schemaGridExtras, schemaGridBridge };
}

export { setupTabulatorSchemaGridEditor };
