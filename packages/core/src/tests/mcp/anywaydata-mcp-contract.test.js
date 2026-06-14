import {
  executeAnyWayDataMcpTool,
  listAnyWayDataMcpResources,
  listAnyWayDataMcpTools,
  readAnyWayDataMcpResource,
} from '../../../js/mcp/anywaydata-mcp-contract.js';

describe('AnyWayData MCP contract', () => {
  test('lists the shared tool surface', () => {
    expect(listAnyWayDataMcpTools().map((tool) => tool.name)).toEqual([
      'generate_data_from_spec',
      'amend_data_from_spec',
      'get_output_format_options_schema',
    ]);
  });

  test('executes generation through the shared contract', () => {
    const result = executeAnyWayDataMcpTool('generate_data_from_spec', {
      textSpec: 'name\nperson.firstName',
      rowCount: 2,
      outputFormat: 'json',
      seed: 123,
    });

    expect(result.ok).toBe(true);
    expect(result.rows).toHaveLength(2);
    expect(result.format).toBe('json');
  });

  test('executes domain keyword generation through the shared contract', () => {
    const result = executeAnyWayDataMcpTool('generate_data_from_spec', {
      textSpec: 't2\nautoIncrement.timestamp(start="12th June 2026 at 4pm", step=60, type="minutes")',
      rowCount: 3,
      outputFormat: 'json',
    });

    expect(result.ok).toBe(true);
    expect(result.rows).toEqual([['2026-06-12T16:00:00Z'], ['2026-06-12T17:00:00Z'], ['2026-06-12T18:00:00Z']]);
  });

  test('preserves safe faker validation for amend requests', () => {
    const result = executeAnyWayDataMcpTool('amend_data_from_spec', {
      textSpec: 'Sentence\nhelpers.mustache("x", {count: () => `${this.number.int()}`})',
      inputData: '[{"Name":"Alice"}]',
      inputFormat: 'json',
      rowCount: 1,
      outputFormat: 'json',
    });

    expect(result.ok).toBe(false);
    expect(result.error.code).toBe('unsafe_faker_rule');
    expect(result.error.details).toEqual({
      mode: 'safe',
    });
  });

  test('describes flat formatter options on generation tools', () => {
    const generateTool = listAnyWayDataMcpTools().find((tool) => tool.name === 'generate_data_from_spec');
    const amendTool = listAnyWayDataMcpTools().find((tool) => tool.name === 'amend_data_from_spec');

    for (const tool of [generateTool, amendTool]) {
      expect(tool.inputSchema.properties.options.type).toBe('object');
      expect(tool.inputSchema.properties.options.description).toContain('Flat formatter options object');
      expect(tool.inputSchema.properties.options.properties).toHaveProperty('delimiter');
      expect(tool.inputSchema.properties.options.properties).not.toHaveProperty('outputFormat');
      expect(tool.inputSchema.properties.options.properties).not.toHaveProperty('options');
    }
  });

  test('reads shared resources through the shared contract', () => {
    const resources = listAnyWayDataMcpResources();
    const installGuideUri = resources.find((resource) => resource.name === 'Install Config Examples').uri;
    const installGuide = readAnyWayDataMcpResource(installGuideUri);

    expect(installGuide.ok).toBe(true);
    expect(installGuide.transport).toBe('stdio');
    expect(installGuide.examples.codex_npx.command).toBe('npx');
  });
});
