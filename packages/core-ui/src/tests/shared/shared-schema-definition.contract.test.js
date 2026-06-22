import * as sharedSchemaDefinitionExports from '../../../js/gui_components/shared/schema-definition/index.js';
import { createSharedSchemaDefinitionComponent } from '../../../js/gui_components/shared/schema-definition/index.js';

describe('shared-schema-definition contract', () => {
  test('public barrel is component-factory-only', () => {
    expect(sharedSchemaDefinitionExports.createSharedSchemaDefinitionComponent).toBe(
      createSharedSchemaDefinitionComponent
    );
    expect(sharedSchemaDefinitionExports.SharedSchemaDefinitionController).toBeUndefined();
    expect(sharedSchemaDefinitionExports.SharedSchemaDefinitionView).toBeUndefined();
  });

  test('shared schema barrel keeps sample schema examples off the broad runtime surface', async () => {
    const sharedSchemaModule = await import('../../../js/gui_components/shared/test-data/schema/schema-editor-core.js');

    expect(sharedSchemaModule.TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT).toBeUndefined();
  });
});
