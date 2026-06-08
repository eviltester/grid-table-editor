import { generateMultipartiteGraphLookaheadAdaptiveRecords } from './strategies/multipartiteGraphLookaheadAdaptiveStrategy.js';
import { generateMultipartiteGraphLookaheadHybridRecords } from './strategies/multipartiteGraphLookaheadHybridStrategy.js';
import { generateMultipartiteGraphLookaheadRecords } from './strategies/multipartiteGraphLookaheadStrategy.js';
import { generateMultipartiteGraphWalkRecords } from './strategies/multipartiteGraphWalkStrategy.js';

export const EXPERIMENTAL_N_WISE_STRATEGIES = Object.freeze({
  'multipartite-graph-lookahead-adaptive': generateMultipartiteGraphLookaheadAdaptiveRecords,
  'multipartite-graph-lookahead-hybrid': generateMultipartiteGraphLookaheadHybridRecords,
  'multipartite-graph-lookahead': generateMultipartiteGraphLookaheadRecords,
  'multipartite-graph-walk': generateMultipartiteGraphWalkRecords,
});
