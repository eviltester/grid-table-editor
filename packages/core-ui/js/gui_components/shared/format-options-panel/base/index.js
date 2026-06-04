import { asciitableDefinition } from './asciitable-definition.js';
import { csvDefinition } from './csv-definition.js';
import { dsvDefinition } from './dsv-definition.js';
import { gherkinDefinition } from './gherkin-definition.js';
import { htmlDefinition } from './html-definition.js';
import { jsonDefinition, jsonlDefinition } from './json-definition.js';
import { markdownDefinition } from './markdown-definition.js';
import { sqlDefinition } from './sql-definition.js';
import { xmlDefinition } from './xml-definition.js';

const CORE_FORMAT_ORDER = ['csv', 'json', 'jsonl', 'xml', 'sql', 'markdown', 'dsv', 'html', 'gherkin', 'asciitable'];

const BASE_FORMAT_OPTION_DEFINITIONS = {
  csv: csvDefinition,
  dsv: dsvDefinition,
  json: jsonDefinition,
  jsonl: jsonlDefinition,
  xml: xmlDefinition,
  sql: sqlDefinition,
  markdown: markdownDefinition,
  html: htmlDefinition,
  gherkin: gherkinDefinition,
  asciitable: asciitableDefinition,
};

export { BASE_FORMAT_OPTION_DEFINITIONS, CORE_FORMAT_ORDER };
