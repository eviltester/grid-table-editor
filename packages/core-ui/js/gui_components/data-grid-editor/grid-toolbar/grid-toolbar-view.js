class GridToolbarView {
  constructor({ root, controller, documentObj = document } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = documentObj;
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
        <button id="addRowButton">Add Row</button>
        <button id="addRowsAboveButton">Add Rows Above</button>
        <button id="addRowsBelowButton">Add Rows Below</button>
        <button id="deleteSelectedRowsButton">Delete Selected Rows</button>
        <label>Filter: <input type="text" id="filter-text-box" placeholder="Filter..."></label>
        <button id="clearFiltersButton" title="Clear Filters">Clear Filters</button>
        <button id="clearSortButton" title="Clear Sort">Clear Sort</button>
        <button id="clearTableButton" title="Clear All Data">Reset Table</button>
        <label><input type="checkbox" id="uniqueColumnNamesCheckbox"> Unique Column Names</label>
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

    if (target.closest('#addRowButton')) {
      this.controller.triggerAddRow();
      return;
    }
    if (target.closest('#addRowsAboveButton')) {
      this.controller.triggerAddRowsAbove();
      return;
    }
    if (target.closest('#addRowsBelowButton')) {
      this.controller.triggerAddRowsBelow();
      return;
    }
    if (target.closest('#deleteSelectedRowsButton')) {
      this.controller.triggerDeleteSelectedRows();
      return;
    }
    if (target.closest('#clearFiltersButton')) {
      this.controller.triggerClearFilters();
      this.render();
      return;
    }
    if (target.closest('#clearSortButton')) {
      this.controller.triggerClearSort();
      return;
    }
    if (target.closest('#clearTableButton')) {
      this.controller.triggerClearTable();
    }
  }

  onInput(event) {
    const input = event.target?.closest?.('#filter-text-box');
    if (!input) {
      return;
    }
    this.controller.setFilterText(input.value);
  }

  onChange(event) {
    const checkbox = event.target?.closest?.('#uniqueColumnNamesCheckbox');
    if (!checkbox) {
      return;
    }
    this.controller.setUniqueColumnNames(checkbox.checked === true);
  }

  render() {
    const state = this.controller.getState();
    const filterInput = this.root.querySelector('#filter-text-box');
    if (filterInput && filterInput.value !== state.filterText) {
      filterInput.value = state.filterText;
    }

    const checkbox = this.root.querySelector('#uniqueColumnNamesCheckbox');
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
}

export { GridToolbarView };
