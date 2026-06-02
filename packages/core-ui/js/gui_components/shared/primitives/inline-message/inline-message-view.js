const INLINE_MESSAGE_SPINNER_STYLE_ID = 'inline-message-spinner-style';

function ensureSpinnerStyles(documentObj) {
  if (!documentObj?.head) {
    return;
  }
  if (documentObj.getElementById(INLINE_MESSAGE_SPINNER_STYLE_ID)) {
    return;
  }

  const style = documentObj.createElement('style');
  style.id = INLINE_MESSAGE_SPINNER_STYLE_ID;
  style.textContent = `
    @keyframes inline-message-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    [data-role="dismiss-button"]::before {
      content: '×';
      display: inline-block;
      line-height: 1;
    }
  `;
  documentObj.head.appendChild(style);
}

class InlineMessageView {
  constructor({ root, controller } = {}) {
    this.root = root;
    this.controller = controller;
    this.loadingIndicator = null;
    this.messageText = null;
    this.dismissButton = null;
  }

  mount() {
    if (!this.root) {
      throw new Error('InlineMessageView requires a root element');
    }
    this.ensureStructure();
    this.render();
  }

  ensureStructure() {
    if (!this.root) {
      return;
    }

    ensureSpinnerStyles(this.root.ownerDocument);

    if (this.loadingIndicator && this.messageText && this.dismissButton) {
      return;
    }

    this.root.replaceChildren();

    this.loadingIndicator = this.root.ownerDocument.createElement('span');
    this.loadingIndicator.setAttribute('data-role', 'loading-indicator');
    this.loadingIndicator.setAttribute('aria-hidden', 'true');
    Object.assign(this.loadingIndicator.style, {
      display: 'none',
      width: '0.85rem',
      height: '0.85rem',
      marginRight: '0.4rem',
      border: '2px solid currentColor',
      borderRightColor: 'transparent',
      borderRadius: '999px',
      verticalAlign: 'text-bottom',
      animation: 'inline-message-spin 0.7s linear infinite',
      opacity: '0.8',
      boxSizing: 'border-box',
    });

    this.messageText = this.root.ownerDocument.createElement('span');
    this.messageText.setAttribute('data-role', 'message-text');

    this.dismissButton = this.root.ownerDocument.createElement('button');
    this.dismissButton.type = 'button';
    this.dismissButton.setAttribute('data-role', 'dismiss-button');
    this.dismissButton.setAttribute('aria-label', 'Dismiss message');
    this.dismissButton.title = 'Dismiss message';
    Object.assign(this.dismissButton.style, {
      display: 'none',
      marginLeft: '0.5rem',
      width: '1rem',
      height: '1rem',
      padding: '0',
      border: '0',
      background: 'transparent',
      color: 'inherit',
      cursor: 'pointer',
      font: 'inherit',
      lineHeight: '1',
      position: 'relative',
    });
    this.dismissButton.addEventListener('click', () => {
      this.controller.clear();
    });

    this.root.append(this.loadingIndicator, this.messageText, this.dismissButton);
  }

  render() {
    if (!this.root) {
      return;
    }

    this.ensureStructure();
    const state = this.controller.getState();
    const hasMessage = Boolean(state.message);
    const showLoading = state.isLoading === true && hasMessage;
    const showDismissButton = state.dismissable === true && hasMessage;

    this.messageText.textContent = state.message || '';
    this.loadingIndicator.style.display = showLoading ? 'inline-block' : 'none';
    this.dismissButton.style.display = showDismissButton ? 'inline-block' : 'none';
    this.root.classList.toggle(state.loadingClassName, state.isLoading === true && Boolean(state.message));

    if (state.severity) {
      this.root.setAttribute('data-severity', state.severity);
    } else {
      this.root.removeAttribute('data-severity');
    }

    if (state.hideWhenEmpty) {
      this.root.style.display = state.message ? state.visibleDisplay : 'none';
    } else if (this.root.style.display === 'none') {
      this.root.style.display = '';
    }
  }

  destroy() {
    if (!this.root) {
      return;
    }
    const state = this.controller.getState();
    this.ensureStructure();
    this.loadingIndicator.style.display = 'none';
    this.messageText.textContent = '';
    this.dismissButton.style.display = 'none';
    this.root.classList.remove(state.loadingClassName);
    this.root.removeAttribute('data-severity');
    if (state.hideWhenEmpty) {
      this.root.style.display = 'none';
    }
  }
}

export { InlineMessageView };
