import { expect, userEvent, within } from 'storybook/test';
import { createGeneratorPreviewComponent } from '../../../../packages/core-ui/js/gui_components/generator/preview/index.js';

function createStoryDataTable(headers, rows) {
  return {
    getHeaders() {
      return headers.slice();
    },
    getRows() {
      return rows.map((row) => row.slice());
    },
  };
}

function renderStoryPreviewGridMarkup(headers, rows) {
  const headerMarkup = headers
    .map(
      (header) => `
        <th
          style="border:1px solid #c9d7e1;padding:0.45rem 0.6rem;background:#edf4f8;font-weight:600;text-align:left;"
        >
          ${header}
        </th>
      `
    )
    .join('');

  const rowMarkup = rows
    .map(
      (row) => `
        <tr>
          ${row
            .map(
              (cell) => `
                <td style="border:1px solid #d7e2e8;padding:0.45rem 0.6rem;background:#ffffff;">
                  ${cell}
                </td>
              `
            )
            .join('')}
        </tr>
      `
    )
    .join('');

  return `
    <div
      class="story-preview-grid"
      style="padding:0.35rem;border:1px solid #d7e2e8;border-radius:6px;background:#f8fbfd;overflow:auto;"
    >
      <table
        style="width:100%;border-collapse:collapse;font-size:0.92rem;color:#163247;background:#ffffff;"
        aria-label="Preview grid"
      >
        <thead>
          <tr>${headerMarkup}</tr>
        </thead>
        <tbody>${rowMarkup}</tbody>
      </table>
    </div>
  `;
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

  const component = createGeneratorPreviewComponent({
    root: componentRoot,
    documentObj: document,
    props: {
      outputPreviewText: args.outputPreviewText || '',
    },
    services: {
      createPreviewGrid: ({ rootElement }) => {
        const renderTable = (dataTable) => {
          const headers = dataTable?.getHeaders?.() || [];
          const rows = dataTable?.getRows?.() || [];
          rootElement.innerHTML = renderStoryPreviewGridMarkup(headers, rows);
        };

        return {
          tableApi: { story: true },
          gridApi: {
            setGridFromGenericDataTable: renderTable,
          },
        };
      },
    },
    callbacks: {
      onPreview: () => {
        eventLog.textContent = 'preview:clicked';
      },
    },
  });

  if (args.sampleData) {
    component.setPreviewDataTable(createStoryDataTable(args.sampleData.headers, args.sampleData.rows));
  }

  root.__storybookCleanup = () => component.destroy();
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
      description: 'Optional sample grid data rendered by the story-local fake preview grid.',
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
    await userEvent.click(canvas.getByRole('button', { name: 'Preview' }));
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
          'Shows the preview surface after preview data has been rendered. The output textarea is populated and the data table preview displays a small sample grid through the component API.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox', { name: 'Output Preview' })).toHaveValue('Status\nactive');
    await expect(canvas.getByText('Status')).toBeTruthy();
    await expect(canvas.getByText('active')).toBeTruthy();
  },
};
