import { createExportPreviewStory, sharedArgTypes } from './export-format-story-factory.js';

const meta = {
  title: 'Export Formats/Previews/Code (Unit Test)/Kotlin/Spek',
  tags: ['autodocs'],
  argTypes: sharedArgTypes,
};

export default meta;

export const StartBlank = createExportPreviewStory('spek', 'start-blank');
export const Previewed = createExportPreviewStory('spek', 'auto-previewed');
