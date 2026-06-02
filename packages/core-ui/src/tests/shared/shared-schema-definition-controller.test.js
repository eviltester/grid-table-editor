import { SharedSchemaDefinitionController } from '../../../js/gui_components/shared/schema-definition/shared-schema-definition-controller.js';

describe('SharedSchemaDefinitionController', () => {
  test('exposes the scoped ids and shell options needed by the view', () => {
    const controller = new SharedSchemaDefinitionController({
      props: {
        headingText: 'Schema',
        sectionClassName: 'custom-schema',
        ids: {
          rows: 'rows-id',
          textContainer: 'text-container-id',
          text: 'text-id',
          addButton: 'add-id',
          toggleButton: 'toggle-id',
          helpIcon: 'help-id',
          error: 'error-id',
        },
      },
    });

    expect(controller.getViewModel()).toEqual(
      expect.objectContaining({
        headingText: 'Schema',
        sectionClassName: 'custom-schema',
        ids: {
          rows: 'rows-id',
          textContainer: 'text-container-id',
          text: 'text-id',
          addButton: 'add-id',
          toggleButton: 'toggle-id',
          helpIcon: 'help-id',
          error: 'error-id',
        },
      })
    );
  });

  test('constructor does not require a global document', () => {
    const originalDocument = global.document;
    delete global.document;

    try {
      const controller = new SharedSchemaDefinitionController();
      expect(controller.documentObj).toBeNull();
    } finally {
      global.document = originalDocument;
    }
  });
});
