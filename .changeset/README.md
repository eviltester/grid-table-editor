# Changesets

This repository uses [Changesets](https://github.com/changesets/changesets) for versioning and release notes across workspace packages.

Typical flow:

1. `npx changeset` to create a release note.
2. Merge PR.
3. `npx changeset version` to update versions.
4. `npx changeset publish` to publish packages.
