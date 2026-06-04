import { commonCodeFields, createPlainOptions, FIELDS } from '../format-option-panel-definition-shared.js';

const typescriptDefinition = {
  format: 'typescript',
  group: 'code',
  label: 'TypeScript',
  panelClassName: 'typescript-options',
  titleHelp: 'typescript-options',
  createDefaultOptions: createPlainOptions,
  fields: commonCodeFields(
    'typescript',
    [
      { value: 'list', label: 'List (Array<T>)' },
      { value: 'array', label: 'Array [ ]' },
    ],
    [
      {
        key: 'useAnonymousObjects',
        name: 'useanonymousobjects',
        label: 'Use Anonymous Objects',
        type: 'checkbox',
        help: 'typescript-option-anonymous-objects',
        className: 'useanonymousobjects',
        defaultValue: true,
      },
      FIELDS.objectClassName('typescript'),
      {
        key: 'blankValueBehavior',
        name: 'blankvaluebehavior',
        label: 'Blank Values',
        type: 'select',
        help: 'typescript-option-blank-value',
        className: 'blankvaluebehavior',
        defaultValue: 'null',
        options: [
          { value: 'null', label: 'null' },
          { value: 'empty-string', label: 'Empty String' },
        ],
      },
    ]
  ),
};

export { typescriptDefinition };
