import { resolveDocumentObj } from '../../shared/dom/default-objects.js';

class GridToolbarView {
  constructor({ root, controller, documentObj } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = resolveDocumentObj(documentObj, root);
    this.handleClick = (event) => this.onClick(event);
    this.handleInput = (event) => this.onInput(event);
    this.handleChange = (event) => this.onChange(event);
  }

  mount() {
    if (!this.root) {
      return;
    }

    this.root.innerHTML = this.template();
    this.bindEvents();
    this.render();
  }

  template() {
    return `
      <div class="toolbar">
        <button id="addRowButton" data-role="add-row-button">Add Row</button>
        <button id="addRowsAboveButton" data-role="add-rows-above-button">Add Rows Above</button>
        <button id="addRowsBelowButton" data-role="add-rows-below-button">Add Rows Below</button>
        <button id="deleteSelectedRowsButton" data-role="delete-selected-rows-button">Delete Selected Rows</button>
        <label data-role="filter-label">
          Filter:
          <input type="text" id="filter-text-box" data-role="filter-text-input" placeholder="Filter...">
        </label>
        <button id="clearFiltersButton" data-role="clear-filters-button" title="Clear Filters">Clear Filters</button>
        <button id="clearSortButton" data-role="clear-sort-button" title="Clear Sort">Clear Sort</button>
        <button id="clearTableButton" data-role="clear-table-button" title="Clear All Data">Reset Table</button>
        <label data-role="unique-column-names-label">
          <input type="checkbox" id="uniqueColumnNamesCheckbox" data-role="unique-column-names-checkbox"> Unique Column Names
        </label>
      </div>
    `;
  }

  bindEvents() {
    this.root.addEventListener('click', this.handleClick);
    this.root.addEventListener('input', this.handleInput);
    this.root.addEventListener('change', this.handleChange);
  }

  onClick(event) {
    const target = event.target;
    if (!(target instanceof this.documentObj.defaultView.HTMLElement)) {
      return;
    }

    if (target.closest('[data-role="add-row-button"]')) {
      this.controller.triggerAddRow();
      return;
    }
    if (target.closest('[data-role="add-rows-above-button"]')) {
      this.controller.triggerAddRowsAbove();
      return;
    }
    if (target.closest('[data-role="add-rows-below-button"]')) {
      this.controller.triggerAddRowsBelow();
      return;
    }
    if (target.closest('[data-role="delete-selected-rows-button"]')) {
      this.controller.triggerDeleteSelectedRows();
      return;
    }
    if (target.closest('[data-role="clear-filters-button"]')) {
      this.controller.triggerClearFilters();
      this.render();
      return;
    }
    if (target.closest('[data-role="clear-sort-button"]')) {
      this.controller.triggerClearSort();
      return;
    }
    if (target.closest('[data-role="clear-table-button"]')) {
      this.controller.triggerClearTable();
    }
  }

  onInput(event) {
    const input = event.target?.closest?.('[data-role="filter-text-input"]');
    if (!input) {
      return;
    }
    this.controller.setFilterText(input.value);
  }

  onChange(event) {
    const checkbox = event.target?.closest?.('[data-role="unique-column-names-checkbox"]');
    if (!checkbox) {
      return;
    }
    this.controller.setUniqueColumnNames(checkbox.checked === true);
  }

  render() {
    const state = this.controller.getState();
    const filterInput = this.getElement('filter-text-input');
    if (filterInput && filterInput.value !== state.filterText) {
      filterInput.value = state.filterText;
    }

    const checkbox = this.getElement('unique-column-names-checkbox');
    if (checkbox) {
      checkbox.checked = state.uniqueColumnNames === true;
    }
  }

  destroy() {
    this.root.removeEventListener('click', this.handleClick);
    this.root.removeEventListener('input', this.handleInput);
    this.root.removeEventListener('change', this.handleChange);
    this.root.replaceChildren();
  }

  getElement(role) {
    return this.root.querySelector(`[data-role="${role}"]`);
  }
}

export { GridToolbarView };
