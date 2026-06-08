# N-Wise Algorithm Benchmark Report

This report compares the current JavaScript implementations of `greedy`, `pict-gcd`, `aetg`, and `ipog` using the same deterministic seed.

The benchmark data comes from:

```bash
node --expose-gc scripts/generate-n-wise-algorithm-report.mjs
```

Memory notes:

- `heap delta` and `RSS delta` are process-level before/after deltas from `process.memoryUsage()` around a single generator run.
- They are useful for comparison, but they are not true peak-memory measurements.
- Negative deltas can happen when V8 reclaims memory during or just after a run.

## Summary

- `aetg` usually produces the fewest rows, especially in the larger `8x4` cases, but it is consistently the slowest and often the heaviest on memory.
- `pict-gcd` is the best balance in this implementation: it stays close to `aetg` on row count while being much faster.
- `ipog` is usually the fastest strategy, but this pragmatic implementation tends to create the most rows as strength rises.
- `greedy` remains straightforward and predictable, but it becomes less competitive on both rows and runtime in the larger cases.

## Scenario 8x3

| Algorithm | Strength | Rows | Runtime ms | Heap delta MiB | RSS delta MiB | Coverage % |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `greedy` | 2 | 22 | 6 | 0.94 | 1.82 | 100.0 |
| `pict-gcd` | 2 | 16 | 5 | 0.61 | -0.20 | 100.0 |
| `aetg` | 2 | 16 | 29 | 1.01 | 0.23 | 100.0 |
| `ipog` | 2 | 21 | 2 | 0.62 | 0.44 | 100.0 |
| `greedy` | 3 | 71 | 18 | 1.58 | 1.99 | 100.0 |
| `pict-gcd` | 3 | 60 | 38 | -0.03 | 0.01 | 100.0 |
| `aetg` | 3 | 56 | 171 | 3.67 | 4.32 | 100.0 |
| `ipog` | 3 | 86 | 10 | 3.31 | 0.19 | 100.0 |
| `greedy` | 4 | 211 | 54 | 0.01 | 1.50 | 100.0 |
| `pict-gcd` | 4 | 192 | 74 | 2.55 | 8.13 | 100.0 |
| `aetg` | 4 | 185 | 731 | 1.91 | 0.48 | 100.0 |
| `ipog` | 4 | 282 | 44 | 10.78 | 3.92 | 100.0 |
| `greedy` | 5 | 588 | 173 | 14.50 | 13.28 | 100.0 |
| `pict-gcd` | 5 | 559 | 187 | 4.55 | 0.04 | 100.0 |
| `aetg` | 5 | 526 | 1851 | 13.08 | 1.84 | 100.0 |
| `ipog` | 5 | 775 | 102 | 11.49 | 0.59 | 100.0 |
| `greedy` | 6 | 1475 | 263 | 1.50 | 0.84 | 100.0 |
| `pict-gcd` | 6 | 1481 | 222 | 10.77 | 0.43 | 100.0 |
| `aetg` | 6 | 1416 | 2402 | 11.06 | 2.85 | 100.0 |
| `ipog` | 6 | 1860 | 103 | 14.05 | 0.52 | 100.0 |

## Scenario 8x4

| Algorithm | Strength | Rows | Runtime ms | Heap delta MiB | RSS delta MiB | Coverage % |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `greedy` | 2 | 46 | 8 | 7.64 | 0.04 | 100.0 |
| `pict-gcd` | 2 | 27 | 10 | 10.51 | -0.02 | 100.0 |
| `aetg` | 2 | 26 | 48 | 12.34 | -0.30 | 100.0 |
| `ipog` | 2 | 46 | 3 | 2.51 | 0.03 | 100.0 |
| `greedy` | 3 | 255 | 60 | 11.83 | -0.73 | 100.0 |
| `pict-gcd` | 3 | 140 | 59 | 10.27 | -0.81 | 100.0 |
| `aetg` | 3 | 131 | 464 | 13.90 | -0.28 | 100.0 |
| `ipog` | 3 | 283 | 29 | 1.03 | -0.09 | 100.0 |
| `greedy` | 4 | 1152 | 463 | 12.57 | 0.24 | 100.0 |
| `pict-gcd` | 4 | 617 | 260 | 1.75 | 0.07 | 100.0 |
| `aetg` | 4 | 577 | 2568 | 7.16 | 0.02 | 100.0 |
| `ipog` | 4 | 1277 | 127 | 5.50 | -0.21 | 100.0 |
| `greedy` | 5 | 3954 | 3576 | 2.79 | 7.23 | 100.0 |
| `pict-gcd` | 5 | 2400 | 923 | 6.91 | -0.83 | 100.0 |
| `aetg` | 5 | 2252 | 10495 | 11.91 | 7.93 | 100.0 |
| `ipog` | 5 | 4375 | 440 | 18.94 | 1.73 | 100.0 |
| `greedy` | 6 | 11200 | 15555 | 17.50 | 11.70 | 100.0 |
| `pict-gcd` | 6 | 8400 | 2753 | 20.47 | -0.96 | 100.0 |
| `aetg` | 6 | 7974 | 40176 | 47.01 | 21.03 | 100.0 |
| `ipog` | 6 | 12748 | 766 | 54.53 | 16.09 | 100.0 |
