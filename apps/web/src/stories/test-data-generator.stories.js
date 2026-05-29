import { renderGeneratorStory } from './storybook-harnesses.js';

const meta = {
  title: 'Test Data/Generator',
  tags: ['autodocs'],
};

export default meta;

export const EmptyEditor = {
  render: () => renderGeneratorStory({ scenario: 'empty' }),
};

export const SampleSchema = {
  render: () => renderGeneratorStory({ scenario: 'sample' }),
};

export const TextModeRoundTrip = {
  render: () => renderGeneratorStory({ scenario: 'text-mode' }),
};

export const ValidationState = {
  render: () => renderGeneratorStory({ scenario: 'validation' }),
};
