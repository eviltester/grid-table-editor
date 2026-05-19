function expectMeaningfulString(result) {
  expect(typeof result).toBe('string');
  expect(result.trim().length).toBeGreaterThan(0);
}

export { expectMeaningfulString };
