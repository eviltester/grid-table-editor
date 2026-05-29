import { createExportPreviewStory, sharedArgTypes } from './export-format-story-factory.js';

const meta = {
  title: 'Export Formats/Previews/Code (Unit Test)/PHP/PHPUnit',
  tags: ['autodocs'],
  argTypes: sharedArgTypes,
};

export default meta;

export const StartBlank = createExportPreviewStory('phpunit', 'start-blank');
export const Previewed = createExportPreviewStory('phpunit', 'auto-previewed');
