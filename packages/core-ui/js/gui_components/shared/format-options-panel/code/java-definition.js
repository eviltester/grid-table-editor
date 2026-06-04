import { commonCodeFields, createPlainOptions, FIELDS } from '../format-option-panel-definition-shared.js';

const javaDefinition = {
  format: 'java',
  group: 'code',
  label: 'Java',
  panelClassName: 'java-options',
  titleHelp: 'java-options',
  createDefaultOptions: createPlainOptions,
  fields: commonCodeFields(
    'java',
    [
      { value: 'list', label: 'List (ArrayList)' },
      { value: 'array', label: 'Array [ ]' },
    ],
    [
      {
        key: 'useAnonymousMaps',
        name: 'useanonymousmaps',
        label: 'Use Anonymous Maps (Map.of)',
        type: 'checkbox',
        help: 'java-option-anonymous-maps',
        className: 'useanonymousmaps',
        defaultValue: true,
      },
      FIELDS.objectClassName('java'),
      {
        key: 'blankValueBehavior',
        name: 'blankvaluebehavior',
        label: 'Blank Values',
        type: 'select',
        help: 'java-option-blank-value',
        className: 'blankvaluebehavior',
        defaultValue: 'null',
        options: [
          { value: 'null', label: 'null' },
          { value: 'empty-string', label: 'Empty String' },
        ],
      },
      {
        key: 'includeImports',
        name: 'includeimports',
        label: 'Include Imports',
        type: 'checkbox',
        help: 'java-option-imports',
        className: 'includeimports',
        defaultValue: true,
      },
    ]
  ),
};

export { javaDefinition };
