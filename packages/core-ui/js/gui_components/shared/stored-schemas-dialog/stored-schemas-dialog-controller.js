import { MAX_STORED_SCHEMA_NAME_LENGTH } from '../stored-schemas/stored-schemas-storage.js';

class StoredSchemasDialogController {
  constructor() {
    this.state = {
      entries: [],
      open: false,
      renamingId: '',
      renameValue: '',
    };
  }

  open(entries = []) {
    this.state = {
      ...this.state,
      entries: Array.isArray(entries) ? entries.slice() : [],
      open: true,
      renamingId: '',
      renameValue: '',
    };
  }

  close() {
    this.state = {
      ...this.state,
      open: false,
      renamingId: '',
      renameValue: '',
    };
  }

  setEntries(entries = []) {
    this.state.entries = Array.isArray(entries) ? entries.slice() : [];
  }

  startRename(id, currentName) {
    this.state.renamingId = id;
    this.state.renameValue = String(currentName || '').slice(0, MAX_STORED_SCHEMA_NAME_LENGTH);
  }

  setRenameValue(value) {
    this.state.renameValue = String(value || '').slice(0, MAX_STORED_SCHEMA_NAME_LENGTH);
  }

  cancelRename() {
    this.state.renamingId = '';
    this.state.renameValue = '';
  }

  getState() {
    return {
      ...this.state,
      entries: this.state.entries.slice(),
    };
  }
}

export { StoredSchemasDialogController };
