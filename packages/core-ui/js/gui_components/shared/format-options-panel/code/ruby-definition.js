import { commonCodeFields, createPlainOptions, FIELDS } from '../format-option-panel-definition-shared.js';

const rubyDefinition = {
  format: 'ruby',
  group: 'code',
  label: 'Ruby',
  panelClassName: 'ruby-options',
  titleHelp: 'ruby-options',
  createDefaultOptions: createPlainOptions,
  fields: commonCodeFields(
    'ruby',
    [
      { value: 'array', label: 'Array [ ]' },
      { value: 'list', label: 'List Array[ ]' },
    ],
    [
      {
        key: 'outputWrapper',
        name: 'outputwrapper',
        label: 'Output Wrapper',
        type: 'select',
        help: 'ruby-option-output-wrapper',
        className: 'outputwrapper',
        defaultValue: 'plain',
        options: [
          { value: 'plain', label: 'Plain Assignment' },
          { value: 'rspec-let', label: 'RSpec let' },
        ],
      },
      {
        key: 'hashKeyStyle',
        name: 'hashkeystyle',
        label: 'Hash Key Style',
        type: 'select',
        help: 'ruby-option-hash-key-style',
        className: 'hashkeystyle',
        defaultValue: 'string',
        options: [
          { value: 'string', label: "String Keys ('name' =>)" },
          { value: 'symbol', label: 'Symbol Keys (name:)' },
        ],
      },
      {
        key: 'useAnonymousObjects',
        name: 'useanonymousobjects',
        label: 'Anonymous Objects (Hash/Map)',
        type: 'checkbox',
        help: 'ruby-option-anonymous-objects',
        className: 'useanonymousobjects',
        defaultValue: true,
      },
      FIELDS.objectClassName('ruby'),
      {
        key: 'objectRepresentation',
        name: 'objectrepresentation',
        label: 'Object Representation',
        type: 'select',
        help: 'ruby-option-object-representation',
        className: 'objectrepresentation',
        defaultValue: 'class',
        options: [
          { value: 'class', label: 'Class' },
          { value: 'struct', label: 'Struct' },
          { value: 'data', label: 'Data' },
        ],
        child: true,
      },
      {
        key: 'fieldNameStyle',
        name: 'fieldnamestyle',
        label: 'Field Name Style',
        type: 'select',
        help: 'ruby-option-field-name-style',
        className: 'fieldnamestyle',
        defaultValue: 'preserve',
        options: [
          { value: 'preserve', label: 'Preserve' },
          { value: 'snake_case', label: 'snake_case' },
        ],
      },
      {
        key: 'hashPrettyStyle',
        name: 'hashprettystyle',
        label: 'Hash Pretty Style',
        type: 'select',
        help: 'ruby-option-hash-pretty-style',
        className: 'hashprettystyle',
        defaultValue: 'compact',
        options: [
          { value: 'compact', label: 'Compact' },
          { value: 'aligned', label: 'Aligned Multi-line' },
        ],
        child: true,
      },
    ]
  ),
};

export { rubyDefinition };
