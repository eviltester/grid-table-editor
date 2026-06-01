import { expect, waitFor, within } from 'storybook/test';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import RandExp from 'randexp';
import { bootstrapApp, createAppPageComponent } from '../../../../packages/core-ui/js/gui_components/app/page/index.js';
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

function createAppPageShell() {
  const root = document.createElement('main');
  root.setAttribute('aria-label', 'App page story');

  root.innerHTML = `<div id="app-page-root"></div>`;

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
    createAppPageComponentFn: ({ root: appPageRoot }) =>
      createAppPageComponent({
        root: appPageRoot,
        props: {
          showTestDataOpen: true,
        },
      }),
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
    await expect(await canvas.findByText('Instructions')).toBeVisible();
    await expect(await canvas.findByRole('button', { name: /Set Text From Grid/i })).toBeVisible();
    await expect(await canvas.findByRole('button', { name: 'Generate' })).toBeVisible();
    await expect(await canvas.findByRole('button', { name: 'Edit as Text' })).toBeVisible();
    await expect(await canvas.findByRole('button', { name: 'Reset Table' })).toBeVisible();
    await waitFor(() => {
      expect(canvasElement.querySelector('#initial-load')).toBeNull();
    });
  },
};
