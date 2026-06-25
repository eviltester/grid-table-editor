import { escapeHtml } from './method-picker-dialog-utils.js';

class MethodListView {
  constructor({ root, controller, callbacks = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.callbacks = callbacks;
    this.handleClick = (event) => {
      const command = event.target?.closest?.('[data-command]')?.getAttribute?.('data-command');
      if (command) {
        this.callbacks.onSelectCommand?.(command);
      }
    };
  }

  mount() {
    if (!this.root) {
      throw new Error('MethodListView requires a root element');
    }
    this.root.className = 'method-picker-list';
    this.root.setAttribute('data-role', 'method-picker-list');
    this.root.setAttribute('aria-label', 'Methods');
    this.root.addEventListener('click', this.handleClick);
    this.render();
  }

  render() {
    const state = this.controller.getState();
    if (state.options.length === 0) {
      this.root.innerHTML = '<p class="method-picker-empty">No methods match the current filter.</p>';
      return;
    }
    this.root.innerHTML = state.options
      .map((option) => {
        const isSelected = option.command === state.selectedCommand;
        return `
          <button
            type="button"
            class="method-picker-tile ${isSelected ? 'is-selected' : ''}"
            data-role="method-picker-tile"
            data-command="${escapeHtml(option.command)}"
          >
            <span class="method-picker-tile-command" data-role="method-picker-command">${escapeHtml(option.command)}</span>
            <span class="method-picker-tile-summary">${escapeHtml(option.helpModel?.summary || '')}</span>
            <span class="method-picker-tile-tag">${escapeHtml(option.sourceType)}</span>
          </button>`;
      })
      .join('');
  }

  destroy() {
    this.root?.removeEventListener('click', this.handleClick);
    this.root?.replaceChildren();
  }
}

export { MethodListView };
