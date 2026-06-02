import { getDefaultDocumentObj, resolveDocumentObj } from '../../shared/dom/default-objects.js';
import { renderIconHtml } from '../../shared/primitives/icon/index.js';

function resolveHeaderDocument(context, column) {
  const tableElement = column?.getTable?.()?.element || null;
  return resolveDocumentObj(context?.documentObj, tableElement);
}

//create header popup contents
export const headerPopupFormatter = function (_e, column, _onRendered) {
  const documentObj = resolveHeaderDocument(this, column);
  if (!documentObj?.createElement) {
    return null;
  }

  var container = documentObj.createElement('div');

  var label = documentObj.createElement('label');
  label.innerHTML = 'Filter Column:';
  label.style.display = 'block';
  label.style.fontSize = '.7em';

  var input = documentObj.createElement('input');
  input.placeholder = 'Filter Column...';
  input.value = column.getHeaderFilterValue() || '';

  input.addEventListener('keyup', () => {
    column.setHeaderFilterValue(input.value);
  });

  var buttons = documentObj.createElement('div');
  buttons.classList.add('headerbuttons');
  buttons.innerHTML = `
        <button type="button" class="customHeaderAddLeftButton header-icon-button" title="Add column left" aria-label="Add column left">${renderIconHtml('add-column-left', { className: 'app-icon header-action-icon' })}</button>
        <button type="button" class="customHeaderRenameButton header-icon-button" title="Rename column" aria-label="Rename column">${renderIconHtml('pencil', { className: 'app-icon header-action-icon' })}</button>
        <button type="button" class="customHeaderDeleteButton header-icon-button" title="Delete column" aria-label="Delete column">${renderIconHtml('trash', { className: 'app-icon header-action-icon' })}</button>
        <button type="button" class="customHeaderDuplicateButton header-icon-button" title="Duplicate column" aria-label="Duplicate column">${renderIconHtml('copy', { className: 'app-icon header-action-icon' })}</button>
        <button type="button" class="customHeaderAddRightButton header-icon-button" title="Add column right" aria-label="Add column right">${renderIconHtml('add-column-right', { className: 'app-icon header-action-icon' })}</button>
    `;

  container.appendChild(label);
  container.appendChild(input);
  container.appendChild(buttons);

  this.headerAddLeftButton = buttons.querySelector('.customHeaderAddLeftButton');
  this.onAddLeftButtonListener = this.onAddLeftButtonClick.bind(this);
  this.headerAddLeftButton.addEventListener('click', this.onAddLeftButtonListener);

  this.headerRenameButton = buttons.querySelector('.customHeaderRenameButton');
  this.onRenameButtonListener = this.onRenameButtonClick.bind(this);
  this.headerRenameButton.addEventListener('click', this.onRenameButtonListener);

  this.headerDeleteButton = buttons.querySelector('.customHeaderDeleteButton');
  this.onDeleteButtonListener = this.onDeleteButtonClick.bind(this);
  this.headerDeleteButton.addEventListener('click', this.onDeleteButtonListener);

  this.headerDuplicateButton = buttons.querySelector('.customHeaderDuplicateButton');
  this.onDuplicateButtonListener = this.onDuplicateButtonClick.bind(this);
  this.headerDuplicateButton.addEventListener('click', this.onDuplicateButtonListener);

  this.headerAddRightButton = buttons.querySelector('.customHeaderAddRightButton');
  this.onAddRightButtonListener = this.onAddRightButtonClick.bind(this);
  this.headerAddRightButton.addEventListener('click', this.onAddRightButtonListener);

  return container;
};

//create dummy header filter to allow popup to filter
export const emptyHeaderFilter = function () {
  const documentObj = resolveDocumentObj(this?.documentObj, null) || getDefaultDocumentObj();
  return documentObj?.createElement?.('div') || null;
};
