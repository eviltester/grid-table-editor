import { createExportPreviewStory, sharedArgTypes } from './export-format-story-factory.js';

const meta = {
  title: 'Export Formats/Previews/Code (Unit Test)/Kotlin/JUnit5 Kotlin',
  tags: ['autodocs'],
  argTypes: sharedArgTypes,
};

export default meta;

export const StartBlank = createExportPreviewStory('junit5-kotlin', 'start-blank');
export const Previewed = createExportPreviewStory('junit5-kotlin', 'auto-previewed');
