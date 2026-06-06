# Generator Runtime Simplification Map

This document is the concrete follow-on plan for simplifying the generator-side runtime and page assembly.

It exists because the current generator path is technically decomposed, but still too indirect for a clean MVC-style component architecture. The runtime currently relies on multiple layers of shells, facades, bridges, dependency builders, callback builders, and page-config composers that mostly forward to one another.

The goal of this map is not to remove all helper functions. The goal is to collapse helper stacks that no longer create a meaningful architectural boundary.

## Problem Statement

The current generator path is more layered than the app-side component model it was meant to support.

The main signs of over-indirection are:

- runtime assembly requires multiple "factory of factory" and "shell/facade/bridge" modules before reaching real feature behavior
- several helpers exist only to rename or forward one object into another
- page-config assembly is split across many tiny files that are not meaningful reviewer-facing boundaries
- tests currently protect some of those intermediate seams even when those seams do not represent intentional product architecture

The result is a system that is more decomposed than a monolith, but less understandable than a straightforward runtime + page-component composition.

## Current Layer Map

### Runtime boot chain

Today the standalone generator entrypoint flows like this:

1. `data-generator-page-runtime.js`
2. `create-generator-runtime-instance.js`
3. `create-generator-runtime-base-state.js`
4. `create-generator-runtime-shell-config.js`
5. `create-generator-runtime-factories.js`
6. `create-generator-page-runtime-mount-factory.js`
7. `create-generator-runtime-dependencies-factory.js`
8. `create-generator-runtime-shell.js`
9. `create-generator-runtime-core.js`
10. `create-generator-runtime-lifecycle-facade.js`
11. `create-generator-runtime-lifecycle.js`
12. `create-generator-runtime-facade.js`
13. `create-generator-runtime-schema-state.js`

This is the strongest simplification target. Several of these layers only exist to pass the same runtime object through one more level of naming.

### Page config chain

Mounted page creation currently flows like this:

1. `create-generator-page-runtime-mount.js`
2. `create-generator-page-component-runtime-config.js`
3. `create-generator-page-component-config-inputs.js`
4. `create-generator-page-component-runtime-dependencies.js`
5. `create-generator-page-component-runtime-callbacks.js`
6. `create-generator-page-component-config.js`
7. `create-generator-page-component-config-dependencies.js`
8. `create-generator-page-component-props.js`
9. `create-generator-page-component-services.js`
10. `create-generator-page-component-callbacks.js`

That chain is too deep for one visible page component. Some of the deeper prop/callback helpers are still useful, but the current stack has too many composition-only pass-throughs.

### Runtime action and view-state cluster

Mounted runtime interaction state currently flows through:

- `create-generator-runtime-interaction-services.js`
- `create-generator-runtime-view-state.js`
- `create-generator-runtime-actions-service.js`

Status:

- the misleading `*Dependencies` and `*Bridge` names are gone from the live action/view-state path
- the remaining work here is further collapse or regrouping only if the surviving services still feel too indirect after schema cleanup

### Schema runtime cluster

The schema runtime previously flowed through:

- `create-generator-runtime-schema-collaborators.js`
- `create-generator-runtime-schema-support-dependencies.js`
- `create-generator-runtime-schema-session-dependencies.js`
- `create-generator-runtime-schema-services.js`
- `create-generator-runtime-schema-adapters.js`
- `generator-schema-runtime-service.js`
- `generator-schema-state-service.js`
- `generator-schema-sync.js`
- `generator-schema-rule-helpers.js`

This cluster mixes several different concerns:

- schema-definition UI support
- schema editing session state
- schema runtime error/status behavior
- schema-to-generation behavior
- helper adapters used only to translate function names

That makes it a good candidate for regrouping around actual responsibilities instead of current refactor seams.

## Concrete Simplification Targets

### Target 1: Collapse the runtime boot chain into one real runtime creator

#### Current state

The runtime entrypoint uses a shell/facade/core/lifecycle stack just to produce one generator runtime object.

#### Target state

Replace the current boot stack with one primary runtime creator:

- `createGeneratorRuntime(...)`

That runtime creator should:

- create base state
- mount the page on `init()`
- destroy mounted state on `destroy()`
- expose the small page-facing API directly
- attach schema editing and generation collaborators directly

#### Keep

- `create-generator-runtime-factory-inputs.js` only if it still honestly owns externally injected parser/sample-schema inputs
- `create-generator-page-runtime-mount.js` only if it remains a real mount-orchestration unit

#### Collapse or delete

- `create-generator-runtime-shell-config.js`
- `create-generator-runtime-factories.js`
- `create-generator-page-runtime-mount-factory.js`
- `create-generator-runtime-dependencies-factory.js`
- `create-generator-runtime-shell.js`
- `create-generator-runtime-core.js`
- `create-generator-runtime-lifecycle-facade.js`
- `create-generator-runtime-facade.js`

#### Expected result

One runtime creator plus a small number of real collaborators, not a chain of wrapper creators.

### Target 2: Collapse the page-config chain into one runtime-to-page mapper

#### Current state

The mounted page config is assembled through several runtime-config, config-input, dependency, and callback wrappers.

#### Target state

Reduce page assembly to:

- `createGeneratorPageRuntimeConfig(runtime)`
- `createGeneratorPageRuntimeMount(...)`

Optionally keep a few meaningful sub-builders where they are truly readable:

- `create-generator-schema-definition-props.js`
- `create-generator-controls-callbacks.js`
- `create-generator-preview-callbacks.js`

#### Collapse or delete

