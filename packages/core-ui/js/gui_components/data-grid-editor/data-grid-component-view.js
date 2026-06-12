import { createTextInputDialogService } from '../shared/dialog-services/text-input-dialog-service.js';
import { escapeHtml } from '../shared/html-escape.js';
import { createGridToolbarComponent } from './grid-toolbar/index.js';
import { createGridRowVisibilitySummaryComponent } from './grid-row-visibility-summary/index.js';
import { showGridError } from './grid-error-surface.js';
import { GuardedColumnEdits } from './shared/guarded-column-edits.js';
import { renderColumnHeaderActionButtonsHtml } from './shared/column-header-action-buttons.js';
import { createTabulatorGridAdapter } from './tabulator-grid-adapter.js';
import { GridExtension as TabulatorGridExtension } from './tabulator/gridExtension-tabulator.js';
import { resolveDocumentObj, resolveWindowObj } from '../shared/dom/default-objects.js';
import { renderIconHtml } from '../shared/primitives/icon/icon-core.js';

function createAppGridTabulatorOptions({
  textInputDialogService,
  shouldEnforceUniqueNames = () => false,
  surfaceError = showGridError,
} = {}) {
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
          ${renderColumnHeaderActionButtonsHtml()}
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
      surfaceError,
      shouldEnforceUniqueNames,
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
    this.windowObj = resolveWindowObj(services.windowObj, this.documentObj);
    this.services = services;
    this.toolbar = null;
    this.gridAdapter = null;
    this.gridReadyPromise = Promise.resolve(null);
    this.textInputDialogService = null;
    this.unsubscribeGridChanged = null;
    this.gridRowVisibilitySummary = null;
    this.totalRowsFrame = null;
    this.contextMenuState = { open: false, x: 0, y: 0 };
    this.handleGridContextMenu = (event) => this.onGridContextMenu(event);
    this.handleRootClick = (event) => this.onRootClick(event);
    this.handleRootChange = (event) => this.onRootChange(event);
    this.handleDocumentPointerDown = (event) => this.onDocumentPointerDown(event);
    this.handleDocumentKeyDown = (event) => this.onDocumentKeyDown(event);
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
        <div
          id="grid-column-error"
          data-role="grid-error-status"
          class="shared-inline-error-status"
          aria-live="polite"
          role="status"
        ></div>
        <div id="myGrid" style="height: 500px; width:100%;" class="ag-theme-alpine" data-role="data-grid-root"></div>
        <div data-role="grid-row-visibility-summary-root"></div>
        <div
          class="data-grid-context-menu"
          data-role="data-grid-context-menu"
          hidden
        ></div>
      </section>
    `;
  }

  createChildren() {
    const toolbarRoot = this.root.querySelector('[data-role="grid-toolbar-root"]');
    const gridRoot = this.root.querySelector('[data-role="data-grid-root"]');
    const createGridToolbar = this.services.createGridToolbar || createGridToolbarComponent;
    this.textInputDialogService = createTextInputDialogService({ documentObj: this.documentObj });
    const showScopedGridError = (message) =>
      showGridError(message, {
        documentObj: this.documentObj,
        resolveElement: () => this.root?.querySelector?.('[data-role="grid-error-status"]'),
      });
    const tabulatorOptions =
      this.services.tabulatorOptions ||
      createAppGridTabulatorOptions({
        textInputDialogService: this.textInputDialogService,
        surfaceError: showScopedGridError,
        shouldEnforceUniqueNames: () => this.controller.getState().uniqueColumnNames === true,
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
    const gridRowVisibilitySummaryRoot = this.root.querySelector('[data-role="grid-row-visibility-summary-root"]');
    this.gridRowVisibilitySummary = createGridRowVisibilitySummaryComponent({
      root: gridRowVisibilitySummaryRoot,
      documentObj: this.documentObj,
      props: {
        totalRowCount: 0,
        visibleRowCount: 0,
        hasActiveFilters: false,
      },
    });

    this.gridAdapter = createTabulatorGridAdapter({
      rootElement: gridRoot,
      documentObj: this.documentObj,
      windowObj: this.windowObj,
      TabulatorCtor: this.services.TabulatorCtor || this.windowObj?.Tabulator || globalThis.Tabulator,
      GridExtensionClass: this.services.GridExtensionClass || TabulatorGridExtension,
      tabulatorOptions,
    });
    this.gridReadyPromise = this.gridAdapter.whenReady();
    this.gridReadyPromise.then(() => {
      const gridExtras = this.getGridExtras();
      this.unsubscribeGridChanged?.();
      this.unsubscribeGridChanged =
        typeof gridExtras?.onGridChanged === 'function'
          ? gridExtras.onGridChanged(() => this.scheduleSyncTotalRows())
          : null;
      this.scheduleSyncTotalRows();
    });
    gridRoot?.addEventListener('contextmenu', this.handleGridContextMenu);
    this.root.addEventListener('click', this.handleRootClick);
    this.root.addEventListener('change', this.handleRootChange);
    this.documentObj?.addEventListener?.('pointerdown', this.handleDocumentPointerDown);
    this.documentObj?.addEventListener?.('keydown', this.handleDocumentKeyDown);
  }

  render() {
    this.toolbar?.update?.(this.controller.getState());
    this.scheduleSyncTotalRows();
    if (this.contextMenuState.open) {
      this.renderContextMenu();
    }
  }

  scheduleSyncTotalRows() {
    if (this.totalRowsFrame !== null) {
      this.windowObj?.cancelAnimationFrame?.(this.totalRowsFrame);
      this.totalRowsFrame = null;
    }

    const requestAnimationFrameFn = this.windowObj?.requestAnimationFrame?.bind(this.windowObj);
    if (typeof requestAnimationFrameFn !== 'function') {
      this.syncTotalRows();
      return;
    }

    this.totalRowsFrame = requestAnimationFrameFn(() => {
      this.totalRowsFrame = null;
      this.syncTotalRows();
    });
  }

  syncTotalRows() {
    if (!this.gridRowVisibilitySummary) {
      return;
    }

    const visibilitySummary = this.getGridExtras()?.getRowVisibilitySummary?.() || null;
    const totalRows = visibilitySummary?.totalRowCount ?? this.getGridExtras()?.getTotalRowCount?.() ?? 0;
    const visibleRowCount = visibilitySummary?.visibleRowCount ?? this.getGridExtras()?.getVisibleRowCount?.() ?? 0;
    const hasActiveFilters = visibilitySummary?.hasActiveFilters === true;
    const normalizedTotalRows = Number.isFinite(totalRows) ? totalRows : 0;
    const normalizedVisibleRowCount = Number.isFinite(visibleRowCount) ? visibleRowCount : 0;

    this.gridRowVisibilitySummary.update({
      totalRowCount: normalizedTotalRows,
      visibleRowCount: normalizedVisibleRowCount,
      hasActiveFilters,
    });
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

  renderContextMenu() {
    const menuRoot = this.root.querySelector('[data-role="data-grid-context-menu"]');
    if (!menuRoot) {
      return;
    }

    const state = this.controller.getState();
    menuRoot.hidden = false;
    menuRoot.style.left = `${this.contextMenuState.x}px`;
    menuRoot.style.top = `${this.contextMenuState.y}px`;
    menuRoot.innerHTML = `
      <div class="data-grid-context-menu__section">
        <button type="button" data-context-action="add-row">Add Row</button>
        <button type="button" data-context-action="add-rows-above">Add Rows Above</button>
        <button type="button" data-context-action="add-rows-below">Add Rows Below</button>
        <button type="button" data-context-action="delete-selected-rows">Delete Selected Rows</button>
      </div>
      <div class="data-grid-context-menu__separator" role="separator"></div>
      <label class="data-grid-context-menu__checkbox">
        <input
          type="checkbox"
          data-context-action="unique-column-names"
          ${state.uniqueColumnNames ? 'checked' : ''}
        />
        Enforce Unique Column Names
      </label>
      <div class="data-grid-context-menu__separator" role="separator"></div>
      <div class="data-grid-context-menu__section">
        <button type="button" data-context-action="edit-filter">Filter...</button>
        <button type="button" data-context-action="clear-filters">Clear Filters</button>
        <button type="button" data-context-action="clear-sort">Clear Sort</button>
        <button type="button" data-context-action="reset-table">Reset Table</button>
        <button type="button" data-context-action="auto-fit-columns">Auto Fit Columns</button>
      </div>
    `;
  }

  openContextMenu(x, y) {
    this.contextMenuState = { open: true, x, y };
    this.renderContextMenu();
  }

  closeContextMenu() {
    this.contextMenuState = { ...this.contextMenuState, open: false };
    const menuRoot = this.root.querySelector('[data-role="data-grid-context-menu"]');
    if (!menuRoot) {
      return;
    }
    menuRoot.hidden = true;
    menuRoot.replaceChildren();
  }

  onGridContextMenu(event) {
    event.preventDefault();
    this.syncSelectionToContextTarget(event.target);
    this.openContextMenu(event.clientX, event.clientY);
  }

  syncSelectionToContextTarget(target) {
    const rowElement = target?.closest?.('.tabulator-row');
    if (!rowElement) {
      return;
    }

    const tableApi = this.getTableApi();
    const rowComponents = typeof tableApi?.getRows === 'function' ? tableApi.getRows() : [];
    const targetRow = rowComponents.find((rowComponent) => rowComponent?.getElement?.() === rowElement);
    if (!targetRow || rowElement.classList.contains('tabulator-selected')) {
      return;
    }

    if (typeof tableApi?.deselectRow === 'function') {
      tableApi.deselectRow();
    }
    targetRow.select?.();
  }

  async onRootClick(event) {
    const actionElement = event.target?.closest?.('[data-context-action]');
    if (!actionElement) {
      return;
    }

    const action = actionElement.getAttribute('data-context-action');
    if (!action || action === 'unique-column-names') {
      return;
    }

    this.closeContextMenu();

    if (action === 'add-row') {
      this.controller.addRow();
    } else if (action === 'add-rows-above') {
      this.controller.addRows(-1);
    } else if (action === 'add-rows-below') {
      this.controller.addRows(1);
    } else if (action === 'delete-selected-rows') {
      await this.controller.deleteSelectedRows();
    } else if (action === 'edit-filter') {
      const nextFilter = await this.textInputDialogService?.requestTextInput?.({
        title: 'Filter Grid',
        initialValue: this.controller.getState().filterText || '',
      });
      if (nextFilter !== null) {
        this.controller.setFilterText(nextFilter);
        this.render();
      }
    } else if (action === 'clear-filters') {
      this.controller.clearFilters();
      this.render();
    } else if (action === 'clear-sort') {
      this.controller.clearSort();
    } else if (action === 'reset-table') {
      await this.controller.clearTable();
    } else if (action === 'auto-fit-columns') {
      this.controller.sizeColumnsToFit();
    }
  }

  onRootChange(event) {
    const checkbox = event.target?.closest?.('[data-context-action="unique-column-names"]');
    if (!checkbox) {
      return;
    }
    this.controller.setUniqueColumnNames(checkbox.checked === true);
    this.toolbar?.update?.(this.controller.getState());
    this.closeContextMenu();
  }

  onDocumentPointerDown(event) {
    if (!this.contextMenuState.open) {
      return;
    }
    const menuRoot = this.root.querySelector('[data-role="data-grid-context-menu"]');
    if (menuRoot?.contains?.(event.target)) {
      return;
    }
    this.closeContextMenu();
  }

  onDocumentKeyDown(event) {
    if (event.key === 'Escape' && this.contextMenuState.open) {
      this.closeContextMenu();
    }
  }

  destroy() {
    this.root
      .querySelector('[data-role="data-grid-root"]')
      ?.removeEventListener('contextmenu', this.handleGridContextMenu);
    this.root.removeEventListener('click', this.handleRootClick);
    this.root.removeEventListener('change', this.handleRootChange);
    this.documentObj?.removeEventListener?.('pointerdown', this.handleDocumentPointerDown);
    this.documentObj?.removeEventListener?.('keydown', this.handleDocumentKeyDown);
    this.closeContextMenu();
    if (this.totalRowsFrame !== null) {
      this.windowObj?.cancelAnimationFrame?.(this.totalRowsFrame);
      this.totalRowsFrame = null;
    }
    this.unsubscribeGridChanged?.();
    this.unsubscribeGridChanged = null;
    this.gridRowVisibilitySummary?.destroy?.();
    this.gridRowVisibilitySummary = null;
    this.toolbar?.destroy?.();
    this.toolbar = null;
    this.gridAdapter?.destroy?.();
    this.gridAdapter = null;
    this.root.replaceChildren();
  }
}

export { createAppGridTabulatorOptions, DataGridComponentView };
