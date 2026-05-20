import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(testDir, '../../../../../../..');

describe('domain docs generator output', () => {
  test('renders JSON example return values as literal inline code (no HTML brace entities)', () => {
    execSync('node scripts/generate-domain-docs.mjs', {
      cwd: repoRoot,
      stdio: 'pipe',
      encoding: 'utf8',
    });

    const docsDir = path.resolve(repoRoot, 'docs-src/docs/040-test-data/domain');
    const locationDocName = fs.readdirSync(docsDir).find((name) => /-location\.md$/.test(name));
    expect(locationDocName).toBeDefined();

    const locationDoc = fs.readFileSync(path.join(docsDir, locationDocName), 'utf8');

    expect(locationDoc).toContain('- `{"name":"Icelandic","alpha2":"is","alpha3":"isl"}`');
    expect(locationDoc).not.toContain('&#123;"name":"Icelandic","alpha2":"is","alpha3":"isl"&#125;');
  });
});
