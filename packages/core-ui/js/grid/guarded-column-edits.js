import { showTextInputModal } from '../gui_components/modal-text-input.js';
import { showConfirmModal } from '../gui_components/modal-confirm.js';

class GuardedColumnEdits {
  constructor(gridExtension, { surfaceError, requestTextInput, requestConfirm, shouldEnforceUniqueNames } = {}) {
    this.gridExtras = gridExtension;
    this.surfaceError = typeof surfaceError === 'function' ? surfaceError : null;
    this.requestTextInput =
      typeof requestTextInput === 'function' ? requestTextInput : (options) => showTextInputModal(options);
    this.requestConfirm =
      typeof requestConfirm === 'function' ? requestConfirm : (options) => showConfirmModal(options);
    this.shouldEnforceUniqueNames =
      typeof shouldEnforceUniqueNames === 'function' ? shouldEnforceUniqueNames : () => true;
  }

  // todo: ids here look suspiciously ag-grid specific

  showError(message) {
    if (this.surfaceError) {
      this.surfaceError(message);
      return;
    }
    console.error(message);
  }

  async renameColId(id) {
    var editColDef = this.gridExtras.getColumnDef(id);
    const currentName = String(editColDef?.headerName ?? '');
    const colTitle = await this.requestTextInput({
      title: 'Column Name',
      initialValue: editColDef.headerName,
    });

    if (colTitle != null && colTitle != '') {
      console.log('rename column ' + id + ' with this name: ' + colTitle);
    } else {
      return false;
    }

    if (colTitle === currentName) {
      return true;
    }

    if (this.shouldEnforceUniqueNames() && this.gridExtras.nameAlreadyExists(colTitle)) {
      this.showError(`A column with name ${colTitle} already exists`);
      return false;
    }

    this.gridExtras.renameColId(id, colTitle);
  }

  async deleteColId(id) {
    if (this.gridExtras.getNumberOfColumns() == 1) {
      this.showError('Cannot Delete The Only Column');
      return;
    }

    let editColDef = this.gridExtras.getColumnDef(id);

    const confirmed = await this.requestConfirm({
      title: 'Delete Column',
      message: `Are you Sure You Want to Delete Column Named ${editColDef.headerName}?`,
    });
    if (!confirmed) return;

    this.gridExtras.deleteColumnId(id);
  }

  async duplicateColumnId(position, id) {
    const colTitle = await this.requestTextInput({
      title: 'Copy Column As',
      initialValue: '',
    });

    if (colTitle != null && colTitle != '') {
      console.log('duplicate a column with this name: ' + colTitle);
    } else {
      return;
    }

    if (this.shouldEnforceUniqueNames() && this.gridExtras.nameAlreadyExists(colTitle)) {
      this.showError(`A column with name ${colTitle} already exists`);
      return false;
    }

    this.gridExtras.duplicateColumn(position, id, colTitle);
  }

  async addNeighbourColumnId(position, id) {
    const colTitle = await this.requestTextInput({
      title: 'New Column Name',
      initialValue: '',
    });

    if (colTitle != null && colTitle != '') {
      console.log('create a new neighbour column with this name: ' + colTitle);
    } else {
      return;
    }

    if (this.shouldEnforceUniqueNames() && this.gridExtras.nameAlreadyExists(colTitle)) {
      this.showError(`A column with name ${colTitle} already exists`);
      return false;
    }

    this.gridExtras.addNeighbourColumnId(position, id, colTitle);
  }
}

export { GuardedColumnEdits };
