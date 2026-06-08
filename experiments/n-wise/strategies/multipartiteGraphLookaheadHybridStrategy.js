import { createMultipartiteGraphLookaheadStrategy } from './graphLookaheadShared.js';

const HYBRID_LOOKAHEAD_CONFIG = {
  getCandidateLimit() {
    return 4;
  },
  shouldUseLookahead(selectedVertices) {
    return selectedVertices.length <= 2;
  },
  shouldIncludeCompletionWeight() {
    return true;
  },
  getProxyTupleGain(candidate) {
    return candidate.completionWeight;
  },
  phaseSwitchUncoveredThreshold: 0.3,
  useIncidenceCache: true,
  updateSyntheticUsageDuringFallback: false,
};

export const generateMultipartiteGraphLookaheadHybridRecords =
  createMultipartiteGraphLookaheadStrategy(HYBRID_LOOKAHEAD_CONFIG);
