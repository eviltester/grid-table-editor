import Papa from 'papaparse';
import RandExp from 'randexp';
import tippy from 'tippy.js';
import '@popperjs/core';

globalThis.Papa = Papa;
globalThis.RandExp = RandExp;
globalThis.tippy = tippy;

await import('../../../packages/core-ui/js/script.js');
