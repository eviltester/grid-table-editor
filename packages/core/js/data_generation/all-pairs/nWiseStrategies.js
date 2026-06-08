import { generateAetgRecords } from './nWiseStrategies/aetgStrategy.js';
import { generateCompatibilityGraphRecords } from './nWiseStrategies/compatibilityGraphStrategy.js';
import { generateGreedyRecords } from './nWiseStrategies/greedyStrategy.js';
import { generateHypergraphVertexRecords } from './nWiseStrategies/hypergraphVertexStrategy.js';
import { generateIpogRecords } from './nWiseStrategies/ipogStrategy.js';
import { generatePictGcdRecords } from './nWiseStrategies/pictGcdStrategy.js';

export const N_WISE_STRATEGIES = Object.freeze({
  greedy: generateGreedyRecords,
  'pict-gcd': generatePictGcdRecords,
  aetg: generateAetgRecords,
  ipog: generateIpogRecords,
  'compatibility-graph': generateCompatibilityGraphRecords,
  'hypergraph-vertex': generateHypergraphVertexRecords,
});
