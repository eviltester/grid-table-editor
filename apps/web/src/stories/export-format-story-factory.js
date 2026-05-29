import { renderGridPreviewStory } from './storybook-harnesses.js';

const sharedArgTypes = {
  previewRowLimit: {
    control: { type: 'number', min: 1, max: 25, step: 1 },
  },
  prettyPrint: {
    control: 'boolean',
  },
  asObject: {
    control: 'boolean',
  },
  asPropertyNamed: {
    control: 'text',
  },
  quotes: {
    control: 'boolean',
  },
  header: {
    control: 'boolean',
  },
  delimiter: {
    control: 'text',
  },
};

function createExportPreviewStory(format, state, args = {}) {
  return {
    args: {
      format,
      state,
      previewRowLimit: 10,
      prettyPrint: true,
      asObject: false,
      asPropertyNamed: format === 'json' ? 'records' : '',
      quotes: false,
      header: format === 'csv' || format === 'dsv',
      delimiter: '\t',
      ...args,
    },
    render: (storyArgs) => renderGridPreviewStory(storyArgs),
  };
}

export { createExportPreviewStory, sharedArgTypes };
