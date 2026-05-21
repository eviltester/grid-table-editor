/*
 * Responsibilities:
 * - Adapts app-page button actions to the test-data generation service.
 * - Keeps service invocation and preview status-reset wiring out of the main grid control.
 */

function createTestDataGridActionAdapter({ getGenerationService, clearPendingStatusReset, scheduleStatusReset } = {}) {
  async function generatePairwiseTestData() {
    await getGenerationService?.()?.generatePairwiseTestData?.();
  }

  async function generateTestData() {
    await getGenerationService?.()?.generateTestData?.();
  }

  async function refreshTestDataPreview() {
    await getGenerationService?.()?.refreshTestDataPreview?.({
      clearPendingStatusReset,
      scheduleStatusReset,
    });
  }

  return {
    generatePairwiseTestData,
    generateTestData,
    refreshTestDataPreview,
  };
}

export { createTestDataGridActionAdapter };
