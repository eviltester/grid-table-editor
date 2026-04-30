import { JSDOM } from 'jsdom';
import { XmlOptionsPanel } from '../../packages/core-ui/js/gui_components/options_panels/options-xml-panel.js';
import { XmlConvertorOptions } from '@anywaydata/core/data_formats/xml-convertor.js';

describe('XmlOptionsPanel', () => {
  let dom;
  let parent;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body><div id="host"></div></body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
    parent = document.getElementById('host');
  });

  afterEach(() => {
    dom.window.close();
  });

  test('renders expected controls', () => {
    const panel = new XmlOptionsPanel(parent);
    panel.addToGui();

    expect(parent.querySelector('.xml-options')).toBeTruthy();
    expect(parent.querySelector("input[name='root-element-name']")).toBeTruthy();
    expect(parent.querySelector("input[name='item-element-name']")).toBeTruthy();
    expect(parent.querySelector("input[name='attribute-columns-csv']")).toBeTruthy();
    expect(parent.querySelector("input[name='include-xml-header']")).toBeTruthy();
    expect(parent.querySelector("input[name='xml-namespace']")).toBeTruthy();
    expect(parent.querySelector('.apply-options')).toBeTruthy();
  });

  test('getOptionsFromGui returns options with DOM values applied', () => {
    const panel = new XmlOptionsPanel(parent);
    panel.addToGui();
    parent.querySelector("input[name='root-element-name']").value = 'orders';
    parent.querySelector("input[name='item-element-name']").value = 'order';
    parent.querySelector("input[name='attribute-columns-csv']").value = 'id,code';
    parent.querySelector("input[name='include-xml-header']").checked = false;
    parent.querySelector("input[name='xml-namespace']").value = 'http://tempuri.org';

    const options = panel.getOptionsFromGui();

    expect(options).toBeInstanceOf(XmlConvertorOptions);
    expect(options.options.rootElementName).toBe('orders');
    expect(options.options.itemElementName).toBe('order');
    expect(options.options.attributeColumnsCsv).toBe('id,code');
    expect(options.options.includeXmlHeader).toBe(false);
    expect(options.options.xmlns).toBe('http://tempuri.org');
  });

  test('setFromOptions populates the form', () => {
    const panel = new XmlOptionsPanel(parent);
    panel.addToGui();
    panel.setFromOptions({
      options: {
        rootElementName: 'records',
        itemElementName: 'record',
        attributeColumnsCsv: 'id',
        includeXmlHeader: false,
        xmlns: 'http://example.com',
      },
    });

    expect(parent.querySelector("input[name='root-element-name']").value).toBe('records');
    expect(parent.querySelector("input[name='item-element-name']").value).toBe('record');
    expect(parent.querySelector("input[name='attribute-columns-csv']").value).toBe('id');
    expect(parent.querySelector("input[name='include-xml-header']").checked).toBe(false);
    expect(parent.querySelector("input[name='xml-namespace']").value).toBe('http://example.com');
  });

  test('setApplyCallback invokes callback with current options', () => {
    const panel = new XmlOptionsPanel(parent);
    const callback = jest.fn();
    panel.addToGui();
    panel.setApplyCallback(callback);
    parent.querySelector("input[name='root-element-name']").value = 'orders';

    parent.querySelector('.apply-options').click();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0][0].options.rootElementName).toBe('orders');
  });
});
