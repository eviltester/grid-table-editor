export class TimedErrorDisplay {
  constructor({ documentObj = document, elementId, timeoutMs = 5000 } = {}) {
    this.documentObj = documentObj;
    this.elementId = elementId;
    this.timeoutMs = timeoutMs;
    this.timeoutId = null;
  }

  clear() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    const element = this.documentObj.getElementById(this.elementId);
    if (element) {
      element.textContent = '';
    }
  }

  show(message) {
    const text = String(message || '').trim();
    if (!text) {
      this.clear();
      return;
    }
    const element = this.documentObj.getElementById(this.elementId);
    if (!element) {
      return;
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    element.textContent = text;
    this.timeoutId = setTimeout(() => {
      this.timeoutId = null;
      element.textContent = '';
    }, this.timeoutMs);
  }
}
