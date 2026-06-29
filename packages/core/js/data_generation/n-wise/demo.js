import { PairwiseGenerator } from './pairwiseGenerator.js';
import { PairwiseTestDataGenerator } from './pairwiseTestDataGenerator.js';
import { TestDataRule, RuleType } from '../testDataRule.js';

/**
 * Demo: Pairwise Combinatorial Matching Data Generation
 *
 * This demo shows how pairwise matching can dramatically reduce the number of data records
 * while maintaining comprehensive coverage of parameter interactions.
 */

console.log('🧪 Pairwise Combinatorial Matching Data Demo\n');

// Example 1: E-commerce Product Testing
console.log('=== Example 1: E-commerce Product Testing ===');
const ecommerceParams = [
  { name: 'Category', values: ['Electronics', 'Clothing', 'Books', 'Sports'] },
  { name: 'PriceRange', values: ['Under $25', '$25-$100', '$100-$500', 'Over $500'] },
  { name: 'Shipping', values: ['Standard', 'Express', 'Overnight'] },
  { name: 'PaymentMethod', values: ['Credit Card', 'PayPal', 'Gift Card', 'Buy Now Pay Later'] },
  { name: 'UserType', values: ['Guest', 'Member', 'Premium'] },
];

const ecommerceGenerator = new PairwiseGenerator(ecommerceParams);
const ecommerceDataRecords = ecommerceGenerator.generateDataSet();
const fullCartesian = 4 * 4 * 3 * 4 * 3; // 576 combinations

console.log(`Full Cartesian Product: ${fullCartesian} data records`);
console.log(`Pairwise Generated: ${ecommerceDataRecords.length} data records`);
console.log(`Reduction: ${((1 - ecommerceDataRecords.length / fullCartesian) * 100).toFixed(1)}%`);

const ecommerceStats = ecommerceGenerator.getCoverageStats();
console.log(
  `Pairwise Coverage: ${ecommerceStats.coveragePercentage.toFixed(1)}% of ${ecommerceStats.totalPairs} pairs`
);

console.log('\nFirst 5 data records:');
ecommerceGenerator
  .exportDataRecords()
  .slice(0, 5)
  .forEach((record, i) => {
    console.log(`${i + 1}: ${JSON.stringify(record, null, 0)}`);
  });

// Example 2: Mobile App Configuration Testing
console.log('\n\n=== Example 2: Mobile App Configuration ===');
const mobileParams = [
  { name: 'Platform', values: ['iOS', 'Android'] },
  { name: 'Version', values: ['Latest', 'Previous', 'Legacy'] },
  { name: 'DeviceType', values: ['Phone', 'Tablet'] },
  { name: 'Orientation', values: ['Portrait', 'Landscape'] },
  { name: 'NetworkType', values: ['WiFi', '4G', '5G', 'Offline'] },
  { name: 'Theme', values: ['Light', 'Dark', 'Auto'] },
];

const mobileGenerator = new PairwiseGenerator(mobileParams);
const mobileDataRecords = mobileGenerator.generateDataSet();
const mobileCartesian = 2 * 3 * 2 * 2 * 4 * 3; // 288 combinations

console.log(`Full Cartesian Product: ${mobileCartesian} data records`);
console.log(`Pairwise Generated: ${mobileDataRecords.length} data records`);
console.log(`Reduction: ${((1 - mobileDataRecords.length / mobileCartesian) * 100).toFixed(1)}%`);

const mobileStats = mobileGenerator.getCoverageStats();
console.log(`Pairwise Coverage: ${mobileStats.coveragePercentage.toFixed(1)}%`);

// Example 3: Integration with TestDataRule system
console.log('\n\n=== Example 3: Mixed Rule Types ===');
// Only ENUM rules participate in pairwise combinations
// Other rule types generate random values per row
const mixedRules = [
  new TestDataRule('Browser', 'Chrome,Firefox,Safari'), // ENUM - pairwise
  new TestDataRule('Theme', 'Light,Dark'), // ENUM - pairwise
  new TestDataRule('AppName', 'MyApp'), // LITERAL - same value every row
  new TestDataRule('IsEnabled', ''), // BOOLEAN - random per row
  new TestDataRule('UserID', 'user.id'), // FAKER - random per row
];

mixedRules[0].setType(RuleType.ENUM);
mixedRules[1].setType(RuleType.ENUM);
mixedRules[2].setType(RuleType.LITERAL);
mixedRules[3].setType(RuleType.BOOLEAN);
mixedRules[4].setType(RuleType.FAKER);

const mixedGenerator = new PairwiseTestDataGenerator();
const mixedResult = mixedGenerator.initializeFromRules(mixedRules);

