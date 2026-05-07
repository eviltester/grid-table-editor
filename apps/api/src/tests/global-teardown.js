/**
 * Global teardown for API tests
 * This runs once after all API tests complete
 */

async function globalTeardown() {
  console.log('🧹 Cleaning up API tests environment...');

  // Any global cleanup tasks can go here
  // For example: cleaning test databases, removing temp files, etc.

  console.log('✅ API tests cleanup complete');
}

export default globalTeardown;
