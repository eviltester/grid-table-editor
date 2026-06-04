import { createPlainOptions } from '../format-option-panel-definition-shared.js';

const csvDefinition = {
  format: 'csv',
  group: 'core',
  label: 'CSV',
  panelClassName: 'delimited-options',
  titleHelp: 'csv-options',
  createDefaultOptions: createPlainOptions,
  fields: [
    {
      key: 'quotes',
      name: 'quotes',
      label: 'Use Quotes',
      type: 'checkbox',
      help: 'csv-option-quotes',
      className: 'quotes',
      defaultValue: false,
    },
    {
      key: 'header',
      name: 'header',
      label: 'Use Header',
      type: 'checkbox',
      help: 'csv-option-header',
      className: 'headerval',
      defaultValue: false,
    },
    {
      key: 'quoteChar',
      name: 'quoteChar',
      label: 'Quote Char',
      type: 'text',
      help: 'csv-option-quote-char',
      className: 'quoteChar',
      defaultValue: '"',
      child: true,
      width: '5em',
    },
    {
      key: 'escapeChar',
      name: 'escapeChar',
      label: 'Escape Char',
      type: 'text',
      help: 'csv-option-escape-char',
      className: 'escapeChar',
      defaultValue: '"',
      child: true,
      width: '5em',
    },
  ],
};

export { csvDefinition };