- `create-generator-page-component-runtime-config.js`
- `create-generator-page-component-config-inputs.js`
- `create-generator-page-component-runtime-dependencies.js`
- `create-generator-page-component-runtime-callbacks.js`
- `create-generator-page-component-config.js`
- `create-generator-page-component-config-dependencies.js`

#### Expected result

The mounted runtime should build one page-config object in one obvious place instead of bouncing between config-of-config builders.

### Target 3: Replace "bridge" language where there is no real cross-boundary adaptation

#### Current state

Several runtime helpers are called `bridge` even though they mostly forward runtime calls or translate one object shape into another local object shape.

#### Target state

Use simpler names and shapes based on what the code really is:

- if it owns user-visible actions, make it a service or controller helper
- if it wraps a third-party API, keep it as an adapter
- if it only forwards calls between local objects, inline it

#### Strong collapse candidates

- `create-generator-runtime-actions-service.js`
  - inline only if the direct runtime creator becomes easier to read
- `create-generator-runtime-view-state.js`
  - inline only if runtime/page mount readability improves
- `generator-mounted-page-bridge.js`
  - inline if it is only a mounted-page convenience wrapper

#### Expected result

Fewer "bridge" modules and more plainly named runtime collaborators.

### Target 4: Regroup schema runtime around real responsibilities

#### Current state

Schema runtime assembly is split by refactor step rather than by enduring responsibility.

#### Target state

Regroup schema runtime into a smaller set of meaningful units:

- schema-definition support
- schema editing/session state
- schema generation/runtime behavior

#### Candidate shape

- `createGeneratorSchemaEditingRuntime(...)`
- `createGeneratorSchemaGenerationRuntime(...)`
- `createGeneratorSchemaDefinitionSupport(...)`

#### Collapse or merge candidates

- merge `create-generator-runtime-schema-support-dependencies.js` and `create-generator-runtime-schema-session-dependencies.js`
- merge `create-generator-runtime-schema-collaborators.js` and `create-generator-runtime-schema-services.js` if that produces a clearer final schema responsibility map
- inline or rename `create-generator-runtime-schema-adapters.js` if it only maps parser helpers into local names

#### Expected result

The schema layer should read like feature responsibilities, not like a stack of dependency buckets.

Status:

- completed by replacing the wrapper chain with direct `create-generator-runtime-schema-runtime.js` assembly

### Target 5: Stop splitting helpers that are not reviewer-facing or architecturally durable

#### Current state

Some tiny helpers were extracted mainly to make one file shorter, not because they define a stable boundary.

#### Rule for the next pass

Keep a helper only if at least one of these is true:

- it represents a real visible component boundary
- it owns a real browser/service adapter concern
- it is a reusable pure logic unit with independent value
- it meaningfully improves readability of a still-simple parent file

Otherwise, inline it.

This especially applies to:

- tiny runtime callback mappers
- tiny runtime service dependency mappers
- tiny config-input wrappers
- tiny factory wrappers whose only job is to call one imported function

## Recommended Execution Order

### Pass A: Collapse the runtime boot stack

Do first because it removes the widest shell/facade indirection.

Success criteria:

- standalone generator runtime creation is understandable from one primary module
- `init()` and `destroy()` behavior remain explicit
- no shell/facade/core/lifecycle-facade stack remains

Status:

- completed in the current runtime pass
- replaced with direct `create-generator-runtime.js` wiring from `data-generator-page-runtime.js`

### Pass B: Collapse page-config assembly

Do second because it affects a smaller, contained cluster and will reduce runtime-to-page mental overhead immediately.

Success criteria:

- one obvious runtime-to-page config builder
- only meaningful prop/callback helper splits remain

Status:

- completed in the current runtime pass
- replaced with direct `create-generator-page-runtime-config.js` used by `create-generator-page-runtime-mount.js`

### Pass C: Rename or inline runtime action/view-state bridges

Do third because the surviving runtime shape will be clearer after Passes A and B.

Success criteria:

- no misleading `*Dependencies` names for live action objects
- fewer `bridge` names where there is no external adaptation boundary

Status:

- completed for the live action/view-state path
- remaining generator cleanup should now focus on deeper schema regrouping rather than old action/view-state naming

### Pass D: Regroup schema runtime

Do fourth because schema is the densest part of the generator flow and should be simplified after the outer runtime shape is cleaner.

Success criteria:

- schema runtime units are grouped by responsibility, not by refactor history

Status:

- completed in the current runtime pass
- schema support, schema session, schema runtime behavior, and schema state wiring now assemble through direct `create-generator-runtime-schema-runtime.js` wiring
- mounted-page collaborator mapping is now direct inside `create-generator-mounted-page-state.js` instead of going through `generator-mounted-page-bridge.js`

## What To Keep Intentionally

Not everything should be collapsed.

These look like reasonable enduring boundaries today:

- `create-generator-page-component.js`
- `create-generator-page-shell-component.js`
- `create-generator-schema-definition-props.js` if schema-definition prop assembly stays materially complex
- `create-generator-controls-services.js` and `create-generator-preview-services.js` if they continue to isolate real service injection
- `tabulator-grid-adapter.js` in preview, because it is a real third-party adapter boundary

## Short Version

The generator-side runtime should move toward:

- one runtime creator
- one page-mount orchestrator
- one page-config builder
- a small number of real services/adapters
- visible components for page, controls, preview, and schema

It should move away from:

- shell/facade/core stacks
- dependency-builder pyramids
- config-of-config helper chains
- bridge naming for local forwarding layers
