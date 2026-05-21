/*
 * Responsibilities:
 * - Provides shared schema text/row transform helpers for test-data UIs.
 * - Preserves schema token placement while mapping parsed rules into UI rows.
 * - Converts UI row models back to schema text through injected mappers.
 */

function buildLeadingTextLinesByRuleIndex(schemaTokens = []) {
  const leadingTextLinesByRuleIndex = [];
  if (!Array.isArray(schemaTokens) || schemaTokens.length === 0) {
    return leadingTextLinesByRuleIndex;
  }

  let pendingLeadingTextLines = [];
  let ruleIndex = 0;
  schemaTokens.forEach((token) => {
    if (token?.kind === 'comment' || token?.kind === 'blank') {
      pendingLeadingTextLines.push(String(token?.text ?? ''));
      return;
    }
    if (token?.kind === 'rule') {
      leadingTextLinesByRuleIndex[ruleIndex] = pendingLeadingTextLines.slice();
      pendingLeadingTextLines = [];
      ruleIndex += 1;
    }
  });

  return leadingTextLinesByRuleIndex;
}

function mapParsedRulesToRows({ dataRules = [], schemaTokens = [], mapRuleToRow }) {
  const leadingTextLinesByRuleIndex = buildLeadingTextLinesByRuleIndex(schemaTokens);
  return (Array.isArray(dataRules) ? dataRules : []).map((rule, ruleIndex) =>
    mapRuleToRow(rule, leadingTextLinesByRuleIndex[ruleIndex] || [])
  );
}

function buildDataRulesFromGridRows({
  rows = [],
  activeDraftCellEdit = null,
  mapGridRowToSchemaRow,
  buildRuleSpecFromSchemaRow,
}) {
  return (Array.isArray(rows) ? rows : []).map((rowData) => {
    const resolvedRowData =
      activeDraftCellEdit?.rowData === rowData
        ? { ...rowData, [activeDraftCellEdit.field]: activeDraftCellEdit.value }
        : rowData;

    const schemaRow = mapGridRowToSchemaRow(resolvedRowData);
    const ruleLine = buildRuleSpecFromSchemaRow(schemaRow);
    return {
      name: String(resolvedRowData.columnName || ''),
      ruleSpec: String(ruleLine || ''),
      comments: String(resolvedRowData.comments ?? ''),
      leadingTextLines: Array.isArray(resolvedRowData.leadingTextLines)
        ? resolvedRowData.leadingTextLines.map((line) => String(line ?? ''))
        : [],
    };
  });
}

function renderSchemaTextFromGridRows({
  rows = [],
  activeDraftCellEdit = null,
  mapGridRowToSchemaRow,
  buildRuleSpecFromSchemaRow,
  dataRulesToSchemaText,
  schemaTokens = [],
}) {
  const dataRules = buildDataRulesFromGridRows({
    rows,
    activeDraftCellEdit,
    mapGridRowToSchemaRow,
    buildRuleSpecFromSchemaRow,
  });
  const renderResult = dataRulesToSchemaText({ dataRules, schemaTokens });
  return renderResult.text;
}

function schemaRowsToSpec({ schemaRows = [], schemaRowsToDataRules, dataRulesToSchemaText }) {
  const renderResult = dataRulesToSchemaText({
    dataRules: schemaRowsToDataRules({ schemaRows }).dataRules,
  });
  return renderResult.text;
}

function schemaRowsToSpecWithTokens({
  schemaRows = [],
  schemaTokens = [],
  buildDataRuleFromSchemaRow,
  dataRulesToSchemaText,
}) {
  const dataRules = (Array.isArray(schemaRows) ? schemaRows : [])
    .map((row) => buildDataRuleFromSchemaRow(row))
    .filter(Boolean);

  const renderResult = dataRulesToSchemaText({
    dataRules,
    schemaTokens,
  });
  return renderResult.text;
}

function validateSchemaRows({ schemaRows = [], schemaRowsToDataRules }) {
  const result = schemaRowsToDataRules({ schemaRows });
  return { errors: result.errors, rows: result.rows };
}

export {
  mapParsedRulesToRows,
  buildDataRulesFromGridRows,
  renderSchemaTextFromGridRows,
  schemaRowsToSpec,
  schemaRowsToSpecWithTokens,
  validateSchemaRows,
};
