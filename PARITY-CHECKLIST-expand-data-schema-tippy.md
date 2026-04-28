# Branch Parity Checklist: expand-data-schema-tippy -> master

Date: 2026-04-28

## Scope

This checklist tracks parity between `expand-data-schema-tippy` and current `master`.

## Commit-Level Status

- [ ] b67968a improved faker documentation generation (not merged by history)
- [ ] 2bbbd13 better faker messages (not merged by history)
- [ ] c6acceb added xml export (not merged by history)
- [ ] b3678cf added docs and jsonl (not merged by history)
- [ ] d14ba5e copy preview (not merged by history)
- [ ] 7aee5db sql (not merged by history)
- [ ] 24e2c43 sql docs (not merged by history)
- [ ] 777ca5d updated version (not merged by history)
- [ ] d723c03 literal (not merged by history)

## Functional Parity Checks

- [x] JSONL export support exists in application code
- [x] XML export support exists in application code
- [x] SQL export support exists in application code
- [x] Faker command help metadata generation exists
- [x] Literal help and faker help tooltip rendering exists

## Documentation Parity Checks

- [x] docs-src/docs/030-data-formats/jsonl/010-jsonl.md restored
- [x] docs-src/docs/030-data-formats/jsonl/options.md restored
- [x] docs-src/docs/030-data-formats/xml/010-xml.md restored
- [x] docs-src/docs/030-data-formats/xml/options.md restored
- [x] docs-src/docs/030-data-formats/sql/010-sql.md restored
- [x] docs-src/docs/030-data-formats/sql/options.md restored
- [x] docs-src/docs/040-test-data/040-literal-test-data.md restored

## Remaining Non-Parity Areas (Investigate/Decide)

- [ ] app.html differs
- [ ] generator.html differs
- [ ] js/data_formats/file-types.js differs
- [ ] js/grid/exporter.js differs
- [ ] js/gui_components/data-generator-page.js differs
- [ ] js/gui_components/exportControls.js differs
- [ ] js/gui_components/faker-command-help-metadata.js differs
- [ ] js/gui_components/import-export-controls.js differs
- [ ] js/gui_components/options_panels/options-json-panel.js differs
- [ ] js/gui_components/tabbed-text-control.js differs
- [ ] scripts/generate-faker-help.js differs
- [ ] tests/* differs in multiple files
- [ ] docs-src/docs/040-test-data/010-test-data-generation.md differs
- [ ] docs-src/docs/040-test-data/020-regex-test-data.md differs
- [ ] docs-src/docs/040-test-data/030-faker-test-data.mdx differs
- [ ] docs-src/docs/050-misc/related_tools.md differs

## Notes

- This checklist separates history parity from functional parity.
- Current state indicates key functionality has been restored on `master` even though commit history is not fully merged.
- Use this file as the source of truth for further branch-parity decisions.
