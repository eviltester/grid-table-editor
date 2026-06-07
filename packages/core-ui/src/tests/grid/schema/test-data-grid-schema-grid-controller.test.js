import * as schemaGridController from '../../../../js/gui_components/app/test-data-grid/schema/test-data-grid-schema-grid-controller.js';

describe('test-data-grid-schema-grid-controller exports', () => {
  test('exposes only the live app schema definition host adapter', () => {
    expect(typeof schemaGridController.createAppSchemaDefinitionProps).toBe('function');
    expect('buildAppSchemaModeHelpHtml' in schemaGridController).toBe(false);
  });
});
