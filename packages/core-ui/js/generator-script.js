import { ensureGridLibraryLoaded } from './gui_components/data-grid-editor/grid-library-loader.js';
import { createDataGeneratorPage } from './gui_components/generator/runtime/data-generator-page-runtime.js';
import { faker } from '@faker-js/faker';
import { initHelpTooltips } from './help/help-tooltips.js';
import { createThemeToggleComponent } from './gui_components/shared/theme-toggle.js';
import { createPageStartupLoadingStatus } from './gui_components/shared/page-startup-loading-status.js';
import { getDefaultDocumentObj, resolveWindowObj } from './gui_components/shared/dom/default-objects.js';
import { createInstructionsComponent } from './gui_components/shared/instructions/index.js';
import { GENERATOR_PAGE_INSTRUCTIONS_PROPS } from './gui_components/shared/instructions/generator-page-instructions.js';
import { createGeneratorPageShellComponent } from './gui_components/generator/page/create-generator-page-shell-component.js';

function resolveThemeToggleHostElement(documentObj) {
  return documentObj?.querySelector?.('[data-role="theme-toggle-host"]') || null;
}

function resolveGeneratorHelpTooltipRoot(documentObj) {
  return documentObj?.getElementById?.('generator-page-root') || documentObj;
}

function resolveGeneratorStartupLoadingElement(documentObj) {
  return documentObj?.getElementById?.('generator-initial-load') || null;
}

async function bootstrapGeneratorPage({
  documentObj = getDefaultDocumentObj(),
  ensureGridLibraryLoadedFn = ensureGridLibraryLoaded,
  createDataGeneratorPageFn = createDataGeneratorPage,
  fakerInstance = faker,
  initHelpTooltipsFn = initHelpTooltips,
} = {}) {
  const themeToggle = createThemeToggleComponent({
    documentObj,
    windowObj: resolveWindowObj(null, documentObj),
    hostElement: resolveThemeToggleHostElement(documentObj),
  });
  const pageRoot = documentObj.getElementById('generator-page-root');
  const generatorPageShell = pageRoot
    ? createGeneratorPageShellComponent({
        root: pageRoot,
      })
    : null;
  const startupLoadingStatus = createPageStartupLoadingStatus({
    documentObj,
    resolveElement: () => resolveGeneratorStartupLoadingElement(documentObj),
  });
  startupLoadingStatus.show();

  try {
    await ensureGridLibraryLoadedFn({ engine: 'tabulator', document: documentObj });
  } catch (error) {
    console.error('Failed to load tabulator library', error);
    startupLoadingStatus.fail();
    return;
  }

  let page = null;
  try {
    const instructionsRoot = documentObj.getElementById('generator-instructions');
    if (instructionsRoot) {
      createInstructionsComponent({
        root: instructionsRoot,
        props: GENERATOR_PAGE_INSTRUCTIONS_PROPS,
      });
    }

    const appRoot = documentObj.getElementById('generator-app');
    if (typeof createDataGeneratorPageFn !== 'function') {
      throw new Error('bootstrapGeneratorPage requires createDataGeneratorPageFn');
    }
    page = createDataGeneratorPageFn({
      parentElement: appRoot,
      documentObj,
      faker: fakerInstance,
      RandExp: globalThis?.RandExp,
    });
    initHelpTooltipsFn({
      documentObj,
      rootElement: resolveGeneratorHelpTooltipRoot(documentObj),
    });
    startupLoadingStatus.clear();
  } catch (error) {
    startupLoadingStatus.fail();
    throw error;
  }

  return {
    generatorPageShell,
    page,
    destroy() {
      page?.destroy?.();
      generatorPageShell?.destroy?.();
      themeToggle?.destroy?.();
    },
  };
}

if (typeof document !== 'undefined') {
  const runBootstrap = async function () {
    try {
      await bootstrapGeneratorPage();
    } catch (error) {
      console.error('Failed to bootstrap generator page', error);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runBootstrap, { once: true });
  } else {
    runBootstrap();
  }
}

export { bootstrapGeneratorPage };
