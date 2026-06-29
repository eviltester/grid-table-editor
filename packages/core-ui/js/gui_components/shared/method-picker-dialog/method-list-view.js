import { escapeHtml } from './method-picker-dialog-utils.js';

class MethodListView {
  constructor({ root, controller, callbacks = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.callbacks = callbacks;
    this.pendingFocusCommand = '';
    this.handleClick = (event) => {
      const command = event.target?.closest?.('[data-command]')?.getAttribute?.('data-command');
      if (command) {
        this.pendingFocusCommand = command;
        this.callbacks.onSelectCommand?.(command);
      }
    };
    this.handleKeyDown = (event) => this.onKeyDown(event);
  }

  mount() {
    if (!this.root) {
      throw new Error('MethodListView requires a root element');
    }
    this.root.className = 'method-picker-list';
    this.root.setAttribute('data-role', 'method-picker-list');
    this.root.setAttribute('role', 'listbox');
    this.root.setAttribute('aria-label', 'Methods');
    this.root.setAttribute('aria-orientation', 'vertical');
    this.root.addEventListener('click', this.handleClick);
    this.root.addEventListener('keydown', this.handleKeyDown);
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
          <div
            class="method-picker-tile ${isSelected ? 'is-selected' : ''}"
            data-role="method-picker-tile"
            data-command="${escapeHtml(option.command)}"
            role="option"
            aria-selected="${isSelected ? 'true' : 'false'}"
            tabindex="${option.command === this.getTabbableCommand(state) ? '0' : '-1'}"
          >
            <span class="method-picker-tile-command" data-role="method-picker-command">${escapeHtml(option.command)}</span>
            <span class="method-picker-tile-summary">${escapeHtml(option.helpModel?.summary || '')}</span>
            <span class="method-picker-tile-tag">${escapeHtml(option.sourceType)}</span>
          </div>`;
      })
      .join('');
    this.focusPendingCommand();
  }

  getTabbableCommand(state) {
    if (state.options.some((option) => option.command === state.selectedCommand)) {
      return state.selectedCommand;
    }
    return state.options[0]?.command || '';
  }

  onKeyDown(event) {
    const movementByKey = {
      ArrowDown: 1,
      ArrowRight: 1,
      ArrowUp: -1,
      ArrowLeft: -1,
    };
    const isMovementKey = Object.prototype.hasOwnProperty.call(movementByKey, event.key);
    const isBoundaryKey = event.key === 'Home' || event.key === 'End';
    if (!isMovementKey && !isBoundaryKey) {
      return;
    }

    const currentTile = event.target?.closest?.('[data-role="method-picker-tile"]');
    if (!currentTile) {
      return;
    }

    const tiles = Array.from(this.root.querySelectorAll('[data-role="method-picker-tile"]'));
    const currentIndex = tiles.indexOf(currentTile);
    if (currentIndex < 0 || tiles.length === 0) {
      return;
    }

    event.preventDefault();
    let nextIndex = currentIndex;
    if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = tiles.length - 1;
    } else {
      nextIndex = (currentIndex + movementByKey[event.key] + tiles.length) % tiles.length;
    }

    const nextCommand = tiles[nextIndex]?.getAttribute('data-command') || '';
    if (!nextCommand) {
      return;
    }
    this.pendingFocusCommand = nextCommand;
    this.callbacks.onSelectCommand?.(nextCommand);
  }

  focusPendingCommand() {
    if (!this.pendingFocusCommand) {
      return;
    }
    const command = this.pendingFocusCommand;
    this.pendingFocusCommand = '';
    this.focusCommand(command);
  }

  focusCommand(command) {
    const selectedCommand = String(command || '');
    const tile = Array.from(this.root.querySelectorAll('[data-role="method-picker-tile"]')).find(
      (element) => element.getAttribute('data-command') === selectedCommand
    );
    tile?.focus?.();
  }

  destroy() {
    this.root?.removeEventListener('click', this.handleClick);
    this.root?.removeEventListener('keydown', this.handleKeyDown);
    this.root?.replaceChildren();
  }
}

export { MethodListView };
