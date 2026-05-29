import { JSDOM } from 'jsdom';
import { jest } from '@jest/globals';
import {
  renderEmbeddedTestDataStory,
  renderGeneratorStory,
  renderGridPreviewStory,
} from '../../../stories/storybook-harnesses.js';

describe('storybook harnesses', () => {
  let dom;
  const flushUi = async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));
  };

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

  test('does not emit export actions during initial story mount', () => {
    const actions = {
      onFormatSelected: jest.fn(),
      onPreviewRendered: jest.fn(),
      onSetTextFromGrid: jest.fn(),
      onSetGridFromText: jest.fn(),
      onSetGridFromTextFailed: jest.fn(),
      onOptionsApplied: jest.fn(),
      onPreviewModeChanged: jest.fn(),
      onAutoPreviewChanged: jest.fn(),
      onCopyText: jest.fn(),
      onDownloadRequested: jest.fn(),
    };

    renderGridPreviewStory({
      format: 'json',
      state: 'auto-previewed',
      asObject: true,
      asPropertyNamed: 'records',
      actions,
    });

    Object.values(actions).forEach((actionSpy) => {
      expect(actionSpy).not.toHaveBeenCalled();
    });
  });

  test('emits onFormatSelected when a direct export format is selected', () => {
    const onFormatSelected = jest.fn();
    const story = renderGridPreviewStory({
      format: 'markdown',
      state: 'start-blank',
      actions: { onFormatSelected },
    });

    story.querySelector('.type-select-action[data-type="json"]')?.click();

    expect(onFormatSelected).toHaveBeenCalledWith({
      group: 'Direct',
      type: 'json',
      label: 'JSON',
    });
  });

  test('emits preview actions when set text from grid is clicked', () => {
    const onSetTextFromGrid = jest.fn();
    const onPreviewRendered = jest.fn();
    const story = renderGridPreviewStory({
      format: 'markdown',
      state: 'start-blank',
      actions: { onSetTextFromGrid, onPreviewRendered },
    });

    story.querySelector('#settextfromgridbutton')?.click();

    expect(onSetTextFromGrid).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'markdown',
        mode: 'preview',
        previewRowLimit: 10,
        trigger: 'button',
      })
    );
    expect(onPreviewRendered).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'markdown',
        mode: 'preview',
        previewRowLimit: 10,
      })
    );
  });

  test('emits simplified grid payload when set grid from text succeeds', async () => {
    const onSetGridFromText = jest.fn();
    const story = renderGridPreviewStory({
      format: 'csv',
      state: 'start-blank',
      actions: { onSetGridFromText },
    });

    story.querySelector('#previewEditModeButton')?.click();
    await flushUi();
    const textArea = story.querySelector('#markdownarea');
    textArea.value = 'Name,Role\nAda,Engineer\nBob,Tester';
    story.querySelector('#setgridfromtextbutton')?.click();
    await flushUi();

    expect(onSetGridFromText).toHaveBeenCalledWith({
      type: 'csv',
      headers: ['Name', 'Role'],
      rows: [
        ['Ada', 'Engineer'],
        ['Bob', 'Tester'],
      ],
      rowCount: 2,
      headerCount: 2,
      sourceTextLength: textArea.value.length,
    });
  });

  test('restores document query helpers after async scoped import flow', async () => {
    const originalQuerySelector = document.querySelector;
    const originalQuerySelectorAll = document.querySelectorAll;
    const originalGetElementById = document.getElementById;
    const story = renderGridPreviewStory({
      format: 'csv',
      state: 'start-blank',
    });

    story.querySelector('#previewEditModeButton')?.click();
    await flushUi();
    const textArea = story.querySelector('#markdownarea');
    textArea.value = 'Name,Role\nAda,Engineer\nBob,Tester';
    story.querySelector('#setgridfromtextbutton')?.click();
    await flushUi();

    expect(document.querySelector).toBe(originalQuerySelector);
    expect(document.querySelectorAll).toBe(originalQuerySelectorAll);
    expect(document.getElementById).toBe(originalGetElementById);
  });

  test('emits parse failure when set grid from text cannot parse input', async () => {
    const onSetGridFromTextFailed = jest.fn();
    const story = renderGridPreviewStory({
      format: 'json',
      state: 'start-blank',
      actions: { onSetGridFromTextFailed },
    });

    story.querySelector('#previewEditModeButton')?.click();
    await flushUi();
    const textArea = story.querySelector('#markdownarea');
    textArea.value = '{"broken":';
    story.querySelector('#setgridfromtextbutton')?.click();
    await flushUi();

    expect(onSetGridFromTextFailed).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'json',
        sourceTextLength: textArea.value.length,
      })
    );
  });

  test('emits options applied for json options', async () => {
    const onOptionsApplied = jest.fn();
    const story = renderGridPreviewStory({
      format: 'json',
      state: 'start-blank',
      actions: { onOptionsApplied },
    });

    const dirtyTrigger = story.querySelector('.json-options input[type="checkbox"]');
    dirtyTrigger.checked = !dirtyTrigger.checked;
    dirtyTrigger.dispatchEvent(new Event('change', { bubbles: true }));
    story.querySelector('.apply-options')?.click();
    await flushUi();

    expect(onOptionsApplied).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'json',
        options: expect.any(Object),
      })
    );
  });

  test('emits preview mode and auto preview changes', async () => {
    const onPreviewModeChanged = jest.fn();
    const onAutoPreviewChanged = jest.fn();
    const story = renderGridPreviewStory({
      format: 'csv',
      state: 'start-blank',
      actions: { onPreviewModeChanged, onAutoPreviewChanged },
    });

    story.querySelector('#previewEditModeButton')?.click();
    await flushUi();
    story.querySelector('#previewEditModeButton')?.click();
    await flushUi();
    story.querySelector('#autoPreviewCheckbox')?.click();

    expect(onPreviewModeChanged).toHaveBeenNthCalledWith(1, {
      mode: 'edit',
      previewRowLimit: 10,
    });
    expect(onPreviewModeChanged).toHaveBeenNthCalledWith(2, {
      mode: 'preview',
      previewRowLimit: 10,
    });
    expect(onAutoPreviewChanged).toHaveBeenCalledWith({
      enabled: true,
      mode: 'preview',
    });
  });
});
