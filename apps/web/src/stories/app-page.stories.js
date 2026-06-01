import { expect, waitFor, within } from 'storybook/test';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import RandExp from 'randexp';
import { bootstrapApp, createAppPageComponent } from '../../../../packages/core-ui/js/gui_components/app/page/index.js';
import { createDataGridComponent } from '../../../../packages/core-ui/js/gui_components/data-grid-editor/index.js';
import { GridExtension as TabulatorGridExtension } from '../../../../packages/core-ui/js/gui_components/data-grid-editor/tabulator/gridExtension-tabulator.js';

class StoryExtendedDataGrid {
  constructor({ documentObj } = {}) {
    this.documentObj = documentObj;
    this.component = null;
  }

  createChildGrid(root) {
    this.component?.destroy?.();
    this.component = createDataGridComponent({
      root,
      documentObj: this.documentObj,
      services: {
        TabulatorCtor: Tabulator,
        GridExtensionClass: TabulatorGridExtension,
      },
    });
    return this.component;
  }

  sizeColumnsToFit() {}

  getGridExtras() {
    return this.component?.getGridExtras?.();
  }

  destroy() {
    this.component?.destroy?.();
    this.component = null;
  }
}

function createScopedStoryDocument(rootElement, documentObj = document) {
  const scopedMethods = {
    getElementById(id) {
      return rootElement.querySelector(`#${id}`) || documentObj.getElementById(id);
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

function createAppPageStoryShell() {
  const root = document.createElement('main');
  root.setAttribute('aria-label', 'App page story');

  root.innerHTML = `<div id="app-page-root"></div>`;

  return root;
}

function createOpenAppPageStoryComponent({ root }) {
  return createAppPageComponent({
    root,
    props: {
      showTestDataOpen: true,
    },
  });
}

function renderAppPageStory() {
  globalThis.RandExp = RandExp;
  globalThis.eval?.('var RandExp = globalThis.RandExp;');
  const root = createAppPageStoryShell();
  document.body.appendChild(root);
  const scopedDocument = createScopedStoryDocument(root, document);
  let app = null;

  root.__appReady = bootstrapApp({
    documentObj: scopedDocument,
    ensureGridLibraryLoadedFn: async () => {},
    activeGridEngineName: 'tabulator',
    createAppPageComponentFn: createOpenAppPageStoryComponent,
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
          'App page composes the main data-grid editor, import/export workspace, instructions, and embedded test-data generation panel through the real app bootstrap path, but without full site navigation chrome.',
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
          'Shows the functional app composition with the grid editor, import/export workspace, instructions, and embedded test-data generation panel mounted together. Use this when you want to review app behavior wiring without the real page navigation or startup loading chrome.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await canvasElement.__appReady;
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Instructions')).toBeVisible();
    await expect(await canvas.findByRole('button', { name: /Set Text From Grid/i })).toBeVisible();
    await expect(await canvas.findByRole('button', { name: 'Generate' })).toBeVisible();
    await expect(await canvas.findByRole('button', { name: 'Edit as Text' })).toBeVisible();
    await expect(await canvas.findByRole('button', { name: 'Reset Table' })).toBeVisible();
    await waitFor(() => {
      expect(canvasElement.querySelector('.header')).toBeNull();
      expect(canvasElement.querySelector('#initial-load')).toBeNull();
    });
  },
};
