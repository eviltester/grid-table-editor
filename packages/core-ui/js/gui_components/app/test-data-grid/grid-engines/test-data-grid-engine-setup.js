/*
 * Responsibilities:
 * - Chooses the available grid engine (Ag Grid or Tabulator) for schema editing.
 * - Delegates engine-specific editor setup to the appropriate module.
 * - Returns normalized editor handles back to the controller.
 */

import { setupAgGridDefnEditor } from './test-data-grid-ag-grid-editor.js';
import { setupTabulatorDefnEditor } from './test-data-grid-tabulator-editor.js';

function setupDefnGridEditor({
  tableDiv,
  convertGridToText,
  onDraftCellEditChange,
  getAgGridTypeEditorValues,
  getTabulatorTypeEditorValues,
  FAKER_SECTION_VALUE,
  DOMAIN_SECTION_VALUE,
}) {
  if (typeof agGrid !== 'undefined' && typeof agGrid.createGrid === 'function') {
    return setupAgGridDefnEditor({
      tableDiv,
      agGridLib: agGrid,
      getAgGridTypeEditorValues,
      onSchemaChanged: convertGridToText,
      onDraftCellEditChange,
    });
  }

  if (typeof Tabulator !== 'undefined') {
    return setupTabulatorDefnEditor({
      tableDiv,
      TabulatorCtor: Tabulator,
      getTabulatorTypeEditorValues,
      FAKER_SECTION_VALUE,
      DOMAIN_SECTION_VALUE,
      onSchemaChanged: convertGridToText,
      onDraftCellEditChange,
    });
  }

  return null;
}

export { setupDefnGridEditor };
