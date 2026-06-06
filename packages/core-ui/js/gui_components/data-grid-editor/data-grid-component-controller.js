import { createConfirmDialogService } from '../shared/dialog-services/confirm-dialog-service.js';

function getDefaultDocumentObj() {
  return typeof document !== 'undefined' ? document : null;
}

class DataGridComponentController {
  constructor({ props = {}, services = {}, documentObj = getDefaultDocumentObj() } = {}) {
    this.documentObj = documentObj;
    this.services = services;
    const confirmDialogService = createConfirmDialogService({ documentObj: this.documentObj });
    this.requestConfirm =
      typeof services.requestConfirm === 'function' ? services.requestConfirm : confirmDialogService.requestConfirm;
    this.state = {
      filterText: props.filterText || '',
      uniqueColumnNames: props.uniqueColumnNames === true,
    };
  }

  updateProps(nextProps = {}) {
    if (Object.prototype.hasOwnProperty.call(nextProps, 'filterText')) {
      this.state.filterText = nextProps.filterText || '';
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'uniqueColumnNames')) {
      this.state.uniqueColumnNames = nextProps.uniqueColumnNames === true;
    }
  }

  getState() {
    return { ...this.state };
  }

  getGridExtras() {
    return this.services.getGridExtras?.() || null;
  }

  addRow() {
    this.getGridExtras()?.addRow?.();
  }

  addRows(position) {
    this.getGridExtras()?.addRowsRelativeToSelection?.(position);
  }

  async deleteSelectedRows() {
    const gridExtras = this.getGridExtras();
    if ((gridExtras?.getNumberOfSelectedRows?.() || 0) <= 0) {
      console.log('no rows selected');
      return;
    }

    const confirmed = await this.requestConfirm({
      title: 'Delete Rows',
      message: 'Are you Sure You Want to Delete Rows?',
    });
    if (confirmed) {
      gridExtras?.deleteSelectedRows?.();
    }
  }

  clearFilters() {
    this.state.filterText = '';
    this.getGridExtras()?.clearFilters?.();
  }

  clearSort() {
    this.getGridExtras()?.clearSort?.();
  }

  setFilterText(filterText) {
    this.state.filterText = filterText || '';
    this.getGridExtras()?.filterText?.(this.state.filterText);
  }

  async clearTable() {
    const confirmed = await this.requestConfirm({
      title: 'Reset Table',
      message: 'Are you sure you want to reset the table and all data?',
    });
    if (confirmed) {
      this.getGridExtras()?.clearGrid?.();
    }
  }

  setUniqueColumnNames(uniqueColumnNames) {
    this.state.uniqueColumnNames = uniqueColumnNames === true;
  }
}

export { DataGridComponentController };
