import { commonCodeFields, createPlainOptions, FIELDS } from '../format-option-panel-definition-shared.js';
import { selectorForName, setSelectValue } from '../format-option-panel-dom.js';

const csharpDefinition = {
  format: 'csharp',
  group: 'code',
  label: 'C#',
  panelClassName: 'csharp-options',
  titleHelp: 'csharp-options',
  createDefaultOptions: createPlainOptions,
  fields: commonCodeFields(
    'csharp',
    [
      { value: 'array', label: 'Array new[] { }' },
      { value: 'list', label: 'List new List<object> { }' },
      { value: 'ireadonlylist', label: 'IReadOnlyList new List<object> { }' },
      { value: 'ienumerable', label: 'IEnumerable new List<object> { }' },
    ],
    [
      {
        key: 'dictionaryValueType',
        name: 'dictionaryvaluetype',
        label: 'Dictionary Value Type',
        type: 'select',
        help: 'csharp-option-dictionary-value-type',
        className: 'dictionaryvaluetype',
        defaultValue: 'auto',
        options: [
          { value: 'auto', label: 'Auto (String when Number Convert on)' },
          { value: 'object', label: 'object' },
          { value: 'string', label: 'string' },
        ],
      },
      {
        key: 'useAnonymousObjects',
        name: 'useanonymousobjects',
        label: 'Anonymous Objects (Dictionary/Map)',
        type: 'checkbox',
        help: 'csharp-option-anonymous-objects',
        className: 'useanonymousobjects',
        defaultValue: true,
      },
      FIELDS.objectClassName('csharp'),
    ]
  ),
  afterRead(options) {
    options.collectionTargetType = options.collectionType;
    options.collectionType = options.collectionTargetType === 'array' ? 'array' : 'list';
  },
  afterWrite(options, _mainOptions, panel) {
    const select = panel.root.querySelector(selectorForName('collectiontype'));
    setSelectValue(select, options.collectionTargetType ?? options.collectionType, 'list');
  },
};

export { csharpDefinition };
