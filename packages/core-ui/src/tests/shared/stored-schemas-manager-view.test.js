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
    const requestTextInput = jest.fn(async () => 'Saved');
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
          requestTextInput,
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
    expect(requestTextInput).not.toHaveBeenCalled();
    component.destroy();
  });

  test('save as requests a schema name with a 50 character maxlength', async () => {
    const requestTextInput = jest.fn(async () => 'Saved');
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
          saveNamedSchema: jest.fn(() => ({ ok: true, entry: { name: 'Saved' }, errorMessage: '' })),
          saveDraft: jest.fn(() => ({ ok: true, errorMessage: '' })),
          recordLastUsed: jest.fn(() => ({ ok: true, errorMessage: '' })),
        },
        textInputDialogService: {
          requestTextInput,
          destroy: jest.fn(),
        },
        storedSchemasDialogService: {
          openStoredSchemasDialog: jest.fn(async () => null),
          destroy: jest.fn(),
        },
      },
    });

    component.setCurrentSchemaText('Name\nliteral(Ada)');
    fireEvent.click(document.querySelector('[data-role="stored-schemas-save-as"]'));
    await Promise.resolve();

    expect(requestTextInput).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'Schema name',
        maxLength: 50,
      })
    );

    component.destroy();
  });

  test('save as surfaces storage errors only once', async () => {
    const onStatus = jest.fn();
    const component = createStoredSchemasManagerComponent({
      root: document.getElementById('root'),
      documentObj: document,
      services: {
        storage: {
          getSummaryState: () => ({
            ok: false,
            draft: null,
            lastUsed: [],
            saved: [],
            counts: { lastUsed: 0, saved: 0 },
            hasDraft: false,
            errorMessage: '',
          }),
          saveNamedSchema: jest.fn(() => ({ ok: false, errorMessage: 'Too many existing saved schemas.' })),
          saveDraft: jest.fn(() => ({ ok: true, errorMessage: '' })),
          recordLastUsed: jest.fn(() => ({ ok: true, errorMessage: '' })),
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
        onStatus,
      },
    });

    component.setCurrentSchemaText('Name\nliteral(Ada)');
    fireEvent.click(document.querySelector('[data-role="stored-schemas-save-as"]'));
    await Promise.resolve();

    expect(onStatus).toHaveBeenCalledTimes(1);
    expect(onStatus).toHaveBeenCalledWith('Too many existing saved schemas.', {
      severity: 'error',
      dismissable: true,
    });

    component.destroy();
  });

  test('clear last used surfaces storage errors only once', () => {
    const onStatus = jest.fn();
    const component = createStoredSchemasManagerComponent({
      root: document.getElementById('root'),
      documentObj: document,
      services: {
        storage: {
          getSummaryState: () => ({
            ok: false,
            draft: null,
            lastUsed: [{ id: 'last-1', name: 'last used - now', schemaText: 'Name\nliteral(Recent)' }],
            saved: [],
            counts: { lastUsed: 1, saved: 0 },
            hasDraft: false,
            errorMessage: '',
          }),
          saveDraft: jest.fn(() => ({ ok: true, errorMessage: '' })),
          recordLastUsed: jest.fn(() => ({ ok: true, errorMessage: '' })),
          clearLastUsed: jest.fn(() => ({
            ok: false,
            errorMessage: 'Stored schemas could not be saved to local storage.',
          })),
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
      callbacks: {
        onStatus,
      },
    });

    fireEvent.click(document.querySelector('[data-role="stored-schemas-clear-last-used"]'));

    expect(onStatus).toHaveBeenCalledTimes(1);
    expect(onStatus).toHaveBeenCalledWith('Stored schemas could not be saved to local storage.', {
      severity: 'error',
      dismissable: true,
    });

    component.destroy();
  });

  test('escapes draft and last used preview help text before setting tooltip attributes', () => {
    const component = createStoredSchemasManagerComponent({
      root: document.getElementById('root'),
      documentObj: document,
      services: {
        storage: {
          getSummaryState: () => ({
            ok: true,
            draft: { schemaText: 'Name\nliteral("<img src=x onerror=alert(1)>")' },
            lastUsed: [
              {
                id: 'last-1',
                name: 'last used - now',
                schemaText: 'Status\nliteral("<svg onload=alert(1)>")',
              },
            ],
            saved: [],
            counts: { lastUsed: 1, saved: 0 },
            hasDraft: true,
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

    fireEvent.change(document.querySelector('[data-role="stored-schemas-last-used-select"]'), {
      target: { value: 'last-1' },
    });

    expect(
      document.querySelector('[data-role="stored-schemas-draft-preview"]').getAttribute('data-help-text')
    ).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(
      document.querySelector('[data-role="stored-schemas-last-used-preview"]').getAttribute('data-help-text')
    ).toContain('&lt;svg onload=alert(1)&gt;');

    component.destroy();
  });
});