if (!mixedResult.isError) {
  const mixedData = mixedGenerator.generateAllDataRecordsAsRows();
  console.log(`Generated ${mixedData.data.data.length - 1} data records`);
  console.log('Pairwise combinations for ENUM rules (Browser×Theme):');

  const dataRows = mixedData.data.data.slice(1); // Skip headers
  dataRows.slice(0, 6).forEach((row, index) => {
    console.log(
      `Row ${index + 1}: Browser=${row[0]}, Theme=${row[1]}, AppName=${row[2]}, IsEnabled=${row[3]}, UserID=${row[4]}`
    );
  });

  console.log(`\nAll ${3 * 2} Browser×Theme pairs are covered with ${dataRows.length} records`);
}

// Create rules using the existing TestDataRule format with ENUM types
const testRules = [
  new TestDataRule('Browser', 'Chrome,Firefox,Safari,Edge'),
  new TestDataRule('OS', 'Windows,macOS,Linux'),
  new TestDataRule('DeviceType', 'Desktop,Mobile,Tablet'),
  new TestDataRule('UserRole', 'Admin,Editor,Viewer,Guest'),
];

// Set rule types to enum for pairwise generation
testRules.forEach((rule) => {
  rule.setType(RuleType.ENUM);
});

const pairwiseGenerator = new PairwiseTestDataGenerator(null, null, {
  enableLogging: true,
});

const initResult = pairwiseGenerator.initializeFromRules(testRules);
if (!initResult.isError) {
  const dataResult = pairwiseGenerator.generateAllDataRecordsAsRows();

  console.log('Generated test data in tabular format:');
  console.log('Headers:', dataResult.data.data[0].join(' | '));
  console.log('---');

  // Show first few rows
  dataResult.data.data.slice(1, 6).forEach((row, i) => {
    console.log(`Row ${i + 1}: ${row.join(' | ')}`);
  });

  console.log(`\nTotal: ${dataResult.data.data.length - 1} data records`);
  console.log(`Coverage: ${dataResult.data.stats.coveragePercentage.toFixed(1)}%`);
} else {
  console.log('Error:', initResult.data);
}

// Example 5: Performance comparison with large parameter space
console.log('\n\n=== Example 5: Performance with Large Parameter Space ===');

const largeParams = [
  { name: 'Server', values: ['Server1', 'Server2', 'Server3', 'Server4', 'Server5'] },
  { name: 'Database', values: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'] },
  { name: 'Framework', values: ['React', 'Vue', 'Angular', 'Svelte'] },
  { name: 'Language', values: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go'] },
  { name: 'Environment', values: ['Development', 'Staging', 'Production'] },
  { name: 'Region', values: ['US-East', 'US-West', 'EU', 'Asia'] },
  { name: 'LoadLevel', values: ['Low', 'Medium', 'High'] },
];

console.log('Testing with 7 parameters (5×4×4×5×3×4×3 = 14,400 combinations)...');

const startTime = Date.now();
const largeGenerator = new PairwiseGenerator(largeParams);
const largeDataRecords = largeGenerator.generateDataSet();
const endTime = Date.now();

const largeCartesian = 5 * 4 * 4 * 5 * 3 * 4 * 3;
console.log(`Full Cartesian: ${largeCartesian.toLocaleString()} data records`);
console.log(`Pairwise: ${largeDataRecords.length} data records`);
console.log(`Reduction: ${((1 - largeDataRecords.length / largeCartesian) * 100).toFixed(1)}%`);
console.log(`Generation time: ${endTime - startTime}ms`);

const largeStats = largeGenerator.getCoverageStats();
console.log(
  `Coverage: ${largeStats.coveragePercentage.toFixed(2)}% of ${largeStats.totalPairs.toLocaleString()} pairs`
);

// Example 5: Demonstrating pair coverage validation
console.log('\n\n=== Example 6: Validating Pair Coverage ===');

const simpleParams = [
  { name: 'A', values: ['A1', 'A2'] },
  { name: 'B', values: ['B1', 'B2'] },
  { name: 'C', values: ['C1', 'C2'] },
];

const simpleGenerator = new PairwiseGenerator(simpleParams);
const simpleDataRecords = simpleGenerator.generateDataSet();

console.log('Parameters:', simpleParams.map((p) => `${p.name}: [${p.values.join(', ')}]`).join(', '));
console.log(`Generated ${simpleDataRecords.length} data records:\n`);

const exported = simpleGenerator.exportDataRecords();
exported.forEach((record, i) => {
  console.log(`Record ${i + 1}: A=${record.A}, B=${record.B}, C=${record.C}`);
});

// Manually verify pairs are covered
console.log('\nPair coverage verification:');
const aPairs = new Set();
const bPairs = new Set();
const cPairs = new Set();

exported.forEach((record) => {
  aPairs.add(`A-B: ${record.A}-${record.B}`);
  bPairs.add(`B-C: ${record.B}-${record.C}`);
  cPairs.add(`A-C: ${record.A}-${record.C}`);
});

console.log('A-B pairs covered:', Array.from(aPairs).join(', '));
console.log('B-C pairs covered:', Array.from(bPairs).join(', '));
console.log('A-C pairs covered:', Array.from(cPairs).join(', '));

console.log('\n Pairwise Demo Complete');
