/**
 * Global setup for API tests
 * This runs once before all API tests
 */

async function globalSetup() {
  console.log('🚀 Setting up API tests environment...');

  // Any global setup tasks can go here
  // For example: creating test databases, seeding data, etc.

  // Set environment variables for tests
  process.env.NODE_ENV = 'test';
  process.env.API_TEST_MODE = 'true';

  console.log('✅ API tests environment ready');
}

export default globalSetup;
