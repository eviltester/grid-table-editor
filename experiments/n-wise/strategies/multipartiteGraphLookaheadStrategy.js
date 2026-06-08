import { createMultipartiteGraphLookaheadStrategy } from './graphLookaheadShared.js';

const BASELINE_LOOKAHEAD_CONFIG = {
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
  phaseSwitchUncoveredThreshold: null,
  useIncidenceCache: false,
  updateSyntheticUsageDuringFallback: true,
};

export const generateMultipartiteGraphLookaheadRecords =
  createMultipartiteGraphLookaheadStrategy(BASELINE_LOOKAHEAD_CONFIG);
