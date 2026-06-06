import { expect, waitFor, within } from 'storybook/test';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import RandExp from 'randexp';
import { bootstrapApp } from '../../../../packages/core-ui/js/gui_components/app/page/app-page-runtime.js';
import { createAppPageComponent } from '../../../../packages/core-ui/js/gui_components/app/page/app-page-shell.js';
import { createDataGridComponent } from '../../../../packages/core-ui/js/gui_components/data-grid-editor/index.js';
import { GridExtension as TabulatorGridExtension } from '../../../../packages/core-ui/js/gui_components/data-grid-editor/tabulator/gridExtension-tabulator.js';
import { createTestDataGenerationPanelManager } from '../../../../packages/core-ui/js/gui_components/app/test-data-grid/controller/test-data-grid-controller.js';

function createAppPageStoryShell() {
  const root = document.createElement('main');
  root.setAttribute('aria-label', 'App page story');

  root.innerHTML = `
    <div data-role="theme-toggle-host" style="min-height: 2.5rem;"></div>
    <div id="app-page-root"></div>
  `;

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
  const root = createAppPageStoryShell();
  let app = null;
  const testDataPanelHarness = createTestDataGenerationPanelManager({
    documentObj: document,
    RandExpClass: RandExp,
  });

  root.__appReady = new Promise((resolve, reject) => {
    requestAnimationFrame(() => {
      bootstrapApp({
        documentObj: document,
        ensureGridLibraryLoadedFn: async () => {},
        createAppPageComponentFn: createOpenAppPageStoryComponent,
        createDataGridComponentFn: createDataGridComponent,
        TabulatorCtor: Tabulator,
        GridExtensionClass: TabulatorGridExtension,
        mountTestDataGenerationPanelFn: testDataPanelHarness.mountTestDataGenerationPanel,
      })
        .then((instance) => {
          app = instance;
          resolve(instance);
        })
        .catch(reject);
    });
  });

  root.__storybookCleanup = () => {
    app?.destroy?.();
    testDataPanelHarness.destroy?.();
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
      expect(canvas.queryByText('AnyWayData')).toBeNull();
      expect(canvas.queryByText(/Please Wait, Loading Libraries/i)).toBeNull();
    });
  },
};
