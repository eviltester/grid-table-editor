import { renderEmbeddedTestDataStory } from './storybook-harnesses.js';

const meta = {
  title: 'Test Data/Embedded Panel',
  tags: ['autodocs'],
};

export default meta;

export const EmptyEditor = {
  render: () => renderEmbeddedTestDataStory({ scenario: 'empty' }),
};

export const SampleSchema = {
  render: () => renderEmbeddedTestDataStory({ scenario: 'sample' }),
};

export const TextModeRoundTrip = {
  render: () => renderEmbeddedTestDataStory({ scenario: 'text-mode' }),
};

export const ValidationState = {
  render: () => renderEmbeddedTestDataStory({ scenario: 'validation' }),
};
