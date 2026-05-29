import { createExportPreviewStory, sharedArgTypes } from './export-format-story-factory.js';

const meta = {
  title: 'Export Formats/Previews/Code (Unit Test)/TypeScript/Vitest',
  tags: ['autodocs'],
  argTypes: sharedArgTypes,
};

export default meta;

export const StartBlank = createExportPreviewStory('vitest', 'start-blank');
export const Previewed = createExportPreviewStory('vitest', 'auto-previewed');
