export function toInlineCode(value) {
  const text = String(value ?? '')
    .replaceAll('\r\n', '\n')
    .replaceAll('\r', '\n')
    .replaceAll('\n', '\\n');
  const backtickRuns = text.match(/`+/g) || [];
  const longestRun = backtickRuns.reduce((max, run) => Math.max(max, run.length), 0);
  const fence = '`'.repeat(longestRun + 1);
  return `${fence}${text}${fence}`;
}
