import { appOnlyInlineHelpEntries, sharedInlineHelpEntries } from './inline-help-content.js';
import { getDefaultDocumentObj, resolveWindowObj } from '../gui_components/shared/dom/default-objects.js';
import { decorateIconContainer } from '../gui_components/shared/primitives/icon/icon-core.js';
import { rewriteRuntimeSiteLinksHtml } from '../gui_components/shared/test-data/help/runtime-docs-url.js';

const GLOBAL_INLINE_HELP_CONTAINER_ID = 'inline-help-items';
const SCOPED_INLINE_HELP_CONTAINER_ROLE = 'inline-help-items';
const DOCUMENT_NODE = 9;

function resolveScopedContainerRoot(documentObj, rootElement) {
  if (!rootElement) {
    return documentObj?.body || documentObj?.documentElement || rootElement;
  }

  if (rootElement.nodeType === DOCUMENT_NODE) {
    return rootElement.body || rootElement.documentElement || rootElement;
  }

  return rootElement;
}

function ensureGlobalInlineHelpContainer(documentObj) {
  let container = documentObj.getElementById(GLOBAL_INLINE_HELP_CONTAINER_ID);
  if (!container) {
    container = documentObj.createElement('div');
    container.id = GLOBAL_INLINE_HELP_CONTAINER_ID;
    container.style.display = 'none';
    documentObj.body.appendChild(container);
  }
  return container;
}

function ensureScopedInlineHelpContainer(documentObj, rootElement) {
  if (!rootElement) {
    return ensureGlobalInlineHelpContainer(documentObj);
  }

  const scopedContainerRoot = resolveScopedContainerRoot(documentObj, rootElement);
  let container = scopedContainerRoot.querySelector(`[data-role="${SCOPED_INLINE_HELP_CONTAINER_ROLE}"]`);
  if (!container) {
    container = documentObj.createElement('div');
    container.style.display = 'none';
    container.setAttribute('data-role', SCOPED_INLINE_HELP_CONTAINER_ROLE);
    scopedContainerRoot.appendChild(container);
  }
  return container;
}

function ensureInlineHelpContainer(documentObj, { rootElement, useGlobalContainer = true } = {}) {
  return useGlobalContainer
    ? ensureGlobalInlineHelpContainer(documentObj)
    : ensureScopedInlineHelpContainer(documentObj, rootElement);
}

function renderInlineHelpItems(documentObj, entries, options = {}) {
  const container = ensureInlineHelpContainer(documentObj, options);
  container.innerHTML = '';
  Object.entries(entries).forEach(([key, html]) => {
    const item = documentObj.createElement('div');
    item.setAttribute('data-name', key);
    item.innerHTML = html;
    container.appendChild(item);
  });
  return container;
}

function upsertInlineHelpItems(documentObj, entries, options = {}) {
  const container = ensureInlineHelpContainer(documentObj, options);
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

function buildHelpTooltipContent(reference, inlineHelpContainer, { documentObj, windowObj } = {}) {
  const id = reference.getAttribute('data-help');
  const inlineHelpText = reference.getAttribute('data-help-text');
  if (inlineHelpText) {
    return rewriteRuntimeSiteLinksHtml(inlineHelpText, { documentObj, windowObj });
  }

  if (!inlineHelpContainer || !id) {
    return '';
  }
  const helpText = inlineHelpContainer.querySelector(`div[data-name='${id}']`);
  if (helpText) {
    return rewriteRuntimeSiteLinksHtml(helpText.innerHTML, { documentObj, windowObj });
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
    const isOptionHelp =
      element.getAttribute('data-role') === 'option-help-icon' ||
      element.getAttribute('data-help-role') === 'option-help-icon';
    element.setAttribute('aria-label', isOptionHelp ? 'Show help for this option' : 'Show help');
  }
  if (!element.hasAttribute('aria-expanded')) {
    element.setAttribute('aria-expanded', 'false');
  }
}

function resolveHelpElements(resolveHelpElementsFn) {
  if (typeof resolveHelpElementsFn !== 'function') {
    return [];
  }

  const resolvedElements = resolveHelpElementsFn();
  if (!resolvedElements) {
    return [];
  }

  return Array.from(resolvedElements).filter(Boolean);
}

function createHelpTooltipService({
  documentObj = getDefaultDocumentObj(),
  windowObj,
  rootElement = documentObj,
  entries = sharedInlineHelpEntries,
  tippyFn,
  useGlobalInlineHelpContainer = true,
  resolveHelpElements: resolveHelpElementsFn,
} = {}) {
  const resolvedWindowObj = resolveWindowObj(windowObj, documentObj);

  const update = () => {
    if (!documentObj) {
      return;
    }

    const inlineHelpContainer = upsertInlineHelpItems(documentObj, entries, {
      rootElement,
      useGlobalContainer: useGlobalInlineHelpContainer,
    });

    const helpIcons = resolveHelpElements(resolveHelpElementsFn);
    helpIcons.forEach((element) => {
      decorateHelpIcon(element);
    });

    const resolvedTippyFn = tippyFn || resolvedWindowObj?.tippy;
    if (typeof resolvedTippyFn !== 'function') {
      return;
    }

    resolvedTippyFn(helpIcons, {
      content(reference) {
        return buildHelpTooltipContent(reference, inlineHelpContainer, { documentObj, windowObj: resolvedWindowObj });
      },
      onShow(instance) {
        instance.reference?.setAttribute?.('aria-expanded', 'true');
      },
      onHidden(instance) {
        instance.reference?.setAttribute?.('aria-expanded', 'false');
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
    const helpIcons = resolveHelpElements(resolveHelpElementsFn);
    helpIcons.forEach((element) => {
      element?._tippy?.destroy?.();
    });
  };

  return {
    update,
    destroy,
  };
}

function createScopedHelpElementResolver(rootElement) {
  return () => rootElement?.querySelectorAll?.('[data-help-role][data-help]') || [];
}

function createUpdateHelpHints(
  documentObj,
  rootElement = documentObj,
  { windowObj, tippyFn, resolveHelpElements } = {}
) {
  return createHelpTooltipService({
    documentObj,
    windowObj,
    rootElement,
    entries: sharedInlineHelpEntries,
    tippyFn,
    useGlobalInlineHelpContainer: false,
    resolveHelpElements: resolveHelpElements || createScopedHelpElementResolver(rootElement),
  }).update;
}

function initHelpTooltips({
  documentObj = getDefaultDocumentObj(),
  windowObj,
  includeAppOnlyEntries = false,
  tippyFn,
  rootElement = documentObj,
} = {}) {
  if (!documentObj) {
    return null;
  }
  const entries = includeAppOnlyEntries
    ? { ...sharedInlineHelpEntries, ...appOnlyInlineHelpEntries }
    : sharedInlineHelpEntries;

  renderInlineHelpItems(documentObj, entries, {
    useGlobalContainer: true,
  });

  const service = createHelpTooltipService({
    documentObj,
    windowObj,
    rootElement,
    entries,
    tippyFn,
    resolveHelpElements: createScopedHelpElementResolver(rootElement),
  });
  service.update();
  return service;
}

export { createHelpTooltipService, createUpdateHelpHints, initHelpTooltips };
