import { escapeHtml } from './method-picker-dialog-utils.js';

class MethodNavigatorView {
  constructor({ root, controller, callbacks = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.callbacks = callbacks;
    this.handleInput = (event) => {
      this.callbacks.onSearchTermChange?.(event?.currentTarget?.value || '');
    };
    this.handleTabClick = (event) => {
      const tabId = event.target?.closest?.('[data-role="method-picker-tab"]')?.getAttribute?.('data-tab');
      if (tabId) {
        this.callbacks.onTabChange?.(tabId);
      }
    };
  }

  mount() {
    if (!this.root) {
      throw new Error('MethodNavigatorView requires a root element');
    }
    this.root.className = 'method-picker-toolbar';
    this.root.innerHTML = `
      <input
        type="search"
        class="method-picker-search"
        data-role="method-picker-search"
        placeholder="Filter domain or method..."
        aria-label="Filter methods"
      />
      <div class="method-picker-tabs" data-role="method-picker-tabs"></div>
    `;
    this.searchInput = this.root.querySelector('[data-role="method-picker-search"]');
    this.tabsElement = this.root.querySelector('[data-role="method-picker-tabs"]');
    this.searchInput?.addEventListener('input', this.handleInput);
    this.tabsElement?.addEventListener('click', this.handleTabClick);
    this.render();
  }

  render() {
    const state = this.controller.getState();
    if (this.searchInput && this.searchInput.value !== state.searchTerm) {
      this.searchInput.value = state.searchTerm;
    }
    if (this.tabsElement) {
      this.tabsElement.innerHTML = state.tabSpecs
        .map(
          (tab) =>
            `<button type="button" data-role="method-picker-tab" data-tab="${escapeHtml(tab.id)}" class="${
              tab.id === state.activeTab ? 'is-active' : ''
            }">${escapeHtml(tab.label)}</button>`
        )
        .join('');
    }
  }

  focusSearch() {
    this.searchInput?.focus?.();
  }

  isSearchFocused(documentObj) {
    return documentObj?.activeElement === this.searchInput;
  }

  destroy() {
    this.searchInput?.removeEventListener('input', this.handleInput);
    this.tabsElement?.removeEventListener('click', this.handleTabClick);
    this.root?.replaceChildren();
  }
}

export { MethodNavigatorView };
