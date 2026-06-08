import { completeRecordInRandomOrder, selectMostOpenTarget, selectRandomOpenTuple } from './shared.js';

export function generateAetgRecords(context) {
  const { model, dataRecords, candidateCount, random } = context;

  while (!model.isFullyCovered()) {
    let bestCandidate = null;
    let bestScore = -1;

    for (let candidateIndex = 0; candidateIndex < candidateCount; candidateIndex += 1) {
      const seedTuple = selectRandomOpenTuple(model, selectMostOpenTarget(model, random), random);
      if (!seedTuple) {
        break;
      }

      const candidate = completeRecordInRandomOrder(
        model,
        context.parameters,
        model.createRecordFromTuple(seedTuple),
        random
      );
      const score = model.calculateCoverageScore(candidate);

      if (score > bestScore) {
        bestScore = score;
        bestCandidate = candidate;
      }
    }

    if (!bestCandidate) {
      break;
    }

    dataRecords.push(bestCandidate);
    model.updateCoverage(bestCandidate);
  }
}
