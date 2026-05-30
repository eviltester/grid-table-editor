class RowCountControlView {
  constructor({ root, controller, documentObj = document } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = documentObj;
    this.handleInput = (event) => {
      this.controller.handleInput(event?.currentTarget?.value || '');
      this.render();
    };
  }

  mount() {
    if (!this.root) {
      throw new Error('RowCountControlView requires a root element');
    }

    this.root.innerHTML = `
      <label class="row-count-control-label">
        <span data-role="label"></span>
        <input data-role="input" type="number" />
      </label>
    `;

    this.inputElement = this.root.querySelector('[data-role="input"]');
    this.labelElement = this.root.querySelector('[data-role="label"]');
    this.inputElement?.addEventListener('input', this.handleInput);
    this.render();
  }

  render() {
    const state = this.controller.getState();
    this.root.className = state.className;
    if (this.labelElement) {
      this.labelElement.className = state.labelClassName;
      this.labelElement.textContent = state.label;
    }
    if (!this.inputElement) {
      return;
    }

    this.inputElement.id = state.inputId;
    this.inputElement.name = state.inputId;
    this.inputElement.value = state.inputValue;
    this.inputElement.min = `${state.min}`;
    this.inputElement.step = `${state.step}`;
    this.inputElement.disabled = state.disabled === true;
    this.inputElement.className = state.inputClassName;
    if (Number.isFinite(state.max)) {
      this.inputElement.max = `${state.max}`;
    } else {
      this.inputElement.removeAttribute('max');
    }
  }

  focus() {
    this.inputElement?.focus();
  }

  destroy() {
    this.inputElement?.removeEventListener('input', this.handleInput);
    this.root.replaceChildren();
  }
}

export { RowCountControlView };
