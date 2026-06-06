import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorPageRuntimeMountFactory } from '../../../js/gui_components/generator/runtime/create-generator-page-runtime-mount-factory.js';

describe('createGeneratorPageRuntimeMountFactory', () => {
  test('builds a runtime mount factory that mounts from the provided runtime', () => {
    const mountResult = { generatorPage: { id: 'page' }, exporter: { id: 'exporter' } };
    const createPageRuntimeMountFn = jest.fn(() => mountResult);
    const createPageRuntimeMount = createGeneratorPageRuntimeMountFactory({
      createPageRuntimeMountFn,
    });

    expect(typeof createPageRuntimeMount).toBe('function');

    const runtime = {
      parentElement: { id: 'root' },
      documentObj: { id: 'document' },
    };

    const mounted = createPageRuntimeMount({
      runtime,
    });

    expect(createPageRuntimeMountFn).toHaveBeenCalledWith({
      runtime,
    });
    expect(mounted).toBe(mountResult);
  });
});
