/*
 https://www.ag-grid.com/javascript-grid/component-header/

  for icons on header
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css"/>

 */

import { GridExtension } from './gridExtension-ag-grid.js';
import { GuardedColumnEdits } from '../shared/guarded-column-edits.js';
import { showGridError } from '../grid-error-surface.js';
import { shouldEnforceUniqueColumnNames } from '../gridControl.js';
import { resolveDocumentObj } from '../../shared/dom/default-objects.js';

function resolveAgGridHeaderDocument(agParams) {
  return (
    resolveDocumentObj(agParams?.documentObj, agParams?.eGridHeader || null) ||
    agParams?.api?.gridBodyCtrl?.eBodyViewport?.ownerDocument ||
    null
  );
}

class CustomHeaderAgGrid {
  init(agParams) {
    this.agParams = agParams;
    this.documentObj = resolveAgGridHeaderDocument(agParams);
    if (!this.documentObj?.createElement) {
      throw new Error('CustomHeaderAgGrid requires a document-backed grid host');
    }
    this.eGui = this.documentObj.createElement('div');
    this.eGui.classList.add('headerWrapper');
    this.eGui.innerHTML = `
               <div class="customHeaderTop">
                <div  data-ref="eFilterButton" class="customFilterMenuButton">
                    <i class="ag-icon ag-icon-filter"></i>
                </div>
                <div data-ref="eLabel" class="customHeaderLabel">${this.agParams.displayName}</div>
                <div class="customSort">
                  <span  data-ref="eSortDesc" class="customSortDownLabel inactive">
                      <i class="ag-icon ag-icon-desc"></i>
                  </span>
                  <span data-ref="eSortAsc" class="customSortUpLabel inactive">
                      <i class="ag-icon ag-icon-asc"></i>
                  </span>
                  <span data-ref="eSortNone" class="customSortRemoveLabel inactive">
                      <i class="ag-icon ag-icon-cancel"></i>
                  </span>
                </div>
              </div>
              <div class="headerbuttons">
                <span class="customHeaderAddLeftButton" title="add left">[<+]</span>
                <span class="customHeaderRenameButton" title="rename">[~]</span>
                <span class="customHeaderDeleteButton" title="delete">[x]</span>
                <span class="customHeaderDuplicateButton" title="duplicate">[+=]</span>
                <span class="customHeaderAddRightButton" title="add right">[+>]</span>
            </div>
          `;

    this.guardedColumnEdits = new GuardedColumnEdits(new GridExtension(this.agParams.api), {
      surfaceError: showGridError,
      shouldEnforceUniqueNames: () => shouldEnforceUniqueColumnNames(this.documentObj),
    });

    this.eMenuButton = this.eGui.querySelector('.customFilterMenuButton');
    this.eSortDownButton = this.eGui.querySelector('.customSortDownLabel');
    this.eSortUpButton = this.eGui.querySelector('.customSortUpLabel');
    this.eSortRemoveButton = this.eGui.querySelector('.customSortRemoveLabel');

    this.headerAddLeftButton = this.eGui.querySelector('.customHeaderAddLeftButton');
    this.onAddLeftButtonListener = this.onAddLeftButtonClick.bind(this);
    this.headerAddLeftButton.addEventListener('click', this.onAddLeftButtonListener);

    this.headerRenameButton = this.eGui.querySelector('.customHeaderRenameButton');
    this.onRenameButtonListener = this.onRenameButtonClick.bind(this);
    this.headerRenameButton.addEventListener('click', this.onRenameButtonListener);

    this.headerDeleteButton = this.eGui.querySelector('.customHeaderDeleteButton');
    this.onDeleteButtonListener = this.onDeleteButtonClick.bind(this);
    this.headerDeleteButton.addEventListener('click', this.onDeleteButtonListener);

    this.headerDuplicateButton = this.eGui.querySelector('.customHeaderDuplicateButton');
    this.onDuplicateButtonListener = this.onDuplicateButtonClick.bind(this);
    this.headerDuplicateButton.addEventListener('click', this.onDuplicateButtonListener);

    this.headerAddRightButton = this.eGui.querySelector('.customHeaderAddRightButton');
    this.onAddRightButtonListener = this.onAddRightButtonClick.bind(this);
    this.headerAddRightButton.addEventListener('click', this.onAddRightButtonListener);

    if (this.agParams.enableMenu) {
      this.onMenuClickListener = this.onMenuClick.bind(this);
      this.eMenuButton.addEventListener('click', this.onMenuClickListener);
    } else {
      this.eMenuButton.remove();
      //this.eGui.removeChild(this.eMenuButton);
    }

    if (this.agParams.enableSorting) {
      this.onSortAscRequestedListener = this.onSortRequested.bind(this, 'asc');
      this.eSortDownButton.addEventListener('click', this.onSortAscRequestedListener);
      this.onSortDescRequestedListener = this.onSortRequested.bind(this, 'desc');
      this.eSortUpButton.addEventListener('click', this.onSortDescRequestedListener);
      this.onRemoveSortListener = this.onSortRequested.bind(this, '');
      this.eSortRemoveButton.addEventListener('click', this.onRemoveSortListener);

      this.onSortChangedListener = this.onSortChanged.bind(this);
      this.agParams.column.addEventListener('sortChanged', this.onSortChangedListener);
      this.onSortChanged();

      this.onFilterChangedListener = this.onFilterChanged.bind(this);
      this.agParams.column.addEventListener('filterChanged', this.onFilterChangedListener);
      this.onFilterChanged();
    } else {
      this.eSortDownButton.remove();
      this.eSortUpButton.remove();
      this.eSortRemoveButton.remove();
      // this.eGui.removeChild(this.eSortDownButton);
      // this.eGui.removeChild(this.eSortUpButton);
      // this.eGui.removeChild(this.eSortRemoveButton);
    }
  }

