/*
 * Responsibilities:
 * - Coordinates the app-page test-data panel shell after services/controllers are created.
 * - Owns the binding order for buttons, mode radios, schema text sync, sample schema loading, and help hint refresh.
 * - Keeps page-assembly side effects out of the higher-level grid control factory.
 */

function setupTestDataGenerationPanel({
  parentElem,
  TEST_DATA_MODES,
  renderTestDataGenerationPanelFn,
  bindPrimaryActionsFn,
  bindGenerateCountInputFn,
  bindModeRadiosFn,
  initializeSchemaErrorDisplayFn,
  bindSchemaTextareaSyncFn,
  bindSchemaSampleShortcutFn,
  schemaTextSyncState,
  debouncer,
  onGenerate,
  onGeneratePairwise,
  onRefreshPreview,
  applyModeDefaultRowCount,
  onPopulateRequested,
  onSampleRequested,
  createTestDataGrid,
  previousSampleHandler = null,
  updateHelpHints,
}) {
  renderTestDataGenerationPanelFn({ parentElem, TEST_DATA_MODES });

  bindPrimaryActionsFn({
    onGenerate,
    onGeneratePairwise,
    onRefreshPreview,
  });
  bindGenerateCountInputFn();
  bindModeRadiosFn({
    parentElem,
    applyModeDefaultRowCount,
  });

  createTestDataGrid?.();

  initializeSchemaErrorDisplayFn(schemaTextSyncState);
  bindSchemaTextareaSyncFn({
    debouncer,
    onPopulateRequested,
  });

  const nextSampleHandler = bindSchemaSampleShortcutFn({
    currentHandler: previousSampleHandler,
    onSampleRequested,
  });

  updateHelpHints?.();

  return {
    sampleHandler: nextSampleHandler,
  };
}

export { setupTestDataGenerationPanel };
