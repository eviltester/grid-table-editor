import { createExportPreviewStory, sharedArgTypes } from './export-format-story-factory.js';

const meta = {
  title: 'Export Formats/Previews/HTML',
  tags: ['autodocs'],
  argTypes: sharedArgTypes,
};

export default meta;

export const StartBlank = createExportPreviewStory('html', 'start-blank');
export const Previewed = createExportPreviewStory('html', 'auto-previewed');
