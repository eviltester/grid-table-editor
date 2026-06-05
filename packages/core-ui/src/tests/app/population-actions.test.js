import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createPopulationActionsComponent } from '../../../js/gui_components/app/population-actions/index.js';

describe('PopulationActions', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
    global.Event = dom.window.Event;
  });

  afterEach(() => {
    dom.window.close();
    delete global.window;
    delete global.document;
    delete global.Event;
  });

  test('renders actions, toggles pairwise visibility, and emits clicks', () => {
    const onGenerate = jest.fn();
    const onGeneratePairwise = jest.fn();
    const onRefreshPreview = jest.fn();

    const component = createPopulationActionsComponent({
      root: document.getElementById('root'),
      props: { pairwiseVisible: false },
      callbacks: {
        onGenerate,
        onGeneratePairwise,
        onRefreshPreview,
      },
    });

    const root = document.getElementById('root');
    const generateButton = root.querySelector('[data-role="generate-button"]');
    const generatePairwiseButton = root.querySelector('[data-role="generate-pairwise-button"]');
    const refreshPreviewButton = root.querySelector('[data-role="refresh-preview-button"]');
    const status = root.querySelector('[data-role="population-status"]');

    expect(generateButton?.id).toBe('');
    expect(generatePairwiseButton?.id).toBe('');
    expect(refreshPreviewButton?.id).toBe('');
    expect(status?.id).toBe('');
    expect(document.getElementById('generatedata')).toBeNull();
    expect(document.getElementById('generateallpairs')).toBeNull();
    expect(document.getElementById('refreshtestdatapreview')).toBeNull();
    expect(document.getElementById('testdata-status')).toBeNull();

    expect(generatePairwiseButton.style.display).toBe('none');

    component.setPairwiseVisible(true);
    expect(generatePairwiseButton.style.display).toBe('');

    component.setGenerateBusy(true);
    component.setGeneratePairwiseBusy(true);
    component.setRefreshPreviewBusy(true);
    expect(generateButton.disabled).toBe(true);
    expect(generatePairwiseButton.disabled).toBe(true);
    expect(refreshPreviewButton.disabled).toBe(true);

    component.setGenerateBusy(false);
    component.setGeneratePairwiseBusy(false);
    component.setRefreshPreviewBusy(false);

    generateButton.click();
    generatePairwiseButton.click();
    refreshPreviewButton.click();

    expect(onGenerate).toHaveBeenCalled();
    expect(onGeneratePairwise).toHaveBeenCalled();
    expect(onRefreshPreview).toHaveBeenCalled();
    component.destroy();
  });

  test('supports two instances in one document with distinct ids', () => {
    const onGenerateA = jest.fn();
    const onGenerateB = jest.fn();

    const rootA = document.getElementById('root');
    const componentA = createPopulationActionsComponent({
      root: rootA,
      props: {
        pairwiseVisible: true,
        ids: {
          generateButton: 'generatedata-a',
          generatePairwiseButton: 'generateallpairs-a',
          refreshPreviewButton: 'refreshtestdatapreview-a',
          status: 'testdata-status-a',
        },
      },
      callbacks: { onGenerate: onGenerateA },
    });

    const siblingRoot = document.createElement('div');
    siblingRoot.id = 'root-b';
    document.body.appendChild(siblingRoot);

    const componentB = createPopulationActionsComponent({
      root: siblingRoot,
      props: {
        pairwiseVisible: false,
        ids: {
          generateButton: 'generatedata-b',
          generatePairwiseButton: 'generateallpairs-b',
          refreshPreviewButton: 'refreshtestdatapreview-b',
          status: 'testdata-status-b',
        },
      },
      callbacks: { onGenerate: onGenerateB },
    });

    const generateButtonA = rootA.querySelector('[data-role="generate-button"]');
    const generatePairwiseButtonA = rootA.querySelector('[data-role="generate-pairwise-button"]');
    const generatePairwiseButtonB = siblingRoot.querySelector('[data-role="generate-pairwise-button"]');
    const statusA = rootA.querySelector('[data-role="population-status"]');
    const statusB = siblingRoot.querySelector('[data-role="population-status"]');

    expect(generateButtonA?.id).toBe('generatedata-a');
    expect(rootA.querySelector('[data-role="refresh-preview-button"]')?.id).toBe('refreshtestdatapreview-a');
    expect(statusA?.id).toBe('testdata-status-a');
    expect(siblingRoot.querySelector('[data-role="generate-button"]')?.id).toBe('generatedata-b');
    expect(siblingRoot.querySelector('[data-role="refresh-preview-button"]')?.id).toBe('refreshtestdatapreview-b');
    expect(statusB?.id).toBe('testdata-status-b');

    generateButtonA.click();
    expect(onGenerateA).toHaveBeenCalledTimes(1);
    expect(onGenerateB).not.toHaveBeenCalled();
    expect(generatePairwiseButtonA.style.display).toBe('');
    expect(generatePairwiseButtonB.style.display).toBe('none');

    componentA.destroy();
    componentB.destroy();
  });
});
