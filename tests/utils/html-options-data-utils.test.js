import { JSDOM } from 'jsdom';
import { HtmlDataValues } from '../../js/gui_components/options_panels/html-options-data-utils.js';

describe('HtmlDataValues', () => {
  let dom;
  let parent;
  let htmlData;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body>
      <div id="host">
        <select class="main-select">
          <option value="tab">Tab</option>
          <option value="space">Space</option>
          <option value="custom">Custom</option>
        </select>
        <input class="custom-input" type="text" value="">
        <input class="checkbox" type="checkbox">
        <input class="textfield" type="text" value="alpha">
      </div>
    </body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
    parent = document.getElementById('host');
    htmlData = new HtmlDataValues(parent);
  });

  afterEach(() => {
    dom.window.close();
    jest.restoreAllMocks();
  });

  test('getSelectedValueFrom returns selected value or default when missing', () => {
    parent.querySelector('.main-select').value = 'space';

    expect(htmlData.getSelectedValueFrom('.main-select', 'fallback')).toBe('space');
    expect(htmlData.getSelectedValueFrom('.missing-select', 'fallback')).toBe('fallback');
  });

  test('getCheckBoxValueFrom and setCheckBoxFrom read and write checkbox values', () => {
    htmlData.setCheckBoxFrom('.checkbox', true, false);
    expect(htmlData.getCheckBoxValueFrom('.checkbox')).toBe(true);

    htmlData.setCheckBoxFrom('.checkbox', undefined, false);
    expect(htmlData.getCheckBoxValueFrom('.checkbox')).toBe(false);
  });

  test('setCheckBoxFrom safely ignores missing elements', () => {
    expect(() => htmlData.setCheckBoxFrom('.missing-checkbox', true, false)).not.toThrow();
  });

  test('setDropDownOptionToKeyValue selects matching option or falls back to default', () => {
    htmlData.setDropDownOptionToKeyValue('.main-select', 'space', 'tab');
    expect(parent.querySelector('.main-select').value).toBe('space');

    htmlData.setDropDownOptionToKeyValue('.main-select', 'unknown', 'tab');
    expect(parent.querySelector('.main-select').value).toBe('tab');
  });

  test('setTextFieldToValue and getTextInputValueFrom read, write, and default missing inputs', () => {
    htmlData.setTextFieldToValue('.textfield', 'beta');
    expect(htmlData.getTextInputValueFrom('.textfield')).toBe('beta');

    htmlData.setTextFieldToValue('.textfield', undefined);
    expect(htmlData.getTextInputValueFrom('.textfield')).toBe('');
    expect(htmlData.getTextInputValueFrom('.missing-textfield')).toBe('');
    expect(() => htmlData.setTextFieldToValue('.missing-textfield', 'ignored')).not.toThrow();
  });

  test('getSelectWithCustomInput returns custom input, mapped values, or the fallback default', () => {
    const mappings = { tab: '\t', space: ' ' };
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    parent.querySelector('.main-select').value = 'custom';
    parent.querySelector('.custom-input').value = '||';
    expect(
      htmlData.getSelectWithCustomInput('.main-select', 'custom', '.custom-input', mappings, 'default-value')
    ).toBe('||');

    parent.querySelector('.main-select').value = 'space';
    expect(
      htmlData.getSelectWithCustomInput('.main-select', 'custom', '.custom-input', mappings, 'default-value')
    ).toBe(' ');

    parent.querySelector('.main-select').value = 'custom';
    parent.querySelector('.custom-input').value = '';
    expect(
      htmlData.getSelectWithCustomInput('.main-select', 'custom', '.custom-input', mappings, 'default-value')
    ).toBe('');

    const unknownOption = document.createElement('option');
    unknownOption.value = 'unknown';
    unknownOption.textContent = 'Unknown';
    parent.querySelector('.main-select').appendChild(unknownOption);
    parent.querySelector('.main-select').value = 'unknown';
    expect(
      htmlData.getSelectWithCustomInput('.main-select', 'custom', '.custom-input', mappings, 'default-value')
    ).toBe('default-value');
    expect(consoleSpy).toHaveBeenCalledWith('unknown item found - using default');
  });

  test('setSelectWithCustomInput selects mapped values and custom values', () => {
    const mappings = { tab: '\t', space: ' ' };

    htmlData.setSelectWithCustomInput('.main-select', 'custom', '.custom-input', mappings, ' ');
    expect(parent.querySelector('.main-select').value).toBe('space');
    expect(parent.querySelector('.custom-input').value).toBe('');

    htmlData.setSelectWithCustomInput('.main-select', 'custom', '.custom-input', mappings, '||');
    expect(parent.querySelector('.main-select').value).toBe('custom');
    expect(parent.querySelector('.custom-input').value).toBe('||');
  });
});
