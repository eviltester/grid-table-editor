import { createExportPreviewStory, sharedArgTypes } from './export-format-story-factory.js';
import { playCodePreview } from './export-format-interactions.js';

const meta = {
  title: 'Export Formats/Previews/Code/JavaScript',
  tags: ['autodocs'],
  argTypes: sharedArgTypes,
};

export default meta;

export const StartBlank = {
  ...createExportPreviewStory('javascript', 'start-blank'),
  play: playCodePreview,
};
export const Previewed = createExportPreviewStory('javascript', 'auto-previewed');
