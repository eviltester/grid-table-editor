function getDefaultDocumentObj() {
  return typeof document !== 'undefined' ? document : null;
}

class RowCountControlView {
  constructor({ root, controller, documentObj = getDefaultDocumentObj() } = {}) {
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

    if (state.inputId) {
      this.inputElement.id = state.inputId;
      this.inputElement.name = state.inputId;
    } else {
      this.inputElement.removeAttribute('id');
      this.inputElement.removeAttribute('name');
    }
    this.inputElement.value = state.inputValue;
    this.inputElement.min = `${state.min}`;
    this.inputElement.step = `${state.step}`;
    this.inputElement.disabled = state.disabled === true;
    this.inputElement.className = state.inputClassName;
    if (state.inputAriaLabel) {
      this.inputElement.setAttribute('aria-label', state.inputAriaLabel);
    } else {
      this.inputElement.removeAttribute('aria-label');
    }
    if (Number.isFinite(state.max)) {
      this.inputElement.max = `${state.max}`;
    } else {
      this.inputElement.removeAttribute('max');
    }
  }

  focus() {
    this.inputElement?.focus();
  }

  getInputValue() {
    return this.inputElement?.value ?? '';
  }

  destroy() {
    this.inputElement?.removeEventListener('input', this.handleInput);
    this.root.replaceChildren();
  }
}

export { RowCountControlView };
