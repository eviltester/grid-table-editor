import { createExportPreviewStory, sharedArgTypes } from './export-format-story-factory.js';
import { playCodePreview } from './export-format-interactions.js';

const meta = {
  title: 'Export Formats/Previews/Code/JavaScript',
  tags: ['autodocs'],
  argTypes: sharedArgTypes,
  parameters: {
    docs: {
      description: {
        component: `
Code preview stories show the grid rendered as JavaScript-oriented output rather than as a plain data interchange format.

## What This Shows
These stories help you inspect how the current grid rows are represented in generated JavaScript text. The focus is on output shape and readability, not on generating a full runnable project.

## Key Stories
- \`Start Blank\`: the grid is ready, but JavaScript output has not been rendered yet.
- \`Previewed\`: JavaScript output is already shown.

## Recommended Workflow
1. Open \`Start Blank\`.
2. Adjust any formatting controls if present.
3. Click \`Set Text From Grid\`.
4. Review the generated JavaScript in the preview area.

## What To Watch
The preview text should look like code-oriented output rather than CSV or JSON. The Actions panel is most useful here for confirming preview generation and copy/download requests.

## Interaction Demo
\`Start Blank\` demonstrates the main workflow for code formats: render the current grid into JavaScript output.
        `,
      },
    },
  },
};

export default meta;

export const StartBlank = {
  ...createExportPreviewStory('javascript', 'start-blank'),
  play: playCodePreview,
  parameters: {
    docs: {
      description: {
        story: 'Use this story to render JavaScript output from the current grid and inspect the generated code shape.',
      },
    },
  },
};
export const Previewed = {
  ...createExportPreviewStory('javascript', 'auto-previewed'),
  parameters: {
    docs: {
      description: {
        story:
          'Use this when you want the generated JavaScript already visible without first triggering preview generation.',
      },
    },
  },
};
