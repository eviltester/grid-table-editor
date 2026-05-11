import { CsvDelimitedOptions } from './options_panels/options-csv-delimited-controls.js';
import { DelimitedOptions } from './options_panels/options-delimited-controls.js';
import { AsciiTableOptionsPanel } from './options_panels/options-ascii-table.js';
import { MarkdownOptionsPanel } from './options_panels/options-markdown-panel.js';
import { JsonOptionsPanel } from './options_panels/options-json-panel.js';
import { JavaOptionsPanel } from './options_panels/options-java-panel.js';
import { JavascriptOptionsPanel } from './options_panels/options-javascript-panel.js';
import { PythonOptionsPanel } from './options_panels/options-python-panel.js';
import { PhpOptionsPanel } from './options_panels/options-php-panel.js';
import { RubyOptionsPanel } from './options_panels/options-ruby-panel.js';
import { KotlinOptionsPanel } from './options_panels/options-kotlin-panel.js';
import { CSharpOptionsPanel } from './options_panels/options-csharp-panel.js';
import { PerlOptionsPanel } from './options_panels/options-perl-panel.js';
import { TypeScriptOptionsPanel } from './options_panels/options-typescript-panel.js';
import { XmlOptionsPanel } from './options_panels/options-xml-panel.js';
import { SqlOptionsPanel } from './options_panels/options-sql-panel.js';
import { GherkinOptionsPanel } from './options_panels/options-gherkin-panel.js';
import { HtmlOptionsPanel } from './options_panels/options-html-panel.js';
import { TestFrameworkOptionsPanel } from './options_panels/options-test-framework-panel.js';
import { getTestFrameworkFormats, getTestFrameworkLabel } from './options-catalog-adapter.js';

const OPTION_UI_SCHEMA_BY_FORMAT = {
  csv: { group: 'core', label: 'CSV', createPanel: (parent) => new CsvDelimitedOptions(parent) },
  json: { group: 'core', label: 'JSON', createPanel: (parent) => new JsonOptionsPanel(parent) },
  jsonl: {
    group: 'core',
    label: 'JSONL',
    createPanel: (parent) => new JsonOptionsPanel(parent, 'jsonl-options', { jsonlMode: true }),
  },
  xml: { group: 'core', label: 'XML', createPanel: (parent) => new XmlOptionsPanel(parent) },
  sql: { group: 'core', label: 'SQL', createPanel: (parent) => new SqlOptionsPanel(parent) },
  markdown: { group: 'core', label: 'MARKDOWN', createPanel: (parent) => new MarkdownOptionsPanel(parent) },
  dsv: { group: 'core', label: 'DSV', createPanel: (parent) => new DelimitedOptions(parent) },
  html: { group: 'core', label: 'HTML', createPanel: (parent) => new HtmlOptionsPanel(parent) },
  gherkin: { group: 'core', label: 'GHERKIN', createPanel: (parent) => new GherkinOptionsPanel(parent) },
  asciitable: { group: 'core', label: 'ASCIITABLE', createPanel: (parent) => new AsciiTableOptionsPanel(parent) },
  csharp: { group: 'code', label: 'C#', createPanel: (parent) => new CSharpOptionsPanel(parent) },
  java: { group: 'code', label: 'Java', createPanel: (parent) => new JavaOptionsPanel(parent) },
  javascript: { group: 'code', label: 'JavaScript', createPanel: (parent) => new JavascriptOptionsPanel(parent) },
  kotlin: { group: 'code', label: 'Kotlin', createPanel: (parent) => new KotlinOptionsPanel(parent) },
  perl: { group: 'code', label: 'Perl', createPanel: (parent) => new PerlOptionsPanel(parent) },
  php: { group: 'code', label: 'PHP', createPanel: (parent) => new PhpOptionsPanel(parent) },
  python: { group: 'code', label: 'Python', createPanel: (parent) => new PythonOptionsPanel(parent) },
  ruby: { group: 'code', label: 'Ruby', createPanel: (parent) => new RubyOptionsPanel(parent) },
  typescript: { group: 'code', label: 'TypeScript', createPanel: (parent) => new TypeScriptOptionsPanel(parent) },
};

const CORE_FORMAT_ORDER = ['csv', 'json', 'jsonl', 'xml', 'sql', 'markdown', 'dsv', 'html', 'gherkin', 'asciitable'];
const CODE_FORMAT_ORDER = ['csharp', 'java', 'javascript', 'kotlin', 'perl', 'php', 'python', 'ruby', 'typescript'];

function createOptionsPanelsForParent(parentElement) {
  const panels = {};
  for (const [format, schema] of Object.entries(OPTION_UI_SCHEMA_BY_FORMAT)) {
    panels[format] = schema.createPanel(parentElement);
  }
  for (const framework of getTestFrameworkFormats()) {
    panels[framework] = new TestFrameworkOptionsPanel(parentElement, framework);
  }
  return panels;
}

function getOutputFormatGroups() {
  return {
    core: CORE_FORMAT_ORDER.map((format) => ({
      type: format,
      label: OPTION_UI_SCHEMA_BY_FORMAT[format]?.label || format.toUpperCase(),
    })),
    code: CODE_FORMAT_ORDER.map((format) => ({
      type: format,
      label: OPTION_UI_SCHEMA_BY_FORMAT[format]?.label || format,
    })),
    unitTest: getTestFrameworkFormats().map((type) => ({
      type,
      label: getTestFrameworkLabel(type),
    })),
  };
}

export { OPTION_UI_SCHEMA_BY_FORMAT, createOptionsPanelsForParent, getOutputFormatGroups };
