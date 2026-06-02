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

    expect(document.getElementById('generateallpairs').style.display).toBe('none');

    component.setPairwiseVisible(true);
    expect(document.getElementById('generateallpairs').style.display).toBe('');

    component.setGenerateBusy(true);
    component.setGeneratePairwiseBusy(true);
    component.setRefreshPreviewBusy(true);
    expect(document.getElementById('generatedata').disabled).toBe(true);
    expect(document.getElementById('generateallpairs').disabled).toBe(true);
    expect(document.getElementById('refreshtestdatapreview').disabled).toBe(true);

    component.setGenerateBusy(false);
    component.setGeneratePairwiseBusy(false);
    component.setRefreshPreviewBusy(false);

    document.getElementById('generatedata').click();
    document.getElementById('generateallpairs').click();
    document.getElementById('refreshtestdatapreview').click();

    expect(onGenerate).toHaveBeenCalled();
    expect(onGeneratePairwise).toHaveBeenCalled();
    expect(onRefreshPreview).toHaveBeenCalled();
    component.destroy();
  });

  test('supports two instances in one document with distinct ids', () => {
    const onGenerateA = jest.fn();
    const onGenerateB = jest.fn();

    const componentA = createPopulationActionsComponent({
      root: document.getElementById('root'),
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

    document.getElementById('generatedata-a').click();
    expect(onGenerateA).toHaveBeenCalledTimes(1);
    expect(onGenerateB).not.toHaveBeenCalled();
    expect(document.getElementById('generateallpairs-a').style.display).toBe('');
    expect(document.getElementById('generateallpairs-b').style.display).toBe('none');

    componentA.destroy();
    componentB.destroy();
  });
});
