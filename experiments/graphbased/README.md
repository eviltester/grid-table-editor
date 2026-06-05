# Graph-Based Storybook Experiment

This folder contains an isolated experiment for deriving a component interaction
graph from Storybook stories and external metadata.

The experiment intentionally does not change existing stories, root
`package.json` scripts, Storybook configuration, or repo test gates.

## Folder Layout

- `metadata/story-interactions.json` contains reviewed interaction metadata keyed
  to Storybook titles and named story exports.
- `metadata/story-interactions.draft.json` is regenerated from story discovery
  and provides graph coverage for every play story that does not have reviewed
  metadata yet. Stories without `play` functions are left unmapped unless they
  have reviewed metadata.
- `scripts/generate-graph.mjs` statically scans Storybook files and writes graph
  outputs.
- `scripts/validate-experiment.mjs` validates metadata and confirms generated
  output is deterministic.
- `scripts/capture-storybook-images.mjs` optionally runs play stories from the
  static Storybook build and captures early/end screenshots.
- `scripts/generate-interactable-graphs.mjs` optionally crawls each static
  Storybook iframe for visible interactable elements and performs one safe
  action per element from a fresh story load.
- `output/story-interaction-graph.json` is the machine-readable graph.
- `output/story-interaction-graph.mmd` is a Mermaid graph for quick review.
- `output/story-interaction-graph.dot` is a Graphviz DOT graph.
- `output/stories/*.mmd` contains one Mermaid graph per mapped story.
- `output/interactable-elements/manifest.json` contains experimental
  runtime-discovered interactable element graphs keyed by story.
- `output/interactable-elements/stories/*.mmd` contains one Mermaid
  interactable-element graph per crawled story.
- `output/coverage-report.md` summarizes metadata coverage and gaps.
- `output/index.html` is a static Storybook-style report with a story hierarchy
  sidebar and clickable per-story graph previews.

## Run

From the repo root:

```bash
node experiments/graphbased/scripts/generate-graph.mjs
node experiments/graphbased/scripts/validate-experiment.mjs
```

The generator performs static discovery only. It does not import story modules,
launch Storybook, or execute `play` functions.

Open `output/index.html` in a browser to browse mapped stories visually. The
HTML report embeds the per-story Mermaid source and renders PNG previews in the
browser when a story is selected. It uses Mermaid from jsDelivr, so the visual
rendering requires network access unless that import is replaced with a local
copy later.

If the browser shows `file:` origin warnings, serve the report locally instead:

```bash
node experiments/graphbased/scripts/serve-report.mjs
```

Then open:

```text
http://127.0.0.1:4177/
```

## Capture Storybook Screenshots

After building Storybook, capture screenshots for all stories:

```bash
pnpm run build-storybook
node experiments/graphbased/scripts/capture-storybook-images.mjs
```

For a quick smoke run:

```bash
$env:STORYBOOK_CAPTURE_LIMIT=2; node experiments/graphbased/scripts/capture-storybook-images.mjs
```

The capture script writes screenshots under
`output/storybook-captures/images/`, writes
`output/storybook-captures/manifest.json`, then regenerates `output/index.html`
so the screenshots appear below each selected story graph. Stories with `play`
functions get early/end screenshots. Stories without `play` functions get one
rendered-state screenshot.

The “start” image is captured as early as possible after the Storybook iframe
loads. Storybook may begin `play` execution immediately, so treat it as an early
render checkpoint rather than a guaranteed pre-interaction snapshot.

## Generate Interactable Element Graphs

After building Storybook, crawl stories for visible enabled controls and build a
one-step action/state graph:

```bash
node experiments/graphbased/scripts/generate-interactable-graphs.mjs
```

For a quick smoke run:

```bash
$env:INTERACTABLE_GRAPH_LIMIT=3; node experiments/graphbased/scripts/generate-interactable-graphs.mjs
```

The crawler serves `storybook-static`, opens each story iframe with Playwright,
records visible interactables such as buttons, links, inputs, selects,
textareas, tabs, checkboxes, radios, and actionable ARIA roles, then reloads the
story before each action. Risky controls are skipped rather than executed when
they look like downloads, file uploads, external links, destructive actions, or
browser-only file flows.

The script writes `output/interactable-elements/manifest.json`,
`output/interactable-elements/stories/*.mmd`, then regenerates `output/index.html`.
The HTML report shows the experimental interactable graph below screenshots and
above the reviewed/draft story interaction graph when crawl data exists.

Useful environment variables:

- `INTERACTABLE_GRAPH_LIMIT` limits how many stories are crawled. `0` means all
  stories.
- `INTERACTABLE_GRAPH_ACTION_LIMIT` limits how many controls are attempted per
  story. The default is `12`.
- `INTERACTABLE_GRAPH_WAIT_MS` controls the wait after each action before the
  resulting interactable state is captured. The default is `650`.
- `INTERACTABLE_GRAPH_PORT` controls the temporary static Storybook server port.
  The default is `4197`.

## Metadata Contract

Metadata entries are keyed by Storybook title and named export:

```json
{
  "title": "Shared/Row Count",
  "story": "NormalizeOnInput",
  "component": "RowCountControl",
  "layer": "shared",
  "initialState": "Minimum-normalizing row count input",
  "interactions": [
    {
      "action": "clear input",
      "from": "value is at minimum",
      "to": "input normalizes back to minimum",
      "assertion": "visible value is 10"
    }
  ]
}
```

The generator joins metadata to discovered stories with this stable key:

```text
<title>/<story export name>
```

Reviewed metadata takes precedence over draft metadata. If a story appears in
both files, the reviewed `story-interactions.json` entry is used in the graph and
HTML report. Draft metadata is intentionally mechanical: it extracts obvious
`userEvent` calls and nearby `expect(...)` assertions from inline `play`
functions. Imported play helpers are marked as helper calls until a later parser
resolves helper source.

## Reading The Report

`output/coverage-report.md` is the fastest human-facing view. It shows:

- how many stories were discovered
- how many stories have interaction metadata
- how many discovered stories contain a `play` function
- metadata gaps where stories have automated interactions but no graph metadata
- stale metadata references that no longer match a story

## Current Limitation

Because metadata lives outside the story files in this first milestone, it can
drift from the actual stories. If this experiment proves useful, the next step
is to move metadata into `parameters.interactionGraph` while keeping these
scripts as the reporting layer.
