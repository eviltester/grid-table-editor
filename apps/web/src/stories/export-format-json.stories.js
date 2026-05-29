import { createExportPreviewStory, sharedArgTypes } from './export-format-story-factory.js';
import { playJsonOptionsPreview, playPreviewEditMode } from './export-format-interactions.js';

const meta = {
  title: 'Export Formats/Previews/JSON',
  tags: ['autodocs'],
  argTypes: sharedArgTypes,
};

export default meta;

export const StartBlank = {
  ...createExportPreviewStory('json', 'start-blank', {
    asObject: true,
    asPropertyNamed: 'records',
  }),
  play: playJsonOptionsPreview,
};
export const Previewed = {
  ...createExportPreviewStory('json', 'auto-previewed', {
    asObject: true,
    asPropertyNamed: 'records',
  }),
  play: playPreviewEditMode,
};
