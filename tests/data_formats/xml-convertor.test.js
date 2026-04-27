import { JSDOM } from 'jsdom';
import { GenericDataTable } from '../../js/data_formats/generic-data-table.js';
import { XmlConvertor, XmlConvertorOptions } from '../../js/data_formats/xml-convertor.js';

function createTable(headers, rows) {
  const table = new GenericDataTable();
  table.setHeaders(headers);
  rows.forEach((row) => table.appendDataRow(row));
  return table;
}

function getParsedXml(xmlText, DOMParserCtor) {
  return new DOMParserCtor().parseFromString(xmlText, 'application/xml');
}

function expectValidXml(xmlText, DOMParserCtor) {
  const xml = getParsedXml(xmlText, DOMParserCtor);
  expect(xml.getElementsByTagName('parsererror').length).toBe(0);
  return xml;
}

describe('XmlConvertor', () => {
  let DOMParserCtor;

  beforeAll(() => {
    DOMParserCtor = new JSDOM('<!doctype html><html><body></body></html>').window.DOMParser;
  });

  describe('option combinations are XML valid', () => {
    const headerModes = [true, false];
    const xmlnsModes = ['', 'http://tempuri.org/PurchaseOrderSchema.xsd'];
    const attributeModes = [
      { key: 'none', csv: '' },
      { key: 'some', csv: 'Id' },
      { key: 'all', csv: 'Name,Id,Note' },
      { key: 'some-with-unknown', csv: 'Id,Missing' },
    ];
    const nameModes = [
      { key: 'default', value: 'root' },
      { key: 'custom', value: 'orders' },
      { key: 'invalid', value: '123 bad root' },
    ];
    const itemModes = [
      { key: 'default', value: 'item' },
      { key: 'custom', value: 'order' },
      { key: 'invalid', value: 'xml item' },
    ];

    headerModes.forEach((includeXmlHeader) => {
      xmlnsModes.forEach((xmlns) => {
        attributeModes.forEach((attributeMode) => {
          nameModes.forEach((rootMode) => {
            itemModes.forEach((itemMode) => {
              test(`header=${includeXmlHeader} xmlns=${xmlns ? 'set' : 'empty'} attributes=${attributeMode.key} root=${rootMode.key} item=${itemMode.key}`, () => {
                const convertor = new XmlConvertor();
                const options = new XmlConvertorOptions();
                options.options.includeXmlHeader = includeXmlHeader;
                options.options.xmlns = xmlns;
                options.options.attributeColumnsCsv = attributeMode.csv;
                options.options.rootElementName = rootMode.value;
                options.options.itemElementName = itemMode.value;
                convertor.setOptions(options);

                const table = createTable(
                  ['Name', 'Id', 'Note'],
                  [
                    ['Connie', '1', 'A&B'],
                    ['Bob', '2', '<note>'],
                  ]
                );
                const xmlText = convertor.fromDataTable(table);

                if (includeXmlHeader) {
                  expect(xmlText.startsWith('<?xml version="1.0" encoding="utf-8"?>\n')).toBe(true);
                } else {
                  expect(xmlText.startsWith('<?xml version="1.0" encoding="utf-8"?>')).toBe(false);
                }

                const xml = expectValidXml(xmlText, DOMParserCtor);
                const rootElement = xml.documentElement;
                const itemElements = rootElement.getElementsByTagName(rootElement.firstElementChild.tagName);
                expect(itemElements.length).toBe(2);

                if (xmlns) {
                  expect(rootElement.getAttribute('xmlns')).toBe(xmlns);
                } else {
                  expect(rootElement.hasAttribute('xmlns')).toBe(false);
                }

                const firstItem = itemElements[0];
                const attributes = firstItem.getAttributeNames().filter((name) => name !== 'xmlns');
                if (attributeMode.key === 'none') {
                  expect(attributes.length).toBe(0);
                  expect(firstItem.children.length).toBe(3);
                }
                if (attributeMode.key === 'some' || attributeMode.key === 'some-with-unknown') {
                  expect(attributes.length).toBe(1);
                  expect(firstItem.children.length).toBe(2);
                }
                if (attributeMode.key === 'all') {
                  expect(attributes.length).toBe(3);
                  expect(firstItem.children.length).toBe(0);
                }
              });
            });
          });
        });
      });
    });
  });

  test('escapes reserved XML characters in both attributes and child element values', () => {
    const convertor = new XmlConvertor({
      options: {
        attributeColumnsCsv: 'Name',
      },
    });
    const table = createTable(['Name', 'Note'], [['A&<>"\'', 'B&<>"\'']]);

    const xmlText = convertor.fromDataTable(table);
    expect(xmlText).toContain('Name="A&amp;&lt;&gt;&quot;&apos;"');
    expect(xmlText).toContain('<Note>B&amp;&lt;&gt;&quot;&apos;</Note>');
    expectValidXml(xmlText, DOMParserCtor);
  });

  test('removes invalid XML 1.0 control characters from values', () => {
    const convertor = new XmlConvertor();
    const table = createTable(['Name'], [['good\u0001value\u0000text']]);

    const xmlText = convertor.fromDataTable(table);
    expect(xmlText).toContain('<Name>goodvaluetext</Name>');
    expect(xmlText.includes('\u0001')).toBe(false);
    expect(xmlText.includes('\u0000')).toBe(false);
    expectValidXml(xmlText, DOMParserCtor);
  });

  test('normalizes invalid names, handles collisions, and reports warnings', () => {
    const convertor = new XmlConvertor({
      options: {
        rootElementName: '1 root',
        itemElementName: 'xml-item',
        attributeColumnsCsv: '1bad,missing',
      },
    });
    const table = createTable(['1bad', '1bad', 'xmlName', 'has space'], [['a', 'b', 'c', 'd']]);

    const xmlText = convertor.fromDataTable(table);
    const warnings = convertor.getWarnings();

    expectValidXml(xmlText, DOMParserCtor);
    expect(warnings).toEqual(
      expect.arrayContaining([
        'Ignored unknown XML attribute column: missing',
        expect.stringContaining('Auto-fixed XML root element name "1 root" -> "_1_root"'),
        expect.stringContaining('Auto-fixed XML item element name "xml-item" -> "_xml-item"'),
      ])
    );
    expect(xmlText).toContain('_1bad="a"');
    expect(xmlText).toContain('_1bad_2');
    expect(xmlText).toContain('<_xmlName>c</_xmlName>');
    expect(xmlText).toContain('<has_space>d</has_space>');
  });

  test('getWarnings returns a copy of internal warnings', () => {
    const convertor = new XmlConvertor({
      options: {
        rootElementName: '123',
      },
    });
    const table = createTable(['Name'], [['Connie']]);
    convertor.fromDataTable(table);

    const warnings = convertor.getWarnings();
    warnings.push('should not mutate');

    expect(convertor.getWarnings()).not.toContain('should not mutate');
  });
});
