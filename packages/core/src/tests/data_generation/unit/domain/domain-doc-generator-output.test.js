import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(testDir, '../../../../../../..');

describe('domain docs generator output', () => {
  test('renders JSON example return values as literal inline code (no HTML brace entities)', () => {
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

      expect(locationDoc).toMatch(/- `\{"name":"[^"]+","alpha2":"[a-z]{2}","alpha3":"[a-z]{3}"\}`/);
      expect(locationDoc).not.toContain('&#123;"name":');
    } finally {
      fs.rmSync(docsDir, { recursive: true, force: true });
    }
  });
});
