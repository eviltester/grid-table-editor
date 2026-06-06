import { jest } from '@jest/globals';
import { createTestDataGridActionAdapter } from '../../../../js/gui_components/app/test-data-grid/controller/test-data-grid-action-adapter.js';

describe('test data grid action adapter', () => {
  test('delegates generate actions to the current generation service', async () => {
    const generatePairwiseTestData = jest.fn();
    const generateTestData = jest.fn();
    const getGenerationService = jest.fn(() => ({
      generatePairwiseTestData,
      generateTestData,
    }));

    const adapter = createTestDataGridActionAdapter({
      getGenerationService,
    });

    await adapter.generatePairwiseTestData();
    await adapter.generateTestData();

    expect(generatePairwiseTestData).toHaveBeenCalledTimes(1);
    expect(generateTestData).toHaveBeenCalledTimes(1);
    expect(getGenerationService).toHaveBeenCalledTimes(2);
  });
});
