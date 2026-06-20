import { resolveDocumentObj } from '../dom/default-objects.js';

const SCHEMA_ROWS_ROLE = 'schema-rows-region';
const SCHEMA_TEXT_REGION_ROLE = 'schema-text-region';
const SCHEMA_TEXTBOX_ROLE = 'schema-textbox';
const SCHEMA_ADD_FIELD_ROLE = 'schema-add-field';
const SCHEMA_MODE_TOGGLE_ROLE = 'schema-mode-toggle';
const SCHEMA_MODE_HELP_ROLE = 'schema-mode-help';
const SCHEMA_ERROR_ROLE = 'schema-error';
const SCHEMA_CONSTRAINTS_REGION_ROLE = 'schema-constraints-region';
const SCHEMA_CONSTRAINTS_SUMMARY_ROLE = 'schema-constraints-summary';
const SCHEMA_CONSTRAINTS_TEXTBOX_ROLE = 'schema-constraints-textbox';
const SCHEMA_FILE_INPUT_ROLE = 'schema-file-input';
const SCHEMA_LOAD_FILE_BUTTON_ROLE = 'schema-load-file-button';
const SCHEMA_SAVE_FILE_BUTTON_ROLE = 'schema-save-file-button';

function renderOptionalIdAttr(idValue) {
  return idValue ? ` id="${idValue}"` : '';
}

