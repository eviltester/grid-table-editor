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

  test('reads shared resources through the shared contract', () => {
    const resources = listAnyWayDataMcpResources();
    const installGuideUri = resources.find((resource) => resource.name === 'Install Config Examples').uri;
    const installGuide = readAnyWayDataMcpResource(installGuideUri);

    expect(installGuide.ok).toBe(true);
    expect(installGuide.transport).toBe('stdio');
    expect(installGuide.examples.codex_npx.command).toBe('npx');
  });
});
