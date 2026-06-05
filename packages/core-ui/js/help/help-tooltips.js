import { appOnlyInlineHelpEntries, sharedInlineHelpEntries } from './inline-help-content.js';
import { getDefaultDocumentObj, resolveWindowObj } from '../gui_components/shared/dom/default-objects.js';
import { decorateIconContainer } from '../gui_components/shared/primitives/icon/index.js';

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
  return container;
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
  return container;
}

function buildHelpTooltipContent(reference, inlineHelpContainer) {
  const id = reference.getAttribute('data-help');
  const inlineHelpText = reference.getAttribute('data-help-text');
  if (inlineHelpText) {
    return inlineHelpText;
  }

  if (!inlineHelpContainer || !id) {
    return '';
  }
  const helpText = inlineHelpContainer.querySelector(`div[data-name='${id}']`);
  if (helpText) {
    return helpText.innerHTML;
  }

  console.log('TODO: Create help for ' + id);
  return '';
}

function decorateHelpIcon(element) {
  element?._tippy?.destroy?.();
  decorateIconContainer(element, 'circle-help', {
    className: 'app-icon helpicon-svg',
    size: 16,
  });
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
}

function createHelpTooltipService({
  documentObj = getDefaultDocumentObj(),
  windowObj,
  rootElement = documentObj,
  entries = sharedInlineHelpEntries,
  registerWindowHook = false,
  tippyFn,
} = {}) {
  const resolvedWindowObj = resolveWindowObj(windowObj, documentObj);

  const update = () => {
    if (!documentObj) {
      return;
    }

    const inlineHelpContainer = upsertInlineHelpItems(documentObj, entries);

    const helpIcons = rootElement?.querySelectorAll?.('.helpicon[data-help]') || [];
    helpIcons.forEach((element) => {
      decorateHelpIcon(element);
    });

    const resolvedTippyFn = tippyFn || resolvedWindowObj?.tippy;
    if (typeof resolvedTippyFn !== 'function') {
      return;
    }

    resolvedTippyFn(helpIcons, {
      content(reference) {
        return buildHelpTooltipContent(reference, inlineHelpContainer);
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

  const destroy = () => {
    const helpIcons = rootElement?.querySelectorAll?.('.helpicon[data-help]') || [];
    helpIcons.forEach((element) => {
      element?._tippy?.destroy?.();
    });
    if (registerWindowHook) {
      if (resolvedWindowObj?.updateHelpHints === update) {
        delete resolvedWindowObj.updateHelpHints;
      }
    }
  };

  if (registerWindowHook && resolvedWindowObj) {
    resolvedWindowObj.updateHelpHints = update;
  }

  return {
    update,
    destroy,
  };
}

function createUpdateHelpHints(documentObj, rootElement = documentObj, { windowObj, tippyFn } = {}) {
  return createHelpTooltipService({
    documentObj,
    windowObj,
    rootElement,
    entries: sharedInlineHelpEntries,
    tippyFn,
  }).update;
}

function initHelpTooltips({
  documentObj = getDefaultDocumentObj(),
  windowObj,
  includeAppOnlyEntries = false,
  tippyFn,
} = {}) {
  if (!documentObj) {
    return null;
  }
  const entries = includeAppOnlyEntries
    ? { ...sharedInlineHelpEntries, ...appOnlyInlineHelpEntries }
    : sharedInlineHelpEntries;

  renderInlineHelpItems(documentObj, entries);

  const service = createHelpTooltipService({
    documentObj,
    windowObj,
    entries,
    registerWindowHook: true,
    tippyFn,
  });
  service.update();
  return service;
}

export { createHelpTooltipService, createUpdateHelpHints, initHelpTooltips };
