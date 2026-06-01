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
      <div class="header">
        <div class="pageheading"><a href="/">AnyWayData</a></div>
        <div class="mainmenu"><a href="/app.html">App</a></div>
        <div class="mainmenu">&nbsp;Generator&nbsp;</div>
        <div class="mainmenu"><a href="/docs/intro">Docs</a></div>
        <div class="mainmenu"><a href="/blog">Blog</a></div>
      </div>

      <div class="main-app">
        <div id="generator-instructions"></div>
        <p
          id="generator-initial-load"
          class="import-progress-status startup-loading-status"
          role="status"
          aria-live="polite"
        >
          Please Wait, Loading Libraries...
        </p>
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
