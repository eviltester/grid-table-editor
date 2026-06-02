import { scheduleTimeout } from '../../unref-timeout.js';

function normalizeProps(props = {}) {
  return {
    message: `${props.message ?? ''}`,
    severity: props.severity || '',
    isLoading: props.isLoading === true,
    dismissable: props.dismissable === true,
    hideWhenEmpty: props.hideWhenEmpty === true,
    visibleDisplay: props.visibleDisplay || 'inline-block',
    loadingClassName: props.loadingClassName || 'is-loading',
    timeoutMs: Number.isFinite(props.timeoutMs) ? props.timeoutMs : 5000,
  };
}

class InlineMessageController {
  constructor({ props = {}, callbacks = {} } = {}) {
    this.callbacks = callbacks;
    this.props = normalizeProps(props);
    this.state = { ...this.props };
    this.timeoutId = null;
  }

  emitChange() {
    this.callbacks.onStateChanged?.(this.getState());
  }

  getState() {
    return { ...this.state };
  }

  updateProps(nextProps = {}) {
    this.props = normalizeProps({ ...this.props, ...nextProps });
    this.state = {
      ...this.props,
      message: Object.prototype.hasOwnProperty.call(nextProps, 'message')
        ? `${nextProps.message ?? ''}`
        : this.state.message,
      severity: Object.prototype.hasOwnProperty.call(nextProps, 'severity')
        ? nextProps.severity || ''
        : this.state.severity,
      isLoading: Object.prototype.hasOwnProperty.call(nextProps, 'isLoading')
        ? nextProps.isLoading === true
        : this.state.isLoading,
      dismissable: Object.prototype.hasOwnProperty.call(nextProps, 'dismissable')
        ? nextProps.dismissable === true
        : this.state.dismissable,
    };
    this.emitChange();
  }

  clearPendingReset() {
    if (this.timeoutId === null) {
      return;
    }
    clearTimeout(this.timeoutId);
    this.timeoutId = null;
  }

  setStatus(message, options = {}) {
    const normalizedOptions =
      typeof options === 'boolean'
        ? { isLoading: options }
        : {
            severity: options?.severity || '',
            dismissable: options?.dismissable === true,
            isLoading: options?.isLoading === true,
          };
    this.clearPendingReset();
    this.state = {
      ...this.state,
      message: `${message ?? ''}`,
      severity: (normalizedOptions.severity || '') === 'normal' ? '' : normalizedOptions.severity || '',
      dismissable: normalizedOptions.dismissable === true && Boolean(message),
      isLoading: normalizedOptions.isLoading === true && Boolean(message),
    };
    this.emitChange();
  }

  show(message, { severity = 'error', timeoutMs = this.props.timeoutMs, sticky = false, isLoading = false } = {}) {
    const text = String(message ?? '').trim();
    if (!text) {
      this.clear();
      return;
    }

    const normalizedSeverity = severity === 'normal' ? '' : severity || '';

    this.clearPendingReset();
    this.state = {
      ...this.state,
      message: text,
      severity: normalizedSeverity,
      dismissable: false,
      isLoading: isLoading === true,
    };
    this.emitChange();

    if (sticky) {
      return;
    }

    const delayMs = Number.isFinite(timeoutMs) ? timeoutMs : this.props.timeoutMs;
    this.timeoutId = scheduleTimeout(() => {
      this.timeoutId = null;
      this.state = {
        ...this.state,
        message: '',
        severity: '',
        dismissable: false,
        isLoading: false,
      };
      this.emitChange();
    }, delayMs);
  }

  scheduleClear(delayMs = this.props.timeoutMs) {
    this.clearPendingReset();
    this.timeoutId = scheduleTimeout(() => {
      this.timeoutId = null;
      this.state = {
        ...this.state,
        message: '',
        severity: '',
        dismissable: false,
        isLoading: false,
      };
      this.emitChange();
    }, delayMs);
  }

  clear() {
    this.clearPendingReset();
    this.state = {
      ...this.state,
      message: '',
      severity: '',
      dismissable: false,
      isLoading: false,
    };
    this.emitChange();
  }

  destroy() {
    this.clearPendingReset();
  }
}

export { InlineMessageController };
