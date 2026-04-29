//create header popup contents
var headerPopupFormatter = function (e, column, onRendered) {
  var container = document.createElement('div');

  var label = document.createElement('label');
  label.innerHTML = 'Filter Column:';
  label.style.display = 'block';
  label.style.fontSize = '.7em';

  var input = document.createElement('input');
  input.placeholder = 'Filter Column...';
  input.value = column.getHeaderFilterValue() || '';

  input.addEventListener('keyup', (e) => {
    column.setHeaderFilterValue(input.value);
  });

  var buttons = document.createElement('div');
  buttons.classList.add('headerbuttons');
  buttons.innerHTML = `
        <span class="customHeaderAddLeftButton" title="add left">[<+]</span>
        <span class="customHeaderRenameButton" title="rename">[~]</span>
        <span class="customHeaderDeleteButton" title="delete">[x]</span>
        <span class="customHeaderDuplicateButton" title="duplicate">[+=]</span>
        <span class="customHeaderAddRightButton" title="add right">[+>]</span>
    `;

  container.appendChild(label);
  container.appendChild(input);
  container.appendChild(buttons);

  headerAddLeftButton = buttons.querySelector('.customHeaderAddLeftButton');
  onAddLeftButtonListener = onAddLeftButtonClick.bind(this);
  headerAddLeftButton.addEventListener('click', this.onAddLeftButtonListener);

  this.headerRenameButton = this.eGui.querySelector('.customHeaderRenameButton');
  this.onRenameButtonListener = this.onRenameButtonClick.bind(this);
  this.headerRenameButton.addEventListener('click', this.onRenameButtonListener);

  this.headerDeleteButton = this.eGui.querySelector('.customHeaderDeleteButton');
  this.onDeleteButtonListener = this.onDeleteButtonClick.bind(this);
  this.headerDeleteButton.addEventListener('click', this.onDeleteButtonListener);

  this.headerDuplicateButton = this.eGui.querySelector('.customHeaderDuplicateButton');
  this.onDuplicateButtonListener = this.onDuplicateButtonClick.bind(this);
  this.headerDuplicateButton.addEventListener('click', this.onDuplicateButtonListener);

  this.headerAddRightButton = this.eGui.querySelector('.customHeaderAddRightButton');
  this.onAddRightButtonListener = this.onAddRightButtonClick.bind(this);
  this.headerAddRightButton.addEventListener('click', this.onAddRightButtonListener);

  return container;
};

//create dummy header filter to allow popup to filter
var emptyHeaderFilter = function () {
  return document.createElement('div');
};
