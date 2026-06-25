import { renderIconHtml } from '../primitives/icon/icon-core.js';

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

  renderInstructionItem(item) {
    if (typeof item !== 'object' || item === null) {
      return `<li>${escapeHtml(item)}</li>`;
    }

    const text = escapeHtml(item.text || '');
    const title = item.title ? ` title="${escapeHtml(item.title)}"` : '';
    const iconHtml = this.renderInstructionItemIcon(item.icon, title);

    return `<li>${iconHtml}<span>${text}</span></li>`;
  }

  renderInstructionItemIcon(iconName, title) {
    if (!iconName) {
      return '';
    }

    try {
      return `<span class="instruction-item-icon"${title}>${renderIconHtml(iconName, {
        className: 'app-icon instruction-action-icon',
      })}</span>`;
    } catch {
      return '';
    }
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
    const itemsHtml = (state.items || []).map((item) => this.renderInstructionItem(item)).join('');
    const actionsHtml = (state.actions || [])
      .map((action) => {
        const className = escapeHtml(action.className || '');
        const label = escapeHtml(action.label || '');
        const actionId = escapeHtml(action.actionId || '');
        return `<button type="button" class="${className}" data-role="instructions-action-button" data-action-id="${actionId}" aria-label="${label}" title="${label}">${label}</button>`;
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
            <button type="button" data-help="${escapeHtml(state.helpKey || '')}" data-help-role="help-icon" class="helpicon"${helpAttributes}></button>
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
