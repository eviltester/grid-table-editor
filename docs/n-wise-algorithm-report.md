# N-Wise Algorithm Benchmark Report

These measurements come from the current JavaScript implementations registered in `NWiseAlgorithm`, all using the same deterministic seed.

Memory notes: `heap delta` and `RSS delta` are process-level before/after deltas from `process.memoryUsage()` around a single generator run. They are useful for comparison, but they are not true peak-memory measurements.

## Summary

- `aetg` still tends to produce the smallest row sets in the non-full-factorial cases, but it remains one of the slowest strategies.
- `pict-gcd` remains the best general middle ground in this implementation: its row counts stay competitive without the large runtime spikes seen in `aetg` and the graph-heavy strategies.
- `compatibility-graph` is now the clearer of the two graph-based approaches. It usually lands near the heuristic strategies on row count, but it becomes expensive at strengths `4` and `5`.
- `hypergraph-vertex` is the more direct hypergraph-driven construction. It can match or beat `compatibility-graph` on row count, but it is generally slower and has the largest memory jumps in the harder `6x4` cases.
- `ipog` stays attractive when runtime matters more than row-count minimization.

## Scenario 6x3

Input data set:
- `P1`: `1.1`, `1.2`, `1.3`
- `P2`: `2.1`, `2.2`, `2.3`
- `P3`: `3.1`, `3.2`, `3.3`
- `P4`: `4.1`, `4.2`, `4.3`
- `P5`: `5.1`, `5.2`, `5.3`
- `P6`: `6.1`, `6.2`, `6.3`

For Cartesian all combinations the number of rows would be 729.

### Strength 2

| Algorithm | Rows | Runtime ms | Heap delta MiB | RSS delta MiB | Coverage % |
| --- | ---: | ---: | ---: | ---: | ---: |
| `pict-gcd` | 13 | 5 | 0.41 | 0.27 | 100.0 |
| `aetg` | 14 | 13 | 0.16 | 0.01 | 100.0 |
| `hypergraph-vertex` | 14 | 9 | 0.54 | 1.04 | 100.0 |
| `compatibility-graph` | 16 | 4 | 0.50 | 0.25 | 100.0 |
| `greedy` | 17 | 3 | 0.48 | 1.21 | 100.0 |
| `ipog` | 17 | 1 | 0.65 | 0.15 | 100.0 |

### Strength 3

| Algorithm | Rows | Runtime ms | Heap delta MiB | RSS delta MiB | Coverage % |
| --- | ---: | ---: | ---: | ---: | ---: |
| `aetg` | 45 | 46 | 1.75 | 0.09 | 100.0 |
| `greedy` | 48 | 5 | 0.81 | 0.38 | 100.0 |
| `pict-gcd` | 48 | 6 | 0.27 | 1.71 | 100.0 |
| `hypergraph-vertex` | 50 | 35 | 1.80 | 0.25 | 100.0 |
| `compatibility-graph` | 51 | 27 | 3.67 | 4.21 | 100.0 |
| `ipog` | 58 | 4 | 0.60 | 0.23 | 100.0 |

### Strength 4

| Algorithm | Rows | Runtime ms | Heap delta MiB | RSS delta MiB | Coverage % |
| --- | ---: | ---: | ---: | ---: | ---: |
| `aetg` | 134 | 91 | 3.00 | -0.77 | 100.0 |
| `greedy` | 137 | 9 | 2.33 | -0.18 | 100.0 |
| `hypergraph-vertex` | 141 | 152 | 7.98 | 16.04 | 100.0 |
| `pict-gcd` | 142 | 10 | 2.87 | 0.68 | 100.0 |
| `compatibility-graph` | 153 | 96 | 2.63 | 7.73 | 100.0 |
| `ipog` | 169 | 7 | 0.69 | 1.02 | 100.0 |

### Strength 5

| Algorithm | Rows | Runtime ms | Heap delta MiB | RSS delta MiB | Coverage % |
| --- | ---: | ---: | ---: | ---: | ---: |
| `greedy` | 288 | 7 | 4.64 | 0.29 | 100.0 |
| `aetg` | 308 | 97 | 6.69 | -0.21 | 100.0 |
| `ipog` | 318 | 13 | 3.11 | 0.71 | 100.0 |
| `hypergraph-vertex` | 330 | 472 | 0.84 | -0.43 | 100.0 |
| `pict-gcd` | 331 | 8 | 3.98 | 2.14 | 100.0 |
| `compatibility-graph` | 368 | 383 | 7.90 | -0.47 | 100.0 |

### Strength 6

