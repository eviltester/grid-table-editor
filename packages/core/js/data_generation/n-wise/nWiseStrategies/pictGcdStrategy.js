import { pickRandom } from '../nWiseShared.js';
import { completeRecord, selectMostOpenTarget, selectRandomOpenTuple } from './shared.js';

function selectBestPictBinding(context, record) {
  let bestBindings = [];
  let bestScore = -1;

  for (const parameter of context.parameters) {
    if (record.has(parameter.name)) {
      continue;
    }

    for (const value of parameter.values) {
      record.set(parameter.name, value);
      const score = context.model.calculateCoverageScore(record);
      record.delete(parameter.name);

      if (score > bestScore) {
        bestScore = score;
        bestBindings = [{ parameter, value }];
      } else if (score === bestScore) {
        bestBindings.push({ parameter, value });
      }
    }
  }

  return pickRandom(bestBindings, context.random);
}

export function generatePictGcdRecords(context) {
  const { model, dataRecords } = context;

  while (!model.isFullyCovered()) {
    let record = new Map();

    while (record.size < context.parameters.length) {
      if (record.size === 0) {
        const seedTuple = selectRandomOpenTuple(model, selectMostOpenTarget(model, context.random), context.random);
        if (!seedTuple) {
          break;
        }
        record = model.createRecordFromTuple(seedTuple);
      } else {
        const bestBinding = selectBestPictBinding(context, record);
        if (!bestBinding) {
          break;
        }
        record.set(bestBinding.parameter.name, bestBinding.value);
      }
    }

    record = completeRecord(model, context.parameters, record);
    dataRecords.push(record);
    model.updateCoverage(record);
  }
}
