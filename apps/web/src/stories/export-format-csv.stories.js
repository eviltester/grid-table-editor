import { createExportPreviewStory, sharedArgTypes } from './export-format-story-factory.js';
import { playCsvRoundTrip, playSetTextFromGrid } from './export-format-interactions.js';

const meta = {
  title: 'Export Formats/Previews/CSV',
  tags: ['autodocs'],
  argTypes: sharedArgTypes,
  parameters: {
    docs: {
      description: {
        component: `
CSV preview stories show the grid-to-text export and round-trip editing workflow for comma-separated output.

## What This Shows
These stories demonstrate how grid data becomes CSV text, how quote and header options affect that text, and how edited CSV can be pushed back into the grid with \`Set Grid From Text\`.

## Key Stories
- \`Start Blank\`: grid data is available, but the CSV preview has not been rendered yet.
- \`Previewed\`: CSV text is already visible so you can inspect or edit it immediately.

## Recommended Workflow
1. Open \`Start Blank\`.
2. Adjust \`quotes\`, \`header\`, \`quoteChar\`, or \`escapeChar\`.
3. Click \`Set Text From Grid\` to render CSV.
4. Switch to \`Edit\` if you want to change the CSV and send it back into the grid.

## What To Watch
The preview area should reflect option changes clearly, and the Actions panel will show when preview text is rendered or grid data is set from the edited CSV.

## Interaction Demo
\`Start Blank\` demonstrates CSV preview generation. \`Previewed\` demonstrates the round-trip flow from visible text back into grid data.
        `,
      },
    },
  },
};

export default meta;

export const StartBlank = {
  ...createExportPreviewStory('csv', 'start-blank'),
  play: playSetTextFromGrid,
  parameters: {
    docs: {
      description: {
        story:
          'Use this story when you want to start with the current grid and deliberately render CSV after adjusting controls.',
      },
    },
  },
};
export const Previewed = {
  ...createExportPreviewStory('csv', 'auto-previewed'),
  play: playCsvRoundTrip,
  parameters: {
    docs: {
      description: {
        story:
          'Use this story when you want the CSV already visible so you can inspect it, switch to Edit mode, and try a Set Grid From Text round trip.',
      },
    },
  },
};
