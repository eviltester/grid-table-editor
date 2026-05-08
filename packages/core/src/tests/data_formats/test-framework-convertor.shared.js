import {
  TestFrameworkConvertor,
  TestFrameworkConvertorOptions,
  buildCanonicalModel,
} from '../../../js/data_formats/test-framework-convertor.js';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';

function createConvertor(frameworkId, options = {}) {
  const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
  convertor.setFramework(frameworkId);
  if (Object.keys(options).length > 0) {
    convertor.setOptions({ options });
  }
  return convertor;
}

function makeTable() {
  const table = new GenericDataTable();
  table.setHeaders(['Name', 'Age']);
  table.appendDataRow(['Connie', 21]);
  table.appendDataRow(['Miles', 34]);
  return table;
}

function makeNestedValueTable() {
  const table = new GenericDataTable();
  table.setHeaders(['Payload', 'Enabled', 'Count']);
  table.appendDataRow([{ nested: ['x', 1], flag: true }, false, 2]);
  return table;
}

function makeStressTable() {
  const table = new GenericDataTable();
  table.setHeaders(['First Name', 'user-id', '123code', 'quote " field', 'line\nbreak']);
  table.appendDataRow(['Connie', 'qa-1', '00123', 'He said "hello"', 'line1\nline2']);
  table.appendDataRow(['Miles', 'qa-2', '9', 'backslash \\ path', 'tab\tvalue']);
  return table;
}

function makeKotlinIdentifierTable() {
  const table = new GenericDataTable();
  table.setHeaders(['123code', '__test', 'user-id']);
  table.appendDataRow(['X1', 'ok', 'qa-1']);
  return table;
}

function makeKotlinCollisionHeaderTable() {
  const table = new GenericDataTable();
  table.setHeaders(['user-id', 'user id']);
  table.appendDataRow(['a', 'b']);
  return table;
}

function makePythonBooleanTable() {
  const table = new GenericDataTable();
  table.setHeaders(['Name', 'Enabled', 'Verified']);
  table.appendDataRow(['Connie', true, false]);
  return table;
}

function makePhpEscapingTable() {
  const table = new GenericDataTable();
  table.setHeaders(['Payload']);
  table.appendDataRow([{ "O'Reilly\\Team": "Alice\\Bob's" }]);
  return table;
}

function makeRubyHeaderEscapingTable() {
  const table = new GenericDataTable();
  table.setHeaders(['First Name', 'user-id', '123code']);
  table.appendDataRow(['Connie', 'qa-1', 'X1']);
  return table;
}

function makeCsvEscapingTable() {
  const table = new GenericDataTable();
  table.setHeaders(['Value']);
  table.appendDataRow(['Path C:\\temp\\file "quoted"']);
  return table;
}

function makeKeywordIdentifierTable() {
  const table = new GenericDataTable();
  table.setHeaders(['class', 'def']);
  table.appendDataRow(['A', 'B']);
  return table;
}

export {
  TestFrameworkConvertor,
  TestFrameworkConvertorOptions,
  buildCanonicalModel,
  createConvertor,
  makeTable,
  makeNestedValueTable,
  makeStressTable,
  makeKotlinIdentifierTable,
  makeKotlinCollisionHeaderTable,
  makePythonBooleanTable,
  makePhpEscapingTable,
  makeRubyHeaderEscapingTable,
  makeCsvEscapingTable,
  makeKeywordIdentifierTable,
};
