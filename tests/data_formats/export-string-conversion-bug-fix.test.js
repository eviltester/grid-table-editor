import { MarkdownConvertor } from '../../packages/core/js/data_formats/markdown-convertor.js';
import { HtmlConvertor } from '../../packages/core/js/data_formats/html-convertor.js';
import { GherkinConvertor } from '../../packages/core/js/data_formats/gherkin-convertor.js';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';

describe('Export Format String Conversion Bug Fix', () => {
  let dataTable;

  beforeEach(() => {
    // Create a data table that mimics pairwise output with mixed data types
    dataTable = new GenericDataTable();
    dataTable.setHeaders(['HTTP Method', 'Content Type', 'User ID', 'Response Time', 'Success']);

    // Add data with mixed types: strings, numbers, and booleans
    dataTable.appendDataRow(['GET', 'application/json', 12345, 250, true]);
    dataTable.appendDataRow(['POST', 'application/xml', 67890, 180, false]);
    dataTable.appendDataRow(['PUT', 'text/plain', 11111, 320, true]);
  });

  test('MarkdownConvertor handles mixed data types without replaceAll error', () => {
    const convertor = new MarkdownConvertor();

    expect(() => {
      const result = convertor.fromDataTable(dataTable);
      expect(result).toBeTruthy();
      expect(result).toContain('HTTP Method');
      expect(result).toContain('12345'); // numeric value
      expect(result).toContain('true'); // boolean value
    }).not.toThrow();
  });

  test('HtmlConvertor handles mixed data types without replaceAll error', () => {
    const convertor = new HtmlConvertor();

    expect(() => {
      const result = convertor.fromDataTable(dataTable);
      expect(result).toBeTruthy();
      expect(result).toContain('<table>');
      expect(result).toContain('12345'); // numeric value
      expect(result).toContain('true'); // boolean value
    }).not.toThrow();
  });

  test('GherkinConvertor handles mixed data types without replaceAll error', () => {
    const convertor = new GherkinConvertor();

    expect(() => {
      const result = convertor.fromDataTable(dataTable);
      expect(result).toBeTruthy();
      expect(result).toContain('|');
      expect(result).toContain('12345'); // numeric value
      expect(result).toContain('true'); // boolean value
    }).not.toThrow();
  });

  test('All convertors properly escape special characters in mixed data', () => {
    // Add data with special characters that need escaping
    const specialTable = new GenericDataTable();
    specialTable.setHeaders(['Text', 'Number', 'Boolean']);
    specialTable.appendDataRow(['Data with | pipe', 42, true]);
    specialTable.appendDataRow(['Data with < and >', 3.14, false]);

    // Markdown should escape pipes
    const markdown = new MarkdownConvertor().fromDataTable(specialTable);
    expect(markdown).toContain('&#124;'); // escaped pipe
    expect(markdown).toContain('42'); // number preserved

    // HTML should escape < >
    const html = new HtmlConvertor().fromDataTable(specialTable);
    expect(html).toContain('&lt;'); // escaped <
    expect(html).toContain('&gt;'); // escaped >
    expect(html).toContain('42'); // number preserved

    // Gherkin should escape pipes and backslashes
    const gherkin = new GherkinConvertor().fromDataTable(specialTable);
    expect(gherkin).toContain('\\|'); // escaped pipe
    expect(gherkin).toContain('42'); // number preserved
  });
});
