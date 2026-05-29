import { createExportPreviewStory, sharedArgTypes } from './export-format-story-factory.js';

const meta = {
  title: 'Export Formats/Previews/Code (Unit Test)/C#/MSTest',
  tags: ['autodocs'],
  argTypes: sharedArgTypes,
};

export default meta;

export const StartBlank = createExportPreviewStory('mstest', 'start-blank');
export const Previewed = createExportPreviewStory('mstest', 'auto-previewed');
