import { jest } from '@jest/globals';
import { fireEvent } from '@testing-library/dom';
import { JSDOM } from 'jsdom';
import * as optionsPreviewSplitLayoutExports from '../../../js/gui_components/app/options-preview-split-layout/index.js';
import { createOptionsPreviewSplitLayoutComponent } from '../../../js/gui_components/app/options-preview-split-layout/index.js';

describe('OptionsPreviewSplitLayout', () => {
  let dom;
  let documentObj;
  let root;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    documentObj = dom.window.document;
    root = documentObj.getElementById('root');
    global.document = documentObj;
    global.window = dom.window;
  });

  afterEach(() => {
    dom.window.close();
    jest.restoreAllMocks();
    delete global.document;
    delete global.window;
  });

  test('public barrel is component-factory-only', () => {
    expect(optionsPreviewSplitLayoutExports.createOptionsPreviewSplitLayoutComponent).toBe(
      createOptionsPreviewSplitLayoutComponent
    );
    expect(optionsPreviewSplitLayoutExports.OptionsPreviewSplitLayoutController).toBeUndefined();
    expect(optionsPreviewSplitLayoutExports.OptionsPreviewSplitLayoutView).toBeUndefined();
  });

  test('renders preview-only layout when options are unsupported', () => {
    const component = createOptionsPreviewSplitLayoutComponent({
      root,
      documentObj,
      props: {
        optionsSupported: false,
      },
    });

    const editArea = component.getEditArea();
    const optionsPanelRoot = component.getOptionsPanelRoot();
    const splitter = component.getOptionsPreviewSplitter();
    const previewPanelRoot = component.getPreviewPanelRoot();

    expect(editArea.style.display).toBe('block');
    expect(optionsPanelRoot.style.display).toBe('none');
    expect(splitter.style.display).toBe('none');
    expect(previewPanelRoot.style.width).toBe('100%');
    expect(previewPanelRoot.style.height).toBe('100%');

    component.destroy();
  });

  test('renders supported split layout and responds to keyboard resizing with clamping', () => {
    const component = createOptionsPreviewSplitLayoutComponent({
      root,
      documentObj,
      props: {
        optionsSupported: true,
      },
    });

    const editArea = component.getEditArea();
    const optionsPanelRoot = component.getOptionsPanelRoot();
    const splitter = component.getOptionsPreviewSplitter();
    jest.spyOn(editArea, 'getBoundingClientRect').mockReturnValue({
      width: 360,
      height: 240,
      top: 0,
      left: 0,
      right: 360,
      bottom: 240,
      x: 0,
      y: 0,
      toJSON() {},
    });

    component.update({ optionsSupported: true });

    expect(editArea.style.display).toBe('flex');
    expect(optionsPanelRoot.style.display).toBe('block');
    expect(splitter.style.display).toBe('block');
    expect(splitter.getAttribute('aria-valuenow')).toBe('180');

    fireEvent.keyDown(splitter, { key: 'ArrowRight' });
    expect(splitter.getAttribute('aria-valuenow')).toBe('180');

    fireEvent.keyDown(splitter, { key: 'End' });
    expect(splitter.getAttribute('aria-valuenow')).toBe('180');

    fireEvent.keyDown(splitter, { key: 'ArrowLeft' });
    expect(splitter.getAttribute('aria-valuenow')).toBe('180');

    component.destroy();
  });

  test('preserves a wider resizable state in a larger container', () => {
    const component = createOptionsPreviewSplitLayoutComponent({
      root,
      documentObj,
      props: {
        optionsSupported: true,
      },
    });

    const editArea = component.getEditArea();
    const splitter = component.getOptionsPreviewSplitter();
    jest.spyOn(editArea, 'getBoundingClientRect').mockReturnValue({
      width: 700,
      height: 240,
      top: 0,
      left: 0,
      right: 700,
      bottom: 240,
      x: 0,
      y: 0,
      toJSON() {},
    });

    component.update({ optionsSupported: true });
    fireEvent.keyDown(splitter, { key: 'End' });
    expect(splitter.getAttribute('aria-valuenow')).toBe('480');
    expect(splitter.getAttribute('aria-valuemax')).toBe('480');

    fireEvent.keyDown(splitter, { key: 'Home' });
    expect(splitter.getAttribute('aria-valuenow')).toBe('180');

    component.destroy();
  });
});
