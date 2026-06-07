import { expect, fireEvent, userEvent, within } from 'storybook/test';
import { createOptionsPreviewSplitLayoutComponent } from '../../../../packages/core-ui/js/gui_components/app/options-preview-split-layout/index.js';

function renderOptionsPreviewSplitLayoutStory(args) {
  const root = document.createElement('section');
  root.style.width = `${args.containerWidthPx}px`;
  root.style.maxWidth = `${args.containerWidthPx}px`;
  root.style.border = '1px solid #d1d5db';
  root.style.padding = '0.75rem';
  root.style.boxSizing = 'border-box';
  root.style.background = '#ffffff';

  const component = createOptionsPreviewSplitLayoutComponent({
    root,
    documentObj: document,
    props: {
      optionsSupported: args.optionsSupported,
    },
  });

  const optionsPanelRoot = component.getOptionsPanelRoot();
  const previewPanelRoot = component.getPreviewPanelRoot();
  if (optionsPanelRoot) {
    optionsPanelRoot.innerHTML = `
      <div style="padding: 0.75rem; background: #f8fafc; border-right: 1px solid #e5e7eb;">
        <strong>Format Options</strong>
        <p style="margin: 0.5rem 0 0;">Reviewer-facing placeholder for the shared format options panel.</p>
      </div>
    `;
  }
  if (previewPanelRoot) {
    previewPanelRoot.innerHTML = `
      <div style="padding: 0.75rem; background: #ffffff;">
        <strong>Preview Text</strong>
        <p style="margin: 0.5rem 0 0;">Reviewer-facing placeholder for the preview/editor surface.</p>
      </div>
    `;
  }

  root.__storybookCleanup = () => component.destroy();
  return root;
}

const meta = {
  title: 'Pages/App/Options Preview Split Layout',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'OptionsPreviewSplitLayout owns the app import/export split-panel shell between the format options surface and the preview/edit text surface. It is the focused component boundary for showing, hiding, resizing, and clamping that layout without dragging the full workspace story into every review.',
      },
    },
  },
  args: {
    optionsSupported: true,
    containerWidthPx: 760,
  },
  argTypes: {
    optionsSupported: {
      control: 'boolean',
      description: 'Whether the selected format supports a visible options panel.',
    },
    containerWidthPx: {
      control: { type: 'number', min: 320, max: 960, step: 20 },
      description: 'Width of the review container used to demonstrate clamping behavior.',
    },
  },
  render: renderOptionsPreviewSplitLayoutStory,
};

export default meta;

export const SupportedFormat = {
  parameters: {
    docs: {
      description: {
        story:
          'Shows the split layout when the selected format exposes a real options panel. Reviewers should see the options column, the separator, and the preview surface immediately.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Format Options')).toBeVisible();
    await expect(canvas.getByText('Preview Text')).toBeVisible();
    await expect(canvas.getByRole('separator', { name: 'Resize options panel' })).toBeVisible();
  },
};

export const UnsupportedFormat = {
  args: {
    optionsSupported: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the layout when the current format has no options panel. The preview surface should expand to the full width and the separator should disappear.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Preview Text')).toBeVisible();
    await expect(canvas.queryByRole('separator', { name: 'Resize options panel' })).toBeNull();
  },
};

export const KeyboardResize = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the keyboard-accessible resize path. Focus the separator and use arrow keys, Home, or End. The play example nudges the width and checks that the aria value changes.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const splitter = canvas.getByRole('separator', { name: 'Resize options panel' });
    const startValue = Number(splitter.getAttribute('aria-valuenow'));
    splitter.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(Number(splitter.getAttribute('aria-valuenow'))).toBeGreaterThan(startValue);
  },
};

export const NarrowWidthClamp = {
  args: {
    containerWidthPx: 360,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the clamped narrow-width state. The options panel should stop shrinking or expanding past the layout constraints instead of pushing the preview area below its minimum review width.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const splitter = canvas.getByRole('separator', { name: 'Resize options panel' });
    splitter.focus();
    fireEvent.keyDown(splitter, { key: 'End' });
    await expect(splitter).toHaveAttribute('aria-valuenow', '180');
  },
};
