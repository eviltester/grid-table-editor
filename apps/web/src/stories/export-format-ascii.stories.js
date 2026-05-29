import { createExportPreviewStory, sharedArgTypes } from './export-format-story-factory.js';

const meta = {
  title: 'Export Formats/Previews/ASCII',
  tags: ['autodocs'],
  argTypes: sharedArgTypes,
};

export default meta;

export const StartBlank = createExportPreviewStory('asciitable', 'start-blank');
export const Previewed = createExportPreviewStory('asciitable', 'auto-previewed');
