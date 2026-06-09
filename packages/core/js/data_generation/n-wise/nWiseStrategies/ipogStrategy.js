export function generateIpogRecords(context) {
  const { model } = context;
  let activeParameterCount = context.strength;
  context.dataRecords.length = 0;
  context.dataRecords.push(...model.generateFullFactorialRecords(activeParameterCount));

  for (let parameterIndex = activeParameterCount; parameterIndex < context.parameters.length; parameterIndex += 1) {
    activeParameterCount = parameterIndex + 1;
    const slice = model.createParameterCoverageSlice(activeParameterCount, parameterIndex);
    const parameterValues = context.parameters[parameterIndex]?.values;

    if (!Array.isArray(parameterValues) || parameterValues.length === 0) {
      continue;
    }

    for (const record of context.dataRecords) {
      let bestValue = parameterValues[0];
      let bestScore = Number.NEGATIVE_INFINITY;

      for (const value of parameterValues) {
        record.set(context.parameters[parameterIndex].name, value);
        const score = model.calculateCoverageScore(record, slice.targets, slice.coverage);
        if (score > bestScore) {
          bestScore = score;
          bestValue = value;
        }
      }

      record.set(context.parameters[parameterIndex].name, bestValue);
      model.updateCoverage(record, slice.targets, slice.coverage);
    }

    for (const target of slice.targets) {
      const covered = slice.coverage.get(target.key);
      for (const tuple of target.tuples) {
        if (covered.has(tuple.key)) {
          continue;
        }

        const record = model.createDefaultRecord(activeParameterCount);
        target.subset.forEach((targetParameterIndex, valueIndex) => {
          record.set(context.parameters[targetParameterIndex].name, tuple.values[valueIndex]);
        });
        context.dataRecords.push(record);
        model.updateCoverage(record, slice.targets, slice.coverage);
      }
    }
  }

  model.resetCoverage();
  for (const record of context.dataRecords) {
    model.updateCoverage(record);
  }
}
