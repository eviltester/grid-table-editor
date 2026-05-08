#!/usr/bin/env bun
import { createBunPlatform, runCli } from './index.js';

const code = await runCli(process.argv, createBunPlatform());
if (code !== 0) {
  process.exit(code);
}
