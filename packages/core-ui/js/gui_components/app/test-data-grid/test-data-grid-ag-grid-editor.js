/*
 * Responsibilities:
 * - Encapsulates Ag Grid-specific setup for the test-data definition editor.
 * - Defines Ag Grid columns/editors and row-drag behavior.
 * - Exposes a normalized bridge API for row CRUD and ordered row reads.
 */

import { GridExtension as AgGridExtension } from '../../data-grid-editor/ag-grid/gridExtension-ag-grid.js';
import { SelectFilterEditor } from '../../data-grid-editor/ag-grid/select-filter-editor.js';

function setupAgGridDefnEditor({ tableDiv, agGridLib, getAgGridTypeEditorValues, onSchemaChanged }) {
  const defnRowData = [];
  const defnColumnDefs = [
    { field: 'columnName' },
    {
      field: 'type',
      cellEditor: SelectFilterEditor,
      cellEditorParams: (params) => ({ values: getAgGridTypeEditorValues(params?.value) }),
    },
    { field: 'value' },
  ];

  const defnGridOptions = {
    columnDefs: defnColumnDefs,
    rowData: defnRowData,
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
    onCellEditingStopped: () => {
      onSchemaChanged();
    },
    onRowDragEnd: () => {
      onSchemaChanged();
    },
  };

  tableDiv.classList.add('ag-theme-alpine');
  const defnGridApi = agGridLib.createGrid(tableDiv, defnGridOptions);
  const defnGridExtras = new AgGridExtension(defnGridApi);
  const defnGridBridge = {
    clearRows: () => defnGridApi.setGridOption('rowData', []),
    addRows: (rows) => {
      if (rows && rows.length > 0) {
        defnGridApi.applyTransaction({ add: rows });
      }
    },
    getRows: () => {
      const rows = [];
      // Respect visual order (including drag reorder) when syncing to text schema.
      defnGridApi.forEachNodeAfterFilterAndSort((rowNode) => rows.push({ ...rowNode.data }));
      return rows;
    },
  };

  return { defnGridApi, defnGridExtras, defnGridBridge, defnGridOptions };
}

export { setupAgGridDefnEditor };
