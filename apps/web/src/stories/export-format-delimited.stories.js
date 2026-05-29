import { createExportPreviewStory, sharedArgTypes } from './export-format-story-factory.js';
import { playDelimitedOptionsPreview } from './export-format-interactions.js';

const meta = {
  title: 'Export Formats/Previews/Delimited',
  tags: ['autodocs'],
  argTypes: sharedArgTypes,
};

export default meta;

export const StartBlank = {
  ...createExportPreviewStory('dsv', 'start-blank'),
  play: playDelimitedOptionsPreview,
};
export const Previewed = createExportPreviewStory('dsv', 'auto-previewed');
