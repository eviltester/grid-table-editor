import { createExportPreviewStory, sharedArgTypes } from './export-format-story-factory.js';

const meta = {
  title: 'Export Formats/Previews/Code/C#',
  tags: ['autodocs'],
  argTypes: sharedArgTypes,
};

export default meta;

export const StartBlank = createExportPreviewStory('csharp', 'start-blank');
export const Previewed = createExportPreviewStory('csharp', 'auto-previewed');
