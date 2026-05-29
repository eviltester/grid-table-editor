import { createExportPreviewStory, sharedArgTypes } from './export-format-story-factory.js';
import { playCsvRoundTrip, playSetTextFromGrid } from './export-format-interactions.js';

const meta = {
  title: 'Export Formats/Previews/CSV',
  tags: ['autodocs'],
  argTypes: sharedArgTypes,
};

export default meta;

export const StartBlank = {
  ...createExportPreviewStory('csv', 'start-blank'),
  play: playSetTextFromGrid,
};
export const Previewed = {
  ...createExportPreviewStory('csv', 'auto-previewed'),
  play: playCsvRoundTrip,
};
