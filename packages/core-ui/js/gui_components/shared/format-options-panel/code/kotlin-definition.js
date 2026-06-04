import { commonCodeFields, createPlainOptions, FIELDS } from '../format-option-panel-definition-shared.js';

const kotlinDefinition = {
  format: 'kotlin',
  group: 'code',
  label: 'Kotlin',
  panelClassName: 'kotlin-options',
  titleHelp: 'kotlin-options',
  createDefaultOptions: createPlainOptions,
  fields: commonCodeFields(
    'kotlin',
    [
      { value: 'array', label: 'Array arrayOf()' },
      { value: 'list', label: 'List listOf()' },
    ],
    [
      {
        key: 'mutableAssignment',
        name: 'mutableassignment',
        label: 'Mutable Assignment (var)',
        type: 'checkbox',
        help: 'kotlin-option-mutable-assignment',
        className: 'mutableassignment',
        defaultValue: false,
        child: true,
      },
      {
        key: 'useAnonymousObjects',
        name: 'useanonymousobjects',
        label: 'Anonymous Objects (Map)',
        type: 'checkbox',
        help: 'kotlin-option-anonymous-objects',
        className: 'useanonymousobjects',
        defaultValue: true,
      },
      {
        key: 'useMutableCollections',
        name: 'usemutablecollections',
        label: 'Mutable Collections',
        type: 'checkbox',
        help: 'kotlin-option-mutable-collections',
        className: 'usemutablecollections',
        defaultValue: false,
      },
      FIELDS.objectClassName('kotlin'),
      {
        key: 'trailingComma',
        name: 'trailingcomma',
        label: 'Trailing Comma',
        type: 'checkbox',
        help: 'kotlin-option-trailing-comma',
        className: 'trailingcomma',
        defaultValue: true,
        child: true,
      },
    ]
  ),
};

export { kotlinDefinition };
