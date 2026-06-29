import {
  escapeHtml,
  getReturnExamples,
  getUsageFunctionCalls,
  renderExampleList,
  renderParameterDetailsTable,
  renderParameterTypesTable,
  renderUsageExamples,
  toSafeDocsUrl,
} from './method-picker-dialog-utils.js';

class MethodHelpDisplayView {
  constructor({ root, controller } = {}) {
    this.root = root;
    this.controller = controller;
  }

  mount() {
    if (!this.root) {
      throw new Error('MethodHelpDisplayView requires a root element');
    }
    this.root.className = 'method-picker-detail';
    this.root.setAttribute('data-role', 'method-picker-detail');
    this.root.setAttribute('aria-label', 'Method details');
    this.render();
  }

  render() {
    const selected = this.controller.getState().selectedOption;
    if (!selected) {
      this.root.innerHTML = '<p class="method-picker-empty">No method selected</p>';
      return;
    }
    const model = selected.helpModel || {};
    const usageExamples = getUsageFunctionCalls(model);
    const returnExamples = getReturnExamples(model);
    const docsUrl = toSafeDocsUrl(model.docsUrl);
    const hasParams = Array.isArray(model.params) && model.params.length > 0;
    this.root.innerHTML = `
      <h4>${escapeHtml(selected.command)}</h4>
      <p>${escapeHtml(model.summary || 'No summary available.')}</p>
      <p><strong>Schema:</strong> <code>${escapeHtml(model.heading || selected.command)}()</code></p>
      <h5>Parameter Details</h5>
      <div class="method-picker-table-wrap">${renderParameterDetailsTable(model)}</div>
      ${hasParams ? `<h5>Parameter Types</h5><div class="method-picker-table-wrap">${renderParameterTypesTable(model)}</div>` : ''}
      ${usageExamples.length ? `<h5>Usage Examples</h5>${renderUsageExamples(model, selected.command)}` : ''}
      ${usageExamples.length === 0 ? `<h5>Return Examples</h5>${renderExampleList(returnExamples, 'No return examples available')}` : ''}
      ${
        docsUrl
          ? `<p class="method-picker-docs-link"><a href="${escapeHtml(docsUrl)}" target="_blank" rel="noopener noreferrer">Open documentation</a></p>`
          : ''
      }
    `;
  }

  destroy() {
    this.root?.replaceChildren();
  }
}

export { MethodHelpDisplayView };
