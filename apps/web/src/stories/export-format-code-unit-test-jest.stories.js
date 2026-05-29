import { createExportPreviewStory, sharedArgTypes } from './export-format-story-factory.js';
import { playCodePreview } from './export-format-interactions.js';

const meta = {
  title: 'Export Formats/Previews/Code (Unit Test)/JavaScript/Jest',
  tags: ['autodocs'],
  argTypes: sharedArgTypes,
};

export default meta;

export const StartBlank = {
  ...createExportPreviewStory('jest', 'start-blank'),
  play: playCodePreview,
};
export const Previewed = createExportPreviewStory('jest', 'auto-previewed');
