function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

class InstructionsView {
  constructor({ root, controller, services = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.services = services;
  }

  mount() {
    if (!this.root) {
      throw new Error('InstructionsView requires a root element');
    }

    this.root.innerHTML = this.template();
    this.services.updateHelpHints?.();
  }

  template() {
    const state = this.controller.getState();
    const itemsHtml = (state.items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
    const actionsHtml = (state.actions || [])
      .map((action) => {
        const className = escapeHtml(action.className || '');
        const label = escapeHtml(action.label || '');
        return `<button type="button" class="${className}">${label}</button>`;
      })
      .join('');
    const helpAttributes = state.helpText ? ` data-help-text="${escapeHtml(state.helpText)}"` : '';
    const openAttribute = state.initiallyOpen ? ' open' : '';
    const footerHtml = state.footerHtml || '';

    return `
      <div class="instructions">
        <details${openAttribute}>
          <summary>
            ${escapeHtml(state.title)}
            <span data-help="${escapeHtml(state.helpKey || '')}" class="helpicon"${helpAttributes}></span>
          </summary>
          <ul>${itemsHtml}</ul>
          ${actionsHtml}
          ${footerHtml}
        </details>
      </div>
    `;
  }

  render() {
    this.root.innerHTML = this.template();
    this.services.updateHelpHints?.();
  }

  destroy() {
    this.root.replaceChildren();
  }
}

export { InstructionsView };
