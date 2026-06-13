import { parseDate as parseNaturalDate } from 'chrono-node';
import {
  addDays,
  addHours,
  addMilliseconds,
  addMinutes,
  addMonths,
  addSeconds,
  addWeeks,
  addYears,
  isValid,
  parse,
  parseISO,
} from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

const DEFAULT_OUTPUT_FORMAT = 'iso8601';
const DEFAULT_STEP_TYPE = 'seconds';
const DEFAULT_STEP_VALUE = 1;
const ISO_OUTPUT_ALIASES = new Set(['iso', 'iso8601', 'iso-8601']);
const STEP_TYPE_NORMALISERS = Object.freeze({
  millisecond: 'milliseconds',
  milliseconds: 'milliseconds',
  second: 'seconds',
  seconds: 'seconds',
  minute: 'minutes',
  minutes: 'minutes',
  hour: 'hours',
  hours: 'hours',
  day: 'days',
  days: 'days',
  week: 'weeks',
  weeks: 'weeks',
  month: 'months',
  months: 'months',
  year: 'years',
  years: 'years',
});

function cloneDate(value) {
  return new Date(value.getTime());
}

function toUtcDatePreservingClock(dateValue) {
  return new Date(
    Date.UTC(
      dateValue.getFullYear(),
      dateValue.getMonth(),
      dateValue.getDate(),
      dateValue.getHours(),
      dateValue.getMinutes(),
      dateValue.getSeconds(),
      dateValue.getMilliseconds()
    )
  );
}

function isIsoLikeDateString(value) {
  return /^\d{4}-\d{2}-\d{2}(?:[T\s].*)?$/.test(String(value || '').trim());
}

function ensureValidDate(dateValue, description) {
  if (!isValid(dateValue)) {
    throw new Error(`Invalid ${description}.`);
  }
  return dateValue;
}

function normaliseStepType(stepType) {
  const raw = String(stepType || DEFAULT_STEP_TYPE)
    .trim()
    .toLowerCase();
  const normalised = STEP_TYPE_NORMALISERS[raw];
  if (!normalised) {
    throw new Error(
      'Invalid argument for type: expected milliseconds, seconds, minutes, hours, days, weeks, months, or years.'
    );
  }
  return normalised;
}

function getNumericArg(value, argName) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Invalid argument for ${argName}: expected a number.`);
  }
  return value;
}

function resolveNow(executionContext = {}) {
  if (executionContext.runStartedAt instanceof Date) {
    return cloneDate(executionContext.runStartedAt);
  }
  if (typeof executionContext.nowProvider === 'function') {
    const provided = executionContext.nowProvider();
    if (provided instanceof Date) {
      return cloneDate(provided);
    }
  }
  return new Date();
}

function resolveStartDate(startValue, inputFormat, fallbackNow) {
  if (startValue instanceof Date) {
    return ensureValidDate(cloneDate(startValue), 'start date');
  }

  if (typeof startValue === 'number') {
    return ensureValidDate(new Date(startValue), 'start date');
  }

  if (typeof startValue === 'undefined') {
    return cloneDate(fallbackNow);
  }

  const startText = String(startValue || '').trim();
  if (!startText) {
    return cloneDate(fallbackNow);
  }

  if (typeof inputFormat === 'string' && inputFormat.trim().length > 0) {
    const parsedWithFormat = ensureValidDate(parse(startText, inputFormat, fallbackNow), 'start date');
    return toUtcDatePreservingClock(parsedWithFormat);
  }

  if (isIsoLikeDateString(startText)) {
    return ensureValidDate(parseISO(startText), 'start date');
  }

  const naturalDate = parseNaturalDate(startText, fallbackNow, { forwardDate: false });
  if (naturalDate instanceof Date) {
    return toUtcDatePreservingClock(ensureValidDate(naturalDate, 'start date'));
  }

  return ensureValidDate(new Date(startText), 'start date');
}

function addStep(dateValue, amount, stepType) {
  switch (stepType) {
    case 'milliseconds':
      return addMilliseconds(dateValue, amount);
    case 'seconds':
      return addSeconds(dateValue, amount);
    case 'minutes':
      return addMinutes(dateValue, amount);
    case 'hours':
      return addHours(dateValue, amount);
    case 'days':
      return addDays(dateValue, amount);
    case 'weeks':
      return addWeeks(dateValue, amount);
    case 'months':
      return addMonths(dateValue, amount);
    case 'years':
      return addYears(dateValue, amount);
    default:
      throw new Error(`Unsupported step type: ${stepType}`);
  }
}

function formatTimestamp(dateValue, outputFormat) {
  const formatValue = String(outputFormat || DEFAULT_OUTPUT_FORMAT)
    .trim()
    .toLowerCase();
  if (!formatValue || ISO_OUTPUT_ALIASES.has(formatValue)) {
    return dateValue.toISOString().replace(/\.\d{3}Z$/, 'Z');
  }
  return formatInTimeZone(dateValue, 'UTC', outputFormat);
}

function executeCustomAutoIncrementTimestamp(executionContext = {}) {
  const args = Array.isArray(executionContext.args) ? executionContext.args : [];
  const startArg = args[0];
  const stepArg = args[1];
  const typeArg = args[2];
  const outputFormatArg = args[3];
  const inputFormatArg = args[4];
  const state = executionContext.autoIncrementState || null;
  const rowIndex =
    Number.isInteger(executionContext.rowIndex) && executionContext.rowIndex > 0 ? executionContext.rowIndex : 0;
  const now = resolveNow(executionContext);
  const startDate = resolveStartDate(startArg, inputFormatArg, now);
  const stepValue = typeof stepArg === 'undefined' ? DEFAULT_STEP_VALUE : getNumericArg(stepArg, 'step');
  const stepType = normaliseStepType(typeArg);

  if (state && typeof state === 'object') {
    const currentDate = state.nextDate instanceof Date ? cloneDate(state.nextDate) : startDate;
    state.nextDate = addStep(cloneDate(currentDate), stepValue, stepType);
    return formatTimestamp(currentDate, outputFormatArg);
  }

  const offsetDate = rowIndex === 0 ? startDate : addStep(startDate, stepValue * rowIndex, stepType);
  return formatTimestamp(offsetDate, outputFormatArg);
}

export { executeCustomAutoIncrementTimestamp };
