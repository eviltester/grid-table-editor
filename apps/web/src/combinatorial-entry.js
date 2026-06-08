import { PairwiseGenerator } from '../../../packages/core/js/data_generation/n-wise/pairwiseGenerator.js';
import { BachAllPairsGenerator } from '../../../packages/core/js/data_generation/n-wise/bachAllPairsGenerator.js';
import { CartesianProductGenerator } from '../../../packages/core/js/data_generation/n-wise/combinationsTestDataGenerator.js';
import { NWiseGenerator } from '../../../packages/core/js/data_generation/n-wise/nWiseGenerator.js';
import { EnumParser } from '../../../packages/core/js/data_generation/utils/enumParser.js';
import { isExplicitEnumRule } from '../../../packages/core/js/data_generation/utils/enum-rule-detection.js';
import {
  CombinationAlgorithm,
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
  CombinationAlgorithm.CARTESIAN_PRODUCT,
]);

const root = document.getElementById('combinatorial-root');
const schemaEditor = document.getElementById('combinatorial-schema');
const strengthSelect = document.getElementById('combinatorial-strength');
const strategiesRoot = document.getElementById('combinatorial-strategies');
const generateButton = document.getElementById('generate-combinatorial');
const statusElement = document.getElementById('combinatorial-status');
const summaryRoot = document.getElementById('combinatorial-summary');
const detailsRoot = document.getElementById('combinatorial-details');

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

function setStatus(message, severity = 'info') {
  statusElement.textContent = message;
  statusElement.dataset.severity = severity;
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

function renderSummary(results, parameters, strength) {
  if (results.length === 0) {
    summaryRoot.innerHTML = '<p>No strategy results to show.</p>';
    return;
  }

  const shape = getParameterShape(parameters);
  const rows = results
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

function renderDetails(results) {
  detailsRoot.innerHTML = results
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

function generateCombinatorial() {
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
  const selectedAlgorithms = getSelectedAlgorithms();
  if (selectedAlgorithms.length === 0) {
    setStatus('Select at least one strategy.', 'error');
    return;
  }

  setStatus(`Running ${selectedAlgorithms.length} strategies...`);
  generateButton.disabled = true;

  const results = selectedAlgorithms.map((algorithm) => {
    try {
      return runAlgorithm({ algorithm, parameters, strength });
    } catch (error) {
      return {
        stats: {
          algorithm,
          rowCount: 0,
          totalTuples: 0,
          coveredTuples: 0,
          coveragePercentage: 0,
          runtimeMs: 0,
        },
        records: [],
        error: error.message,
      };
    }
  });

  renderSummary(results, parameters, strength);
  renderDetails(results);
  generateButton.disabled = false;
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
}

schemaEditor.value = DEFAULT_SCHEMA;
renderControls();

schemaEditor.addEventListener('input', renderControls);
strengthSelect.addEventListener('change', renderStrategyCheckboxes);
generateButton.addEventListener('click', generateCombinatorial);

if (root) {
  setStatus('Ready.');
}
