import { commonCodeFields, createPlainOptions, FIELDS } from '../format-option-panel-definition-shared.js';

const perlDefinition = {
  format: 'perl',
  group: 'code',
  label: 'Perl',
  panelClassName: 'perl-options',
  titleHelp: 'perl-options',
  createDefaultOptions: createPlainOptions,
  fields: commonCodeFields(
    'perl',
    [
      { value: 'array', label: 'Array Ref ([...])' },
      { value: 'list', label: 'List (...)' },
    ],
    [
      {
        key: 'hashKeyStyle',
        name: 'hashkeystyle',
        label: 'Hash Key Style',
        type: 'select',
        help: 'perl-option-hash-key-style',
        className: 'hashkeystyle',
        defaultValue: 'quoted',
        options: [
          { value: 'quoted', label: "Quoted Keys ('name' =>)" },
          { value: 'bareword', label: 'Bareword Keys (name =>)' },
        ],
      },
      {
        key: 'useAnonymousObjects',
        name: 'useanonymousobjects',
        label: 'Anonymous Objects (Hash/Map)',
        type: 'checkbox',
        help: 'perl-option-anonymous-objects',
        className: 'useanonymousobjects',
        defaultValue: true,
      },
      FIELDS.objectClassName('perl'),
      {
        key: 'objectInstantiationStyle',
        name: 'objectinstantiationstyle',
        label: 'Object Instantiation',
        type: 'select',
        help: 'perl-option-object-instantiation-style',
        className: 'objectinstantiationstyle',
        defaultValue: 'bless',
        options: [
          { value: 'bless', label: 'bless(...)' },
          { value: 'constructor', label: 'Class->new(...)' },
        ],
      },
    ]
  ),
};

export { perlDefinition };
