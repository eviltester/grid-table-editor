/*
 * Responsibilities:
 * - Centralizes guarded column-edit prompts, confirmations, uniqueness checks, and error reporting.
 * - Lets grid-engine adapters provide only the engine-specific read/write hooks for column operations.
 */

import { createConfirmDialogService } from '../../shared/dialog-services/confirm-dialog-service.js';
import { createTextInputDialogService } from '../../shared/dialog-services/text-input-dialog-service.js';

function getDefaultDocumentObj() {
  return typeof document !== 'undefined' ? document : null;
}

class GuardedColumnEditWorkflow {
  constructor(
    gridExtension,
    {
      surfaceError,
      requestTextInput,
      requestConfirm,
      shouldEnforceUniqueNames,
      documentObj = getDefaultDocumentObj(),
    } = {}
  ) {
    this.gridExtras = gridExtension;
    this.surfaceError = typeof surfaceError === 'function' ? surfaceError : null;
    const textInputDialogService = createTextInputDialogService({ documentObj });
    const confirmDialogService = createConfirmDialogService({ documentObj });
    this.requestTextInput =
      typeof requestTextInput === 'function' ? requestTextInput : textInputDialogService.requestTextInput;
    this.requestConfirm = typeof requestConfirm === 'function' ? requestConfirm : confirmDialogService.requestConfirm;
    this.shouldEnforceUniqueNames =
      typeof shouldEnforceUniqueNames === 'function' ? shouldEnforceUniqueNames : () => true;
  }

  showError(message) {
    if (this.surfaceError) {
      this.surfaceError(message);
      return;
    }
    console.error(message);
  }

  async promptForName({ title, initialValue = '', logMessage }) {
    const value = await this.requestTextInput({
      title,
      initialValue,
    });

    if (value == null || value === '') {
      return null;
    }

    if (typeof logMessage === 'function') {
      console.log(logMessage(value));
    }
    return value;
  }

  hasDuplicateName(columnName) {
    return this.shouldEnforceUniqueNames() && this.gridExtras.nameAlreadyExists(columnName);
  }

  ensureUniqueName(columnName) {
    if (!this.hasDuplicateName(columnName)) {
      return true;
    }
    this.showError(`A column with name ${columnName} already exists`);
    return false;
  }

  async rename(target, { getCurrentName, applyRename, logLabel }) {
    if (!target) {
      this.showError('Column not found');
      return false;
    }

    const currentName = String(getCurrentName(target) ?? '');
    const nextName = await this.promptForName({
      title: 'Column Name',
      initialValue: currentName,
      logMessage: (value) => `rename column ${logLabel(target)} with this name: ${value}`,
    });

    if (nextName == null) {
      return false;
    }

    if (nextName === currentName) {
      return true;
    }

    if (!this.ensureUniqueName(nextName)) {
      return false;
    }

    applyRename(target, nextName);
    return true;
  }

  async delete(target, { getCurrentName, applyDelete }) {
    if (this.gridExtras.getNumberOfColumns() == 1) {
      this.showError('Cannot Delete The Only Column');
      return false;
    }

    if (!target) {
      this.showError('Column not found');
      return false;
    }

    const currentName = String(getCurrentName(target) ?? '');
    const confirmed = await this.requestConfirm({
      title: 'Delete Column',
      message: `Are you Sure You Want to Delete Column Named ${currentName}?`,
    });
    if (!confirmed) {
      return false;
    }

    applyDelete(target);
    return true;
  }

  async duplicate(position, target, { applyDuplicate }) {
    if (!target) {
      this.showError('Column not found');
      return false;
    }

    const nextName = await this.promptForName({
      title: 'Copy Column As',
      initialValue: '',
      logMessage: (value) => `duplicate a column with this name: ${value}`,
    });
    if (nextName == null) {
      return false;
    }

    if (!this.ensureUniqueName(nextName)) {
      return false;
    }

    applyDuplicate(position, target, nextName);
    return true;
  }

  async addNeighbour(position, target, { applyAddNeighbour }) {
    if (!target) {
      this.showError('Column not found');
      return false;
    }

    const nextName = await this.promptForName({
      title: 'New Column Name',
      initialValue: '',
      logMessage: (value) => `create a new neighbour column with this name: ${value}`,
    });
    if (nextName == null) {
      return false;
    }

    if (!this.ensureUniqueName(nextName)) {
      return false;
    }

    applyAddNeighbour(position, target, nextName);
    return true;
  }
}

export { GuardedColumnEditWorkflow };
