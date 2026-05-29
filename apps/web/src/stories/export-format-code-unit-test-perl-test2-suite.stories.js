import { createExportPreviewStory, sharedArgTypes } from './export-format-story-factory.js';

const meta = {
  title: 'Export Formats/Previews/Code (Unit Test)/Perl/Test2::Suite',
  tags: ['autodocs'],
  argTypes: sharedArgTypes,
};

export default meta;

export const StartBlank = createExportPreviewStory('test2-suite', 'start-blank');
export const Previewed = createExportPreviewStory('test2-suite', 'auto-previewed');
