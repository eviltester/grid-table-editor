import { createJsonFields, createPlainOptions } from '../format-option-panel-definition-shared.js';

const jsonDefinition = {
  format: 'json',
  group: 'core',
  label: 'JSON',
  panelClassName: 'json-options',
  titleHelp: 'json-options',
  createDefaultOptions: createPlainOptions,
  fields: createJsonFields(false),
};

const jsonlDefinition = {
  format: 'jsonl',
  group: 'core',
  label: 'JSONL',
  panelClassName: 'jsonl-options',
  titleHelp: 'jsonl-options',
  tipFormat: 'jsonl',
  createDefaultOptions: createPlainOptions,
  fields: createJsonFields(true),
  afterRead(options) {
    options.prettyPrint = false;
    options.asObject = false;
    options.asPropertyNamed = '';
    options.outputAsJsonLines = true;
  },
};

export { jsonDefinition, jsonlDefinition };
