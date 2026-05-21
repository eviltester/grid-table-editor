/*
 * Responsibilities:
 * - Tracks in-progress Tabulator cell edits (before commit) for schema text sync.
 * - Pushes draft values to host callbacks during input/change events.
 * - Clears active draft state on demand.
 */

function createTabulatorDraftSync({ onDraftCellEditChange, onSchemaChanged }) {
  let activeDraftCellEdit = null;

  const setActiveDraftCellEdit = (value) => {
    activeDraftCellEdit = value;
    onDraftCellEditChange(activeDraftCellEdit);
  };

  const beginDraftTracking = (cell) => {
    setTimeout(() => {
      const editorElement = cell?.getElement?.()?.querySelector?.('input, select, textarea');
      const rowData = cell?.getRow?.()?.getData?.();
      const field = cell?.getField?.() || cell?.getColumn?.()?.getDefinition?.()?.field;
      if (!editorElement || !rowData || !field) {
        return;
      }

      setActiveDraftCellEdit({
        field,
        rowData,
        value: editorElement.value ?? '',
      });

      const pushDraftValueToText = () => {
        if (activeDraftCellEdit?.rowData !== rowData || activeDraftCellEdit?.field !== field) {
          return;
        }
        setActiveDraftCellEdit({
          ...activeDraftCellEdit,
          value: editorElement.value ?? '',
        });
        onSchemaChanged();
      };

      editorElement.addEventListener('input', pushDraftValueToText);
      editorElement.addEventListener('change', pushDraftValueToText);
      pushDraftValueToText();
    }, 0);
  };

  const clearDraftTracking = () => {
    setActiveDraftCellEdit(null);
  };

  return {
    beginDraftTracking,
    clearDraftTracking,
  };
}

export { createTabulatorDraftSync };
