export function toInlineCode(value) {
  const normalizedValue =
    typeof value === 'bigint'
      ? `${value}n`
      : value !== null && typeof value === 'object'
        ? JSON.stringify(value)
        : String(value);
  const text = normalizedValue.replaceAll('\r\n', '\n').replaceAll('\r', '\n').replaceAll('\n', '\\n');
  const backtickRuns = text.match(/`+/g) || [];
  const longestRun = backtickRuns.reduce((max, run) => Math.max(max, run.length), 0);
  const fence = '`'.repeat(longestRun + 1);
  return `${fence}${text}${fence}`;
}
