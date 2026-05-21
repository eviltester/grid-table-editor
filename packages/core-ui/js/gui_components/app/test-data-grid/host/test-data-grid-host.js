/*
 * Responsibilities:
 * - Creates test-data grid chrome elements (table host + row control buttons).
 * - Binds add/delete row control behavior against normalized grid bridge/extras APIs.
 */

function createGridChromeElements(gridDiv) {
  const tableDiv = document.createElement('div');
  tableDiv.style.height = '160px';
  tableDiv.style.width = '100%';
  gridDiv.appendChild(tableDiv);

  const addNewRowButton = document.createElement('button');
  addNewRowButton.innerText = '+ Add Column';
  gridDiv.appendChild(addNewRowButton);

  const deleteRowsButton = document.createElement('button');
  deleteRowsButton.innerText = ' - Delete Selected';
  gridDiv.appendChild(deleteRowsButton);

  return { tableDiv, addNewRowButton, deleteRowsButton };
}

function bindGridChromeControls({ addNewRowButton, deleteRowsButton, getBridge, getExtras, onSchemaChanged }) {
  addNewRowButton.addEventListener('click', () => {
    const bridge = getBridge();
    if (!bridge) {
      return;
    }
    bridge.addRows([{ columnName: '', type: 'regex', value: '', comments: '' }]);
    onSchemaChanged();
  });

  deleteRowsButton.addEventListener('click', () => {
    const extras = getExtras();
    if (!extras) {
      return;
    }
    extras.deleteSelectedRows();
    onSchemaChanged();
  });
}

export { createGridChromeElements, bindGridChromeControls };
