import { parseCliOptions } from './cli-options.js';
import { runCliCommand } from './run-cli.js';
import { createNodePlatform } from './platform/node-platform.js';
import { createBunPlatform } from './platform/bun-platform.js';

export { parseCliOptions, runCliCommand, createNodePlatform, createBunPlatform };

export async function runCli(argv = process.argv, platform = createNodePlatform()) {
  const options = parseCliOptions(argv);
  return runCliCommand({ options, platform });
}
