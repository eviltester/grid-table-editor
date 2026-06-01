class ImportExportToolbarView {
  constructor({ root, controller } = {}) {
    this.root = root;
    this.controller = controller;
  }

  mount() {
    if (!this.root) {
      throw new Error('ImportExportToolbarView requires a root element');
    }

    this.root.innerHTML = this.template();
  }

  template() {
    const state = this.controller.getState();
    return `<span data-help="${state.helpDataHelp}" class="helpicon"></span>
            <button id="settextfromgridbutton">v Set Text From Grid v</button>
            <button id="setgridfromtextbutton" disabled>^ Set Grid From Text ^</button>
            <label id="csvinputlabel"><span class="fileFormat">.csv</span> import ^:<input type="file" id="csvinput"/></label>
            <button id="filedownload"><span class="fileFormat">.csv</span> Download</button>
            <div id="export-progress-status" class="import-progress-status" style="display:none;" aria-live="polite"></div>
            <label id="dropzone">
            <span>[Drag And Drop <span class="fileFormat">.csv</span> File Here]</span>
            </label>
            <div id="import-progress-status" class="import-progress-status" style="display:none;" aria-live="polite"></div>
            <div id="import-export-error" class="generator-schema-error-text" aria-live="polite" role="status"></div>`;
  }

  render() {}

  destroy() {
    this.root.replaceChildren();
  }
}

export { ImportExportToolbarView };
