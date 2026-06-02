import { createTextInputDialogService } from '../shared/dialog-services/index.js';
import { escapeHtml } from '../shared/html-escape.js';
import { createGridToolbarComponent } from './grid-toolbar/index.js';
import { showGridError } from './grid-error-surface.js';
import { GuardedColumnEdits } from './shared/guarded-column-edits.js';
import { createTabulatorGridAdapter } from './tabulator-grid-adapter.js';
import { GridExtension as TabulatorGridExtension } from './tabulator/gridExtension-tabulator.js';
import { shouldEnforceUniqueColumnNames } from './gridControl.js';
import { resolveDocumentObj, resolveWindowObj } from '../shared/dom/default-objects.js';
import { renderIconHtml } from '../shared/primitives/icon/index.js';

function createAppGridTabulatorOptions({ rootElement, textInputDialogService } = {}) {
  const customHeaderFormatter = function (cell) {
    const columnName = typeof cell.getValue === 'function' ? cell.getValue() : '';
    return `
      <div class="headerWrapper">
        <div class="customHeaderTop">
          <button type="button" class="customFilterMenuButton header-icon-button" data-action="filter" title="Filter column" aria-label="Filter column">
            ${renderIconHtml('filter', { className: 'app-icon header-action-icon' })}
          </button>
          <div class="customHeaderLabel">${escapeHtml(columnName)}</div>
          <div class="customSort">
            <button type="button" class="customSortDownLabel header-icon-button" data-action="sort-desc" title="Sort descending" aria-label="Sort descending">${renderIconHtml('arrow-down', { className: 'app-icon header-sort-icon' })}</button>
            <button type="button" class="customSortUpLabel header-icon-button" data-action="sort-asc" title="Sort ascending" aria-label="Sort ascending">${renderIconHtml('arrow-up', { className: 'app-icon header-sort-icon' })}</button>
            <button type="button" class="customSortRemoveLabel header-icon-button" data-action="sort-none" title="Clear sort" aria-label="Clear sort">${renderIconHtml('x', { className: 'app-icon header-sort-icon', size: 14 })}</button>
          </div>
        </div>
        <div class="headerbuttons">
          <button type="button" class="header-icon-button" data-action="add-left" title="Add column left" aria-label="Add column left">${renderIconHtml('add-column-left', { className: 'app-icon header-action-icon' })}</button>
          <button type="button" class="header-icon-button" data-action="rename" title="Rename column" aria-label="Rename column">${renderIconHtml('pencil', { className: 'app-icon header-action-icon' })}</button>
          <button type="button" class="header-icon-button" data-action="delete" title="Delete column" aria-label="Delete column">${renderIconHtml('trash', { className: 'app-icon header-action-icon' })}</button>
          <button type="button" class="header-icon-button" data-action="duplicate" title="Duplicate column" aria-label="Duplicate column">${renderIconHtml('copy', { className: 'app-icon header-action-icon' })}</button>
          <button type="button" class="header-icon-button" data-action="add-right" title="Add column right" aria-label="Add column right">${renderIconHtml('add-column-right', { className: 'app-icon header-action-icon' })}</button>
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

    const guardedColumnEdits = new GuardedColumnEdits(new TabulatorGridExtension(column.getTable()), {
      surfaceError: showGridError,
      shouldEnforceUniqueNames: () => shouldEnforceUniqueColumnNames(rootElement),
    });
    const columnId = column.getDefinition().colId || column.getDefinition().field;
    const fieldName = column.getField();
    const table = column.getTable();

    if (action === 'filter') {
      const existingFilter = column.getHeaderFilterValue?.() || '';
      const newFilter = await textInputDialogService.requestTextInput({
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

  return {
    columns: [
      {
        title: '~rename-me',
        field: 'column1',
        sorter: 'string',
      },
    ],
    data: [],
    columnDefaults: {
      resizable: true,
      rowHandle: true,
      editor: 'input',
      editorParams: { selectContents: true },
      headerFilter: 'input',
      headerFilterFunc: 'like',
      sorter: 'string',
      titleFormatter: customHeaderFormatter,
      headerClick: onCustomHeaderClick,
    },
    autoColumns: false,
    headerSort: true,
    headerSortClickElement: 'icon',
    movableColumns: true,
    movableRows: true,
    selectableRows: true,
    selectableRowsRangeMode: 'click',
  };
}

class DataGridComponentView {
  constructor({ root, controller, documentObj, services = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = resolveDocumentObj(documentObj, root);
    this.services = services;
    this.toolbar = null;
    this.gridAdapter = null;
    this.gridReadyPromise = Promise.resolve(null);
  }

  mount() {
    if (!this.root) {
      return;
    }

    this.root.innerHTML = this.template();
    this.createChildren();
    this.render();
  }

  template() {
    return `
      <section class="data-grid-editor">
        <div data-role="grid-toolbar-root"></div>
        <div id="grid-column-error" class="generator-schema-error-text" aria-live="polite" role="status"></div>
        <div id="myGrid" style="height: 500px; width:100%;" class="ag-theme-alpine" data-role="data-grid-root"></div>
      </section>
    `;
  }

  createChildren() {
    const toolbarRoot = this.root.querySelector('[data-role="grid-toolbar-root"]');
    const gridRoot = this.root.querySelector('[data-role="data-grid-root"]');
    const createGridToolbar = this.services.createGridToolbar || createGridToolbarComponent;
    const textInputDialogService = createTextInputDialogService({ documentObj: this.documentObj });
    const tabulatorOptions =
      this.services.tabulatorOptions ||
      createAppGridTabulatorOptions({
        rootElement: this.root,
        textInputDialogService,
      });

    this.toolbar = createGridToolbar({
      root: toolbarRoot,
      documentObj: this.documentObj,
      props: this.controller.getState(),
      callbacks: {
        onAddRow: () => this.controller.addRow(),
        onAddRowsAbove: () => this.controller.addRows(-1),
        onAddRowsBelow: () => this.controller.addRows(1),
        onDeleteSelectedRows: () => this.controller.deleteSelectedRows(),
        onClearFilters: () => this.controller.clearFilters(),
        onClearSort: () => this.controller.clearSort(),
        onClearTable: () => this.controller.clearTable(),
        onFilterTextChange: (filterText) => this.controller.setFilterText(filterText),
        onUniqueColumnNamesChange: (uniqueColumnNames) => this.controller.setUniqueColumnNames(uniqueColumnNames),
      },
    });

    this.gridAdapter = createTabulatorGridAdapter({
      rootElement: gridRoot,
      documentObj: this.documentObj,
      windowObj: resolveWindowObj(this.services.windowObj, this.documentObj),
      TabulatorCtor: this.services.TabulatorCtor || globalThis.Tabulator,
      GridExtensionClass: this.services.GridExtensionClass || TabulatorGridExtension,
      tabulatorOptions,
    });
    this.gridReadyPromise = this.gridAdapter.whenReady();
  }

  render() {
    this.toolbar?.update?.(this.controller.getState());
  }

  getGridAdapter() {
    return this.gridAdapter;
  }

  getGridExtras() {
    return this.gridAdapter?.getGridApi?.() || null;
  }

  getTableApi() {
    return this.gridAdapter?.getTableApi?.() || null;
  }

  whenGridReady() {
    return this.gridReadyPromise;
  }

  destroy() {
    this.toolbar?.destroy?.();
    this.toolbar = null;
    this.gridAdapter?.destroy?.();
    this.gridAdapter = null;
    this.root.replaceChildren();
  }
}

export { createAppGridTabulatorOptions, DataGridComponentView };
