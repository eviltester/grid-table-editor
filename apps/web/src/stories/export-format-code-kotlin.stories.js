import { createExportPreviewStory, sharedArgTypes } from './export-format-story-factory.js';

const meta = {
  title: 'Export Formats/Previews/Code/Kotlin',
  tags: ['autodocs'],
  argTypes: sharedArgTypes,
};

export default meta;

export const StartBlank = createExportPreviewStory('kotlin', 'start-blank');
export const Previewed = createExportPreviewStory('kotlin', 'auto-previewed');
