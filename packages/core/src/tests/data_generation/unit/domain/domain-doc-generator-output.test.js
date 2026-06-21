import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(testDir, '../../../../../../..');

describe('domain docs generator output', () => {
  test('omits hidden object-returning methods from generated docs', () => {
    const docsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'anywaydata-domain-docs-'));
    try {
      execSync('node scripts/generate-domain-docs.mjs', {
        cwd: repoRoot,
        stdio: 'pipe',
        encoding: 'utf8',
        env: {
          ...process.env,
          ANYWAYDATA_DOMAIN_DOCS_OUT_DIR: docsDir,
        },
      });

      const locationDocName = fs.readdirSync(docsDir).find((name) => /-location\.md$/.test(name));
      expect(locationDocName).toBeDefined();

      const locationDoc = fs.readFileSync(path.join(docsDir, locationDocName), 'utf8');

      expect(locationDoc).not.toContain('### `location.language`');
      expect(locationDoc).not.toContain('&#123;"name":');
    } finally {
      fs.rmSync(docsDir, { recursive: true, force: true });
    }
  });

  test('renders each structured usage example with description, code, and return value together', () => {
    const docsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'anywaydata-domain-docs-'));
    try {
      execSync('node scripts/generate-domain-docs.mjs', {
        cwd: repoRoot,
        stdio: 'pipe',
        encoding: 'utf8',
        env: {
          ...process.env,
          ANYWAYDATA_DOMAIN_DOCS_OUT_DIR: docsDir,
        },
      });

      const literalDocName = fs.readdirSync(docsDir).find((name) => /-literal\.md$/.test(name));
      expect(literalDocName).toBeDefined();

      const literalDoc = fs.readFileSync(path.join(docsDir, literalDocName), 'utf8');
      const literalSection = literalDoc.split('### `literal.value`')[1];
      expect(literalSection).toBeDefined();

      expect(literalSection).toContain('Examples:');
      expect(literalSection).toContain('Shows literal.value in use.');
      expect(literalSection).toContain('```txt\nliteral.value(value="Pending")\n```');
      expect(literalSection).toContain('Returns: `Pending`');
      expect(literalSection).not.toContain('Command picker:');
      expect(literalSection).not.toContain('Params field:');
      expect(literalSection).not.toContain('Example return values:');
      expect(literalSection).not.toContain('Type-in examples (named params):');
      expect(literalSection.indexOf('Shows literal.value in use.')).toBeLessThan(
        literalSection.indexOf('```txt\nliteral.value(value="Pending")\n```')
      );
      expect(literalSection.indexOf('```txt\nliteral.value(value="Pending")\n```')).toBeLessThan(
        literalSection.indexOf('Returns: `Pending`')
      );
    } finally {
      fs.rmSync(docsDir, { recursive: true, force: true });
    }
  });

  test('omits self-referential anywaydata docs links while keeping faker docs links', () => {
    const docsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'anywaydata-domain-docs-'));
    try {
      execSync('node scripts/generate-domain-docs.mjs', {
        cwd: repoRoot,
        stdio: 'pipe',
        encoding: 'utf8',
        env: {
          ...process.env,
          ANYWAYDATA_DOMAIN_DOCS_OUT_DIR: docsDir,
        },
      });

      const phoneDocName = fs.readdirSync(docsDir).find((name) => /-phone\.md$/.test(name));
      expect(phoneDocName).toBeDefined();

      const phoneDoc = fs.readFileSync(path.join(docsDir, phoneDocName), 'utf8');

      expect(phoneDoc).not.toContain('- Docs: [https://anywaydata.com/docs/');
      expect(phoneDoc).toContain('- Faker docs: [https://fakerjs.dev/api/phone]');
    } finally {
      fs.rmSync(docsDir, { recursive: true, force: true });
    }
  });

  test('documents internet.httpMethod as a custom AnywayData implementation with no per-method faker link', () => {
    const docsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'anywaydata-domain-docs-'));
    try {
      execSync('node scripts/generate-domain-docs.mjs', {
        cwd: repoRoot,
        stdio: 'pipe',
        encoding: 'utf8',
        env: {
          ...process.env,
          ANYWAYDATA_DOMAIN_DOCS_OUT_DIR: docsDir,
        },
      });

      const internetDocName = fs.readdirSync(docsDir).find((name) => /-internet\.md$/.test(name));
      expect(internetDocName).toBeDefined();

      const internetDoc = fs.readFileSync(path.join(docsDir, internetDocName), 'utf8');
      const httpMethodSection = internetDoc
        .split('### `internet.httpMethod`')[1]
        ?.split('### `internet.httpStatusCode`')[0];
      expect(httpMethodSection).toBeDefined();

      expect(internetDoc).toContain(
        'The `internet` domain mostly maps domain keywords to faker-backed generators, but `internet.httpMethod` is implemented directly by AnywayData.'
      );
      expect(httpMethodSection).toContain('Returns a random HTTP request method from an AnywayData-defined pool');
      expect(httpMethodSection).toContain('generation throws if exclusions remove every available method.');
      expect(httpMethodSection).not.toContain('- Faker docs:');
    } finally {
      fs.rmSync(docsDir, { recursive: true, force: true });
    }
  });

  test('omits non-scalar domain methods while keeping flattened scalar methods in generated docs', () => {
    const docsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'anywaydata-domain-docs-'));
    try {
      execSync('node scripts/generate-domain-docs.mjs', {
        cwd: repoRoot,
        stdio: 'pipe',
        encoding: 'utf8',
        env: {
          ...process.env,
          ANYWAYDATA_DOMAIN_DOCS_OUT_DIR: docsDir,
        },
      });

      const airlineDocName = fs.readdirSync(docsDir).find((name) => /-airline\.md$/.test(name));
      const financeDocName = fs.readdirSync(docsDir).find((name) => /-finance\.md$/.test(name));
      const locationDocName = fs.readdirSync(docsDir).find((name) => /-location\.md$/.test(name));
      const dateDocName = fs.readdirSync(docsDir).find((name) => /-date\.md$/.test(name));
      const scienceDocName = fs.readdirSync(docsDir).find((name) => /-science\.md$/.test(name));

      expect(airlineDocName).toBeDefined();
      expect(financeDocName).toBeDefined();
      expect(locationDocName).toBeDefined();
      expect(dateDocName).toBeDefined();
      expect(scienceDocName).toBeDefined();

      const airlineDoc = fs.readFileSync(path.join(docsDir, airlineDocName), 'utf8');
      const financeDoc = fs.readFileSync(path.join(docsDir, financeDocName), 'utf8');
      const locationDoc = fs.readFileSync(path.join(docsDir, locationDocName), 'utf8');
      const dateDoc = fs.readFileSync(path.join(docsDir, dateDocName), 'utf8');
      const scienceDoc = fs.readFileSync(path.join(docsDir, scienceDocName), 'utf8');

      expect(airlineDoc).not.toContain('### `airline.airplane`');
      expect(airlineDoc).toContain('### `airplane.name`');
      expect(airlineDoc).toContain('### `airplane.iataTypeCode`');

      expect(financeDoc).not.toContain('### `finance.currency`');
      expect(financeDoc).toContain('### `finance.currencyCode`');

      expect(locationDoc).not.toContain('### `location.language`');
      expect(locationDoc).not.toContain('### `location.nearbyGPSCoordinate`');
      expect(locationDoc).toContain('### `location.city`');
      expect(locationDoc).toContain('### `language.name`');
      expect(locationDoc).toContain('### `language.alpha2`');
      expect(locationDoc).toContain('### `language.alpha3`');

      expect(dateDoc).not.toContain('### `date.betweens`');
      expect(dateDoc).toContain('### `date.between`');

      expect(scienceDoc).not.toContain('### `science.unit`');
      expect(scienceDoc).toContain('### `unit.name`');
      expect(scienceDoc).toContain('### `unit.symbol`');
    } finally {
      fs.rmSync(docsDir, { recursive: true, force: true });
    }
  });
});
