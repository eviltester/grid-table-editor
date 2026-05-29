import { createExportPreviewStory, sharedArgTypes } from './export-format-story-factory.js';

const meta = {
  title: 'Export Formats/Previews/Code (Unit Test)/Kotlin/Kotest',
  tags: ['autodocs'],
  argTypes: sharedArgTypes,
};

export default meta;

export const StartBlank = createExportPreviewStory('kotest', 'start-blank');
export const Previewed = createExportPreviewStory('kotest', 'auto-previewed');
