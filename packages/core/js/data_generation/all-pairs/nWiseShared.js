export const NWiseAlgorithm = Object.freeze({
  GREEDY: 'greedy',
  PICT_GCD: 'pict-gcd',
  AETG: 'aetg',
  IPOG: 'ipog',
  COMPATIBILITY_GRAPH: 'compatibility-graph',
  HYPERGRAPH_VERTEX: 'hypergraph-vertex',
});

export const SUPPORTED_N_WISE_ALGORITHMS = new Set(Object.values(NWiseAlgorithm));

export function createSeededRandom(seed) {
  let state = Number.isInteger(seed) ? seed : 1;
  state %= 2147483647;
  if (state <= 0) {
    state += 2147483646;
  }

  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

export function serializeTuple(values) {
  return JSON.stringify(values);
}

export function deserializeTuple(tupleKey) {
  return JSON.parse(tupleKey);
}

export function combinations(items, size) {
  const results = [];
  const current = [];

  function visit(start) {
    if (current.length === size) {
      results.push([...current]);
      return;
    }

    const remaining = size - current.length;
    for (let index = start; index <= items.length - remaining; index += 1) {
      current.push(items[index]);
      visit(index + 1);
      current.pop();
    }
  }

  visit(0);
  return results;
}

export function cartesianProduct(valueLists) {
  const results = [];
  const current = [];

  function visit(index) {
    if (index === valueLists.length) {
      results.push([...current]);
      return;
    }

    for (const value of valueLists[index]) {
      current.push(value);
      visit(index + 1);
      current.pop();
    }
  }

  visit(0);
  return results;
}

export function pickRandom(items, random) {
  if (items.length === 0) {
    return undefined;
  }
  return items[Math.floor(random() * items.length)];
}

export function cloneRecords(records) {
  return records.map((record) => new Map(record));
}

export function shuffleItems(items, random) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function readProcessMemoryUsage() {
  if (typeof process === 'undefined' || typeof process.memoryUsage !== 'function') {
    return null;
  }
  try {
    return process.memoryUsage();
  } catch {
    return null;
  }
}

export function computeMemoryDelta(before, after, fieldName) {
  if (!before || !after || typeof before[fieldName] !== 'number' || typeof after[fieldName] !== 'number') {
    return null;
  }
  return after[fieldName] - before[fieldName];
}
