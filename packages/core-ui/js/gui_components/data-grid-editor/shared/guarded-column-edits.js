/*
 * Responsibilities:
 * - Provides the shared AG/id-style guarded column editing API used by data-grid editor UIs.
 * - Adapts grid extensions that expose id-based column operations onto the shared workflow.
 */

import { GuardedColumnEditWorkflow } from './guarded-column-edit-workflow.js';

class GuardedColumnEdits {
  constructor(gridExtension, options = {}) {
    this.gridExtras = gridExtension;
    this.workflow = new GuardedColumnEditWorkflow(gridExtension, options);
  }

  getColumnDefinition(id) {
    return this.gridExtras.getColumnDef(id);
  }

  async renameColId(id) {
    return this.workflow.rename(this.getColumnDefinition(id), {
      getCurrentName: (columnDef) => columnDef?.headerName,
      applyRename: (_columnDef, nextName) => this.gridExtras.renameColId(id, nextName),
      logLabel: () => id,
    });
  }

  async deleteColId(id) {
    return this.workflow.delete(this.getColumnDefinition(id), {
      getCurrentName: (columnDef) => columnDef?.headerName,
      applyDelete: () => this.gridExtras.deleteColumnId(id),
    });
  }

  async duplicateColumnId(position, id) {
    return this.workflow.duplicate(position, this.getColumnDefinition(id), {
      applyDuplicate: (nextPosition, _columnDef, nextName) =>
        this.gridExtras.duplicateColumn(nextPosition, id, nextName),
    });
  }

  async addNeighbourColumnId(position, id) {
    return this.workflow.addNeighbour(position, this.getColumnDefinition(id), {
      applyAddNeighbour: (nextPosition, _columnDef, nextName) =>
        this.gridExtras.addNeighbourColumnId(nextPosition, id, nextName),
    });
  }
}

export { GuardedColumnEdits };
