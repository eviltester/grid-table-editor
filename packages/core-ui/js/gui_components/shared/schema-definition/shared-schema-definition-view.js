class SharedSchemaDefinitionView {
  constructor({ root, controller, documentObj = document } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = documentObj;
    this.handleContainerInput = (event) => {
      this.controller.handleInput(event);
    };
    this.handleContainerFocusOut = (event) => {
      this.controller.handleFocusOut(event);
    };
    this.handleContainerClick = (event) => {
      void this.controller.handleClick(event);
    };
    this.handleRootClick = (event) => {
      if (!event?.target?.closest?.('.shared-schema-sample-button, .generator-schema-sample-button')) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      this.controller.insertSampleSchema();
    };
    this.handleDocumentClick = (event) => {
      if (!event?.target?.closest?.('.shared-schema-sample-button, .generator-schema-sample-button')) {
        return;
      }
      event.preventDefault();
      this.controller.insertSampleSchema();
    };
    this.handleContainerDragStart = (event) => {
      this.controller.handleDragStart(event);
    };
    this.handleContainerDragOver = (event) => {
      this.controller.handleDragOver(event);
    };
    this.handleContainerDrop = (event) => {
      this.controller.handleDrop(event);
    };
    this.handleContainerDragEnd = () => {
      this.controller.handleDragEnd();
    };
    this.handleAddButtonClick = (event) => {
      event.preventDefault();
      this.controller.addRow();
    };
    this.handleToggleButtonClick = (event) => {
      event.preventDefault();
      this.controller.toggleMode();
    };
    this.handleTextInput = () => {
      this.controller.syncFromText({ showErrors: false, force: true });
    };
    this.handleTextFocusOut = () => {
      this.controller.syncFromText({ showErrors: false, force: true });
    };
  }

  mount() {
    if (!this.root) {
      throw new Error('SharedSchemaDefinitionView requires a root element');
    }

    const viewModel = this.controller.getViewModel();
    const headingMarkup = viewModel.headingText
      ? `<strong>${viewModel.headingText}</strong>`
      : '<span aria-hidden="true"></span>';
    const headingRowClassName = viewModel.headingRowClassName ? ` ${viewModel.headingRowClassName}` : '';
    const addButtonClassName = viewModel.addButtonClassName ? ` ${viewModel.addButtonClassName}` : '';

    this.root.innerHTML = `
      <section class="${viewModel.sectionClassName}">
        <div class="${viewModel.headingClassName}${headingRowClassName}">
          ${headingMarkup}
          <span id="${viewModel.ids.error}" class="${viewModel.errorClassName}" aria-live="polite" role="status"></span>
          <span class="generator-button-with-help">
            <span id="${viewModel.ids.helpIcon}" class="helpicon" data-help="${viewModel.helpIconDataHelp}"></span>
            <button id="${viewModel.ids.toggleButton}" class="icon-button" title="${viewModel.toggleButtonTitle}">Edit as Text</button>
          </span>
        </div>
        <div id="${viewModel.ids.rows}" class="generator-schema-rows"></div>
        <div id="${viewModel.ids.textContainer}" class="generator-schema-text">
          <textarea id="${viewModel.ids.text}" class="${viewModel.textAreaClassName}" placeholder="${viewModel.textAreaPlaceholder}"></textarea>
        </div>
        <div class="generator-schema-footer">
          <button id="${viewModel.ids.addButton}" class="${addButtonClassName.trim()}">${viewModel.addButtonLabel}</button>
        </div>
      </section>
    `;

    this.rowsElement = this.root.querySelector(`#${viewModel.ids.rows}`);
    this.addButtonElement = this.root.querySelector(`#${viewModel.ids.addButton}`);
    this.toggleButtonElement = this.root.querySelector(`#${viewModel.ids.toggleButton}`);
    this.textAreaElement = this.root.querySelector(`#${viewModel.ids.text}`);

    this.rowsElement?.addEventListener('input', this.handleContainerInput);
    this.rowsElement?.addEventListener('change', this.handleContainerInput);
    this.rowsElement?.addEventListener('focusout', this.handleContainerFocusOut);
    this.rowsElement?.addEventListener('dragstart', this.handleContainerDragStart);
    this.rowsElement?.addEventListener('dragover', this.handleContainerDragOver);
    this.rowsElement?.addEventListener('drop', this.handleContainerDrop);
    this.rowsElement?.addEventListener('dragend', this.handleContainerDragEnd);
    this.rowsElement?.addEventListener('click', this.handleContainerClick);
    this.root.addEventListener('click', this.handleRootClick);
    this.documentObj.addEventListener('click', this.handleDocumentClick);
    this.addButtonElement?.addEventListener('click', this.handleAddButtonClick);
    this.toggleButtonElement?.addEventListener('click', this.handleToggleButtonClick);
    this.textAreaElement?.addEventListener('input', this.handleTextInput);
    this.textAreaElement?.addEventListener('change', this.handleTextInput);
    this.textAreaElement?.addEventListener('focusout', this.handleTextFocusOut);

    this.controller.init();
  }

  render() {
    this.controller.render();
  }

  destroy() {
    this.rowsElement?.removeEventListener('input', this.handleContainerInput);
    this.rowsElement?.removeEventListener('change', this.handleContainerInput);
    this.rowsElement?.removeEventListener('focusout', this.handleContainerFocusOut);
    this.rowsElement?.removeEventListener('dragstart', this.handleContainerDragStart);
    this.rowsElement?.removeEventListener('dragover', this.handleContainerDragOver);
    this.rowsElement?.removeEventListener('drop', this.handleContainerDrop);
    this.rowsElement?.removeEventListener('dragend', this.handleContainerDragEnd);
    this.rowsElement?.removeEventListener('click', this.handleContainerClick);
    this.root.removeEventListener('click', this.handleRootClick);
    this.documentObj.removeEventListener('click', this.handleDocumentClick);
    this.addButtonElement?.removeEventListener('click', this.handleAddButtonClick);
    this.toggleButtonElement?.removeEventListener('click', this.handleToggleButtonClick);
    this.textAreaElement?.removeEventListener('input', this.handleTextInput);
    this.textAreaElement?.removeEventListener('change', this.handleTextInput);
    this.textAreaElement?.removeEventListener('focusout', this.handleTextFocusOut);
    this.root.replaceChildren();
  }
}

export { SharedSchemaDefinitionView };
