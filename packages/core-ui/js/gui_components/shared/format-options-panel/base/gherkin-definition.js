import { createPlainOptions } from '../format-option-panel-definition-shared.js';

const gherkinDefinition = {
  format: 'gherkin',
  group: 'core',
  label: 'GHERKIN',
  panelClassName: 'gherkin-options',
  titleHelp: 'gherkin-options',
  createDefaultOptions: createPlainOptions,
  fields: [
    {
      key: 'inCellPadding',
      name: 'incellpadding',
      label: 'In Cell Padding',
      type: 'select',
      help: 'gherkin-option-in-cell-padding',
      className: 'incellpadding',
      defaultValue: 'none',
      options: [
        { value: 'none', label: 'None' },
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
        { value: 'both', label: 'Both' },
      ],
    },
    {
      key: 'prettyPrint',
      name: 'prettyprint',
      label: 'Pretty Print',
      type: 'checkbox',
      help: 'gherkin-option-pretty-print',
      className: 'prettyprint',
      defaultValue: false,
    },
    {
      key: 'showHeadings',
      name: 'showheadings',
      label: 'Show Headers',
      type: 'checkbox',
      help: 'gherkin-option-show-headers',
      className: 'showheadings',
      defaultValue: true,
    },
    {
      key: 'leftIndent',
      name: 'leftindent',
      label: 'Left Indent',
      type: 'text',
      help: 'gherkin-option-left-indent',
      className: 'leftindent',
      defaultValue: '',
      width: '5em',
    },
  ],
};

export { gherkinDefinition };
