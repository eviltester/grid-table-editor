import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorPageRuntimeMount } from '../../../js/gui_components/generator/runtime/create-generator-page-runtime-mount.js';

describe('createGeneratorPageRuntimeMount', () => {
  test('builds the page config, mounts the page component, creates mounted state, and runs initial sync', () => {
    const createMountedPageState = jest.fn(() => ({
      generatorPage: { id: 'page-component' },
      exporter: { id: 'exporter' },
      schemaErrorDisplay: { id: 'schema-error' },
      generatorControls: { id: 'controls' },
      generatorPreview: { id: 'preview' },
      schemaDefinition: { id: 'schema-definition' },
    }));
    const createPageComponentRuntimeConfig = jest.fn(() => ({
      props: { controlsProps: { selectedFormat: 'csv' } },
      services: { generatorControlsServices: {}, generatorPreviewServices: {} },
      callbacks: { generatorControls: {}, generatorPreview: {}, schemaDefinition: {} },
    }));
    const createPageComponent = jest.fn(() => ({ id: 'page-component' }));
    const runMountedPageStartupSync = jest.fn();
    const createMountedPageStartupSync = jest.fn(() => runMountedPageStartupSync);

    const runtime = {
      parentElement: { id: 'root' },
      documentObj: { id: 'document' },
    };

    const mounted = createGeneratorPageRuntimeMount({
      runtime,
      createPageComponent,
      createPageComponentRuntimeConfig,
      createMountedPageState,
      createMountedPageStartupSync,
    });

    expect(createPageComponentRuntimeConfig).toHaveBeenCalledWith({
      runtime,
    });
    expect(createPageComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        root: runtime.parentElement,
        documentObj: runtime.documentObj,
        props: { controlsProps: { selectedFormat: 'csv' } },
        services: { generatorControlsServices: {}, generatorPreviewServices: {} },
        callbacks: { generatorControls: {}, generatorPreview: {}, schemaDefinition: {} },
      })
    );
    expect(createMountedPageState).toHaveBeenCalledWith({
      runtime,
      generatorPage: { id: 'page-component' },
    });
    expect(createMountedPageStartupSync).toHaveBeenCalledWith({
      runtime,
    });
    expect(runMountedPageStartupSync).toHaveBeenCalledTimes(1);
    expect(mounted).toEqual({
      generatorPage: { id: 'page-component' },
      exporter: { id: 'exporter' },
      schemaErrorDisplay: { id: 'schema-error' },
      generatorControls: { id: 'controls' },
      generatorPreview: { id: 'preview' },
      schemaDefinition: { id: 'schema-definition' },
    });
  });
});
