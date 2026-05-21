import { GuardedColumnEditWorkflow } from '../shared/guarded-column-edit-workflow.js';

class GuardedTabulatorColumnEdits {
  constructor(gridExtension, options = {}) {
    this.gridExtras = gridExtension;
    this.workflow = new GuardedColumnEditWorkflow(gridExtension, options);
  }

  async renameColumn(column) {
    return this.workflow.rename(column, {
      getCurrentName: (targetColumn) => targetColumn?.getDefinition?.()?.title,
      applyRename: (targetColumn, nextName) => this.gridExtras.renameColumn(targetColumn, nextName),
      logLabel: (targetColumn) => targetColumn?.getDefinition?.()?.title,
    });
  }

  async deleteColumn(column) {
    return this.workflow.delete(column, {
      getCurrentName: (targetColumn) => targetColumn?.getDefinition?.()?.title,
      applyDelete: (targetColumn) => this.gridExtras.deleteColumn(targetColumn),
    });
  }

  async duplicateColumn(position, column) {
    return this.workflow.duplicate(position, column, {
      applyDuplicate: (nextPosition, targetColumn, nextName) =>
        this.gridExtras.duplicateColumn(nextPosition, targetColumn, nextName),
    });
  }

  async addNeighbourColumn(position, existingColumn) {
    return this.workflow.addNeighbour(position, existingColumn, {
      applyAddNeighbour: (nextPosition, targetColumn, nextName) =>
        this.gridExtras.addNeighbourColumn(nextPosition, targetColumn, nextName),
    });
  }
}

export { GuardedTabulatorColumnEdits };
