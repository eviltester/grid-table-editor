import { jest } from '@jest/globals';
import { fireEvent } from '@testing-library/dom';
import { JSDOM } from 'jsdom';
import { createImportExportGridPreviewSyncControlComponent } from '../../../js/gui_components/app/import-export-grid-preview-sync-control/index.js';

describe('ImportExportGridPreviewSyncControl', () => {
  let dom;
  let root;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    root = dom.window.document.getElementById('root');
  });

  afterEach(() => {
    dom.window.close();
    jest.restoreAllMocks();
  });

  test('enables grid-from-text only when preview text is dirty in preview mode', () => {
    const component = createImportExportGridPreviewSyncControlComponent({
      root,
      props: {
        mode: 'preview',
        previewTextDirty: false,
      },
    });

    const setTextButton = root.querySelector('[data-role="set-text-from-grid-button"]');
    const setGridButton = root.querySelector('[data-role="set-grid-from-text-button"]');
    const setTextIcons = setTextButton.querySelectorAll('svg.app-icon');
    const setGridIcons = setGridButton.querySelectorAll('svg.app-icon');

    expect(setTextButton.getAttribute('aria-label')).toBe('Set Text From Grid');
    expect(setTextButton.getAttribute('title')).toBe('Send Grid to Text Preview');
    expect(setGridButton.getAttribute('aria-label')).toBe('Set Grid From Text');
    expect(setGridButton.getAttribute('title')).toBe('Send Text Preview to Grid');
    expect(setTextIcons).toHaveLength(2);
    expect(setGridIcons).toHaveLength(2);
    expect(setTextButton.disabled).toBe(false);
    expect(setGridButton.disabled).toBe(true);

    component.update({ previewTextDirty: true });

    expect(setGridButton.disabled).toBe(false);
  });

  test('emits both sync actions and reflects aria-disabled when busy', () => {
    const onSetTextFromGrid = jest.fn();
    const onSetGridFromText = jest.fn();
    const component = createImportExportGridPreviewSyncControlComponent({
      root,
      props: {
        mode: 'edit',
        previewTextDirty: false,
      },
      callbacks: {
        onSetTextFromGrid,
        onSetGridFromText,
      },
    });

    const setTextButton = root.querySelector('[data-role="set-text-from-grid-button"]');
    const setGridButton = root.querySelector('[data-role="set-grid-from-text-button"]');

    fireEvent.click(setTextButton);
    fireEvent.click(setGridButton);

    expect(onSetTextFromGrid).toHaveBeenCalledTimes(1);
    expect(onSetGridFromText).toHaveBeenCalledTimes(1);

    component.update({ importBusy: true });

    expect(setTextButton.disabled).toBe(true);
    expect(setTextButton.getAttribute('aria-disabled')).toBe('true');
    expect(setGridButton.disabled).toBe(true);
    expect(setGridButton.getAttribute('aria-disabled')).toBe('true');
  });
});
