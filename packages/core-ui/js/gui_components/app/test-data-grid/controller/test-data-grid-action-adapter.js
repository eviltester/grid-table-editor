/*
 * Responsibilities:
 * - Adapts app-page button actions to the test-data generation service.
 * - Keeps service invocation and preview status-reset wiring out of the main grid control.
 */

function createTestDataGridActionAdapter({ getGenerationService } = {}) {
  async function generatePairwiseTestData() {
    await getGenerationService?.()?.generatePairwiseTestData?.();
  }

  async function generateTestData() {
    await getGenerationService?.()?.generateTestData?.();
  }

  return {
    generatePairwiseTestData,
    generateTestData,
  };
}

export { createTestDataGridActionAdapter };
