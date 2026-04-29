# Agent Working Agreement

## Definition of Done for Code Changes

Before reporting a coding task as complete, run:

```bash
npm run verify:local
```

and include the result status in the final update.

If verification fails:

- do not mark the task as done
- report the failing command(s)
- include the relevant error summary
- fix issues where possible, then re-run verification

## Notes

- `verify:local` is the canonical local gate for this repo.
- CI uses `verify:ci` and branch protection should require CI to pass before merge.
