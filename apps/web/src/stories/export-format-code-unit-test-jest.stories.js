import { createExportPreviewStory, sharedArgTypes } from './export-format-story-factory.js';
import { playCodePreview } from './export-format-interactions.js';

const meta = {
  title: 'Export Formats/Previews/Code (Unit Test)/JavaScript/Jest',
  tags: ['autodocs'],
  argTypes: sharedArgTypes,
  parameters: {
    docs: {
      description: {
        component: `
Code (Unit Test) preview stories show grid rows rendered as framework-specific test scaffolding rather than plain data output.

## What This Shows
This Jest page demonstrates how the current grid can be turned into JavaScript unit-test-oriented output. The focus is on the generated test structure and data representation, not on a full project template.

## Key Stories
- \`Start Blank\`: test output is not rendered yet, but grid data is ready.
- \`Previewed\`: Jest-oriented output is already visible.

## Recommended Workflow
1. Open \`Start Blank\`.
2. Adjust formatting controls if present.
3. Click \`Set Text From Grid\`.
4. Review the generated Jest-style text in the preview area.

## What To Watch
The preview should read like test-oriented code rather than raw data export. The Actions panel is useful here for preview generation and copy/download behavior.

## Interaction Demo
\`Start Blank\` demonstrates the core unit-test format workflow: render the current grid into framework-specific output.
        `,
      },
    },
  },
};

export default meta;

export const StartBlank = {
  ...createExportPreviewStory('jest', 'start-blank'),
  play: playCodePreview,
  parameters: {
    docs: {
      description: {
        story:
          'Use this story to render Jest-oriented output from the current grid and inspect the generated test-style structure.',
      },
    },
  },
};
export const Previewed = {
  ...createExportPreviewStory('jest', 'auto-previewed'),
  parameters: {
    docs: {
      description: {
        story: 'Use this when you want the generated Jest output already visible for quick inspection.',
      },
    },
  },
};
