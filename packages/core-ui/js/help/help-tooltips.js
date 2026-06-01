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

function upsertInlineHelpItems(documentObj, entries) {
  const container = ensureInlineHelpContainer(documentObj);
  Object.entries(entries).forEach(([key, html]) => {
    let item = container.querySelector(`div[data-name='${key}']`);
    if (!item) {
      item = documentObj.createElement('div');
      item.setAttribute('data-name', key);
      container.appendChild(item);
    }
    item.innerHTML = html;
  });
}

function createUpdateHelpHints(documentObj, rootElement = documentObj) {
  return function updateHelpHints() {
    const tippyFn = globalThis?.tippy;
    if (typeof tippyFn !== 'function') {
      return;
    }

    upsertInlineHelpItems(documentObj, sharedInlineHelpEntries);

    const helpIcons = rootElement?.querySelectorAll?.('.helpicon[data-help]') || [];
    helpIcons.forEach((element) => {
      element?._tippy?.destroy?.();
      const tagName = String(element?.tagName || '').toLowerCase();
      const isNativeButton = tagName === 'button';
      const isNativeLink = tagName === 'a';
      if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }
      if (!isNativeButton && !isNativeLink && !element.hasAttribute('role')) {
        element.setAttribute('role', 'button');
      }
      if (!element.hasAttribute('aria-label')) {
        const isOptionHelp = element.classList.contains('option-help-icon');
        element.setAttribute('aria-label', isOptionHelp ? 'Show help for this option' : 'Show help');
      }
    });

    tippyFn(helpIcons, {
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
      interactiveBorder: 16,
      delay: [250, 300],
      hideOnClick: false,
      appendTo: () => documentObj.body,
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

export { createUpdateHelpHints, initHelpTooltips };
