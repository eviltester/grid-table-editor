import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  TestFrameworkConvertor,
  TestFrameworkConvertorOptions,
} from '../../packages/core/js/data_formats/test-framework-convertor.js';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';

function makeSyntaxStressTable() {
  const table = new GenericDataTable();
  table.setHeaders(['First Name', 'user-id', '123code', 'payload']);
  table.appendDataRow(['Connie', 'qa-1', '00123', { nested: ['x', 1], flag: true }]);
  table.appendDataRow(['Miles', 'qa-2', '9', 'Path C:\\temp\\file "quoted"']);
  return table;
}

function hasCommand(command, args = ['--version']) {
  const result = spawnSync(command, args, { encoding: 'utf-8' });
  return result.status === 0;
}

function hasPerlModule(moduleName) {
  const result = spawnSync('perl', ['-M' + moduleName, '-e', '1'], { encoding: 'utf-8' });
  return result.status === 0;
}

function writeAndCheck({ framework, ext, checkCmd, checkArgsBuilder }) {
  const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
  convertor.setFramework(framework);
  const rendered = convertor.fromDataTable(makeSyntaxStressTable());

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), `tf-syntax-${framework}-`));
  const file = path.join(tempDir, `generated.${ext}`);
  fs.writeFileSync(file, rendered, 'utf8');
  const args = checkArgsBuilder(file);
  const result = spawnSync(checkCmd, args, { encoding: 'utf-8' });
  fs.rmSync(tempDir, { recursive: true, force: true });

  expect(result.status).toBe(
    0,
    `${framework} syntax check failed.\nSTDOUT:\n${result.stdout || ''}\nSTDERR:\n${result.stderr || ''}`
  );
}

export { hasCommand, hasPerlModule, writeAndCheck };
