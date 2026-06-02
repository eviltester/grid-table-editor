class GridToolbarController {
  constructor({ props = {}, callbacks = {} } = {}) {
    this.callbacks = callbacks;
    this.state = {
      filterText: props.filterText || '',
      uniqueColumnNames: props.uniqueColumnNames === true,
    };
  }

  getState() {
    return { ...this.state };
  }

  updateProps(nextProps = {}) {
    if (Object.prototype.hasOwnProperty.call(nextProps, 'filterText')) {
      this.state.filterText = nextProps.filterText || '';
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'uniqueColumnNames')) {
      this.state.uniqueColumnNames = nextProps.uniqueColumnNames === true;
    }
  }

  triggerAddRow() {
    this.callbacks.onAddRow?.();
  }

  triggerAddRowsAbove() {
    this.callbacks.onAddRowsAbove?.();
  }

  triggerAddRowsBelow() {
    this.callbacks.onAddRowsBelow?.();
  }

  triggerDeleteSelectedRows() {
    this.callbacks.onDeleteSelectedRows?.();
  }

  triggerClearFilters() {
    this.state.filterText = '';
    this.callbacks.onClearFilters?.();
  }

  triggerClearSort() {
    this.callbacks.onClearSort?.();
  }

  triggerClearTable() {
    this.callbacks.onClearTable?.();
  }

  setFilterText(filterText) {
    this.state.filterText = filterText || '';
    this.callbacks.onFilterTextChange?.(this.state.filterText);
  }

  setUniqueColumnNames(uniqueColumnNames) {
    this.state.uniqueColumnNames = uniqueColumnNames === true;
    this.callbacks.onUniqueColumnNamesChange?.(this.state.uniqueColumnNames);
  }
}

export { GridToolbarController };
