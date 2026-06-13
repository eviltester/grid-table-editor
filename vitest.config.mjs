import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
            storybookUrl: 'http://127.0.0.1:6006',
            storybookScript: 'pnpm exec storybook dev -p 6006 --host 127.0.0.1 --exact-port --ci',
          }),
        ],
        test: {
          name: 'storybook',
          fileParallelism: false,
          maxWorkers: 1,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            api: {
              host: '127.0.0.1',
              port: 51315,
            },
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
