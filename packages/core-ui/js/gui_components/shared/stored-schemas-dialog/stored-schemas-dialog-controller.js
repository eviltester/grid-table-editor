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
    this.state.renameValue = currentName || '';
  }

  setRenameValue(value) {
    this.state.renameValue = String(value || '');
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
