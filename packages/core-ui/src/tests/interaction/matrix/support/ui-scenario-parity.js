import { createAppTestDataInteractionHarness } from './app-test-data-interaction-harness.js';
import { createGeneratorInteractionHarness } from './generator-interaction-harness.js';

function normaliseMultilineText(value) {
  return String(value || '')
    .replace(/\r\n/g, '\n')
    .trim();
}

function createMiniExpect() {
  function assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }

  function buildMatchers(received, isNegated = false) {
    function check(condition, message) {
      assert(isNegated ? !condition : condition, message);
    }

    return {
      get not() {
        return buildMatchers(received, !isNegated);
      },
      toBe(expected) {
        check(
          Object.is(received, expected),
          `Expected ${JSON.stringify(received)} ${isNegated ? 'not ' : ''}to be ${JSON.stringify(expected)}`
        );
      },
      toEqual(expected) {
        check(
          JSON.stringify(received) === JSON.stringify(expected),
          `Expected ${JSON.stringify(received)} ${isNegated ? 'not ' : ''}to equal ${JSON.stringify(expected)}`
        );
      },
      toBeTruthy() {
        check(Boolean(received), `Expected ${JSON.stringify(received)} ${isNegated ? 'not ' : ''}to be truthy`);
      },
      toBeGreaterThan(expected) {
        check(
          Number(received) > Number(expected),
          `Expected ${JSON.stringify(received)} ${isNegated ? 'not ' : ''}to be greater than ${JSON.stringify(expected)}`
        );
      },
      toMatch(expected) {
        const regex = expected instanceof RegExp ? expected : new RegExp(String(expected));
        check(
          regex.test(String(received)),
          `Expected ${JSON.stringify(received)} ${isNegated ? 'not ' : ''}to match ${String(regex)}`
        );
      },
      toContain(expected) {
        check(
          String(received).includes(String(expected)),
          `Expected ${JSON.stringify(received)} ${isNegated ? 'not ' : ''}to contain ${JSON.stringify(expected)}`
        );
      },
    };
  }

  return function expectLike(received) {
    return buildMatchers(received);
  };
}

function hasStructuralParity({ appResult, generatorResult }) {
  if (JSON.stringify(appResult.headers) !== JSON.stringify(generatorResult.headers)) {
    return false;
  }

  if (appResult.rowCount !== generatorResult.rowCount) {
    return false;
  }

  const appPairwiseCsv = normaliseMultilineText(appResult.pairwiseCsv);
  const generatorPairwiseCsv = normaliseMultilineText(generatorResult.pairwiseCsv);
  return appPairwiseCsv === generatorPairwiseCsv;
}

function hasExactPreviewParity({ appResult, generatorResult }) {
  return normaliseMultilineText(appResult.previewCsv) === normaliseMultilineText(generatorResult.previewCsv);
}

async function probeUiScenarioParity(scenarios) {
  const previousExpect = global.expect;
  const previousWarn = console.warn;
  global.expect = createMiniExpect();
  console.warn = () => {};

  const parityByScenarioId = {};

  try {
    for (const scenario of Array.isArray(scenarios) ? scenarios : []) {
      let appHarness = null;
      let generatorHarness = null;
      try {
        appHarness = createAppTestDataInteractionHarness();
        const appResult = await appHarness.runScenario(scenario);
        appHarness.cleanup();
        appHarness = null;

        generatorHarness = createGeneratorInteractionHarness();
        const generatorResult = await generatorHarness.runScenario(scenario);
        generatorHarness.cleanup();
        generatorHarness = null;

        const structuralParity = hasStructuralParity({ appResult, generatorResult });
        const exactPreviewParity = structuralParity && hasExactPreviewParity({ appResult, generatorResult });

        parityByScenarioId[scenario.id] = {
          mode: exactPreviewParity ? 'exact' : 'structural',
          exactPreviewParity,
          structuralParity,
        };
      } catch (error) {
        parityByScenarioId[scenario.id] = {
          mode: 'failed',
          exactPreviewParity: false,
          structuralParity: false,
          error: error?.message || String(error),
        };
      } finally {
        appHarness?.cleanup();
        generatorHarness?.cleanup();
      }
    }
  } finally {
    global.expect = previousExpect;
    console.warn = previousWarn;
  }

  return parityByScenarioId;
}

export { normaliseMultilineText, probeUiScenarioParity };
