import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import {
  DEFAULT_PROMPT,
  bootstrapWriterSchemaPage,
  buildWriterSharedContext,
  extractJsonPayload,
  normalizeStructuredSchemaPayload,
  parseWriterStructuredOutput,
  runWriterSchemaGeneration,
} from '../../writer-schema-page.mjs';

describe('writer schema prototype page', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM(
      `<!doctype html><html><body>
        <div class="header" data-role="theme-toggle-host"><div class="pageheading">AnyWayData</div></div>
        <main id="writer-schema-page-root">
          <p id="writer-schema-support-status">Checking Writer API availability...</p>
          <textarea id="writer-schema-prompt"></textarea>
          <button id="writer-schema-example-prompt" type="button">Load example prompt</button>
          <button id="writer-schema-generate" type="button">Generate schema from prompt</button>
          <p id="writer-schema-generation-status">Ready for a prompt.</p>
          <pre id="writer-schema-json-output">No output yet.</pre>
          <pre id="writer-schema-request-output">No Writer request has been sent yet.</pre>
          <pre id="writer-schema-raw-output">No raw Writer response yet.</pre>
          <pre id="writer-schema-error-output">No errors yet.</pre>
          <ol id="writer-schema-progress-output"><li>No generation activity yet.</li></ol>
          <div id="writer-schema-editor-root"></div>
        </main>
      </body></html>`,
      { url: 'https://example.test/writer-schema.html' }
    );
  });

  afterEach(() => {
    dom.window.close();
    jest.restoreAllMocks();
  });

  test('extractJsonPayload unwraps fenced JSON', () => {
    expect(extractJsonPayload('```json\n{"schemaFields":[]}\n```')).toBe('{"schemaFields":[]}');
  });

  test('parseWriterStructuredOutput parses JSON objects from plain text responses', () => {
    expect(
      parseWriterStructuredOutput('Result:\n{"schemaFields":[{"name":"Title","sourceType":"literal","value":"book"}]}')
    ).toEqual({
      schemaFields: [{ name: 'Title', sourceType: 'literal', value: 'book' }],
    });
  });

  test('normalizeStructuredSchemaPayload maps supported source types into schema rows', () => {
    expect(
      normalizeStructuredSchemaPayload({
        schemaFields: [
          { name: 'Category', sourceType: 'enum', values: ['A', 'B'] },
          { name: 'Book Title', sourceType: 'domain', command: 'commerce.productName' },
          { name: 'ISBN', sourceType: 'regex', pattern: '[0-9]{3}' },
        ],
      })
    ).toMatchObject({
      schemaRows: [
        { name: 'Category', sourceType: 'enum', value: '"A","B"' },
        { name: 'Book Title', sourceType: 'domain', command: 'commerce.productName' },
        { name: 'ISBN', sourceType: 'regex', value: '[0-9]{3}' },
      ],
      normalizationErrors: [],
    });
  });

  test('buildWriterSharedContext includes schema guidance and allowed domain commands', () => {
    const context = buildWriterSharedContext({
      domainCommands: ['person.fullName', 'commerce.productName'],
      sampleSchemaText: 'Name\nperson.fullName',
    });

    expect(context).toContain('Supported sourceType values are exactly: domain, enum, literal, regex.');
    expect(context).toContain('Never invent or rename commands');
    expect(context).toContain('Do not use literal placeholders like YYYY-MM-DD');
    expect(context).toContain('person.fullName, commerce.productName');
    expect(context).toContain('Name\nperson.fullName');
  });

  test('normalizeStructuredSchemaPayload rejects invented domain commands', () => {
    const result = normalizeStructuredSchemaPayload(
      {
        schemaFields: [
          { name: 'Author Name', sourceType: 'domain', command: 'person.fullName' },
          { name: 'Publisher', sourceType: 'domain', command: 'commerce.publisher' },
        ],
      },
      {
        allowedDomainCommands: ['book.publisher', 'commerce.productName', 'person.fullName'],
      }
    );

    expect(result.schemaRows).toMatchObject([{ name: 'Author Name', command: 'person.fullName' }]);
    expect(result.normalizationErrors).toHaveLength(1);
    expect(result.normalizationErrors[0].message).toContain('unsupported command "commerce.publisher"');
  });

  test('normalizeStructuredSchemaPayload rejects date placeholder literals for date-like fields', () => {
    expect(() =>
      normalizeStructuredSchemaPayload({
        schemaFields: [{ name: 'Published Date', sourceType: 'literal', value: 'YYYY-MM-DD' }],
      })
    ).toThrow('Use an allowed date.* domain command instead');
  });

  test('runWriterSchemaGeneration parses structured JSON text returned by Writer', async () => {
    const writer = {
      write: jest.fn(async () =>
        JSON.stringify({
          schemaFields: [
            { name: 'Book Title', sourceType: 'domain', command: 'commerce.productName' },
            { name: 'Genre', sourceType: 'enum', values: ['Fiction', 'Non-fiction'] },
          ],
        })
      ),
    };
    const WriterCtor = {
      create: jest.fn(async () => writer),
    };

    const result = await runWriterSchemaGeneration({
      WriterCtor,
      promptText: DEFAULT_PROMPT,
      domainCommands: ['commerce.productName', 'person.fullName'],
      sampleSchemaText: 'Name\nperson.fullName',
      onStatus: jest.fn(),
    });

    expect(WriterCtor.create).toHaveBeenCalledTimes(1);
    expect(WriterCtor.create).toHaveBeenCalledWith(
      expect.objectContaining({
        expectedInputLanguages: ['en'],
        expectedContextLanguages: ['en'],
        outputLanguage: 'en',
      })
    );
    expect(writer.write).toHaveBeenCalledWith(
      DEFAULT_PROMPT,
      expect.objectContaining({
        context: expect.any(String),
        expectedInputLanguages: ['en'],
        expectedContextLanguages: ['en'],
        outputLanguage: 'en',
      })
    );
    expect(result.parsedPayload.schemaFields).toHaveLength(2);
    expect(result.requestDetails).toMatchObject({
      promptText: DEFAULT_PROMPT,
      taskContext: expect.any(String),
      writeOptions: expect.objectContaining({
        outputLanguage: 'en',
      }),
      createOptions: expect.objectContaining({
        sharedContext: expect.any(String),
      }),
    });
    expect(result.schemaRows).toMatchObject([
      { name: 'Book Title', sourceType: 'domain', command: 'commerce.productName' },
      { name: 'Genre', sourceType: 'enum', value: '"Fiction","Non-fiction"' },
    ]);
    expect(result.normalizationErrors).toEqual([]);
  });

  test('bootstrap warns when Writer API support is unavailable', async () => {
    const schemaComponent = {
      destroy: jest.fn(),
      replaceRows: jest.fn(),
      setTextMode: jest.fn(),
      render: jest.fn(),
      syncTextFromRows: jest.fn(),
      validateRows: jest.fn(() => ({ errors: [] })),
      getSchemaText: jest.fn(() => ''),
    };

    await bootstrapWriterSchemaPage({
      documentObj: dom.window.document,
      WriterCtor: null,
      createThemeToggleComponentFn: () => ({ destroy: jest.fn() }),
      createSharedSchemaDefinitionComponentFn: () => schemaComponent,
    });

    expect(dom.window.document.getElementById('writer-schema-support-status').textContent).toContain(
      'Writer API is not available'
    );
    expect(dom.window.document.getElementById('writer-schema-prompt').value).toBe(DEFAULT_PROMPT);
  });

  test('bootstrap generates rows and populates the shared schema component', async () => {
    const schemaComponent = {
      destroy: jest.fn(),
      replaceRows: jest.fn(),
      setTextMode: jest.fn(),
      render: jest.fn(),
      syncTextFromRows: jest.fn(),
      validateRows: jest.fn(() => ({ errors: [] })),
      getSchemaText: jest.fn(() => 'Book Title\ncommerce.productName()'),
    };
    const writer = {
      write: jest.fn(async () =>
        JSON.stringify({
          schemaFields: [{ name: 'Book Title', sourceType: 'domain', command: 'commerce.productName' }],
        })
      ),
    };
    const WriterCtor = {
      availability: jest.fn(async () => 'available'),
      create: jest.fn(async () => writer),
    };

    const page = await bootstrapWriterSchemaPage({
      documentObj: dom.window.document,
      WriterCtor,
      createThemeToggleComponentFn: () => ({ destroy: jest.fn() }),
      createSharedSchemaDefinitionComponentFn: () => schemaComponent,
    });

    await page.generateFromPrompt();

    expect(schemaComponent.replaceRows).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ name: 'Book Title', command: 'commerce.productName' })])
    );
    expect(schemaComponent.syncTextFromRows).toHaveBeenCalledTimes(1);
    expect(dom.window.document.getElementById('writer-schema-generation-status').textContent).toContain(
      'Generated 1 schema fields'
    );
    expect(dom.window.document.getElementById('writer-schema-json-output').textContent).toContain('Book Title');
    expect(dom.window.document.getElementById('writer-schema-request-output').textContent).toContain(
      '"promptText": "Create 10 fields that represent the inventory of a bookshop"'
    );
    expect(dom.window.document.getElementById('writer-schema-raw-output').textContent).toContain(
      'commerce.productName'
    );
    expect(dom.window.document.getElementById('writer-schema-error-output').textContent).toBe('No errors yet.');
    expect(dom.window.document.getElementById('writer-schema-progress-output').textContent).toContain(
      'Schema generation completed successfully.'
    );
  });

  test('bootstrap shows full error and raw response when generated schema cannot be normalized', async () => {
    const schemaComponent = {
      destroy: jest.fn(),
      replaceRows: jest.fn(),
      setTextMode: jest.fn(),
      render: jest.fn(),
      syncTextFromRows: jest.fn(),
      validateRows: jest.fn(() => ({ errors: [] })),
      getSchemaText: jest.fn(() => ''),
    };
    const invalidResponse = JSON.stringify({
      schemaFields: [{ name: 'Book Title', sourceType: 'domain' }],
    });
    const writer = {
      write: jest.fn(async () => invalidResponse),
    };
    const WriterCtor = {
      availability: jest.fn(async () => 'available'),
      create: jest.fn(async () => writer),
    };

    const page = await bootstrapWriterSchemaPage({
      documentObj: dom.window.document,
      WriterCtor,
      createThemeToggleComponentFn: () => ({ destroy: jest.fn() }),
      createSharedSchemaDefinitionComponentFn: () => schemaComponent,
    });

    await expect(page.generateFromPrompt()).rejects.toThrow(
      'Generated domain field "Book Title" is missing a command.'
    );

    expect(dom.window.document.getElementById('writer-schema-generation-status').textContent).toContain(
      'Unable to generate a schema from the prompt'
    );
    expect(dom.window.document.getElementById('writer-schema-error-output').textContent).toContain(
      'Generated domain field "Book Title" is missing a command.'
    );
    expect(dom.window.document.getElementById('writer-schema-raw-output').textContent).toContain(
      '"sourceType":"domain"'
    );
    expect(dom.window.document.getElementById('writer-schema-request-output').textContent).toContain(
      '"outputLanguage": "en"'
    );
    expect(dom.window.document.getElementById('writer-schema-progress-output').textContent).toContain(
      'Generation failed: Generated domain field "Book Title" is missing a command.'
    );
  });

  test('bootstrap keeps valid schema rows when some generated fields are invalid', async () => {
    const schemaComponent = {
      destroy: jest.fn(),
      replaceRows: jest.fn(),
      setTextMode: jest.fn(),
      render: jest.fn(),
      syncTextFromRows: jest.fn(),
      validateRows: jest.fn(() => ({ errors: [] })),
      getSchemaText: jest.fn(() => 'Author Name\nperson.fullName()'),
    };
    const writer = {
      write: jest.fn(async () =>
        JSON.stringify({
          schemaFields: [
            { name: 'Author Name', sourceType: 'domain', command: 'person.fullName' },
            { name: 'Publisher', sourceType: 'domain', command: 'commerce.publisher' },
          ],
        })
      ),
    };
    const WriterCtor = {
      availability: jest.fn(async () => 'available'),
      create: jest.fn(async () => writer),
    };

    const page = await bootstrapWriterSchemaPage({
      documentObj: dom.window.document,
      WriterCtor,
      createThemeToggleComponentFn: () => ({ destroy: jest.fn() }),
      createSharedSchemaDefinitionComponentFn: () => schemaComponent,
    });

    await page.generateFromPrompt();

    expect(schemaComponent.replaceRows).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ name: 'Author Name', command: 'person.fullName' })])
    );
    expect(dom.window.document.getElementById('writer-schema-generation-status').textContent).toContain(
      'could not be mapped and were left out'
    );
    expect(dom.window.document.getElementById('writer-schema-error-output').textContent).toContain(
      'unsupported command "commerce.publisher"'
    );
    expect(dom.window.document.getElementById('writer-schema-progress-output').textContent).toContain(
      'Completed with partial recovery.'
    );
  });
});
