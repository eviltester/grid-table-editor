import { renderEmbeddedTestDataStory } from './storybook-harnesses.js';

const meta = {
  title: 'Test Data/Embedded Panel',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
These embedded-panel stories are useful for exploratory review, but this section is not fully Storybook-ready yet.

## Current Limitations
- Tippy-based help and tooltip behavior is not fully working in Storybook.
- The embedded test-data panel is still mounted as a relatively large app fragment rather than a set of smaller Storybook-friendly components.

## What This Means
Use these stories to inspect states and basic interactions, but treat them as partial integration previews rather than polished component stories. A later refactor should split the panel into smaller units so help, interaction coverage, and docs can become more precise.
        `,
      },
    },
  },
};

export default meta;

export const EmptyEditor = {
  render: () => renderEmbeddedTestDataStory({ scenario: 'empty' }),
  parameters: {
    docs: {
      description: {
        story:
          'Shows the embedded panel in its baseline state. Useful for layout review, but still subject to the current Storybook limitations above.',
      },
    },
  },
};

export const SampleSchema = {
  render: () => renderEmbeddedTestDataStory({ scenario: 'sample' }),
  parameters: {
    docs: {
      description: {
        story:
          'Shows a populated embedded schema example. Best used for visual review of the richer state rather than fine-grained component testing.',
      },
    },
  },
};

export const TextModeRoundTrip = {
  render: () => renderEmbeddedTestDataStory({ scenario: 'text-mode' }),
  parameters: {
    docs: {
      description: {
        story:
          'Shows the text-mode variant of the embedded panel. Round-trip behavior can be explored, but tooltip/help behavior is still incomplete here.',
      },
    },
  },
};

export const ValidationState = {
  render: () => renderEmbeddedTestDataStory({ scenario: 'validation' }),
  parameters: {
    docs: {
      description: {
        story:
          'Shows validation feedback in the embedded panel. Good for state review, but still backed by a large composite mount rather than smaller isolated stories.',
      },
    },
  },
};
