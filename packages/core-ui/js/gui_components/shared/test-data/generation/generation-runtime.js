/*
 * Responsibilities:
 * - Shared runtime helpers for generated value normalization and table construction.
 * - Shared pairwise and n-wise generation adapters used by app and generator page flows.
 * - Shared parsing for non-negative count inputs.
 */

function normaliseGeneratedCellValue(value) {
  if (value === undefined || value === null) {
    return '';
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return value;
}

function normaliseGeneratedRow(row = []) {
  if (!Array.isArray(row)) {
    return [];
  }
  return row.map((value) => normaliseGeneratedCellValue(value));
}

function getGeneratorGenerationErrors(generator) {
  return typeof generator?.generationErrors === 'function' ? generator.generationErrors() : [];
}

function createTableFromGenerator({ rowCount = 0, generator, GenericDataTableClass }) {
  const outputTable = new GenericDataTableClass();
  outputTable.setHeaders(generator.generateHeadersArray());
  outputTable.__generationErrors = [];
  outputTable.__generationStats = { generatedRows: 0, failedRows: 0 };
  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    const generatedRow = generator.generateRow();
    const generationErrors = getGeneratorGenerationErrors(generator);
    if (generationErrors.length > 0) {
      outputTable.__generationErrors = generationErrors;
      outputTable.__generationStats.failedRows += 1;
      break;
    }
    outputTable.appendDataRow(normaliseGeneratedRow(generatedRow));
    outputTable.__generationStats.generatedRows += 1;
  }
  return outputTable;
}

function createPairwiseTableFromGenerator({
  generator,
  PairwiseTestDataGeneratorClass,
  GenericDataTableClass,
  faker,
  RandExp,
}) {
  try {
    const pairwiseGenerator = new PairwiseTestDataGeneratorClass(faker, RandExp);
    const initResult = pairwiseGenerator.initializeFromRules(generator.testDataRules(), {
      constraints: typeof generator.schemaConstraints === 'function' ? generator.schemaConstraints() : [],
    });

    if (initResult.isError) {
      console.error('Pairwise initialization error:', initResult.errorMessage);
      return null;
    }

    const dataResult = pairwiseGenerator.generateAllDataRecordsAsRows();
    if (dataResult.isError) {
      console.error('Pairwise generation error:', dataResult.errorMessage);
      return null;
    }

    const dataTable = new GenericDataTableClass();
    const [headers, ...rows] = dataResult.data.data;
    dataTable.setHeaders(headers);
    rows.forEach((row) => {
      dataTable.appendDataRow(row);
    });

    return dataTable;
  } catch (error) {
    console.error('Pairwise table creation error:', error);
    return null;
  }
}

function createCombinationsTableFromGenerator({
  generator,
  CombinationsTestDataGeneratorClass,
  GenericDataTableClass,
  faker,
  RandExp,
  options = {},
}) {
  try {
    const combinationsGenerator = new CombinationsTestDataGeneratorClass(faker, RandExp);
    const initResult = combinationsGenerator.initializeFromRules(generator.testDataRules(), {
      ...options,
      constraints: typeof generator.schemaConstraints === 'function' ? generator.schemaConstraints() : [],
    });

    if (initResult.isError) {
      console.error('Combinations initialization error:', initResult.errorMessage);
      return null;
    }

    const dataResult = combinationsGenerator.generateAllDataRecordsAsRows();
    if (dataResult.isError) {
      console.error('Combinations generation error:', dataResult.errorMessage);
      return null;
    }

    const dataTable = new GenericDataTableClass();
    const [headers, ...rows] = dataResult.data.data;
    dataTable.setHeaders(headers);
    rows.forEach((row) => {
      dataTable.appendDataRow(row);
    });

    dataTable.__combinationStats = dataResult.data.stats || null;
    return dataTable;
  } catch (error) {
    console.error('Combinations table creation error:', error);
    return null;
  }
}

function parseNonNegativeCount(value, { min = 0, max = null } = {}) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return { value: min, valid: false };
  }
  let normalized = Math.max(min, parsed);
  if (Number.isFinite(max)) {
    normalized = Math.min(normalized, max);
  }
  return { value: normalized, valid: true };
}

export {
  normaliseGeneratedCellValue,
  normaliseGeneratedRow,
  getGeneratorGenerationErrors,
  createTableFromGenerator,
  createPairwiseTableFromGenerator,
  createCombinationsTableFromGenerator,
  parseNonNegativeCount,
};
