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
      <a class="skip-link" href="#generator-main-content">Skip to main content</a>
      <main id="generator-main-content" class="main-app" aria-labelledby="generator-page-title">
        <h1 id="generator-page-title" class="visually-hidden">Data Generator</h1>
        <div id="generator-instructions"></div>
        <div id="generator-app"></div>
      </main>
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
