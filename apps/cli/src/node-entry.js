#!/usr/bin/env node
import { createNodePlatform, runCli } from './index.js';

const code = await runCli(process.argv, createNodePlatform());
if (code !== 0) {
  process.exit(code);
}
