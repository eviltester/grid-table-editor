import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import {
  bindPrimaryActions,
  bindGenerateCountInput,
  bindModeRadios,
  bindSchemaSampleShortcut,
} from '../../../js/gui_components/app/test-data-grid/test-data-grid-ui-bindings.js';

describe('test-data-grid ui bindings', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
    global.Event = dom.window.Event;
  });

  afterEach(() => {
    dom.window.close();
  });

  test('bindGenerateCountInput normalizes invalid values to 1', () => {
    document.body.innerHTML = '<input type="number" id="generateCount" />';

    bindGenerateCountInput();
    const input = document.getElementById('generateCount');
    expect(input.value).toBe('1');

    input.value = '-2';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(input.value).toBe('1');
  });

  test('bindModeRadios applies default row count on checked radio change', () => {
    document.body.innerHTML =
      '<div id="host"><input type="radio" name="testDataGenerationMode" value="new-table"><input type="radio" name="testDataGenerationMode" value="amend-table"></div>';
    const parentElem = document.getElementById('host');
    const applyModeDefaultRowCount = jest.fn();
    const amend = parentElem.querySelector('input[value="amend-table"]');
    amend.checked = true;

    bindModeRadios({ parentElem, applyModeDefaultRowCount });
    amend.dispatchEvent(new Event('change', { bubbles: true }));

    expect(applyModeDefaultRowCount).toHaveBeenCalledWith('amend-table');
  });

  test('bindPrimaryActions wires all action buttons', () => {
    document.body.innerHTML =
      '<button id="generatedata"></button><button id="generateallpairs"></button><button id="refreshtestdatapreview"></button>';
    const onGenerate = jest.fn();
    const onGeneratePairwise = jest.fn();
    const onRefreshPreview = jest.fn();

    bindPrimaryActions({ onGenerate, onGeneratePairwise, onRefreshPreview });
    document.getElementById('generatedata').click();
    document.getElementById('generateallpairs').click();
    document.getElementById('refreshtestdatapreview').click();

    expect(onGenerate).toHaveBeenCalledTimes(1);
    expect(onGeneratePairwise).toHaveBeenCalledTimes(1);
    expect(onRefreshPreview).toHaveBeenCalledTimes(1);
  });

  test('bindSchemaSampleShortcut replaces previous handler and invokes callback', () => {
    document.body.innerHTML = '<button class="testdata-schema-sample-button"></button>';
    const previousHandler = jest.fn();
    document.addEventListener('click', previousHandler);
    const onSampleRequested = jest.fn();

    const nextHandler = bindSchemaSampleShortcut({
      currentHandler: previousHandler,
      onSampleRequested,
    });
    document.querySelector('.testdata-schema-sample-button').click();

    expect(previousHandler).not.toHaveBeenCalled();
    expect(onSampleRequested).toHaveBeenCalledTimes(1);
    expect(typeof nextHandler).toBe('function');
  });
});
