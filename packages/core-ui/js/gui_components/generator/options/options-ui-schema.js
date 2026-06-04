import {
  CODE_FORMAT_ORDER,
  CORE_FORMAT_ORDER,
  FORMAT_OPTION_DEFINITIONS,
  createFormatOptionPanel,
  createTestFrameworkDefinition,
} from '../../shared/format-options-panel/format-option-panel-definition.js';
import { getTestFrameworkFormats, getTestFrameworkLabel } from './options-catalog-adapter.js';

const OPTION_UI_SCHEMA_BY_FORMAT = FORMAT_OPTION_DEFINITIONS;

function createOptionsPanelsForParent(parentElement) {
  const panels = {};
  for (const [format, schema] of Object.entries(getOptionPanelDefinitions())) {
    panels[format] = createFormatOptionPanel(schema, { root: parentElement });
  }
  return panels;
}

function getOptionPanelDefinitions() {
  const definitions = { ...FORMAT_OPTION_DEFINITIONS };
  for (const framework of getTestFrameworkFormats()) {
    definitions[framework] = createTestFrameworkDefinition(framework);
  }
  return definitions;
}

function getOutputFormatGroups() {
  return {
    core: CORE_FORMAT_ORDER.map((format) => ({
      type: format,
      label: OPTION_UI_SCHEMA_BY_FORMAT[format]?.label || format.toUpperCase(),
    })),
    code: CODE_FORMAT_ORDER.map((format) => ({
      type: format,
      label: OPTION_UI_SCHEMA_BY_FORMAT[format]?.label || format,
    })),
    unitTest: getTestFrameworkFormats().map((type) => ({
      type,
      label: getTestFrameworkLabel(type),
    })),
  };
}

export { OPTION_UI_SCHEMA_BY_FORMAT, createOptionsPanelsForParent, getOptionPanelDefinitions, getOutputFormatGroups };