class SharedSchemaDefinitionView {
  constructor({ root, controller, documentObj } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = resolveDocumentObj(documentObj, root);
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
      if (!event?.target?.closest?.('.shared-schema-sample-button')) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      this.controller.insertSampleSchema();
    };
    this.handleDocumentClick = (event) => {
      if (!event?.target?.closest?.('.shared-schema-sample-button')) {
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
    this.handleConstraintsInput = () => {
      this.controller.syncConstraintsFromEditor({ showErrors: false });
    };
    this.handleConstraintsFocusOut = () => {
      this.controller.syncConstraintsFromEditor({ showErrors: true });
    };
    this.handleLoadFileButtonClick = () => {
      this.fileInputElement?.click?.();
    };
    this.handleFileInputChange = async (event) => {
      const file = event?.target?.files?.[0] || null;
      if (!file) {
        return;
      }
      await this.controller.loadSchemaFromFile(file);
      if (event?.target) {
        event.target.value = '';
      }
    };
    this.handleSaveFileButtonClick = () => {
      this.controller.saveSchemaToFile();
    };
  }

  getElementByRole(role) {
    return this.root?.querySelector?.(`[data-role="${role}"]`) || null;
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
      <section class="${viewModel.sectionClassName}" data-role="shared-schema-definition">
        <div class="${viewModel.headingClassName}${headingRowClassName}">
          ${headingMarkup}
          <span${renderOptionalIdAttr(viewModel.ids.error)} class="${viewModel.errorClassName}" data-role="schema-error" aria-live="polite" role="status"></span>
          <span class="${viewModel.helpGroupClassName}" data-role="schema-mode-toggle-group">
            <button
              type="button"
              ${renderOptionalIdAttr(viewModel.ids.helpIcon)}
              class="helpicon"
              data-help-role="help-icon"
              data-role="schema-mode-help"
              data-help="${viewModel.helpIconDataHelp}"></button>
            <button
              ${renderOptionalIdAttr(viewModel.ids.toggleButton)}
              class="icon-button"
              data-role="schema-mode-toggle"
              title="${viewModel.toggleButtonTitle}">Edit as Text</button>
          </span>
          <span class="${viewModel.fileActionsClassName}" data-role="schema-file-actions">
            <button
              type="button"
              class="${viewModel.loadFileButtonClassName}"
              data-role="schema-load-file-button">${viewModel.loadFileButtonLabel}</button>
            <input
              type="file"
              data-role="schema-file-input"
              accept="${viewModel.loadFileInputAccept}"
              aria-label="${viewModel.loadFileButtonLabel}"
              hidden>
            <button
              type="button"
              class="${viewModel.saveFileButtonClassName}"
              data-role="schema-save-file-button">${viewModel.saveFileButtonLabel}</button>
          </span>
        </div>
        <div${renderOptionalIdAttr(viewModel.ids.rows)} class="${viewModel.rowsClassName}" data-role="schema-rows-region"></div>
        <div${renderOptionalIdAttr(viewModel.ids.textContainer)} class="${viewModel.textContainerClassName}" data-role="schema-text-region">
          <textarea
            ${renderOptionalIdAttr(viewModel.ids.text)}
            class="${viewModel.textAreaClassName}"
            data-role="schema-textbox"
            aria-label="Schema text"
            placeholder="${viewModel.textAreaPlaceholder}"></textarea>
        </div>
        <details class="${viewModel.constraintsDetailsClassName}" data-role="schema-constraints-region">
          <summary class="${viewModel.constraintsSummaryClassName}" data-role="schema-constraints-summary">
            Schema Constraints (0)
          </summary>
          <textarea
            class="${viewModel.constraintsTextAreaClassName}"
            data-role="schema-constraints-textbox"
            aria-label="Schema constraints"
            placeholder="${viewModel.constraintsTextAreaPlaceholder}"></textarea>
        </details>
        <div class="${viewModel.footerClassName}" data-role="schema-footer">
          <button
            ${renderOptionalIdAttr(viewModel.ids.addButton)}
            class="${addButtonClassName.trim()}"
            data-role="schema-add-field">${viewModel.addButtonLabel}</button>
        </div>
      </section>
    `;

    this.rowsElement = this.getElementByRole(SCHEMA_ROWS_ROLE);
    this.textContainerElement = this.getElementByRole(SCHEMA_TEXT_REGION_ROLE);
    this.addButtonElement = this.getElementByRole(SCHEMA_ADD_FIELD_ROLE);
    this.toggleButtonElement = this.getElementByRole(SCHEMA_MODE_TOGGLE_ROLE);
    this.helpIconElement = this.getElementByRole(SCHEMA_MODE_HELP_ROLE);
    this.errorElement = this.getElementByRole(SCHEMA_ERROR_ROLE);
    this.textAreaElement = this.getElementByRole(SCHEMA_TEXTBOX_ROLE);
    this.constraintsRegionElement = this.getElementByRole(SCHEMA_CONSTRAINTS_REGION_ROLE);
    this.constraintsSummaryElement = this.getElementByRole(SCHEMA_CONSTRAINTS_SUMMARY_ROLE);
    this.constraintsTextAreaElement = this.getElementByRole(SCHEMA_CONSTRAINTS_TEXTBOX_ROLE);
    this.fileInputElement = this.getElementByRole(SCHEMA_FILE_INPUT_ROLE);
    this.loadFileButtonElement = this.getElementByRole(SCHEMA_LOAD_FILE_BUTTON_ROLE);
    this.saveFileButtonElement = this.getElementByRole(SCHEMA_SAVE_FILE_BUTTON_ROLE);
    this.controller.attachElements?.({
      rowsElement: this.rowsElement,
      textContainerElement: this.textContainerElement,
      addButtonElement: this.addButtonElement,
      toggleButtonElement: this.toggleButtonElement,
      helpIconElement: this.helpIconElement,
      errorElement: this.errorElement,
      textElement: this.textAreaElement,
      constraintsRegionElement: this.constraintsRegionElement,
      constraintsSummaryElement: this.constraintsSummaryElement,
      constraintsTextElement: this.constraintsTextAreaElement,
    });

    this.rowsElement?.addEventListener('input', this.handleContainerInput);
    this.rowsElement?.addEventListener('change', this.handleContainerInput);
    this.rowsElement?.addEventListener('focusout', this.handleContainerFocusOut);
    this.rowsElement?.addEventListener('dragstart', this.handleContainerDragStart);
    this.rowsElement?.addEventListener('dragover', this.handleContainerDragOver);
    this.rowsElement?.addEventListener('drop', this.handleContainerDrop);
    this.rowsElement?.addEventListener('dragend', this.handleContainerDragEnd);
    this.rowsElement?.addEventListener('click', this.handleContainerClick);
    this.root.addEventListener('click', this.handleRootClick);
    this.documentObj?.addEventListener?.('click', this.handleDocumentClick);
    this.addButtonElement?.addEventListener('click', this.handleAddButtonClick);
    this.toggleButtonElement?.addEventListener('click', this.handleToggleButtonClick);
    this.textAreaElement?.addEventListener('input', this.handleTextInput);
    this.textAreaElement?.addEventListener('change', this.handleTextInput);
    this.textAreaElement?.addEventListener('focusout', this.handleTextFocusOut);
    this.constraintsTextAreaElement?.addEventListener('input', this.handleConstraintsInput);
    this.constraintsTextAreaElement?.addEventListener('change', this.handleConstraintsInput);
    this.constraintsTextAreaElement?.addEventListener('focusout', this.handleConstraintsFocusOut);
    this.loadFileButtonElement?.addEventListener('click', this.handleLoadFileButtonClick);
    this.fileInputElement?.addEventListener('change', this.handleFileInputChange);
    this.saveFileButtonElement?.addEventListener('click', this.handleSaveFileButtonClick);

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
    this.documentObj?.removeEventListener?.('click', this.handleDocumentClick);
    this.addButtonElement?.removeEventListener('click', this.handleAddButtonClick);
    this.toggleButtonElement?.removeEventListener('click', this.handleToggleButtonClick);
    this.textAreaElement?.removeEventListener('input', this.handleTextInput);
    this.textAreaElement?.removeEventListener('change', this.handleTextInput);
    this.textAreaElement?.removeEventListener('focusout', this.handleTextFocusOut);
    this.constraintsTextAreaElement?.removeEventListener('input', this.handleConstraintsInput);
    this.constraintsTextAreaElement?.removeEventListener('change', this.handleConstraintsInput);
    this.constraintsTextAreaElement?.removeEventListener('focusout', this.handleConstraintsFocusOut);
    this.loadFileButtonElement?.removeEventListener('click', this.handleLoadFileButtonClick);
    this.fileInputElement?.removeEventListener('change', this.handleFileInputChange);
    this.saveFileButtonElement?.removeEventListener('click', this.handleSaveFileButtonClick);
    this.root.replaceChildren();
  }
}

export { SharedSchemaDefinitionView };
