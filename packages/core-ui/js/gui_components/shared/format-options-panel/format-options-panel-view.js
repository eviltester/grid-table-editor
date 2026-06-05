import { resolveDocumentObj, resolveWindowObj } from '../dom/default-objects.js';

class FormatOptionsPanelView {
  constructor({ root, controller, documentObj, windowObj, services = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = resolveDocumentObj(documentObj, root);
    this.windowObj = resolveWindowObj(windowObj, this.documentObj);
    this.services = services;
    this.panelDefinitions = {};
    this.activePanel = null;
  }

  mount() {
    this.panelDefinitions = this.services.getPanelDefinitions?.() || {};
    this.render();
  }

  render() {
    const selectedFormat = this.controller.getSelectedFormat();
    const definition = selectedFormat ? this.panelDefinitions[selectedFormat] : null;

    this.activePanel?.destroy?.();
    this.activePanel = null;

    if (!definition) {
      this.controller.setSupported(false);
      this.root.innerHTML = '';
      this.root.style.display = 'none';
      return;
    }

    this.controller.setSupported(true);
    this.root.style.display = 'block';
    const panel = this.services.createPanelFromDefinition?.(definition, { root: this.root });
    this.activePanel = panel || null;
    panel?.render?.();
    const currentOptions = this.controller.getCurrentOptions();
    if (typeof currentOptions !== 'undefined') {
      panel?.write?.(currentOptions);
    }
    this.setApplyButtonDirty(false);
    panel?.onDirty?.((isDirty) => {
      this.controller.setDirty(isDirty);
      this.setApplyButtonDirty(isDirty);
    });
    panel?.onApply?.((options) => {
      this.controller.apply(options);
      this.setApplyButtonDirty(false);
    });
    this.services.updateHelpHints?.();
  }

  getActivePanel() {
    return this.activePanel;
  }

  getPanels() {
    return this.panelDefinitions;
  }

  setApplyButtonDirty(isDirty) {
    const applyButton = this.root.querySelector('[data-role="apply-options-button"]');
    if (!applyButton) {
      return;
    }

    applyButton.disabled = isDirty !== true;
    applyButton.setAttribute('aria-disabled', applyButton.disabled ? 'true' : 'false');
  }

  destroy() {
    this.activePanel?.destroy?.();
    this.root.innerHTML = '';
    this.root.style.display = '';
    this.activePanel = null;
  }
}

export { FormatOptionsPanelView };
