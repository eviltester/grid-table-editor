class PopulationModeSelectorView {
  constructor({ root, controller, documentObj = document } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = documentObj;
    this.handleChange = (event) => {
      const input = event?.target;
      if (!input?.checked) {
        return;
      }
      this.controller.handleModeChange(input.value);
      this.render();
    };
  }

  mount() {
    if (!this.root) {
      throw new Error('PopulationModeSelectorView requires a root element');
    }

    this.root.innerHTML = '';
    this.root.addEventListener('change', this.handleChange);
    this.render();
  }

  render() {
    const state = this.controller.getState();
    this.root.replaceChildren();

    state.options.forEach((option) => {
      const label = this.documentObj.createElement('label');
      const input = this.documentObj.createElement('input');
      const text = this.documentObj.createTextNode(option.label || option.value);

      input.type = 'radio';
      input.name = state.name;
      input.value = option.value;
      input.checked = state.selectedMode === option.value;
      if (option.inputId) {
        input.id = option.inputId;
      }

      label.appendChild(input);
      label.appendChild(text);
      this.root.appendChild(label);
    });
  }

  destroy() {
    this.root.removeEventListener('change', this.handleChange);
    this.root.replaceChildren();
  }
}

export { PopulationModeSelectorView };
