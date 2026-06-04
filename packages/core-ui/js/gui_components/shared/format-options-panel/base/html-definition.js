import { createPlainOptions, selectCustomField } from '../format-option-panel-definition-shared.js';

const htmlDefinition = {
  format: 'html',
  group: 'core',
  label: 'HTML',
  panelClassName: 'html-options',
  titleHelp: 'html-table-options',
  createDefaultOptions: createPlainOptions,
  fields: [
    {
      key: 'compact',
      name: 'compacthtml',
      label: 'Compact',
      type: 'checkbox',
      help: 'html-option-compact',
      className: 'compacthtml',
      defaultValue: false,
    },
    {
      key: 'prettyPrint',
      name: 'prettyprint',
      label: 'Pretty Print',
      type: 'checkbox',
      help: 'html-option-pretty-print',
      className: 'prettyprint',
      defaultValue: false,
    },
    selectCustomField({ helpPrefix: 'html', defaultValue: '\t' }),
    {
      key: 'addTheadToTable',
      name: 'addthead',
      label: 'Add <thead>',
      type: 'checkbox',
      help: 'html-option-add-thead',
      className: 'addthead',
      defaultValue: false,
    },
    {
      key: 'addTbodyToTable',
      name: 'addtbody',
      label: 'Add <tbody>',
      type: 'checkbox',
      help: 'html-option-add-tbody',
      className: 'addtbody',
      defaultValue: false,
    },
  ],
};

export { htmlDefinition };
