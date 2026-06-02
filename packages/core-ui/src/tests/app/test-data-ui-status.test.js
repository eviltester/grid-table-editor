import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';

describe('test-data-ui-status presenter cache', () => {
  let originalDocument;
  let originalWindow;

  beforeEach(() => {
    jest.resetModules();
    originalDocument = global.document;
    originalWindow = global.window;
  });

  afterEach(() => {
    global.document = originalDocument;
    global.window = originalWindow;
  });

  test('status updates stay scoped to the current document when loading is shown first', async () => {
    const firstDom = new JSDOM('<!doctype html><html><body><div id="testdata-status"></div></body></html>');
    global.document = firstDom.window.document;
    global.window = firstDom.window;

    const statusModule = await import('../../../js/gui_components/app/test-data-grid/ui/test-data-ui-status.js');

    statusModule.setTestDataStatus('First document complete.');
    expect(firstDom.window.document.getElementById('testdata-status')?.textContent || '').toContain(
      'First document complete.'
    );

    const secondDom = new JSDOM('<!doctype html><html><body><div id="testdata-status"></div></body></html>');
    global.document = secondDom.window.document;
    global.window = secondDom.window;

    statusModule.setTestDataLoadingStatus('Generating rows...');
    statusModule.setTestDataStatus('Second document complete.');

    expect(secondDom.window.document.getElementById('testdata-status')?.textContent || '').toContain(
      'Second document complete.'
    );
    expect(firstDom.window.document.getElementById('testdata-status')?.textContent || '').not.toContain(
      'Second document complete.'
    );

    firstDom.window.close();
    secondDom.window.close();
  });
});
