import fs from 'node:fs';
import path from 'node:path';
import {
  appOnlyInlineHelpEntries,
  sharedInlineHelpEntries,
} from '../../../../../../packages/core-ui/js/help/inline-help-content.js';

function collectTemplateHelpTags(content) {
  const tags = [];
  const spanMatches = content.matchAll(/<span\b[^>]*\bclass=(['"])[^'"]*helpicon[^'"]*\1[^>]*>/g);
  for (const match of spanMatches) {
    const tag = match[0];
    const helpIdMatch = tag.match(/data-help=(['"])(.*?)\1/);
    if (!helpIdMatch) {
      continue;
    }
    const helpTextMatch = tag.match(/data-help-text=(['"])(.*?)\1/);
    tags.push({
      helpId: helpIdMatch[2],
      hasInlineText: Boolean(helpTextMatch && helpTextMatch[2].trim().length > 0),
    });
  }
  return tags;
}

describe('help content coverage', () => {
  const repoRoot = process.cwd();
  const helpMapApp = { ...sharedInlineHelpEntries, ...appOnlyInlineHelpEntries };

  test('app html help icons resolve to inline text or help entries', () => {
    const appHtml = fs.readFileSync(path.join(repoRoot, 'apps', 'web', 'app.html'), 'utf8');
    const tags = collectTemplateHelpTags(appHtml);

    const missing = tags.filter((tag) => !tag.hasInlineText && !Object.hasOwn(helpMapApp, tag.helpId));
    expect(missing).toEqual([]);
  });

  test('generator html help icons resolve to inline text or help entries', () => {
    const generatorHtml = fs.readFileSync(path.join(repoRoot, 'apps', 'web', 'generator.html'), 'utf8');
    const tags = collectTemplateHelpTags(generatorHtml);

    const missing = tags.filter((tag) => !tag.hasInlineText && !Object.hasOwn(sharedInlineHelpEntries, tag.helpId));
    expect(missing).toEqual([]);
  });

  test('options panel help icons resolve to inline text or help entries', () => {
    const optionsDir = path.join(repoRoot, 'packages', 'core-ui', 'js', 'gui_components', 'options_panels');
    const panelFiles = fs.readdirSync(optionsDir).filter((filename) => filename.endsWith('.js'));

    const missing = [];
    panelFiles.forEach((filename) => {
      const fullPath = path.join(optionsDir, filename);
      const source = fs.readFileSync(fullPath, 'utf8');
      const usesCentralTipAssignment =
        source.includes('applySharedOptionTips(') ||
        source.includes('applyUiPanelOnlyTips(') ||
        source.includes('refreshHelpTipsForSelectedFramework(');
      const tags = collectTemplateHelpTags(source);
      tags.forEach((tag) => {
        // Template string placeholder handled by explicit known keys below.
        if (tag.helpId.includes('${')) {
          return;
        }
        if (tag.hasInlineText) {
          return;
        }
        if (Object.hasOwn(helpMapApp, tag.helpId)) {
          return;
        }
        if (usesCentralTipAssignment) {
          return;
        }
        missing.push({ filename, helpId: tag.helpId });
      });
    });

    expect(sharedInlineHelpEntries['json-options']).toBeDefined();
    expect(sharedInlineHelpEntries['jsonl-options']).toBeDefined();
    expect(missing).toEqual([]);
  });
});
