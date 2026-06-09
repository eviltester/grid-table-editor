import { PairwiseGenerator } from '../../../packages/core/js/data_generation/n-wise/pairwiseGenerator.js';
import { BachAllPairsGenerator } from '../../../packages/core/js/data_generation/n-wise/bachAllPairsGenerator.js';
import { CartesianProductGenerator } from '../../../packages/core/js/data_generation/n-wise/combinationsTestDataGenerator.js';
import { NWiseCoverageModel } from '../../../packages/core/js/data_generation/n-wise/nWiseCoverageModel.js';
import { NWiseGenerator } from '../../../packages/core/js/data_generation/n-wise/nWiseGenerator.js';
import { EnumParser } from '../../../packages/core/js/data_generation/utils/enumParser.js';
import { isExplicitEnumRule } from '../../../packages/core/js/data_generation/utils/enum-rule-detection.js';
import { createConfirmDialogService } from '../../../packages/core-ui/js/gui_components/shared/dialog-services/confirm-dialog-service.js';
import {
  CombinationAlgorithm,
  calculateCartesianProductRows,
  COMBINATION_STRATEGIES,
  getAvailableStrengths,
  getStrategiesForStrength,
} from '../../../packages/core-ui/js/gui_components/generator/generation/n-wise-generation-options.js';

const DEFAULT_SCHEMA = `Browser
enum("Chrome","Firefox","Safari")
OS
enum("Windows","macOS","Linux")
Viewport
enum("Desktop","Tablet","Mobile")
Auth
enum("Guest","User","Admin")`;

const DEFAULT_SELECTED_ALGORITHMS = new Set([
  CombinationAlgorithm.BACH_ALLPAIRS,
  CombinationAlgorithm.PAIRWISE,
  CombinationAlgorithm.GREEDY,
  CombinationAlgorithm.PICT_GCD,
  CombinationAlgorithm.AETG,
  CombinationAlgorithm.IPOG,
]);

const CARTESIAN_CONFIRM_THRESHOLD = 10000;

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function normaliseAlgorithmLabel(algorithm) {
  const strategy = COMBINATION_STRATEGIES.find((item) => item.id === algorithm);
  return strategy?.label || algorithm;
}

function formatNumber(value) {
  if (value === Number.POSITIVE_INFINITY) {
    return 'Too large to estimate';
  }
  if (value === Number.NEGATIVE_INFINITY) {
    return 'Too small to estimate';
  }
  return Number.isFinite(value) ? Number(value).toLocaleString('en-US') : 'Unknown';
}

