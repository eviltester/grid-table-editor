import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';

describe('test-data-ui-status presenter cache', () => {
  let originalDocument;
  let originalWindow;
  let originalRequestAnimationFrame;
  let originalSetTimeout;

  beforeEach(() => {
    jest.resetModules();
    originalDocument = global.document;
    originalWindow = global.window;
    originalRequestAnimationFrame = global.requestAnimationFrame;
    originalSetTimeout = global.setTimeout;
  });

  afterEach(() => {
    global.document = originalDocument;
    global.window = originalWindow;
    global.requestAnimationFrame = originalRequestAnimationFrame;
    global.setTimeout = originalSetTimeout;
  });

  test('status updates stay scoped to the current document when loading is shown first', async () => {
    const firstDom = new JSDOM('<!doctype html><html><body><div data-role="population-status"></div></body></html>');
    global.document = firstDom.window.document;
    global.window = firstDom.window;

    const statusModule = await import('../../../js/gui_components/app/test-data-grid/ui/test-data-ui-status.js');

    statusModule.setTestDataStatus('First document complete.');
    expect(firstDom.window.document.querySelector('[data-role="population-status"]')?.textContent || '').toContain(
      'First document complete.'
    );

    const secondDom = new JSDOM('<!doctype html><html><body><div data-role="population-status"></div></body></html>');
    global.document = secondDom.window.document;
    global.window = secondDom.window;

    statusModule.setTestDataLoadingStatus('Generating rows...');
    statusModule.setTestDataStatus('Second document complete.');

    expect(secondDom.window.document.querySelector('[data-role="population-status"]')?.textContent || '').toContain(
      'Second document complete.'
    );
    expect(firstDom.window.document.querySelector('[data-role="population-status"]')?.textContent || '').not.toContain(
      'Second document complete.'
    );

    firstDom.window.close();
    secondDom.window.close();
  });

  test('scoped service prefers injected browser scheduling callbacks over ambient globals', async () => {
    const dom = new JSDOM('<!doctype html><html><body><div data-role="population-status"></div></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;

    const ambientRequestAnimationFrame = jest.fn();
    const ambientSetTimeout = jest.fn();
    global.requestAnimationFrame = ambientRequestAnimationFrame;
    global.setTimeout = ambientSetTimeout;

    const statusModule = await import('../../../js/gui_components/app/test-data-grid/ui/test-data-ui-status.js');
    const requestAnimationFrameFn = jest.fn((callback) => callback());
    const setTimeoutFn = jest.fn((callback) => callback());
    const service = statusModule.createTestDataUiStatusService({
      documentObj: dom.window.document,
      windowObj: dom.window,
      requestAnimationFrameFn,
      setTimeoutFn,
    });

    await service.yieldToUi();

    expect(requestAnimationFrameFn).toHaveBeenCalledTimes(1);
    expect(setTimeoutFn).toHaveBeenCalledTimes(1);
    expect(ambientRequestAnimationFrame).not.toHaveBeenCalled();
    expect(ambientSetTimeout).not.toHaveBeenCalled();

    service.destroy();
    dom.window.close();
  });

  test('scoped service prefers rooted population-status hooks over the legacy status id', async () => {
    const dom = new JSDOM(`<!doctype html><html><body>
      <div id="testdata-status">legacy</div>
      <div data-role="population-status"></div>
    </body></html>`);
    global.document = dom.window.document;
    global.window = dom.window;

    const statusModule = await import('../../../js/gui_components/app/test-data-grid/ui/test-data-ui-status.js');
    const service = statusModule.createTestDataUiStatusService({
      documentObj: dom.window.document,
      windowObj: dom.window,
    });

    service.setTestDataStatus('Hook-owned status');

    expect(dom.window.document.querySelector('[data-role="population-status"]')?.textContent || '').toContain(
      'Hook-owned status'
    );
    expect(dom.window.document.getElementById('testdata-status')?.textContent || '').toBe('legacy');

    service.destroy();
    dom.window.close();
  });
});
