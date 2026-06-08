import { createMultipartiteGraphLookaheadStrategy } from './graphLookaheadShared.js';

const ADAPTIVE_LOOKAHEAD_CONFIG = {
  getCandidateLimit(context) {
    if (context.strength <= 3) {
      return 2;
    }
    if (context.strength === 4) {
      return 1;
    }
    return 4;
  },
  shouldUseLookahead(selectedVertices) {
    return selectedVertices.length <= 2;
  },
  shouldIncludeCompletionWeight(selectedVertices) {
    return selectedVertices.length <= 2;
  },
  getProxyTupleGain() {
    return 0;
  },
  phaseSwitchUncoveredThreshold: null,
  useIncidenceCache: true,
  updateSyntheticUsageDuringFallback: true,
};

export const generateMultipartiteGraphLookaheadAdaptiveRecords =
  createMultipartiteGraphLookaheadStrategy(ADAPTIVE_LOOKAHEAD_CONFIG);
