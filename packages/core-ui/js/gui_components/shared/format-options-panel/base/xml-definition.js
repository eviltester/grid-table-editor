import { createPlainOptions } from '../format-option-panel-definition-shared.js';

const xmlDefinition = {
  format: 'xml',
  group: 'core',
  label: 'XML',
  panelClassName: 'xml-options',
  titleHelp: 'xml-options',
  createDefaultOptions: createPlainOptions,
  fields: [
    {
      key: 'rootElementName',
      name: 'root-element-name',
      label: 'Root Element',
      type: 'text',
      help: 'xml-option-root-element',
      className: 'root-element-name',
      width: '10em',
    },
    {
      key: 'itemElementName',
      name: 'item-element-name',
      label: 'Item Element',
      type: 'text',
      help: 'xml-option-item-element',
      className: 'item-element-name',
      width: '10em',
    },
    {
      key: 'attributeColumnsCsv',
      name: 'attribute-columns-csv',
      label: 'Attributes',
      type: 'text',
      help: 'xml-option-attributes',
      className: 'attributes-columns-csv',
      width: '15em',
    },
    {
      key: 'includeXmlHeader',
      name: 'include-xml-header',
      label: 'XML Header',
      type: 'checkbox',
      help: 'xml-option-header',
      className: 'xml-header',
      defaultValue: true,
    },
    {
      key: 'xmlns',
      name: 'xml-namespace',
      label: 'XMLNS',
      type: 'text',
      help: 'xml-option-xmlns',
      className: 'xml-namespace',
      width: '15em',
    },
  ],
};

export { xmlDefinition };
