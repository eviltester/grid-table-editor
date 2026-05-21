import { test, describe, expect } from '@jest/globals';
import { faker } from '@faker-js/faker';
import {
  applyDeterministicScenarioSeed,
  withDeterministicScenarioSeed,
} from './support/deterministic-scenario-seed.js';

describe('deterministic scenario seed', () => {
  test('applyDeterministicScenarioSeed returns stable seed and reseeds Math.random and faker', () => {
    const firstSeed = applyDeterministicScenarioSeed('scenario-a');
    const firstRandoms = [Math.random(), Math.random()];
    const firstName = faker.person.firstName();

    const secondSeed = applyDeterministicScenarioSeed('scenario-a');
    const secondRandoms = [Math.random(), Math.random()];
    const secondName = faker.person.firstName();

    expect(firstSeed).toBe(secondSeed);
    expect(secondRandoms).toEqual(firstRandoms);
    expect(secondName).toBe(firstName);
  });

  test('withDeterministicScenarioSeed restores Math.random after callback', async () => {
    const previousRandom = Math.random;

    await withDeterministicScenarioSeed('scenario-b', async () => {
      expect(Math.random).not.toBe(previousRandom);
    });

    expect(Math.random).toBe(previousRandom);
  });
});