| Algorithm | Rows | Runtime ms | Heap delta MiB | RSS delta MiB | Coverage % |
| --- | ---: | ---: | ---: | ---: | ---: |
| `aetg` | 729 | 0 | 0.73 | 0.48 | 100.0 |
| `compatibility-graph` | 729 | 1 | 1.04 | 0.55 | 100.0 |
| `greedy` | 729 | 1 | 1.04 | 1.04 | 100.0 |
| `hypergraph-vertex` | 729 | 1 | 0.97 | -0.10 | 100.0 |
| `ipog` | 729 | 1 | 0.71 | 0.04 | 100.0 |
| `pict-gcd` | 729 | 1 | 0.97 | -0.23 | 100.0 |

## Scenario 6x4

Input data set:
- `P1`: `1.1`, `1.2`, `1.3`, `1.4`
- `P2`: `2.1`, `2.2`, `2.3`, `2.4`
- `P3`: `3.1`, `3.2`, `3.3`, `3.4`
- `P4`: `4.1`, `4.2`, `4.3`, `4.4`
- `P5`: `5.1`, `5.2`, `5.3`, `5.4`
- `P6`: `6.1`, `6.2`, `6.3`, `6.4`

For Cartesian all combinations the number of rows would be 4096.

### Strength 2

| Algorithm | Rows | Runtime ms | Heap delta MiB | RSS delta MiB | Coverage % |
| --- | ---: | ---: | ---: | ---: | ---: |
| `aetg` | 23 | 20 | 3.12 | 0.90 | 100.0 |
| `pict-gcd` | 23 | 3 | 2.64 | -1.00 | 100.0 |
| `compatibility-graph` | 24 | 5 | 4.05 | -1.05 | 100.0 |
| `hypergraph-vertex` | 26 | 11 | 4.60 | -0.05 | 100.0 |
| `greedy` | 28 | 3 | 1.76 | 0.02 | 100.0 |
| `ipog` | 28 | 1 | 0.66 | 0.10 | 100.0 |

### Strength 3

| Algorithm | Rows | Runtime ms | Heap delta MiB | RSS delta MiB | Coverage % |
| --- | ---: | ---: | ---: | ---: | ---: |
| `greedy` | 64 | 7 | 5.17 | 0.03 | 100.0 |
| `ipog` | 64 | 5 | 3.49 | 0.46 | 100.0 |
| `aetg` | 105 | 107 | 0.75 | 0.21 | 100.0 |
| `pict-gcd` | 110 | 12 | 10.10 | 0.06 | 100.0 |
| `hypergraph-vertex` | 115 | 126 | 1.12 | -0.43 | 100.0 |
| `compatibility-graph` | 120 | 64 | 3.14 | -0.53 | 100.0 |

### Strength 4

| Algorithm | Rows | Runtime ms | Heap delta MiB | RSS delta MiB | Coverage % |
| --- | ---: | ---: | ---: | ---: | ---: |
| `aetg` | 420 | 364 | 5.73 | 0.23 | 100.0 |
| `pict-gcd` | 440 | 32 | 6.49 | -0.29 | 100.0 |
| `hypergraph-vertex` | 446 | 2021 | 29.79 | 21.94 | 100.0 |
| `greedy` | 448 | 35 | 0.63 | -0.48 | 100.0 |
| `ipog` | 448 | 17 | 9.70 | -0.24 | 100.0 |
| `compatibility-graph` | 495 | 1155 | 8.38 | -0.90 | 100.0 |

### Strength 5

| Algorithm | Rows | Runtime ms | Heap delta MiB | RSS delta MiB | Coverage % |
| --- | ---: | ---: | ---: | ---: | ---: |
| `greedy` | 1024 | 36 | 10.89 | -0.02 | 100.0 |
| `ipog` | 1024 | 19 | 12.03 | 0.39 | 100.0 |
| `aetg` | 1335 | 1028 | 8.89 | -0.40 | 100.0 |
| `hypergraph-vertex` | 1375 | 10516 | 30.72 | 29.41 | 100.0 |
| `pict-gcd` | 1414 | 112 | 2.37 | -0.52 | 100.0 |
| `compatibility-graph` | 1534 | 7949 | 9.58 | -0.76 | 100.0 |

### Strength 6

| Algorithm | Rows | Runtime ms | Heap delta MiB | RSS delta MiB | Coverage % |
| --- | ---: | ---: | ---: | ---: | ---: |
| `aetg` | 4096 | 7 | 4.92 | 0.10 | 100.0 |
| `compatibility-graph` | 4096 | 4 | 3.85 | 0.57 | 100.0 |
| `greedy` | 4096 | 5 | 4.61 | 0.08 | 100.0 |
| `hypergraph-vertex` | 4096 | 7 | 4.59 | 0.40 | 100.0 |
| `ipog` | 4096 | 6 | 4.46 | 1.07 | 100.0 |
| `pict-gcd` | 4096 | 4 | 3.75 | 0.03 | 100.0 |

