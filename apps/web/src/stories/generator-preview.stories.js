import { expect, userEvent, within } from 'storybook/test';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { createGeneratorPreviewComponent } from '../../../../packages/core-ui/js/gui_components/generator/preview/index.js';
import { GridExtension as TabulatorGridExtension } from '../../../../packages/core-ui/js/gui_components/data-grid-editor/tabulator/gridExtension-tabulator.js';

function createStoryDataTable(headers, rows) {
  return {
    getHeaders() {
      return headers.slice();
    },
    getColumnCount() {
      return headers.length;
    },
    getRows() {
      return rows.map((row) => row.slice());
    },
    getRowCount() {
      return rows.length;
    },
    getRowAsObjectUsingHeadings(rowIndex, fieldNames) {
      const row = rows[rowIndex] || [];
      const output = {};
      fieldNames.forEach((fieldName, columnIndex) => {
        output[fieldName] = row[columnIndex] ?? '';
      });
      return output;
    },
  };
}

function renderGeneratorPreviewStory(args) {
  const root = document.createElement('main');
  root.setAttribute('aria-label', 'Generator preview story');

  const heading = document.createElement('h1');
  heading.textContent = 'Generator preview';
  heading.style.position = 'absolute';
  heading.style.width = '1px';
  heading.style.height = '1px';
  heading.style.padding = '0';
  heading.style.margin = '-1px';
  heading.style.overflow = 'hidden';
  heading.style.clip = 'rect(0, 0, 0, 0)';
  heading.style.whiteSpace = 'nowrap';
  heading.style.border = '0';
  root.appendChild(heading);

  const eventLog = document.createElement('pre');
  eventLog.setAttribute('aria-label', 'Preview interaction log');
  eventLog.style.marginTop = '0.75rem';
  eventLog.style.padding = '0.5rem';
  eventLog.style.background = '#f3f4f6';
  eventLog.style.whiteSpace = 'pre-wrap';
  eventLog.textContent = 'No preview interactions yet.';

  const componentRoot = document.createElement('section');
  componentRoot.setAttribute('aria-label', 'Generator preview example');
  root.appendChild(componentRoot);
  root.appendChild(eventLog);

  let component = null;
  component = createGeneratorPreviewComponent({
    root: componentRoot,
    documentObj: document,
    props: {
      outputPreviewText: args.outputPreviewText || '',
    },
    services: {
      TabulatorCtor: Tabulator,
      GridExtensionClass: TabulatorGridExtension,
    },
    callbacks: {
      onPreview: () => {
        eventLog.textContent = 'preview:clicked';
      },
    },
  });

  if (args.sampleData) {
    const dataTable = createStoryDataTable(args.sampleData.headers, args.sampleData.rows);
    component.whenReady?.().then(() => {
      component.setPreviewDataTable(dataTable);
    });
  }

  root.__storybookCleanup = () => {
    component?.destroy();
  };
  return root;
}

const meta = {
  title: 'Generator/Preview',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'GeneratorPreview owns the generator preview surface: preview row count, preview trigger, output preview textarea, and data-table preview host. It keeps the existing generator DOM contract while moving preview concerns behind a feature boundary.',
      },
    },
  },
  args: {
    outputPreviewText: '',
    sampleData: null,
  },
  argTypes: {
    outputPreviewText: {
      control: 'text',
      description: 'Current rendered output preview text shown in the textarea.',
    },
    sampleData: {
      control: false,
      description:
        'Optional sample grid data rendered through the real preview-grid adapter path using the same Tabulator library the generator page loads.',
    },
  },
  render: renderGeneratorPreviewStory,
};

export default meta;

export const EmptyPreview = {
  parameters: {
    docs: {
      description: {
        story:
          'Shows the preview surface before any preview has been generated. Try clicking Preview to confirm the feature emits the preview action while the output textarea remains empty.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole('button', { name: 'Preview' }));
    await expect(canvas.getByText('preview:clicked')).toBeTruthy();
    await expect(canvas.getByRole('textbox', { name: 'Output Preview' })).toHaveValue('');
  },
};

export const WithPreviewData = {
  args: {
    outputPreviewText: 'Status\nactive',
    sampleData: {
      headers: ['Status'],
      rows: [['active']],
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the preview surface after preview data has been rendered. The output textarea is populated and the data table preview uses the real preview-grid adapter path with the real Tabulator library, so the visible child grid behaves the same way as the generator page preview.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const previewGridRegion = await canvas.findByLabelText('Data Table Preview Grid');
    await expect(canvas.getByRole('textbox', { name: 'Output Preview' })).toHaveValue('Status\nactive');
    await expect(previewGridRegion).toBeVisible();
    await expect(await within(previewGridRegion).findByText('Status', { exact: true })).toBeVisible();
    await expect(await within(previewGridRegion).findByText('active', { exact: true })).toBeVisible();
  },
};
