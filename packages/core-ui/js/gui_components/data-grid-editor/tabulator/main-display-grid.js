import { GridExtension } from './gridExtension-tabulator.js';
import { GridControl, GridControlsPageMap, shouldEnforceUniqueColumnNames } from '../gridControl.js';
import { GuardedColumnEdits } from '../../../grid/guarded-column-edits.js';
import { showGridError } from '../grid-error-surface.js';
import { showTextInputModal } from '../../shared/modal-text-input.js';

/*
    Grid Features Used:
    - custom column header to add buttons for add new etc.
    - in cell editing
    - user row moving - drag drop
    - user column dragging - left right
    - column sorting
    - table filtering
    - row select (for deleting row, and adding above below)
*/

class ExtendedDataGrid {
  constructor() {
    var rowData = [];

    var columnDefs = [
      {
        title: '~rename-me',
        field: 'column1',
        sorter: 'string',
      },
    ];

    const escapeHtml = function (value) {
      return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');
    };

    const customHeaderFormatter = function (cell) {
      const columnName = typeof cell.getValue === 'function' ? cell.getValue() : '';
      return `
                <div class="headerWrapper">
                    <div class="customHeaderTop">
                        <div class="customFilterMenuButton" data-action="filter" title="Filter Column">
                            <i class="ag-icon ag-icon-filter"></i>
                        </div>
                        <div class="customHeaderLabel">${escapeHtml(columnName)}</div>
                        <div class="customSort">
                            <span class="customSortDownLabel" data-action="sort-desc" title="Sort Desc">
                                ↓
                            </span>
                            <span class="customSortUpLabel" data-action="sort-asc" title="Sort Asc">
                                ↑
                            </span>
                            <span class="customSortRemoveLabel" data-action="sort-none" title="Clear Sort">
                                ×
                            </span>
                        </div>
                    </div>
                    <div class="headerbuttons">
                        <span data-action="add-left" title="add left">[<+]</span>
                        <span data-action="rename" title="rename">[~]</span>
                        <span data-action="delete" title="delete">[x]</span>
                        <span data-action="duplicate" title="duplicate">[+=]</span>
                        <span data-action="add-right" title="add right">[+>]</span>
                    </div>
                </div>
            `;
    };

    const onCustomHeaderClick = async function (e, column) {
      const targetElement = e?.target && typeof e.target.closest === 'function' ? e.target : null;
      const actionElement = targetElement?.closest?.('[data-action]');
      const action = actionElement?.dataset?.action;
      if (!action) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const guardedColumnEdits = new GuardedColumnEdits(new GridExtension(column.getTable()), {
        surfaceError: showGridError,
        shouldEnforceUniqueNames: () => shouldEnforceUniqueColumnNames(document),
      });
      const columnId = column.getDefinition().colId || column.getDefinition().field;
      const fieldName = column.getField();
      const table = column.getTable();

      if (action === 'filter') {
        const existingFilter = column.getHeaderFilterValue?.() || '';
        const newFilter = await showTextInputModal({
          title: 'Filter Column',
          initialValue: existingFilter,
        });
        if (newFilter !== null) {
          column.setHeaderFilterValue?.(newFilter);
        }
        return;
      }

      if (action === 'sort-asc') {
        table.setSort(fieldName, 'asc');
        return;
      }

      if (action === 'sort-desc') {
        table.setSort(fieldName, 'desc');
        return;
      }

      if (action === 'sort-none') {
        table.clearSort();
        return;
      }

      if (action === 'add-left') {
        await guardedColumnEdits.addNeighbourColumnId(-1, columnId);
        return;
      }
      if (action === 'rename') {
        await guardedColumnEdits.renameColId(columnId);
        return;
      }
      if (action === 'delete') {
        await guardedColumnEdits.deleteColId(columnId);
        return;
      }
      if (action === 'duplicate') {
        await guardedColumnEdits.duplicateColumnId(1, columnId);
        return;
      }
      if (action === 'add-right') {
        await guardedColumnEdits.addNeighbourColumnId(1, columnId);
      }
    };

    this.gridOptions = {
      columns: columnDefs,
      data: rowData,

      columnDefaults: {
        //wrapText: true,
        //autoHeight: true,
        resizable: true,
        rowHandle: true,
        //editable: true,
        editor: 'input',
        editorParams: { selectContents: true },
        headerFilter: 'input',
        headerFilterFunc: 'like',
        sorter: 'string',
        titleFormatter: customHeaderFormatter,
        headerClick: onCustomHeaderClick,
      },

      // Keep parity with AG Grid: headers come from our grid extension abstraction,
      // not from inferred object keys during setData/import.
      autoColumns: false,
      headerSort: true,
      // Prevent accidental table re-order when clicking non-sort controls in custom headers.
      headerSortClickElement: 'icon',

      movableColumns: true,

      movableRows: true,
      // rowDragManaged: true,
      // rowDragMultiRow: true,

      // make rows selectable when clicked,
      // with multi-row selection where click first then click last with shift
      selectableRows: true,
      selectableRowsRangeMode: 'click',
      // rowSelection: {
      //     mode: 'multiRow',
      //     checkboxes: false,
      //     headerCheckbox: false,
      //     enableClickSelection: true,
      // },
      //onColumnResized: (params) => {params.api.resetRowHeights();}
    };
  }

  createChildGrid(parentGridDiv) {
    let gridControls = new GridControl(new GridControlsPageMap());
    gridControls.addGuiIn(parentGridDiv);

    //let gridDiv = document.querySelector('#myGrid');

    this.gridApi = new Tabulator('#myGrid', this.gridOptions);

    this.gridExtras = new GridExtension(this.gridApi);

    // this.gridApi = agGrid.createGrid(gridDiv, this.gridOptions);

    // having setup the grid, make it a little more responsive - removed when adding tippy as it need doctype html
    // TODO: add some resizing div controls
    //setTimeout(function(gridDiv){gridDiv.style.height="40%";},1000, gridDiv);

    gridControls.useThisGridFunctionality(this.gridExtras);
    gridControls.addHooksToPage(document);
  }

  sizeColumnsToFit() {
    //this.gridApi.sizeColumnsToFit();
  }

  getGridExtras() {
    return this.gridExtras;
  }
}

export { ExtendedDataGrid };
