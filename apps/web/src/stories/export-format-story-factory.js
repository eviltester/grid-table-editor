import { renderGridPreviewStory } from './export-preview-story-harness.js';

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
  onFormatSelected: {
    action: 'onFormatSelected',
    table: { disable: true },
  },
  onPreviewRendered: {
    action: 'onPreviewRendered',
    table: { disable: true },
  },
  onSetTextFromGrid: {
    action: 'onSetTextFromGrid',
    table: { disable: true },
  },
  onSetGridFromText: {
    action: 'onSetGridFromText',
    table: { disable: true },
  },
  onSetGridFromTextFailed: {
    action: 'onSetGridFromTextFailed',
    table: { disable: true },
  },
  onOptionsApplied: {
    action: 'onOptionsApplied',
    table: { disable: true },
  },
  onPreviewModeChanged: {
    action: 'onPreviewModeChanged',
    table: { disable: true },
  },
  onAutoPreviewChanged: {
    action: 'onAutoPreviewChanged',
    table: { disable: true },
  },
  onCopyText: {
    action: 'onCopyText',
    table: { disable: true },
  },
  onDownloadRequested: {
    action: 'onDownloadRequested',
    table: { disable: true },
  },
};

function extractActionHandlers(args) {
  return {
    onFormatSelected: args.onFormatSelected,
    onPreviewRendered: args.onPreviewRendered,
    onSetTextFromGrid: args.onSetTextFromGrid,
    onSetGridFromText: args.onSetGridFromText,
    onSetGridFromTextFailed: args.onSetGridFromTextFailed,
    onOptionsApplied: args.onOptionsApplied,
    onPreviewModeChanged: args.onPreviewModeChanged,
    onAutoPreviewChanged: args.onAutoPreviewChanged,
    onCopyText: args.onCopyText,
    onDownloadRequested: args.onDownloadRequested,
  };
}

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
    render: (storyArgs) =>
      renderGridPreviewStory({
        ...storyArgs,
        actions: extractActionHandlers(storyArgs),
      }),
  };
}

export { createExportPreviewStory, sharedArgTypes };
