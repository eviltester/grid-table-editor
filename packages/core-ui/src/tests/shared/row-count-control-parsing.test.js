import { JSDOM } from 'jsdom';
import { parseRowCountInputElement } from '../../../js/gui_components/shared/row-count-control/row-count-control-parsing.js';

describe('row-count-control parsing', () => {
  test('parses valid values from an input element', () => {
    const dom = new JSDOM(
      '<!doctype html><html><body><input id="previewRowsCount" min="0" max="50" value="12" /></body></html>'
    );
    const input = dom.window.document.getElementById('previewRowsCount');

    expect(parseRowCountInputElement(input, { inputId: 'previewRowsCount', min: 0 })).toEqual({
      value: 12,
      valid: true,
      errors: [],
    });

    dom.window.close();
  });

  test('reports max validation errors from an input element', () => {
    const dom = new JSDOM(
      '<!doctype html><html><body><input id="previewRowsCount" min="0" max="50" value="99" /></body></html>'
    );
    const input = dom.window.document.getElementById('previewRowsCount');

    expect(parseRowCountInputElement(input, { inputId: 'previewRowsCount', min: 0 })).toEqual({
      value: 50,
      valid: false,
      errors: ['previewRowsCount must be less than or equal to 50.'],
    });

    dom.window.close();
  });

  test('reports a required numeric error when no input element is available', () => {
    expect(parseRowCountInputElement(null, { inputId: 'generateRowsCount', min: 0 })).toEqual({
      value: 0,
      valid: false,
      errors: ['generateRowsCount must be a number greater than or equal to 0.'],
    });
  });
});
