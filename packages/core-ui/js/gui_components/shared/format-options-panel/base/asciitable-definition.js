import { createPlainOptions, getAsciiStyleOptions } from '../format-option-panel-definition-shared.js';

const asciitableDefinition = {
  format: 'asciitable',
  group: 'core',
  label: 'ASCIITABLE',
  panelClassName: 'delimited-options',
  titleHelp: 'ascii-table-options',
  createDefaultOptions: createPlainOptions,
  fields: [
    {
      key: 'style',
      name: 'style',
      label: 'Style',
      type: 'select',
      help: 'ascii-option-style',
      className: 'style',
      defaultValue: 'ramac',
      options: getAsciiStyleOptions(),
    },
  ],
};

export { asciitableDefinition };
