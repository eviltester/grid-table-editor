import { createExportPreviewStory, sharedArgTypes } from './export-format-story-factory.js';
import { playDelimitedOptionsPreview } from './export-format-interactions.js';

const meta = {
  title: 'Export Formats/Previews/Delimited',
  tags: ['autodocs'],
  argTypes: sharedArgTypes,
  parameters: {
    docs: {
      description: {
        component: `
Delimited preview stories show separator-driven text output where the same grid can be rendered with different delimiter rules.

## What This Shows
These stories focus on the delimiter selector and related quote and header options, which are especially useful when copying data into spreadsheets or tools that expect a non-CSV separator.

## Key Stories
- \`Start Blank\`: the grid is ready, but no delimited preview has been rendered yet.
- \`Previewed\`: a delimited export is already visible for inspection.

## Recommended Workflow
1. Open \`Start Blank\`.
2. Change the delimiter and any quote or header options.
3. Click \`Apply\`.
4. Click \`Set Text From Grid\` and compare the preview output.

## Important Controls
\`delimiter\`, \`quotes\`, \`header\`, \`quoteChar\`, and \`escapeChar\` are the controls that most visibly change the output.

## Interaction Demo
\`Start Blank\` demonstrates changing the delimiter to semicolon and then rendering the preview text.
        `,
      },
    },
  },
};

export default meta;

export const StartBlank = {
  ...createExportPreviewStory('dsv', 'start-blank'),
  play: playDelimitedOptionsPreview,
  parameters: {
    docs: {
      description: {
        story:
          'Best for exploring delimiter changes before any preview text exists. This is the most useful story for option comparison.',
      },
    },
  },
};
export const Previewed = {
  ...createExportPreviewStory('dsv', 'auto-previewed'),
  parameters: {
    docs: {
      description: {
        story:
          'Use this when you want the current delimited output visible immediately without first pressing Set Text From Grid.',
      },
    },
  },
};
