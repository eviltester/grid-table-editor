class GeneratorPageShellView {
  constructor({ root, controller } = {}) {
    this.root = root;
    this.controller = controller;
  }

  mount() {
    if (!this.root) {
      throw new Error('GeneratorPageShellView requires a root element');
    }

    this.root.innerHTML = this.template();
  }

  template() {
    return `
      <div class="main-app">
        <div id="generator-instructions"></div>
        <div id="generator-app"></div>
      </div>
    `;
  }

  render() {
    this.root.innerHTML = this.template();
  }

  destroy() {
    this.root.replaceChildren();
  }
}

export { GeneratorPageShellView };
