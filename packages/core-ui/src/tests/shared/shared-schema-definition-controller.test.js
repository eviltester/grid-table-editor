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

  test('getState fallback matches the shared schema editor session shape before attach', () => {
    const controller = new SharedSchemaDefinitionController();

    expect(controller.getState()).toEqual({
      rows: [],
      tokens: [],
      constraints: [],
      constraintText: '',
      isTextMode: false,
    });
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

  test('saveSchemaToFile forwards schema text through the shared file transfer service', () => {
    const schemaFileTransferService = {
      downloadSchemaText: jest.fn(() => true),
    };
    const controller = new SharedSchemaDefinitionController({
      props: {
        schemaFileName: 'writer-schema.txt',
      },
      services: {
        schemaFileTransferService,
      },
    });
    controller.schemaEditor = {
      getSchemaText: jest.fn(() => 'Field\nliteral(value)'),
    };

    const result = controller.saveSchemaToFile();

    expect(result).toBe(true);
    expect(schemaFileTransferService.downloadSchemaText).toHaveBeenCalledWith('Field\nliteral(value)', {
      filename: 'writer-schema.txt',
    });
  });

  test('saveSchemaToFile surfaces a clear error when download support is unavailable', () => {
    const controller = new SharedSchemaDefinitionController({
      props: {
        schemaErrorDisplay: {
          show: jest.fn(),
          clear: jest.fn(),
        },
      },
      services: {
        schemaFileTransferService: {},
      },
    });
    controller.schemaEditor = {
      getSchemaText: jest.fn(() => 'Field\nliteral(value)'),
    };

    const result = controller.saveSchemaToFile();

    expect(result).toBe(false);
    expect(controller.props.schemaErrorDisplay.show).toHaveBeenCalledWith(
      'Schema file saving is not available in this browser.'
    );
  });

  test('loadSchemaFromFile reads text through the shared file transfer service and applies it through the editor', async () => {
    const schemaFileTransferService = {
      readSchemaTextFile: jest.fn(async () => 'Loaded Name\nliteral(Ada)'),
    };
    const controller = new SharedSchemaDefinitionController({
      services: {
        schemaFileTransferService,
      },
    });
    controller.schemaEditor = {
      loadSchemaText: jest.fn(() => ({ rows: [{ name: 'Loaded Name' }], errors: [], applied: true })),
      getState: jest.fn(() => ({ rows: [], tokens: [], isTextMode: false })),
    };

    const result = await controller.loadSchemaFromFile({ name: 'schema.txt' });

    expect(schemaFileTransferService.readSchemaTextFile).toHaveBeenCalledWith({ name: 'schema.txt' });
    expect(controller.schemaEditor.loadSchemaText).toHaveBeenCalledWith('Loaded Name\nliteral(Ada)', {
      showErrors: true,
      preferRowMode: true,
    });
    expect(result).toEqual({
      rows: [{ name: 'Loaded Name' }],
      errors: [],
      applied: true,
    });
  });

  test('loadSchemaFromFile surfaces wrapped file read failures with a useful message', async () => {
    const schemaFileTransferService = {
      readSchemaTextFile: jest.fn(async () => {
        throw new Error('Reading the schema file failed.');
      }),
    };
    const controller = new SharedSchemaDefinitionController({
      services: {
        schemaFileTransferService,
      },
      props: {
        schemaErrorDisplay: {
          show: jest.fn(),
          clear: jest.fn(),
        },
      },
    });
    controller.schemaEditor = {
      getState: jest.fn(() => ({ rows: [{ name: 'Existing Name' }], tokens: [], isTextMode: false })),
    };

    const result = await controller.loadSchemaFromFile({ name: 'schema.txt' });

    expect(controller.props.schemaErrorDisplay.show).toHaveBeenCalledWith(
      'Unable to load schema file: Reading the schema file failed.'
    );
    expect(result.errors[0].message).toBe('Unable to load schema file: Reading the schema file failed.');
    expect(result.rows).toEqual([{ name: 'Existing Name' }]);
  });
});
