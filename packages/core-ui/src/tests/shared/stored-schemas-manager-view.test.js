import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { fireEvent } from '@testing-library/dom';
import { createStoredSchemasManagerComponent } from '../../../js/gui_components/shared/stored-schemas-manager/index.js';

describe('StoredSchemasManagerView', () => {
  let dom;

  beforeEach(() => {
    jest.useFakeTimers();
    dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
      url: 'https://example.test',
    });
    global.window = dom.window;
    global.document = dom.window.document;
  });

  afterEach(() => {
    jest.useRealTimers();
    dom.window.close();
    delete global.window;
    delete global.document;
  });

  test('renders collapsed details and storage actions', () => {
    const component = createStoredSchemasManagerComponent({
      root: document.getElementById('root'),
      documentObj: document,
      services: {
        storage: {
          getSummaryState: () => ({
            ok: true,
            draft: null,
            lastUsed: [],
            saved: [],
            counts: { lastUsed: 0, saved: 0 },
            hasDraft: false,
            errorMessage: '',
          }),
          saveDraft: jest.fn(() => ({ ok: true, errorMessage: '' })),
          recordLastUsed: jest.fn(() => ({ ok: true, errorMessage: '' })),
        },
        textInputDialogService: {
          requestTextInput: jest.fn(async () => null),
          destroy: jest.fn(),
        },
        storedSchemasDialogService: {
          openStoredSchemasDialog: jest.fn(async () => null),
          destroy: jest.fn(),
        },
      },
    });

    const details = document.querySelector('[data-role="stored-schemas-details"]');
    expect(details.open).toBe(false);
    expect(document.querySelector('[data-role="stored-schemas-summary"]').textContent).toBe(
      'Managed Stored Schemas (0)'
    );

    component.destroy();
  });

  test('autosaves draft and loads last used entry', () => {
    const saveDraft = jest.fn(() => ({ ok: true, errorMessage: '' }));
    const onSchemaLoaded = jest.fn();
    const component = createStoredSchemasManagerComponent({
      root: document.getElementById('root'),
      documentObj: document,
      services: {
        storage: {
          getSummaryState: () => ({
            ok: true,
            draft: { schemaText: 'Name\nliteral(Draft)' },
            lastUsed: [{ id: 'last-1', name: 'last used - now', schemaText: 'Name\nliteral(Recent)' }],
            saved: [{ id: 'saved-1', name: 'Saved', schemaText: 'Name\nliteral(Saved)' }],
            counts: { lastUsed: 1, saved: 1 },
            hasDraft: true,
            errorMessage: '',
          }),
          saveDraft,
          recordLastUsed: jest.fn(() => ({ ok: true, errorMessage: '' })),
          recoverDraft: jest.fn(() => ({ ok: true, draft: { schemaText: 'Name\nliteral(Draft)' } })),
          clearLastUsed: jest.fn(() => ({ ok: true, errorMessage: '' })),
          saveNamedSchema: jest.fn(() => ({ ok: true, entry: { name: 'Saved' }, errorMessage: '' })),
        },
        textInputDialogService: {
          requestTextInput: jest.fn(async () => 'Saved'),
          destroy: jest.fn(),
        },
        storedSchemasDialogService: {
          openStoredSchemasDialog: jest.fn(async () => null),
          destroy: jest.fn(),
        },
      },
      callbacks: {
        onSchemaLoaded,
      },
    });

    component.setCurrentSchemaText('Name\nliteral(Ada)');
    jest.advanceTimersByTime(350);

    fireEvent.change(document.querySelector('[data-role="stored-schemas-last-used-select"]'), {
      target: { value: 'last-1' },
    });
    fireEvent.click(document.querySelector('[data-role="stored-schemas-load-last-used"]'));

    expect(onSchemaLoaded).toHaveBeenCalledWith('Name\nliteral(Recent)');
    component.destroy();
  });
});
