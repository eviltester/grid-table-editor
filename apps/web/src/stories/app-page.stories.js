import { expect, waitFor, within } from 'storybook/test';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import RandExp from 'randexp';
import { bootstrapApp } from '../../../../packages/core-ui/js/gui_components/app/page/index.js';
import { ExtendedDataGrid as TabulatorExtendedDataGrid } from '../../../../packages/core-ui/js/gui_components/data-grid-editor/tabulator/main-display-grid.js';
import { GridExtension as TabulatorGridExtension } from '../../../../packages/core-ui/js/gui_components/data-grid-editor/tabulator/gridExtension-tabulator.js';

class StoryExtendedDataGrid extends TabulatorExtendedDataGrid {
  constructor({ documentObj } = {}) {
    super({
      documentObj,
      TabulatorCtor: Tabulator,
      GridExtensionClass: TabulatorGridExtension,
    });
  }
}

function createScopedStoryDocument(rootElement, documentObj = document) {
  const scopedMethods = {
    getElementById(id) {
      return rootElement.querySelector(`#${id}`);
    },
    querySelector(selector) {
      return rootElement.querySelector(selector);
    },
    querySelectorAll(selector) {
      return rootElement.querySelectorAll(selector);
    },
  };

  return new Proxy(documentObj, {
    get(target, prop) {
      if (prop in scopedMethods) {
        return scopedMethods[prop];
      }

      const value = Reflect.get(target, prop);
      return typeof value === 'function' ? value.bind(target) : value;
    },
  });
}

function createAppPageShell() {
  const root = document.createElement('main');
  root.setAttribute('aria-label', 'App page story');

  root.innerHTML = `
    <h1 style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">
      App page
    </h1>
    <div class="instructions">
      <details open>
        <summary>Instructions <span data-help="instructions-summary-title" class="helpicon"></span></summary>
        <ul>
          <li>[Reset Table] To clear all table data</li>
          <li>[~] Rename Column</li>
          <li>[x] Delete Column</li>
          <li>[&lt;+] Add Column Left</li>
          <li>[+=] Duplicate this column</li>
          <li>[+&gt;] Add Column Right</li>
        </ul>
        <button type="button" class="instructions-copy-to-grid-button">Copy Instructions To Grid</button>
      </details>
    </div>
    <div class="main-app">
      <div id="main-grid-view"></div>
      <div class="importexport" id="import-export-controls"></div>
      <div class="testDataSchemaGui">
        <details open>
          <summary>Test Data <span data-help="test-data-summary-title" class="helpicon"></span></summary>
          <div id="testDataGeneratorContainer"></div>
        </details>
      </div>
    </div>
    <p id="initial-load" class="import-progress-status startup-loading-status" role="status" aria-live="polite">
      Please Wait, Loading Libraries...
    </p>
  `;

  return root;
}

function renderAppPageStory() {
  globalThis.RandExp = RandExp;
  globalThis.eval?.('var RandExp = globalThis.RandExp;');
  const root = createAppPageShell();
  document.body.appendChild(root);
  const scopedDocument = createScopedStoryDocument(root, document);
  let app = null;

  root.__appReady = bootstrapApp({
    documentObj: scopedDocument,
    ensureGridLibraryLoadedFn: async () => {},
    activeGridEngineName: 'tabulator',
    ExtendedDataGridClass: class extends StoryExtendedDataGrid {
      constructor() {
        super({ documentObj: scopedDocument });
      }
    },
  }).then((instance) => {
    app = instance;
    return instance;
  });

  root.__storybookCleanup = () => {
    app?.destroy?.();
    root.remove();
  };

  return root;
}

const meta = {
  title: 'Pages/App/Page',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'App page composes the main data-grid editor, import/export workspace, and test-data generation panel through the current app bootstrap path. This story is the app-side page-level equivalent of the generator page story.',
      },
    },
  },
  render: renderAppPageStory,
};

export default meta;

export const Default = {
  parameters: {
    docs: {
      description: {
        story:
          'Shows the real app page composition with the grid editor, import/export workspace, and embedded test-data generation panel mounted together. Review this story when you want to see the app-level wiring rather than a single app feature in isolation.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await canvasElement.__appReady;
    const canvas = within(canvasElement);
    await expect(await canvas.findByRole('button', { name: /Set Text From Grid/i })).toBeVisible();
    await expect(await canvas.findByRole('button', { name: 'Generate' })).toBeVisible();
    await expect(await canvas.findByRole('button', { name: 'Edit as Text' })).toBeVisible();
    await expect(await canvas.findByRole('button', { name: 'Reset Table' })).toBeVisible();
    await waitFor(() => {
      expect(canvasElement.querySelector('#initial-load')).toBeNull();
    });
  },
};
