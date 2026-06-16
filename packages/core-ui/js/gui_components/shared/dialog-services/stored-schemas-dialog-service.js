import { createConfirmDialogService } from './confirm-dialog-service.js';
import { createStoredSchemasDialogComponent } from '../stored-schemas-dialog/index.js';

function createStoredSchemasDialogService({ documentObj, windowObj } = {}) {
  const confirmDialogService = createConfirmDialogService({ documentObj, windowObj });
  let dialog = null;

  return {
    async openStoredSchemasDialog({ storage, onLoadSchema, onStatus, onDidChange } = {}) {
      const refreshEntries = () => {
        const summary = storage?.loadSavedSchemas?.() || { saved: [] };
        dialog?.setEntries(summary.saved || []);
        onDidChange?.();
      };

      dialog?.destroy?.();
      dialog = createStoredSchemasDialogComponent({
        documentObj,
        windowObj,
        callbacks: {
          onLoad: async (entry) => {
            onLoadSchema?.(entry.schemaText, entry);
          },
          onRename: async (id, name) => {
            const result = storage?.renameSavedSchema?.(id, name);
            if (result?.errorMessage) {
              onStatus?.(result.errorMessage, { severity: 'error', dismissable: true });
            }
            refreshEntries();
          },
          onDelete: async (entry) => {
            const shouldDelete = await confirmDialogService.requestConfirm({
              title: 'Delete Stored Schema',
              message: `Delete Stored Schema named ${entry.name}?`,
              okLabel: 'Delete',
              cancelLabel: 'Cancel',
            });
            if (!shouldDelete) {
              return;
            }
            const result = storage?.deleteSavedSchema?.(entry.id);
            if (result?.ok) {
              onStatus?.(`Deleted ${entry.name}.`, { dismissable: true });
            } else if (result?.errorMessage) {
              onStatus?.(result.errorMessage, { severity: 'error', dismissable: true });
            }
            refreshEntries();
          },
        },
      });
      dialog.open((storage?.loadSavedSchemas?.().saved || []).slice());
      return dialog;
    },
    destroy() {
      confirmDialogService.destroy();
      dialog?.destroy?.();
      dialog = null;
    },
  };
}

export { createStoredSchemasDialogService };
