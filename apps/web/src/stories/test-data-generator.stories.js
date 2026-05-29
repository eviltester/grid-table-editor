import { renderGeneratorStory } from './storybook-harnesses.js';

const meta = {
  title: 'Test Data/Generator',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
These generator stories are helpful for review and discovery, but this section is not fully Storybook-ready yet.

## Current Limitations
- Tippy-based help and tooltip behavior is not fully working in Storybook.
- The generator is still mounted as a large page-level surface instead of a set of smaller focused components.

## What This Means
Use these stories to understand the main states and flows, but do not treat them as the final Storybook shape for this feature area. A future refactor should break the generator into smaller chunks so Storybook can support clearer docs, interactions, and component-level review.
        `,
      },
    },
  },
};

export default meta;

export const EmptyEditor = {
  render: () => renderGeneratorStory({ scenario: 'empty' }),
  parameters: {
    docs: {
      description: {
        story:
          'Shows the generator baseline state. Useful for broad UI review, but not yet a fully isolated Storybook component story.',
      },
    },
  },
};

export const SampleSchema = {
  render: () => renderGeneratorStory({ scenario: 'sample' }),
  parameters: {
    docs: {
      description: {
        story:
          'Shows a populated generator example. Best used for reviewing the assembled experience rather than detailed component decomposition.',
      },
    },
  },
};

export const TextModeRoundTrip = {
  render: () => renderGeneratorStory({ scenario: 'text-mode' }),
  parameters: {
    docs: {
      description: {
        story:
          'Shows the generator in text mode. Helpful for flow review, but tooltip/help behavior remains incomplete in Storybook.',
      },
    },
  },
};

export const ValidationState = {
  render: () => renderGeneratorStory({ scenario: 'validation' }),
  parameters: {
    docs: {
      description: {
        story:
          'Shows validation behavior in the generator. Good for inspecting this state, while keeping in mind the larger component split still needs work.',
      },
    },
  },
};
