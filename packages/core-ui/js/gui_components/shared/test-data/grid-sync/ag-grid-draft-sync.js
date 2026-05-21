/*
 * Responsibilities:
 * - Tracks in-progress Ag Grid cell edits (before commit) for schema text sync.
 * - Pushes draft values to host callbacks during input/change events.
 * - Clears active draft state when editing stops.
 */

function createAgGridDraftSync({ onDraftCellEditChange, onSchemaChanged }) {
  let activeDraftCellEdit = null;

  const setActiveDraftCellEdit = (value) => {
    activeDraftCellEdit = value;
    onDraftCellEditChange?.(activeDraftCellEdit);
  };

  const onCellEditingStarted = (event) => {
    setTimeout(() => {
      const editorHost = event?.eGridCell;
      const editorElement = editorHost?.querySelector?.('input, select, textarea');
      const rowData = event?.data;
      const field = event?.colDef?.field;
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

  const onCellEditingStopped = () => {
    setActiveDraftCellEdit(null);
    onSchemaChanged();
  };

  return {
    onCellEditingStarted,
    onCellEditingStopped,
  };
}

export { createAgGridDraftSync };
