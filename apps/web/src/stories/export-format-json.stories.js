import { createExportPreviewStory, sharedArgTypes } from './export-format-story-factory.js';
import { playJsonOptionsPreview, playPreviewEditMode } from './export-format-interactions.js';

const meta = {
  title: 'Export Formats/Previews/JSON',
  tags: ['autodocs'],
  argTypes: sharedArgTypes,
  parameters: {
    docs: {
      description: {
        component: `
JSON preview stories show structured grid output where the shape of the rendered text can change materially based on formatting and wrapper options.

## What This Shows
These stories focus on pretty printing, object wrapping, and property naming so you can see how the same grid data can be represented either as a plain array or as a named property on an object.

## Key Stories
- \`Start Blank\`: grid data exists, but JSON has not been rendered yet.
- \`Previewed\`: JSON output is already visible and ready to inspect.

## Recommended Workflow
1. Open \`Start Blank\`.
2. Adjust \`prettyPrint\`, \`asObject\`, or \`asPropertyNamed\`.
3. Click \`Apply\`.
4. Click \`Set Text From Grid\` to render the updated JSON.

## What To Watch
The preview should change shape when object wrapping is enabled, and the Actions panel will show both option application and preview rendering.

## Interaction Demo
\`Start Blank\` demonstrates applying JSON wrapper options before rendering. \`Previewed\` demonstrates the preview/edit mode toggle flow.
        `,
      },
    },
  },
};

export default meta;

export const StartBlank = {
  ...createExportPreviewStory('json', 'start-blank', {
    asObject: true,
    asPropertyNamed: 'records',
  }),
  play: playJsonOptionsPreview,
  parameters: {
    docs: {
      description: {
        story:
          'Use this story to explore how JSON structure changes when object wrapping and property naming are applied before preview generation.',
      },
    },
  },
};
export const Previewed = {
  ...createExportPreviewStory('json', 'auto-previewed', {
    asObject: true,
    asPropertyNamed: 'records',
  }),
  play: playPreviewEditMode,
  parameters: {
    docs: {
      description: {
        story:
          'Use this story when you want JSON already visible and want to focus on Preview versus Edit mode behavior.',
      },
    },
  },
};
