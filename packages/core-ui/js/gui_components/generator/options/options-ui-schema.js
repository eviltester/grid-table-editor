import {
  CODE_FORMAT_ORDER,
  CORE_FORMAT_ORDER,
  FORMAT_OPTION_DEFINITIONS,
  createTestFrameworkDefinition,
} from '../../shared/format-options-panel/format-option-panel-definition.js';
import { getTestFrameworkFormats, getTestFrameworkLabel } from './options-catalog-adapter.js';

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
      label: FORMAT_OPTION_DEFINITIONS[format]?.label || format.toUpperCase(),
    })),
    code: CODE_FORMAT_ORDER.map((format) => ({
      type: format,
      label: FORMAT_OPTION_DEFINITIONS[format]?.label || format,
    })),
    unitTest: getTestFrameworkFormats().map((type) => ({
      type,
      label: getTestFrameworkLabel(type),
    })),
  };
}

export { getOptionPanelDefinitions, getOutputFormatGroups };
