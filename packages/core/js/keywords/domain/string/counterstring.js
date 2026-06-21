function reverseString(reverseMe) {
  return String(reverseMe).split('').reverse().join('');
}

function getCounterString(count, delimiter) {
  let counter = Number(count);
  let token = String(delimiter ?? '').trim();
  if (!token) {
    token = '*';
  }
  token = token[0];

  let counterString = '';
  while (counter > 0) {
    let appendThis = `${token}${reverseString(counter.toString())}`;
    if (appendThis.length > counter) {
      appendThis = appendThis.substring(0, counter);
    }
    counterString += appendThis;
    counter -= appendThis.length;
  }
  return reverseString(counterString);
}

function getIntegerArg(value, argName) {
  if (!Number.isInteger(value)) {
    throw new Error(`Invalid argument for ${argName}: expected an integer.`);
  }
  return value;
}

function executeCustomCounterString(executionContext = {}) {
  const args = Array.isArray(executionContext.args) ? executionContext.args : [];
  const hasMin = typeof args[0] !== 'undefined';
  const hasMax = typeof args[1] !== 'undefined';

  const minArg = hasMin ? getIntegerArg(args[0], 'min') : 1;
  const maxArg = hasMax ? getIntegerArg(args[1], 'max') : hasMin ? minArg : 25;

  const lowest = Math.max(1, Math.min(minArg, maxArg));
  const highest = Math.max(1, Math.max(minArg, maxArg));
  const delimiter = typeof args[2] === 'undefined' ? '*' : args[2];

  const length = lowest + Math.floor(Math.random() * (highest - lowest + 1));
  return getCounterString(length, delimiter);
}

export { executeCustomCounterString };
