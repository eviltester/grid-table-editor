import { showTextInputModal } from '../../modal-text-input.js';

class GuardedTabulatorColumnEdits {
  constructor(gridExtension, { surfaceError, requestTextInput } = {}) {
    this.gridExtras = gridExtension;
    this.surfaceError = typeof surfaceError === 'function' ? surfaceError : null;
    this.requestTextInput =
      typeof requestTextInput === 'function' ? requestTextInput : (options) => showTextInputModal(options);
  }

  // todo: ids here look suspiciously ag-grid specific

  showError(message) {
    if (this.surfaceError) {
      this.surfaceError(message);
      return;
    }
    console.error(message);
  }

  async renameColumn(column) {
    if (column == null || column == undefined) {
      this.showError('Column not found');
      return;
    }

    const currentName = String(column.getDefinition()?.title ?? '');
    const colTitle = await this.requestTextInput({
      title: 'Column Name',
      initialValue: column.getDefinition().title,
    });

    if (colTitle != null && colTitle != '') {
      console.log('rename column ' + column.getDefinition().title + ' with this name: ' + colTitle);
    } else {
      return false;
    }

    if (colTitle === currentName) {
      return true;
    }

    if (this.gridExtras.nameAlreadyExists(colTitle)) {
      this.showError(`A column with name ${colTitle} already exists`);
      return false;
    }

    this.gridExtras.renameColumn(column, colTitle);
  }

  deleteColumn(column) {
    if (column == null || column == undefined) {
      this.showError('Column not found');
      return;
    }

    if (this.gridExtras.getNumberOfColumns() == 1) {
      this.showError('Cannot Delete The Only Column');
      return;
    }

    if (!confirm('Are you Sure You Want to Delete Column Named ' + column.getDefinition().title + '?')) return;

    this.gridExtras.deleteColumn(column);
  }

  async duplicateColumn(position, column) {
    const colTitle = await this.requestTextInput({
      title: 'Copy Column As',
      initialValue: '',
    });

    if (colTitle != null && colTitle != '') {
      console.log('duplicate a column with this name: ' + colTitle);
    } else {
      return;
    }

    if (this.gridExtras.nameAlreadyExists(colTitle)) {
      this.showError(`A column with name ${colTitle} already exists`);
      return false;
    }

    this.gridExtras.duplicateColumn(position, column, colTitle);
  }

  async addNeighbourColumn(position, existingColumn) {
    if (existingColumn == null || existingColumn == undefined) {
      this.showError('Column not found');
      return;
    }

    const colTitle = await this.requestTextInput({
      title: 'New Column Name',
      initialValue: '',
    });

    if (colTitle != null && colTitle != '') {
      console.log('create a new neighbour column with this name: ' + colTitle);
    } else {
      return;
    }

    if (this.gridExtras.nameAlreadyExists(colTitle)) {
      this.showError(`A column with name ${colTitle} already exists`);
      return false;
    }

    this.gridExtras.addNeighbourColumn(position, existingColumn, colTitle);
  }
}

export { GuardedTabulatorColumnEdits };
