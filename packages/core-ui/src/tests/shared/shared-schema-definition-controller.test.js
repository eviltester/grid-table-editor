import {
  SharedSchemaDefinitionController,
  DEFAULT_SHARED_SCHEMA_IDS,
} from '../../../js/gui_components/shared/schema-definition/shared-schema-definition-controller.js';
import { jest } from '@jest/globals';

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

  test('does not emit child ids by default when no host contract ids are requested', () => {
    const controller = new SharedSchemaDefinitionController();

    expect(controller.getViewModel().ids).toEqual({
      rows: null,
      textContainer: null,
      text: null,
      addButton: null,
      toggleButton: null,
      helpIcon: null,
      error: null,
    });
    expect(DEFAULT_SHARED_SCHEMA_IDS).toEqual({});
  });

  test('forwards moveRowToIndex through the shared schema definition boundary', () => {
    const controller = new SharedSchemaDefinitionController();
    controller.schemaEditor = {
      moveRowToIndex: jest.fn(),
    };

    controller.moveRowToIndex(4, 1);

    expect(controller.schemaEditor.moveRowToIndex).toHaveBeenCalledWith(4, 1);
  });

  test('forwards parseTextToRows through the shared schema definition boundary', () => {
    const controller = new SharedSchemaDefinitionController();
    controller.schemaEditor = {
      parseTextToRows: jest.fn(() => ({ rows: [{ name: 'Field' }], errors: [], tokens: [] })),
    };

    const result = controller.parseTextToRows('Field\nliteral(value)');

    expect(controller.schemaEditor.parseTextToRows).toHaveBeenCalledWith('Field\nliteral(value)');
    expect(result).toEqual({
      rows: [{ name: 'Field' }],
      errors: [],
      tokens: [],
    });
  });
});
