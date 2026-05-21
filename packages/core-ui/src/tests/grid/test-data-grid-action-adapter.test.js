import { jest } from '@jest/globals';
import { createTestDataGridActionAdapter } from '../../../js/gui_components/app/test-data-grid/controller/test-data-grid-action-adapter.js';

describe('test data grid action adapter', () => {
  test('delegates generate actions to the current generation service', async () => {
    const generatePairwiseTestData = jest.fn();
    const generateTestData = jest.fn();
    const refreshTestDataPreview = jest.fn();
    const getGenerationService = jest.fn(() => ({
      generatePairwiseTestData,
      generateTestData,
      refreshTestDataPreview,
    }));
    const clearPendingStatusReset = jest.fn();
    const scheduleStatusReset = jest.fn();

    const adapter = createTestDataGridActionAdapter({
      getGenerationService,
      clearPendingStatusReset,
      scheduleStatusReset,
    });

    await adapter.generatePairwiseTestData();
    await adapter.generateTestData();
    await adapter.refreshTestDataPreview();

    expect(generatePairwiseTestData).toHaveBeenCalledTimes(1);
    expect(generateTestData).toHaveBeenCalledTimes(1);
    expect(refreshTestDataPreview).toHaveBeenCalledWith({
      clearPendingStatusReset,
      scheduleStatusReset,
    });
    expect(getGenerationService).toHaveBeenCalledTimes(3);
  });
});
