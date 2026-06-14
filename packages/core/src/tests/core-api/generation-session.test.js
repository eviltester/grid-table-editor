import { createGenerationSession, generateFromTextSpec } from '../../index.js';

const TIMESTAMP_SPEC = 'CreatedAt\nautoIncrement.timestamp(start="12th June 2026 at 4pm", step=60, type="minutes")';

test('createGenerationSession preserves generator state across repeated batch calls', () => {
  const session = createGenerationSession({
    textSpec: TIMESTAMP_SPEC,
  });

  const first = session.generateRows({ rowCount: 1 });
  const second = session.generateRows({ rowCount: 2 });
  const singleBatch = generateFromTextSpec({
    textSpec: TIMESTAMP_SPEC,
    rowCount: 3,
    outputFormat: 'json',
  });

  expect(first.ok).toBe(true);
  expect(second.ok).toBe(true);
  expect(singleBatch.ok).toBe(true);
  expect([...first.rows, ...second.rows]).toEqual(singleBatch.rows);
});

test('createGenerationSession streamRows resumes from the same live session state', async () => {
  const session = createGenerationSession({
    textSpec: TIMESTAMP_SPEC,
  });
  const first = session.generateRows({ rowCount: 1 });
  const chunks = [];

  const streamed = await session.streamRows({
    rowCount: 2,
    outputFormat: 'jsonl',
    onChunk: async (chunk) => {
      chunks.push(chunk);
    },
    collectRows: true,
  });

  expect(first.ok).toBe(true);
  expect(streamed.ok).toBe(true);
  expect(first.rows).toEqual([['2026-06-12T16:00:00Z']]);
  expect(streamed.rows).toEqual([['2026-06-12T17:00:00Z'], ['2026-06-12T18:00:00Z']]);
  expect(chunks).toEqual(['{"CreatedAt":"2026-06-12T17:00:00Z"}', '{"CreatedAt":"2026-06-12T18:00:00Z"}']);
});

test('createGenerationSession safe mode accepts domain commands and rejects unsafe faker expressions in core', () => {
  const safeDomainSession = createGenerationSession({
    textSpec: TIMESTAMP_SPEC,
    safeFakerRules: true,
  });
  const unsafeFakerSession = createGenerationSession({
    textSpec: 'Sentence\nhelpers.mustache("x", {count: () => `${this.number.int()}`})',
    safeFakerRules: true,
  });

  expect(safeDomainSession.isValid()).toBe(true);
  expect(unsafeFakerSession.isValid()).toBe(false);
  expect(unsafeFakerSession.getErrors()).toContainEqual(
    expect.objectContaining({
      code: 'unsafe_faker_rule',
    })
  );
});

test('createGenerationSession amendRows shares header merge semantics with the core buffered path', () => {
  const session = createGenerationSession({
    textSpec: 'Name\nBob',
  });

  const amended = session.amendRows({
    headers: ['Age'],
    rows: [['30'], ['40']],
    rowCount: 1,
    mode: 'amend-table',
    outputFormat: 'json',
  });

  expect(amended.ok).toBe(true);
  expect(amended.headers).toEqual(['Age', 'Name']);
  expect(amended.rows).toEqual([
    ['30', 'Bob'],
    ['40', ''],
  ]);
});
