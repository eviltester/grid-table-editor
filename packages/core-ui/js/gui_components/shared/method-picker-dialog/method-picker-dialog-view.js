import { createMethodHelpDisplay } from './method-help-display.js';
import { createMethodList } from './method-list.js';
import { createMethodNavigator } from './method-navigator.js';
import { escapeHtml } from './method-picker-dialog-utils.js';

class MethodPickerDialogView {
  constructor({ root, controller, callbacks = {}, documentObj } = {}) {
    this.root = root;
    this.controller = controller;
    this.callbacks = callbacks;
    this.documentObj = documentObj;
    this.handleOverlayClick = (event) => this.onOverlayClick(event);
    this.handleKeyDown = (event) => this.onKeyDown(event);
  }

  mount() {
    if (!this.root) {
      throw new Error('MethodPickerDialogView requires a root element');
    }
    const state = this.controller.getState();
    this.root.className = 'method-picker-overlay';
    this.root.setAttribute('data-role', 'method-picker-overlay');
    this.root.innerHTML = `
      <div class="method-picker-modal" data-role="method-picker-dialog" role="dialog" aria-modal="true" aria-label="${escapeHtml(
        state.title
      )}">
        <header class="method-picker-header">
          <h3>${escapeHtml(state.title)}</h3>
          <button type="button" class="method-picker-close" data-role="method-picker-close-button" aria-label="Close">×</button>
        </header>
        <div data-role="method-picker-navigator-root"></div>
        <div class="method-picker-content">
          <div data-role="method-picker-list-root"></div>
          <aside data-role="method-picker-detail-root"></aside>
        </div>
        <footer class="method-picker-footer">
          <button type="button" data-role="method-picker-cancel-button">Cancel</button>
          <button type="button" data-role="method-picker-apply-button" class="method-picker-apply">Apply</button>
        </footer>
      </div>
    `;

    this.navigator = createMethodNavigator({
      root: this.root.querySelector('[data-role="method-picker-navigator-root"]'),
      props: this.getNavigatorProps(),
      callbacks: {
        onSearchTermChange: (searchTerm) => {
          this.controller.setSearchTerm(searchTerm);
          this.render();
        },
        onTabChange: (tabId) => {
          this.controller.setActiveTab(tabId);
          this.render();
        },
      },
    });
    this.list = createMethodList({
      root: this.root.querySelector('[data-role="method-picker-list-root"]'),
      props: this.getListProps(),
      callbacks: {
        onSelectCommand: (command) => {
          this.controller.selectCommand(command);
          this.render();
        },
      },
    });
    this.helpDisplay = createMethodHelpDisplay({
      root: this.root.querySelector('[data-role="method-picker-detail-root"]'),
      props: this.getHelpDisplayProps(),
    });
    this.applyButton = this.root.querySelector('[data-role="method-picker-apply-button"]');
    this.root.addEventListener('click', this.handleOverlayClick);
    this.root.addEventListener('keydown', this.handleKeyDown);
    this.updateApplyButtonState();
  }

  getNavigatorProps() {
    const state = this.controller.getState();
    return {
      activeTab: state.activeTab,
      searchTerm: state.searchTerm,
      tabSpecs: state.tabSpecs,
    };
  }

  getListProps() {
    const state = this.controller.getState();
    return {
      options: state.filteredOptions,
      selectedCommand: state.selectedCommand,
    };
  }

  getHelpDisplayProps() {
    return {
      selectedOption: this.controller.getState().selectedOption,
    };
  }

  render() {
    this.navigator?.update(this.getNavigatorProps());
    this.list?.update(this.getListProps());
    this.helpDisplay?.update(this.getHelpDisplayProps());
    this.updateApplyButtonState();
  }

  updateApplyButtonState() {
    const state = this.controller.getState();
    if (this.applyButton) {
      this.applyButton.disabled = state.applyDisabled;
      this.applyButton.setAttribute('aria-disabled', state.applyDisabled ? 'true' : 'false');
    }
  }

  onOverlayClick(event) {
    if (event.target === this.root) {
      this.callbacks.onCancel?.({ reason: 'backdrop' });
      return;
    }
    if (event.target?.closest?.('[data-role="method-picker-close-button"]')) {
      this.callbacks.onCancel?.({ reason: 'close' });
      return;
    }
    if (event.target?.closest?.('[data-role="method-picker-cancel-button"]')) {
      this.callbacks.onCancel?.({ reason: 'cancel' });
      return;
    }
    if (event.target?.closest?.('[data-role="method-picker-apply-button"]')) {
      const selection = this.controller.applySelection();
      if (selection) {
        this.callbacks.onApply?.(selection);
      }
    }
  }

  onKeyDown(event) {
    if (event.key === 'Tab') {
      this.wrapFocusWithinDialog(event);
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      this.callbacks.onCancel?.({ reason: 'escape' });
      return;
    }
    if (event.key === '/' && !this.navigator?.isSearchFocused(this.documentObj)) {
      event.preventDefault();
      this.navigator?.focusSearch();
      return;
    }
    if (event.key === 'Enter' && this.navigator?.isSearchFocused(this.documentObj)) {
      event.preventDefault();
      this.activateCommandWithEnter(this.controller.getFilteredOptions()[0]?.command || '');
      return;
    }
    if (event.key === 'Enter') {
      const focusedCommand = this.getFocusedTileCommand();
      if (focusedCommand) {
        event.preventDefault();
        this.activateCommandWithEnter(focusedCommand, { restoreListFocus: true });
      }
    }
  }

  activateCommandWithEnter(command, { restoreListFocus = false } = {}) {
    const result = this.controller.activateCommandWithEnter(command);
    if (result.action === 'apply' && result.selection) {
      this.callbacks.onApply?.(result.selection);
      return;
    }
    if (result.action === 'preview') {
      this.render();
      if (restoreListFocus) {
        this.list?.focusCommand(command);
      }
    }
  }

  getFocusedTileCommand() {
    const activeElement = this.documentObj?.activeElement;
    const tile = activeElement?.closest?.('[data-role="method-picker-tile"]');
    if (!tile || !this.root?.contains?.(tile)) {
      return '';
    }
    return tile.getAttribute('data-command') || '';
  }

  wrapFocusWithinDialog(event) {
    const dialog = this.root?.querySelector?.('[data-role="method-picker-dialog"]');
    const focusable = Array.from(
      dialog?.querySelectorAll?.(
        'button:not([disabled]):not([tabindex="-1"]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ) || []
    ).filter((element) => element.getAttribute('aria-hidden') !== 'true');
    if (focusable.length === 0) {
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const activeElement = this.documentObj?.activeElement;
    if (event.shiftKey && activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }
    if (!event.shiftKey && activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  focusSearch() {
    this.navigator?.focusSearch();
  }

  destroy() {
    this.root?.removeEventListener('click', this.handleOverlayClick);
    this.root?.removeEventListener('keydown', this.handleKeyDown);
    this.navigator?.destroy();
    this.list?.destroy();
    this.helpDisplay?.destroy();
    this.root?.replaceChildren();
  }
}

export { MethodPickerDialogView };
