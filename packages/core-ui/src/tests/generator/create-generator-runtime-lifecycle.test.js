import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorRuntimeLifecycle } from '../../../js/gui_components/generator/runtime/create-generator-runtime-lifecycle.js';

describe('createGeneratorRuntimeLifecycle', () => {
  test('mounts the runtime through the injected page-runtime mount helper', () => {
    const runtime = {
      parentElement: { id: 'root' },
      TabulatorCtor: function FakeTabulator() {},
    };
    const createPageRuntimeMount = jest.fn(() => ({
      generatorPage: { destroy: jest.fn() },
      mounted: true,
    }));

    const lifecycle = createGeneratorRuntimeLifecycle({
      getRuntime: () => runtime,
      createPageRuntimeMount,
    });

    lifecycle.init();

    expect(createPageRuntimeMount).toHaveBeenCalledWith({ runtime });
    expect(runtime.mounted).toBe(true);
    expect(runtime.generatorPage).toEqual(expect.objectContaining({ destroy: expect.any(Function) }));
  });

  test('destroys through the mounted page instance', () => {
    const destroy = jest.fn();
    const mountedRuntime = {
      parentElement: { id: 'root' },
      TabulatorCtor: function FakeTabulator() {},
      generatorPage: { destroy },
    };
    const createPageRuntimeMount = jest.fn();
    const mountedLifecycle = createGeneratorRuntimeLifecycle({
      getRuntime: () => mountedRuntime,
      createPageRuntimeMount,
    });

    mountedLifecycle.destroy();

    expect(createPageRuntimeMount).not.toHaveBeenCalled();
    expect(destroy).toHaveBeenCalledTimes(1);
  });
});
