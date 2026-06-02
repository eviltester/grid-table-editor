class ImportExportToolbarView {
  constructor({ root, controller, services = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.services = services;
  }

  mount() {
    if (!this.root) {
      throw new Error('ImportExportToolbarView requires a root element');
    }

    this.root.innerHTML = this.template();
    this.services.updateHelpHints?.();
  }

  template() {
    const state = this.controller.getState();
    return `<span data-help="${state.helpDataHelp}" class="helpicon"></span>
            <button type="button" id="settextfromgridbutton">v Set Text From Grid v</button>
            <button type="button" id="setgridfromtextbutton" disabled>^ Set Grid From Text ^</button>
            <label id="csvinputlabel"><span class="fileFormat">.csv</span> import ^:<input type="file" id="csvinput"/></label>
            <button type="button" id="filedownload"><span class="fileFormat">.csv</span> Download</button>
            <div id="export-progress-status" class="import-progress-status" style="display:none;" aria-live="polite"></div>
            <label id="dropzone">
            <span>[Drag And Drop <span class="fileFormat">.csv</span> File Here]</span>
            </label>
            <div id="import-progress-status" class="import-progress-status" style="display:none;" aria-live="polite"></div>
            <div id="import-export-error" class="generator-schema-error-text" aria-live="polite" role="status"></div>`;
  }

  render() {
    this.services.updateHelpHints?.();
  }

  destroy() {
    this.root.replaceChildren();
  }
}

export { ImportExportToolbarView };
