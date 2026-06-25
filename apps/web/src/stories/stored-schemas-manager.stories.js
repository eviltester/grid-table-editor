import { expect, userEvent, within } from 'storybook/test';
import { createStoredSchemasManagerComponent } from '../../../../packages/core-ui/js/gui_components/shared/stored-schemas-manager/index.js';

function createInMemoryStorageState(args) {
  return {
    draft: args.includeDraft
      ? {
          id: 'draft-1',
          name: 'ldraft',
          schemaText: 'Name\nliteral(Draft)',
          updatedAt: '2026-06-16T10:00:00.000Z',
        }
      : null,
    lastUsed: args.includeLastUsed
      ? [
          {
            id: 'last-1',
            name: 'last used - 2026-06-16T10:05:00.000Z',
            schemaText: 'Status\nactive,inactive',
            updatedAt: '2026-06-16T10:05:00.000Z',
          },
        ]
      : [],
    saved: args.includeSaved
      ? [
          {
            id: 'saved-1',
            name: 'Regression Smoke',
            schemaText: 'Browser\nchrome,firefox',
            updatedAt: '2026-06-16T10:06:00.000Z',
          },
        ]
      : [],
  };
}

function createStorageService(state) {
  const data = {
    draft: state.draft,
    lastUsed: [...state.lastUsed],
    saved: [...state.saved],
  };
  return {
    getSummaryState() {
      return {
        ok: true,
        draft: data.draft,
        lastUsed: [...data.lastUsed],
        saved: [...data.saved],
        counts: { lastUsed: data.lastUsed.length, saved: data.saved.length },
        hasDraft: Boolean(data.draft?.schemaText),
        errorMessage: '',
      };
    },
    saveDraft(schemaText) {
      data.draft = { id: 'draft-1', name: 'ldraft', schemaText, updatedAt: '2026-06-16T10:10:00.000Z' };
      return { ok: true, errorMessage: '' };
    },
    recordLastUsed(schemaText) {
      data.lastUsed = [
        {
          id: 'last-1',
          name: 'last used - 2026-06-16T10:11:00.000Z',
          schemaText,
          updatedAt: '2026-06-16T10:11:00.000Z',
        },
      ];
      return { ok: true, errorMessage: '' };
    },
    recoverDraft() {
      return { ok: true, draft: data.draft };
    },
    clearLastUsed() {
      data.lastUsed = [];
      return { ok: true, errorMessage: '' };
    },
    saveNamedSchema(name, schemaText) {
      const entry = {
        id: `saved-${data.saved.length + 1}`,
        name,
        schemaText,
        updatedAt: '2026-06-16T10:12:00.000Z',
      };
      data.saved = [entry, ...data.saved];
      return { ok: true, entry, errorMessage: '' };
    },
    loadSavedSchemas() {
      return this.getSummaryState();
    },
    renameSavedSchema(id, name) {
      data.saved = data.saved.map((entry) => (entry.id === id ? { ...entry, name } : entry));
      return { ok: true, errorMessage: '' };
    },
    deleteSavedSchema(id) {
      data.saved = data.saved.filter((entry) => entry.id !== id);
      return { ok: true, errorMessage: '' };
    },
  };
}

function renderStoredSchemasManagerStory(args) {
  const root = document.createElement('main');
  const log = document.createElement('pre');
  log.setAttribute('aria-label', 'Interaction log');
  log.textContent = 'No interactions yet.';
  const componentRoot = document.createElement('section');
  root.appendChild(componentRoot);
  root.appendChild(log);

  const storage = createStorageService(createInMemoryStorageState(args));
  const component = createStoredSchemasManagerComponent({
    root: componentRoot,
    documentObj: document,
    props: {
      currentSchemaText: 'Name\nliteral(Ada)',
    },
    services: {
      storage,
      textInputDialogService: {
        requestTextInput: async () => 'Named Schema',
        destroy() {},
      },
      storedSchemasDialogService: {
        async openStoredSchemasDialog({ onLoadSchema, storage: storageApi }) {
          const firstSaved = storageApi.loadSavedSchemas().saved[0];
          if (firstSaved) {
            onLoadSchema?.(firstSaved.schemaText, firstSaved);
          }
        },
        destroy() {},
      },
    },
    callbacks: {
      onSchemaLoaded: (schemaText) => {
        log.textContent = `loaded:${schemaText}`;
      },
      onStatus: (message) => {
        log.textContent = message;
      },
    },
  });

  root.__storybookCleanup = () => component.destroy();
  return root;
}

const meta = {
  title: 'Shared/Stored Schemas Manager',
  tags: ['autodocs'],
  args: {
    includeDraft: false,
    includeLastUsed: false,
    includeSaved: false,
  },
  argTypes: {
    includeDraft: { control: 'boolean' },
    includeLastUsed: { control: 'boolean' },
    includeSaved: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'StoredSchemasManager is the shared schema-storage control mounted below the shared schema editor in both the embedded app panel and generator page. It owns draft recovery, last-used history, and access to named saved schemas.',
      },
    },
  },
  render: renderStoredSchemasManagerStory,
};

export default meta;

export const EmptyStorage = {
  parameters: {
    docs: {
      description: {
        story:
          'Default empty state. The disclosure should start collapsed, draft recovery should be disabled, and the save action remains available because the current schema text is non-empty.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Managed Stored Schemas (0)')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Recover Draft' })).toBeDisabled();
  },
};

export const DraftAndHistory = {
  args: {
    includeDraft: true,
    includeLastUsed: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the manager with a recoverable draft and one last-used schema. Expand the disclosure, choose the history item, and use Load to confirm the loaded schema is reported in the story log.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Managed Stored Schemas (0)'));
    await userEvent.selectOptions(canvas.getByLabelText('Last Used'), 'last-1');
    await userEvent.click(canvas.getByRole('button', { name: /load last used schema/i }));
    await expect(canvas.getByText(/Loaded last used/i)).toBeVisible();
  },
};

export const SavedSchemasAvailable = {
  args: {
    includeSaved: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Reviewer-facing state where named saved schemas already exist. Use Load Saved Schema to exercise the shared saved-schema dialog service path through the story log.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Managed Stored Schemas (1)'));
    await userEvent.click(canvas.getByRole('button', { name: 'Load Saved Schema' }));
    await expect(canvas.getByText(/Loaded Regression Smoke/i)).toBeVisible();
  },
};
