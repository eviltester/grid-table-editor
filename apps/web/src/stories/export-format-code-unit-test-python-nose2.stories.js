import { createExportPreviewStory, sharedArgTypes } from './export-format-story-factory.js';

const meta = {
  title: 'Export Formats/Previews/Code (Unit Test)/Python/nose2',
  tags: ['autodocs'],
  argTypes: sharedArgTypes,
};

export default meta;

export const StartBlank = createExportPreviewStory('nose2', 'start-blank');
export const Previewed = createExportPreviewStory('nose2', 'auto-previewed');
