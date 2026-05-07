import Papa from 'papaparse';
import RandExp from 'randexp';
import tippy from 'tippy.js';
import '@popperjs/core';

globalThis.Papa = Papa;
globalThis.RandExp = RandExp;
globalThis.tippy = tippy;

void import('../../../packages/core-ui/js/generator-script.js').catch((error) => {
  console.error('Failed to load generator script', error);
});
