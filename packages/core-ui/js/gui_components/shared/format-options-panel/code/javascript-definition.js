import { createJsonFields, createPlainOptions } from '../format-option-panel-definition-shared.js';

const javascriptDefinition = {
  format: 'javascript',
  group: 'code',
  label: 'JavaScript',
  panelClassName: 'javascript-options',
  titleHelp: 'javascript-options',
  tipFormat: 'json',
  createDefaultOptions: createPlainOptions,
  fields: createJsonFields(false),
};

export { javascriptDefinition };
