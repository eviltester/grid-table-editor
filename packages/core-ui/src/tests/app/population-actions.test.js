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

    document.getElementById('generatedata').click();
    document.getElementById('generateallpairs').click();
    document.getElementById('refreshtestdatapreview').click();

    expect(onGenerate).toHaveBeenCalled();
    expect(onGeneratePairwise).toHaveBeenCalled();
    expect(onRefreshPreview).toHaveBeenCalled();
    component.destroy();
  });
});
