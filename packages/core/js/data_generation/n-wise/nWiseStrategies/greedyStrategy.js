import { completeRecord } from './shared.js';

export function generateGreedyRecords(context) {
  const { model, dataRecords } = context;

  while (!model.isFullyCovered()) {
    const uncovered = model.getFirstUncoveredTuple();
    if (!uncovered) {
      break;
    }

    const record = completeRecord(model, context.parameters, model.createRecordFromTuple(uncovered));
    dataRecords.push(record);
    model.updateCoverage(record);
  }
}
