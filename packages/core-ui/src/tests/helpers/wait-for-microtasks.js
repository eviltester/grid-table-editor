export async function waitForMicrotaskAssertions(assertions, { maxMicrotasks = 12 } = {}) {
  let lastError;

  for (let index = 0; index < maxMicrotasks; index += 1) {
    await Promise.resolve();

    try {
      return assertions();
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) {
    throw lastError;
  }
}
