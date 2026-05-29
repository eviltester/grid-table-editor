import { createExportPreviewStory, sharedArgTypes } from './export-format-story-factory.js';

const meta = {
  title: 'Export Formats/Previews/JSONL',
  tags: ['autodocs'],
  argTypes: sharedArgTypes,
};

export default meta;

export const StartBlank = createExportPreviewStory('jsonl', 'start-blank');
export const Previewed = createExportPreviewStory('jsonl', 'auto-previewed');
