import { ensureGridLibraryLoaded } from './gui_components/data-grid-editor/grid-library-loader.js';
import { DataGeneratorPage } from './gui_components/generator/index.js';
import { faker } from '@faker-js/faker';
import { initHelpTooltips } from './help/help-tooltips.js';
import { initThemeToggle } from './gui_components/shared/theme-toggle.js';
import { createPageStartupLoadingStatus } from './gui_components/shared/page-startup-loading-status.js';

async function bootstrapGeneratorPage({
  documentObj = document,
  ensureGridLibraryLoadedFn = ensureGridLibraryLoaded,
  DataGeneratorPageClass = DataGeneratorPage,
  fakerInstance = faker,
} = {}) {
  initThemeToggle({ documentObj, windowObj: documentObj?.defaultView || window });
  const startupLoadingStatus = createPageStartupLoadingStatus({
    documentObj,
    elementId: 'generator-initial-load',
  });
  startupLoadingStatus.show();

  try {
    await ensureGridLibraryLoadedFn({ engine: 'tabulator', document: documentObj });
  } catch (error) {
    console.error('Failed to load tabulator library', error);
    startupLoadingStatus.fail();
    return;
  }

  const appRoot = documentObj.getElementById('generator-app');
  const page = new DataGeneratorPageClass({
    parentElement: appRoot,
    documentObj,
    faker: fakerInstance,
    RandExp: globalThis?.RandExp,
  });
  page.init();
  initHelpTooltips({ documentObj });

  startupLoadingStatus.clear();
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
