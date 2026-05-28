/*
 * Responsibilities:
 * - Encapsulates Ag Grid-specific setup for the test-data schema editor.
 * - Defines Ag Grid columns/editors and row-drag behavior.
 * - Exposes a normalized bridge API for row CRUD and ordered row reads.
 */

import { GridExtension as AgGridExtension } from '../../../data-grid-editor/ag-grid/gridExtension-ag-grid.js';
import { SelectFilterEditor } from '../../../data-grid-editor/ag-grid/select-filter-editor.js';
import { createAgGridDraftSync } from '../../../shared/test-data/grid-sync/index.js';

function setupAgGridSchemaGridEditor({
  tableDiv,
  agGridLib,
  getAgGridCommandEditorValues,
  getMethodPickerOptions,
  onSchemaChanged,
  onDraftCellEditChange,
}) {
  const schemaGridRowData = [];
  const { onCellEditingStarted, onCellEditingStopped } = createAgGridDraftSync({
    onDraftCellEditChange,
    onSchemaChanged,
  });

  const schemaGridColumnDefs = [
    { field: 'columnName' },
    {
      field: 'type',
      cellEditor: SelectFilterEditor,
      cellEditorParams: (params) => ({
        values: getAgGridCommandEditorValues(params?.value),
        getMethodPickerOptions,
      }),
    },
    { field: 'value' },
  ];

  const schemaGridOptions = {
    columnDefs: schemaGridColumnDefs,
    rowData: schemaGridRowData,
    defaultColDef: {
      wrapText: true,
      autoHeight: true,
      resizable: true,
      editable: true,
      rowDrag: true,
      sortable: false,
    },
    suppressMovableColumns: true,
    rowDragManaged: true,
    rowDragMultiRow: true,
    rowSelection: {
      mode: 'multiRow',
      checkboxes: false,
      headerCheckbox: false,
      enableClickSelection: true,
    },
    onCellEditingStarted,
    onCellEditingStopped,
    onRowDragEnd: () => {
      onSchemaChanged();
    },
  };

  tableDiv.classList.add('ag-theme-alpine');
  const schemaGridApi = agGridLib.createGrid(tableDiv, schemaGridOptions);
  const schemaGridExtras = new AgGridExtension(schemaGridApi);
  const schemaGridBridge = {
    clearRows: () => schemaGridApi.setGridOption('rowData', []),
    addRows: (rows) => {
      if (rows && rows.length > 0) {
        schemaGridApi.applyTransaction({ add: rows });
      }
    },
    getRows: () => {
      const rows = [];
      // Respect visual order (including drag reorder) when syncing to text schema.
      schemaGridApi.forEachNodeAfterFilterAndSort((rowNode) => rows.push(rowNode.data));
      return rows;
    },
  };

  return { schemaGridApi, schemaGridExtras, schemaGridBridge, schemaGridOptions };
}

export { setupAgGridSchemaGridEditor };
