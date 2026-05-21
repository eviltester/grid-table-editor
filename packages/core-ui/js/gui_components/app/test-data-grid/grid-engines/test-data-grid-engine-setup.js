/*
 * Responsibilities:
 * - Chooses the available grid engine (Ag Grid or Tabulator) for schema editing.
 * - Delegates engine-specific editor setup to the appropriate module.
 * - Returns normalized editor handles back to the controller.
 */

import { setupAgGridSchemaGridEditor } from './test-data-grid-ag-grid-editor.js';
import { setupTabulatorSchemaGridEditor } from './test-data-grid-tabulator-editor.js';

function setupSchemaGridEditor({
  tableDiv,
  convertGridToText,
  onDraftCellEditChange,
  getAgGridCommandEditorValues,
  getTabulatorCommandEditorValues,
  FAKER_SECTION_VALUE,
  DOMAIN_SECTION_VALUE,
}) {
  if (typeof agGrid !== 'undefined' && typeof agGrid.createGrid === 'function') {
    return setupAgGridSchemaGridEditor({
      tableDiv,
      agGridLib: agGrid,
      getAgGridCommandEditorValues,
      onSchemaChanged: convertGridToText,
      onDraftCellEditChange,
    });
  }

  if (typeof Tabulator !== 'undefined') {
    return setupTabulatorSchemaGridEditor({
      tableDiv,
      TabulatorCtor: Tabulator,
      getTabulatorCommandEditorValues,
      FAKER_SECTION_VALUE,
      DOMAIN_SECTION_VALUE,
      onSchemaChanged: convertGridToText,
      onDraftCellEditChange,
    });
  }

  return null;
}

export { setupSchemaGridEditor };
