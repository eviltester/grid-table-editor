class FormatOptionsPanelView {
  constructor({ root, controller, documentObj = document, windowObj, services = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = documentObj;
    this.windowObj = windowObj;
    this.services = services;
    this.panels = {};
    this.activePanel = null;
  }

  mount() {
    this.panels = this.services.createPanelsForParent?.(this.root) || {};
    this.render();
  }

  render() {
    const selectedFormat = this.controller.getSelectedFormat();
    const panel = selectedFormat ? this.panels[selectedFormat] : null;
    this.activePanel = panel || null;

    if (!panel) {
      this.controller.setSupported(false);
      this.root.innerHTML = '';
      this.root.style.display = 'none';
      return;
    }

    this.controller.setSupported(true);
    this.root.style.display = 'block';
    panel.addToGui();
    const currentOptions = this.controller.getCurrentOptions();
    if (typeof currentOptions !== 'undefined') {
      panel.setFromOptions?.(currentOptions);
    }
    this.bindDirtyState();
    panel.setApplyCallback?.((options) => {
      this.controller.apply(options);
      this.setApplyButtonDirty(false);
    });
    this.services.updateHelpHints?.();
  }

  getActivePanel() {
    return this.activePanel;
  }

  getPanels() {
    return this.panels;
  }

  setApplyButtonDirty(isDirty) {
    const applyButton = this.root.querySelector('.apply-options');
    if (!applyButton) {
      return;
    }

    applyButton.disabled = isDirty !== true;
    applyButton.setAttribute('aria-disabled', applyButton.disabled ? 'true' : 'false');
  }

  bindDirtyState() {
    const panelRoot = this.root.firstElementChild;
    if (!panelRoot) {
      return;
    }

    this.setApplyButtonDirty(false);

    const markDirty = (event) => {
      const target = event?.target;
      if (!target || typeof target.closest !== 'function') {
        return;
      }
      if (target.closest('.apply-options')) {
        return;
      }
      this.controller.setDirty(true);
      this.setApplyButtonDirty(true);
    };

    panelRoot.addEventListener('input', markDirty);
    panelRoot.addEventListener('change', markDirty);
  }

  destroy() {
    this.root.innerHTML = '';
    this.root.style.display = '';
    this.activePanel = null;
  }
}

export { FormatOptionsPanelView };
