void import('./writer-schema-page.mjs')
  .then(({ bootstrapWriterSchemaPage }) => bootstrapWriterSchemaPage())
  .catch((error) => {
    globalThis.console?.error?.('Failed to load Writer schema prototype page', error);
  });