function parseEnumParameters(schemaText) {
  const contentLines = String(schemaText || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'));
  const parameters = [];
  const errors = [];

  for (let index = 0; index < contentLines.length; index += 2) {
    const name = contentLines[index];
    const ruleSpec = contentLines[index + 1];
    if (!name || !ruleSpec) {
      errors.push('Schema must use pairs of lines: column name followed by generation rule.');
      break;
    }
    if (!isExplicitEnumRule(ruleSpec)) {
      continue;
    }
    try {
      const values = EnumParser.extractEnumValues(ruleSpec).filter((value) => String(value).length > 0);
      if (values.length > 0) {
        parameters.push({ name, values });
      }
    } catch (error) {
      errors.push(`${name}: ${error.message}`);
    }
  }

  const names = new Set();
  for (const parameter of parameters) {
    if (names.has(parameter.name)) {
      errors.push(`Enum parameter names must be unique: ${parameter.name}`);
    }
    names.add(parameter.name);
  }

  return { parameters, errors };
}

function getParameterShape(parameters) {
  return `${parameters.length} parameters x ${parameters.map((parameter) => parameter.values.length).join('/')}`;
}

function getValueCounts(parameters) {
  return parameters.map((parameter) => parameter.values.length);
}

function calculateTheoreticalMinimumRows(parameters, strength) {
  if (!Array.isArray(parameters) || parameters.length === 0) {
    return 0;
  }
  const model = new NWiseCoverageModel(parameters, strength);
  return model.coverageTargets.reduce((largestTupleSet, target) => Math.max(largestTupleSet, target.tuples.length), 0);
}

function calculateRequiredTupleCount(parameters, strength) {
  if (!Array.isArray(parameters) || parameters.length === 0) {
    return 0;
  }
  const model = new NWiseCoverageModel(parameters, strength);
  return model.getTotalTargetTupleCount();
}

function calculateEstimateDetails(parameters, strength) {
  if (!Array.isArray(parameters) || parameters.length === 0) {
    return {
      theoreticalMinimumRows: 0,
      totalRequiredTuples: 0,
    };
  }

  const model = new NWiseCoverageModel(parameters, strength);
  return {
    theoreticalMinimumRows: model.coverageTargets.reduce(
      (largestTupleSet, target) => Math.max(largestTupleSet, target.tuples.length),
      0
    ),
    totalRequiredTuples: model.getTotalTargetTupleCount(),
  };
}

function buildEstimateSummary(parameters, strength) {
  const cartesianRowCount = calculateCartesianProductRows(getValueCounts(parameters));
  const { theoreticalMinimumRows, totalRequiredTuples } =
    parameters.length >= strength && strength >= 1
      ? calculateEstimateDetails(parameters, strength)
      : { theoreticalMinimumRows: 0, totalRequiredTuples: 0 };

  return {
    cartesianRowCount,
    theoreticalMinimumRows,
    totalRequiredTuples,
  };
}

function sortResultsByRowCount(results) {
  return [...results].sort((left, right) => {
    const leftHasError = Boolean(left?.error);
    const rightHasError = Boolean(right?.error);
    if (leftHasError !== rightHasError) {
      return leftHasError ? 1 : -1;
    }

    const leftRows = Number.isFinite(left?.stats?.rowCount) ? left.stats.rowCount : Number.MAX_SAFE_INTEGER;
    const rightRows = Number.isFinite(right?.stats?.rowCount) ? right.stats.rowCount : Number.MAX_SAFE_INTEGER;
    if (leftRows !== rightRows) {
      return leftRows - rightRows;
    }

    const leftRuntime = Number.isFinite(left?.stats?.runtimeMs) ? left.stats.runtimeMs : Number.MAX_SAFE_INTEGER;
    const rightRuntime = Number.isFinite(right?.stats?.runtimeMs) ? right.stats.runtimeMs : Number.MAX_SAFE_INTEGER;
    return leftRuntime - rightRuntime;
  });
}

async function filterAlgorithmsForCartesianConfirmation({
  algorithms,
  parameters,
  requestConfirm,
  threshold = CARTESIAN_CONFIRM_THRESHOLD,
}) {
  const selectedAlgorithms = Array.isArray(algorithms) ? [...algorithms] : [];
  if (!selectedAlgorithms.includes(CombinationAlgorithm.CARTESIAN_PRODUCT)) {
    return selectedAlgorithms;
  }

  const cartesianRowCount = calculateCartesianProductRows(getValueCounts(parameters));
  if (typeof requestConfirm !== 'function') {
    return selectedAlgorithms;
  }
  if (Number.isFinite(cartesianRowCount) && cartesianRowCount <= threshold) {
    return selectedAlgorithms;
  }

  const confirmed = await requestConfirm({
    title: 'Cartesian product generation',
    message: `You included cartesian product generation. Are you sure? this will generate ${formatNumber(cartesianRowCount)} data rows.`,
    okLabel: 'Run cartesian product',
    cancelLabel: 'Skip cartesian product',
  });

  return confirmed
    ? selectedAlgorithms
    : selectedAlgorithms.filter((algorithm) => algorithm !== CombinationAlgorithm.CARTESIAN_PRODUCT);
}

function createIdleResultStats(algorithm) {
  return {
    algorithm,
    rowCount: 0,
    totalTuples: 0,
    coveredTuples: 0,
    coveragePercentage: 0,
    runtimeMs: 0,
  };
}

function normalisePairwiseStats({ generator, algorithm, runtimeMs }) {
  const stats = generator.getCoverageStats();
  return {
    algorithm,
    rowCount: stats.totalRecords,
    totalTuples: stats.totalPairs,
    coveredTuples: stats.coveredPairs,
    coveragePercentage: stats.coveragePercentage,
    runtimeMs,
  };
}

function runAlgorithm({ algorithm, parameters, strength }) {
  const startedAt = performance.now();
  if ([CombinationAlgorithm.PAIRWISE, CombinationAlgorithm.BACH_ALLPAIRS].includes(algorithm)) {
    if (strength !== 2) {
      throw new Error('Pairwise algorithms only support strength 2.');
    }
    const generator =
      algorithm === CombinationAlgorithm.BACH_ALLPAIRS
        ? new BachAllPairsGenerator(parameters, { seed: 1 })
        : new PairwiseGenerator(parameters);
    generator.generateDataSet();
    const runtimeMs = performance.now() - startedAt;
    return {
      stats: normalisePairwiseStats({ generator, algorithm, runtimeMs }),
      records: generator.exportDataRecords(),
    };
  }

  if (algorithm === CombinationAlgorithm.CARTESIAN_PRODUCT) {
    const generator = new CartesianProductGenerator(parameters, { strength });
    generator.generateDataSet();
    const runtimeMs = performance.now() - startedAt;
    return {
      stats: {
        ...generator.getBenchmarkStats(),
        runtimeMs,
      },
      records: generator.exportDataRecords(),
    };
  }

  const generator = new NWiseGenerator(parameters, {
    strength,
    algorithm,
    seed: 1,
    candidateCount: 20,
    runs: algorithm === CombinationAlgorithm.AETG ? 3 : 1,
  });
  generator.generateDataSet();
  return {
    stats: generator.getBenchmarkStats(),
    records: generator.exportDataRecords(),
  };
}

function renderRecordsTable(records) {
  if (!Array.isArray(records) || records.length === 0) {
    return '<p>No generated rows.</p>';
  }
  const headers = Object.keys(records[0]);
  const headerCells = headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('');
  const bodyRows = records
    .map((record) => `<tr>${headers.map((header) => `<td>${escapeHtml(record[header])}</td>`).join('')}</tr>`)
    .join('');

  return `<div class="combinatorial-table-wrapper">
    <table class="combinatorial-table combinatorial-data-table">
      <thead><tr>${headerCells}</tr></thead>
      <tbody>${bodyRows}</tbody>
    </table>
  </div>`;
}

function createCombinatorialPage({
  schemaEditor,
  strengthSelect,
  strategiesRoot,
  estimatesRoot,
  generateButton,
  progressElement,
  statusElement,
  summaryRoot,
  detailsRoot,
  requestConfirm,
}) {
  function setStatus(message, severity = 'info') {
    statusElement.textContent = message;
    statusElement.dataset.severity = severity;
  }

  function setProgress(message = '', { running = false } = {}) {
    progressElement.hidden = !message;
    progressElement.textContent = message;
    progressElement.dataset.state = running ? 'running' : 'idle';
  }

  function getSelectedStrength() {
    return Number.parseInt(strengthSelect.value, 10);
  }

  function getSelectedAlgorithms() {
    return Array.from(strategiesRoot.querySelectorAll('input[type="checkbox"]:checked'))
      .map((input) => input.value)
      .filter(Boolean);
  }

  function renderStrengthOptions() {
    const { parameters } = parseEnumParameters(schemaEditor.value);
    const currentStrength = getSelectedStrength();
    const strengths = getAvailableStrengths(parameters.length);
    strengthSelect.innerHTML = strengths
      .map((strength) => `<option value="${strength}">${strength}-wise</option>`)
      .join('');

    if (strengths.length > 0) {
      strengthSelect.value = strengths.includes(currentStrength) ? String(currentStrength) : String(strengths[0]);
    }
    strengthSelect.disabled = strengths.length === 0;
  }

  function renderEstimateSummary() {
    const { parameters } = parseEnumParameters(schemaEditor.value);
    const strength = getSelectedStrength();
    if (parameters.length < 2 || !Number.isInteger(strength)) {
      estimatesRoot.innerHTML =
        '<p>Add at least two enum fields to see cartesian size and n-wise coverage estimates.</p>';
      return;
    }

    const summary = buildEstimateSummary(parameters, strength);
    estimatesRoot.innerHTML = `
      <div><strong>Cartesian product:</strong> ${escapeHtml(formatNumber(summary.cartesianRowCount))} rows</div>
      <div><strong>Theoretical minimum:</strong> at least ${escapeHtml(formatNumber(summary.theoreticalMinimumRows))} rows</div>
      <div><strong>${escapeHtml(`${strength}-wise`)}</strong> requires ${escapeHtml(
        formatNumber(summary.totalRequiredTuples)
      )} target tuples.</div>
    `;
  }

  function renderStrategyCheckboxes() {
    const strength = getSelectedStrength();
    const { parameters } = parseEnumParameters(schemaEditor.value);
    const availableStrategies = getStrategiesForStrength(strength, { valueCounts: getValueCounts(parameters) });
    const selectedAlgorithms = new Set(getSelectedAlgorithms());
    if (selectedAlgorithms.size === 0) {
      for (const algorithm of DEFAULT_SELECTED_ALGORITHMS) {
        selectedAlgorithms.add(algorithm);
      }
    }

    strategiesRoot.innerHTML = availableStrategies
      .map((strategy) => {
        const checked = selectedAlgorithms.has(strategy.id) ? ' checked' : '';
        return `<label class="combinatorial-strategy-checkbox">
          <input type="checkbox" value="${escapeHtml(strategy.id)}"${checked}>
          <span class="combinatorial-strategy-name">${escapeHtml(strategy.label)}</span>
          <span class="combinatorial-strategy-description">${escapeHtml(strategy.description)}</span>
        </label>`;
      })
      .join('');
  }

  function renderControls() {
    renderStrengthOptions();
    renderStrategyCheckboxes();
    renderEstimateSummary();
  }

  function renderSummary(results, parameters, strength) {
    if (results.length === 0) {
      summaryRoot.innerHTML = '<p>No strategy results to show.</p>';
      return;
    }

    const shape = getParameterShape(parameters);
    const rows = sortResultsByRowCount(results)
      .map(({ stats, error }) => {
        const coverage = Number.isFinite(stats?.coveragePercentage) ? stats.coveragePercentage.toFixed(1) : '0.0';
        const runtime = Number.isFinite(stats?.runtimeMs) ? stats.runtimeMs.toFixed(2) : '0.00';
        return `<tr>
          <td>${escapeHtml(normaliseAlgorithmLabel(stats.algorithm))}</td>
          <td>${strength}</td>
          <td>${escapeHtml(shape)}</td>
          <td>${error ? 'n/a' : escapeHtml(stats.rowCount)}</td>
          <td>${error ? 'n/a' : escapeHtml(stats.totalTuples)}</td>
          <td>${error ? 'n/a' : escapeHtml(stats.coveredTuples)}</td>
          <td>${error ? 'n/a' : coverage}</td>
          <td>${error ? 'n/a' : runtime}</td>
          <td>${error ? escapeHtml(error) : 'OK'}</td>
        </tr>`;
      })
      .join('');

    summaryRoot.innerHTML = `<div class="combinatorial-table-wrapper">
      <table class="combinatorial-table">
        <thead>
          <tr>
            <th>Strategy</th>
            <th>Strength</th>
            <th>Shape</th>
            <th>Rows</th>
            <th>Total required tuples</th>
            <th>Covered tuples</th>
            <th>Coverage %</th>
            <th>Runtime ms</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
  }

  function renderDetails(results) {
    detailsRoot.innerHTML = sortResultsByRowCount(results)
      .map(({ stats, records, error }) => {
        const runtime = Number.isFinite(stats?.runtimeMs) ? stats.runtimeMs.toFixed(2) : '0.00';
        const title = `${normaliseAlgorithmLabel(stats.algorithm)} - ${error ? 'failed' : `${stats.rowCount} rows`} - ${runtime} ms`;
        return `<details class="combinatorial-run-details">
          <summary>${escapeHtml(title)}</summary>
          ${error ? `<p class="combinatorial-error">${escapeHtml(error)}</p>` : renderRecordsTable(records)}
        </details>`;
      })
      .join('');
  }

  async function yieldToBrowser() {
    await new Promise((resolve) => {
      (globalThis.requestAnimationFrame || globalThis.setTimeout)(() => resolve(), 0);
    });
  }

  function syncSelectedAlgorithms(algorithms) {
    const selectedSet = new Set(algorithms);
    for (const input of strategiesRoot.querySelectorAll('input[type="checkbox"]')) {
      input.checked = selectedSet.has(input.value);
    }
  }

  async function generateCombinatorial() {
    const { parameters, errors } = parseEnumParameters(schemaEditor.value);
    summaryRoot.innerHTML = '';
    detailsRoot.innerHTML = '';

    if (errors.length > 0) {
      setStatus(errors.join(' '), 'error');
      return;
    }
    if (parameters.length < 2) {
      setStatus('Add at least two enum fields to compare combinatorial strategies.', 'error');
      return;
    }

    renderControls();
    const strength = getSelectedStrength();
    let selectedAlgorithms = getSelectedAlgorithms();
    if (selectedAlgorithms.length === 0) {
      setStatus('Select at least one strategy.', 'error');
      return;
    }

    selectedAlgorithms = await filterAlgorithmsForCartesianConfirmation({
      algorithms: selectedAlgorithms,
      parameters,
      requestConfirm,
    });
    syncSelectedAlgorithms(selectedAlgorithms);

    if (selectedAlgorithms.length === 0) {
      setStatus('Cartesian product run cancelled. No strategies remain selected.', 'warning');
      setProgress('');
      return;
    }

    generateButton.disabled = true;
    setStatus(`Running ${selectedAlgorithms.length} strategies...`);
    setProgress(`Running 0/${selectedAlgorithms.length} strategies...`, { running: true });

    const results = [];
    try {
      for (let index = 0; index < selectedAlgorithms.length; index += 1) {
        const algorithm = selectedAlgorithms[index];
        const label = normaliseAlgorithmLabel(algorithm);
        setProgress(`Running ${index + 1}/${selectedAlgorithms.length}: ${label}`, { running: true });
        setStatus(`Switching to ${label}...`);
        await yieldToBrowser();

        try {
          results.push(runAlgorithm({ algorithm, parameters, strength }));
        } catch (error) {
          results.push({
            stats: createIdleResultStats(algorithm),
            records: [],
            error: error.message,
          });
        }

        renderSummary(results, parameters, strength);
        renderDetails(results);
        await yieldToBrowser();
      }

      const failedRuns = results.filter((result) => result.error).length;
      if (failedRuns > 0) {
        const successfulRuns = results.length - failedRuns;
        const severity = successfulRuns > 0 ? 'warning' : 'error';
        setStatus(
          `Completed ${results.length} strategy runs for ${strength}-wise coverage with ${failedRuns} failure${
            failedRuns === 1 ? '' : 's'
          }.`,
          severity
        );
        return;
      }

      setStatus(`Completed ${results.length} strategy runs for ${strength}-wise coverage.`, 'success');
    } finally {
      generateButton.disabled = false;
      setProgress('');
    }
  }

  function initialise() {
    schemaEditor.value = DEFAULT_SCHEMA;
    renderControls();
    setStatus('Ready.');
    setProgress('');
    schemaEditor.addEventListener('input', renderControls);
    strengthSelect.addEventListener('change', () => {
      renderStrategyCheckboxes();
      renderEstimateSummary();
    });
    generateButton.addEventListener('click', () => {
      void generateCombinatorial();
    });
  }

  return {
    initialise,
    generateCombinatorial,
    renderControls,
    renderEstimateSummary,
    setStatus,
    setProgress,
  };
}

function initCombinatorialPage({ documentObj = globalThis.document } = {}) {
  if (!documentObj) {
    return null;
  }

  const root = documentObj.getElementById('combinatorial-root');
  const schemaEditor = documentObj.getElementById('combinatorial-schema');
  const strengthSelect = documentObj.getElementById('combinatorial-strength');
  const strategiesRoot = documentObj.getElementById('combinatorial-strategies');
  const estimatesRoot = documentObj.getElementById('combinatorial-estimates');
  const generateButton = documentObj.getElementById('generate-combinatorial');
  const progressElement = documentObj.getElementById('combinatorial-progress');
  const statusElement = documentObj.getElementById('combinatorial-status');
  const summaryRoot = documentObj.getElementById('combinatorial-summary');
  const detailsRoot = documentObj.getElementById('combinatorial-details');

  if (
    !root ||
    !schemaEditor ||
    !strengthSelect ||
    !strategiesRoot ||
    !estimatesRoot ||
    !generateButton ||
    !progressElement ||
    !statusElement ||
    !summaryRoot ||
    !detailsRoot
  ) {
    return null;
  }

  const confirmDialogService = createConfirmDialogService({ documentObj });
  const page = createCombinatorialPage({
    schemaEditor,
    strengthSelect,
    strategiesRoot,
    estimatesRoot,
    generateButton,
    progressElement,
    statusElement,
    summaryRoot,
    detailsRoot,
    requestConfirm: confirmDialogService.requestConfirm,
  });
  page.initialise();
  return page;
}

if (globalThis.document) {
  initCombinatorialPage();
}

export {
  buildEstimateSummary,
  calculateRequiredTupleCount,
  calculateTheoreticalMinimumRows,
  createCombinatorialPage,
  filterAlgorithmsForCartesianConfirmation,
  initCombinatorialPage,
  parseEnumParameters,
  sortResultsByRowCount,
};
