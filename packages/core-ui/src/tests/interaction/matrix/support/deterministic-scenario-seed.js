import { faker } from '@faker-js/faker';

function hashScenarioId(value) {
  let hash = 0;
  const text = String(value || '');
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }
  return hash || 1;
}

function createSeededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function applyDeterministicScenarioSeed(scenarioId) {
  const seed = hashScenarioId(scenarioId);
  Math.random = createSeededRandom(seed);
  faker.seed(seed);
  return seed;
}

async function withDeterministicScenarioSeed(scenarioId, callback) {
  const previousRandom = Math.random;
  applyDeterministicScenarioSeed(scenarioId);
  try {
    return await callback();
  } finally {
    Math.random = previousRandom;
  }
}

export { applyDeterministicScenarioSeed, withDeterministicScenarioSeed };
