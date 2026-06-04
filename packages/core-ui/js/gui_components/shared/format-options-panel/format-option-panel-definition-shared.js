import { AsciiTableConvertor } from '@anywaydata/core/data_formats/asciitable-convertor.js';

const DEFAULT_DELIMITER_MAPPINGS = {
  tab: '\t',
  space: ' ',
};

const DSV_DELIMITER_MAPPINGS = {
  tab: '\t',
  comma: ',',
  hash: '#',
  colon: ':',
  pipe: '|',
  space: ' ',
  semicolon: ';',
  slash: '/',
  backslash: '\\',
};

function selectCustomField({
  key = 'prettyPrintDelimiter',
  helpPrefix,
  defaultValue = '\t',
  defaultSelection = 'tab',
}) {
  return {
    key,
    name: 'prettydelimiter',
    label: 'Delimiter',
    type: 'selectCustom',
    help: `${helpPrefix}-option-delimiter`,
    customHelp: `${helpPrefix}-option-custom-delimiter`,
    customName: 'custom-pretty-delimiter',
    customLabel: 'Custom Delimiter',
    className: 'prettydelimiter',
    customClassName: 'custom-pretty-delimiter',
    mappings: DEFAULT_DELIMITER_MAPPINGS,
    options: [
      { value: 'tab', label: 'Tab [\\t]' },
      { value: 'space', label: 'Space [ ]' },
    ],
    defaultValue,
    defaultSelection,
    child: true,
  };
}

const FIELDS = {
  assignToVariable: (prefix) => ({
    key: 'assignToVariable',
    name: 'assigntovariable',
    label: 'Assign to Variable',
    type: 'checkbox',
    help: `${prefix}-option-assign-variable`,
    className: 'assigntovariable',
    defaultValue: true,
  }),
  variableName: (prefix) => ({
    key: 'variableName',
    name: 'variablename',
    label: 'Variable Name',
    type: 'text',
    help: `${prefix}-option-variable-name`,
    className: 'variablename',
    defaultValue: 'data',
    child: true,
  }),
  quoteNumbers: (prefix) => ({
    key: 'quoteNumbers',
    name: 'quotenumbers',
    label: 'Number Convert (Quote Numbers)',
    type: 'checkbox',
    help: `${prefix}-option-quote-numbers`,
    className: 'quotenumbers',
    defaultValue: false,
  }),
  objectClassName: (prefix) => ({
    key: 'objectClassName',
    name: 'objectclassname',
    label: 'Class Name',
    type: 'text',
    help: `${prefix}-option-class-name`,
    className: 'objectclassname',
    defaultValue: 'Row',
    child: true,
  }),
  prettyPrint: (prefix, defaultValue = true) => ({
    key: 'prettyPrint',
    name: 'prettyprint',
    label: 'Pretty Print',
    type: 'checkbox',
    help: `${prefix}-option-pretty-print`,
    className: 'prettyprint',
    defaultValue,
  }),
};

function createPlainOptions() {
  return { options: {} };
}

function commonCodeFields(prefix, collectionOptions, extraFields = []) {
  return [
    {
      key: 'collectionType',
      name: 'collectiontype',
      label: 'Collection Type',
      type: 'select',
      help: `${prefix}-option-collection-type`,
      className: 'collectiontype',
      options: collectionOptions,
      defaultValue: collectionOptions[0]?.value,
    },
    FIELDS.assignToVariable(prefix),
    FIELDS.variableName(prefix),
    FIELDS.quoteNumbers(prefix),
    ...extraFields,
    FIELDS.prettyPrint(prefix, true),
    selectCustomField({ helpPrefix: prefix, defaultValue: '    ' }),
  ];
}

function getAsciiStyleOptions() {
  const converter = new AsciiTableConvertor();
  return Object.entries(converter.options.styleNames).map(([label, value]) => ({ value, label }));
}

function createJsonFields(jsonlMode = false) {
  const fields = [
    {
      key: 'makeNumbersNumeric',
      name: 'numbersnumeric',
      label: 'Number Convert',
      type: 'checkbox',
      help: 'json-option-number-convert',
      className: 'numbersnumeric',
      defaultValue: false,
    },
  ];

  if (!jsonlMode) {
    fields.push(
      {
        key: 'prettyPrint',
        name: 'prettyprint',
        label: 'Pretty Print',
        type: 'checkbox',
        help: 'json-option-pretty-print',
        className: 'prettyprint',
        defaultValue: true,
      },
      selectCustomField({ helpPrefix: 'json', defaultValue: '\t' }),
      {
        key: 'asObject',
        name: 'asobject',
        label: 'As Object',
        type: 'checkbox',
        help: 'json-option-as-object',
        className: 'asobject',
        defaultValue: false,
      },
      {
        key: 'asPropertyNamed',
        name: 'propertynamed',
        label: 'Property Name',
        type: 'text',
        help: 'json-option-property-name',
        className: 'propertynamed',
        defaultValue: 'data',
        child: true,
        width: '10em',
      }
    );
  }

  return fields;
}

export {
  DEFAULT_DELIMITER_MAPPINGS,
  DSV_DELIMITER_MAPPINGS,
  FIELDS,
  commonCodeFields,
  createJsonFields,
  createPlainOptions,
  getAsciiStyleOptions,
  selectCustomField,
};
