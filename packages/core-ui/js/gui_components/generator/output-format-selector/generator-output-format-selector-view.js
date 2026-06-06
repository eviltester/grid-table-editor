class GeneratorOutputFormatSelectorView {
  constructor({ root, controller, documentObj, services = {}, ids = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = documentObj;
    this.services = services;
    this.ids = {
      outputFormatSelect: '',
      ...ids,
    };
    this.handleOutputFormatChange = () => {
      this.controller.setSelectedFormat(this.getSelectedFormat());
      this.render();
    };
  }

  buildOptionalIdAttr(id) {
    return id ? ` id="${id}"` : '';
  }

  mount() {
    if (!this.root) {
      throw new Error('GeneratorOutputFormatSelectorView requires a root element');
    }

    this.root.innerHTML = this.template();
    this.populateOutputFormats(this.getOutputFormatSelect());
    this.bindEvents();
    this.render();
  }

  template() {
    return `
      <label>Output Format
        <select${this.buildOptionalIdAttr(this.ids.outputFormatSelect)} data-role="generator-output-format-select"></select>
      </label>
    `;
  }

  bindEvents() {
    this.getOutputFormatSelect()?.addEventListener('change', this.handleOutputFormatChange);
  }

  populateOutputFormats(outputSelect) {
    if (!outputSelect) {
      return;
    }

    outputSelect.replaceChildren();
    const formatGroups = this.services.getOutputFormatGroups?.();
    if (!formatGroups) {
      return;
    }

    this.appendFormatGroup(outputSelect, formatGroups.core);
    this.appendFormatGroup(outputSelect, formatGroups.code, '-- Code --');
    this.appendFormatGroup(outputSelect, formatGroups.unitTest, '-- Code (Unit Test) --');
  }

  appendFormatGroup(parentElement, entries = [], label = '') {
    const supportedEntries = entries.filter(({ type }) => this.services.canExportFormat?.(type) !== false);
    if (supportedEntries.length === 0) {
      return;
    }

    const target = label ? this.documentObj.createElement('optgroup') : parentElement;
    if (label) {
      target.label = label;
    }

    supportedEntries.forEach(({ type, label: optionLabel }) => {
      const option = this.documentObj.createElement('option');
      option.value = type;
      option.textContent = optionLabel;
      target.appendChild(option);
    });

    if (label) {
      parentElement.appendChild(target);
    }
  }

  render() {
    const outputSelect = this.getOutputFormatSelect();
    const { selectedFormat } = this.controller.getState();
    if (outputSelect && outputSelect.value !== selectedFormat) {
      outputSelect.value = selectedFormat || 'csv';
    }
  }

  destroy() {
    this.getOutputFormatSelect()?.removeEventListener('change', this.handleOutputFormatChange);
    this.root.replaceChildren();
  }

  getOutputFormatSelect() {
    return this.root.querySelector('[data-role="generator-output-format-select"]');
  }

  getSelectedFormat() {
    return this.getOutputFormatSelect()?.value || 'csv';
  }
}

export { GeneratorOutputFormatSelectorView };
