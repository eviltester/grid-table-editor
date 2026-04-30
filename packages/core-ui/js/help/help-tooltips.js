import { appOnlyInlineHelpEntries, sharedInlineHelpEntries } from './inline-help-content.js';

function ensureInlineHelpContainer(documentObj) {
  let container = documentObj.getElementById('inline-help-items');
  if (!container) {
    container = documentObj.createElement('div');
    container.id = 'inline-help-items';
    container.style.display = 'none';
    documentObj.body.appendChild(container);
  }
  return container;
}

function renderInlineHelpItems(documentObj, entries) {
  const container = ensureInlineHelpContainer(documentObj);
  container.innerHTML = '';
  Object.entries(entries).forEach(([key, html]) => {
    const item = documentObj.createElement('div');
    item.setAttribute('data-name', key);
    item.innerHTML = html;
    container.appendChild(item);
  });
}

function createUpdateHelpHints(documentObj) {
  return function updateHelpHints() {
    const tippyFn = globalThis?.tippy;
    if (typeof tippyFn !== 'function') {
      return;
    }

    tippyFn('.helpicon[data-help]', {
      content(reference) {
        const id = reference.getAttribute('data-help');
        const inlineHelpText = reference.getAttribute('data-help-text');
        if (inlineHelpText) {
          return inlineHelpText;
        }

        const helpItems = documentObj.getElementById('inline-help-items');
        if (!helpItems || !id) {
          return '';
        }
        const helpText = helpItems.querySelector(`div[data-name='${id}']`);
        if (helpText) {
          return helpText.innerHTML;
        }

        console.log('TODO: Create help for ' + id);
        return '';
      },
      placement: 'top-start',
      allowHTML: true,
      interactive: true,
    });
  };
}

function initHelpTooltips({ documentObj = document, includeAppOnlyEntries = false } = {}) {
  const entries = includeAppOnlyEntries
    ? { ...sharedInlineHelpEntries, ...appOnlyInlineHelpEntries }
    : sharedInlineHelpEntries;

  renderInlineHelpItems(documentObj, entries);

  const updateHelpHints = createUpdateHelpHints(documentObj);
  if (typeof window !== 'undefined') {
    window.updateHelpHints = updateHelpHints;
  }
  updateHelpHints();
}

export { initHelpTooltips };