  async onAddLeftButtonClick() {
    await this.guardedColumnEdits.addNeighbourColumnId(-1, this.agParams.column.colId);
  }

  async onRenameButtonClick() {
    await this.guardedColumnEdits.renameColId(this.agParams.column.colId);
  }

  async onDeleteButtonClick() {
    await this.guardedColumnEdits.deleteColId(this.agParams.column.colId);
  }

  async onDuplicateButtonClick() {
    await this.guardedColumnEdits.duplicateColumnId(1, this.agParams.column.colId);
  }

  async onAddRightButtonClick() {
    await this.guardedColumnEdits.addNeighbourColumnId(1, this.agParams.column.colId);
  }

  deactivateIcon(toDeactivateItems) {
    toDeactivateItems.forEach((toDeactivate) => {
      toDeactivate.classList.remove('active');
    });
  }

  activateIcon(toActivate) {
    toActivate.classList.add('active');
  }

  onFilterChanged() {
    if (this.agParams.column.isFilterActive()) {
      this.activateIcon(this.eMenuButton);
    } else {
      this.deactivateIcon([this.eMenuButton]);
    }
  }

  onSortChanged() {
    if (this.agParams.column.isSortAscending()) {
      this.deactivateIcon([this.eSortUpButton, this.eSortRemoveButton]);
      this.activateIcon(this.eSortDownButton);
    } else if (this.agParams.column.isSortDescending()) {
      this.deactivateIcon([this.eSortDownButton, this.eSortRemoveButton]);
      this.activateIcon(this.eSortUpButton);
    } else {
      this.deactivateIcon([this.eSortUpButton, this.eSortDownButton]);
      this.activateIcon(this.eSortRemoveButton);
    }
  }

  getGui() {
    return this.eGui;
  }

  onMenuClick() {
    this.agParams.showColumnMenu(this.eMenuButton);
  }

  onSortRequested(order, event) {
    this.agParams.setSort(order, event.shiftKey);
  }

  destroy() {
    if (this.onMenuClickListener) {
      this.eMenuButton.removeEventListener('click', this.onMenuClickListener);
    }
    this.eSortDownButton.removeEventListener('click', this.onSortRequestedListener);
    this.eSortUpButton.removeEventListener('click', this.onSortRequestedListener);
    this.eSortRemoveButton.removeEventListener('click', this.onSortRequestedListener);
    this.agParams.column.removeEventListener('sortChanged', this.onSortChangedListener);

    this.headerAddLeftButton.removeEventListener('click', this.onAddLeftButtonListener);
    this.headerRenameButton.removeEventListener('click', this.onRenameButtonListener);
    this.headerDeleteButton.removeEventListener('click', this.onDeleteButtonListener);
    this.headerDuplicateButton.removeEventListener('click', this.onDuplicateButtonListener);
    this.headerAddRightButton.removeEventListener('click', this.onAddRightButtonListener);
  }
}

export { CustomHeaderAgGrid };
