import { JSDOM } from 'jsdom';
import { getTipsForFormat } from '@anywaydata/core';
import { CsvDelimitedOptions } from '../../../js/gui_components/options_panels/options-csv-delimited-controls.js';
import { DelimitedOptions } from '../../../js/gui_components/options_panels/options-delimited-controls.js';
import { CSharpOptionsPanel } from '../../../js/gui_components/options_panels/options-csharp-panel.js';
import { JsonOptionsPanel } from '../../../js/gui_components/options_panels/options-json-panel.js';
import { JavascriptOptionsPanel } from '../../../js/gui_components/options_panels/options-javascript-panel.js';
import { KotlinOptionsPanel } from '../../../js/gui_components/options_panels/options-kotlin-panel.js';
import { XmlOptionsPanel } from '../../../js/gui_components/options_panels/options-xml-panel.js';
import { SqlOptionsPanel } from '../../../js/gui_components/options_panels/options-sql-panel.js';
import { MarkdownOptionsPanel } from '../../../js/gui_components/options_panels/options-markdown-panel.js';
import { HtmlOptionsPanel } from '../../../js/gui_components/options_panels/options-html-panel.js';
import { GherkinOptionsPanel } from '../../../js/gui_components/options_panels/options-gherkin-panel.js';
import { AsciiTableOptionsPanel } from '../../../js/gui_components/options_panels/options-ascii-table.js';
import { JavaOptionsPanel } from '../../../js/gui_components/options_panels/options-java-panel.js';
import { PerlOptionsPanel } from '../../../js/gui_components/options_panels/options-perl-panel.js';
import { PhpOptionsPanel } from '../../../js/gui_components/options_panels/options-php-panel.js';
import { PythonOptionsPanel } from '../../../js/gui_components/options_panels/options-python-panel.js';
import { RubyOptionsPanel } from '../../../js/gui_components/options_panels/options-ruby-panel.js';
import { TypeScriptOptionsPanel } from '../../../js/gui_components/options_panels/options-typescript-panel.js';
import { TestFrameworkOptionsPanel } from '../../../js/gui_components/options_panels/options-test-framework-panel.js';

describe('option panel help parity with core tips', () => {
  let dom;
  let host;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="host"></div></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
    host = document.getElementById('host');
  });

  afterEach(() => {
    dom.window.close();
  });

  test('rendered tagged option help texts match core tip catalog', () => {
    const panels = [
      new CsvDelimitedOptions(host),
      new DelimitedOptions(host),
      new CSharpOptionsPanel(host),
      new JsonOptionsPanel(host),
      new JsonOptionsPanel(host, 'jsonl-options', { jsonlMode: true }),
      new JavascriptOptionsPanel(host),
      new KotlinOptionsPanel(host),
      new XmlOptionsPanel(host),
      new SqlOptionsPanel(host),
      new MarkdownOptionsPanel(host),
      new HtmlOptionsPanel(host),
      new GherkinOptionsPanel(host),
      new AsciiTableOptionsPanel(host),
      new JavaOptionsPanel(host),
      new PerlOptionsPanel(host),
      new PhpOptionsPanel(host),
      new PythonOptionsPanel(host),
      new RubyOptionsPanel(host),
      new TypeScriptOptionsPanel(host),
      new TestFrameworkOptionsPanel(host, 'junit5'),
    ];

    for (const panel of panels) {
      host.innerHTML = '';
      panel.addToGui();
      const helpIcons = Array.from(host.querySelectorAll('.option-help-icon'));
      expect(helpIcons.length).toBeGreaterThan(0);
      for (const icon of helpIcons) {
        const hasCoreTag = icon.hasAttribute('data-option-key') && icon.hasAttribute('data-option-format');
        const hasUiTag = icon.hasAttribute('data-ui-tip-key');
        expect(hasCoreTag || hasUiTag).toBe(true);
        const helpText = icon.getAttribute('data-help-text');
        expect(helpText).toBeTruthy();
        expect(helpText.startsWith("Help for option '")).toBe(false);
      }

      const icons = Array.from(host.querySelectorAll('.option-help-icon[data-option-key][data-option-format]'));
      for (const icon of icons) {
        const format = icon.getAttribute('data-option-format');
        const key = icon.getAttribute('data-option-key');
        const expectedTip = getTipsForFormat(format)[key];
        expect(icon.getAttribute('data-help-text')).toBe(expectedTip);
      }
    }
  });
});
