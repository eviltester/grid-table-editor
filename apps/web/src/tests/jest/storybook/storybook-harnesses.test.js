import { JSDOM } from 'jsdom';
import {
  renderEmbeddedTestDataStory,
  renderGeneratorStory,
  renderGridPreviewStory,
} from '../../../stories/storybook-harnesses.js';

describe('storybook harnesses', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body></body></html>', {
      pretendToBeVisual: true,
      url: 'http://localhost/',
    });
    global.window = dom.window;
    global.document = dom.window.document;
    global.HTMLElement = dom.window.HTMLElement;
    global.Event = dom.window.Event;
    global.MouseEvent = dom.window.MouseEvent;
    global.FocusEvent = dom.window.FocusEvent;
    global.CustomEvent = dom.window.CustomEvent;
    global.navigator = dom.window.navigator;
    global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
    global.cancelAnimationFrame = (handle) => clearTimeout(handle);
  });

  afterEach(() => {
    dom.window.close();
    delete global.window;
    delete global.document;
    delete global.HTMLElement;
    delete global.Event;
    delete global.MouseEvent;
    delete global.FocusEvent;
    delete global.CustomEvent;
    delete global.navigator;
    delete global.requestAnimationFrame;
    delete global.cancelAnimationFrame;
  });

  test('renders the embedded test-data panel sample story', () => {
    const story = renderEmbeddedTestDataStory({ scenario: 'sample' });

    expect(story.querySelectorAll('.generator-schema-row').length).toBeGreaterThan(1);
    expect(story.querySelector('#testDataSchemaText')).toBeTruthy();
  });

  test('renders the generator sample story', () => {
    const story = renderGeneratorStory({ scenario: 'sample' });

    expect(story.querySelectorAll('.generator-schema-row').length).toBeGreaterThan(1);
    expect(story.querySelector('#generatorOutputFormat')).toBeTruthy();
  });

  test('renders the JSON previewed object wrapper story', () => {
    const story = renderGridPreviewStory({
      format: 'json',
      state: 'auto-previewed',
      asObject: true,
      asPropertyNamed: 'records',
    });

    expect(story.querySelector('#markdownarea')?.value).toContain('"records"');
    expect(story.querySelector('.json-options')).toBeTruthy();
  });

  test('renders auto-preview text into the current story surface when multiple stories exist', () => {
    const firstStory = renderGridPreviewStory({
      format: 'markdown',
      state: 'start-blank',
    });
    const firstStoryPreviewBefore = firstStory.querySelector('#markdownarea')?.value;
    const secondStory = renderGridPreviewStory({
      format: 'json',
      state: 'auto-previewed',
      asObject: true,
      asPropertyNamed: 'records',
    });

    expect(firstStory.querySelector('#markdownarea')?.value).toBe(firstStoryPreviewBefore);
    expect(secondStory.querySelector('#markdownarea')?.value).toContain('"records"');
  });
});
