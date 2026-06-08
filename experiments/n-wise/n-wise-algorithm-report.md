# Experimental N-Wise Algorithm Report

This report covers the experimental multipartite strategies only. The stable n-wise and pairwise implementations remain outside this comparison on purpose.

## Summary

- Best experimental runtime across non-full-factorial cases: `multipartite-graph-lookahead-hybrid`
- Best experimental row count across non-full-factorial cases: `multipartite-graph-walk`
- Best experimental balanced runtime/rows result: `multipartite-graph-lookahead-hybrid`

| Experiment | Avg rows | Avg runtime ms | Avg graph rows | Avg fallback rows | Avg lookahead evals | Balanced score |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `multipartite-graph-lookahead-hybrid` | 316.5 | 1469.6 | 165.3 | 151.3 | 650.5 | 2.15 |
| `multipartite-graph-lookahead-adaptive` | 318.4 | 1773.4 | 302.3 | 16.1 | 980.4 | 2.26 |
| `multipartite-graph-walk` | 313.6 | 1719.8 | 0.0 | 0.0 | 0.0 | 2.35 |
| `multipartite-graph-lookahead` | 315.8 | 1916.0 | 299.8 | 16.0 | 1214.0 | 2.45 |

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

| Experiment | Rows | Runtime ms | Graph rows | Fallback rows | Lookahead evals | Heap delta MiB | Coverage % |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `multipartite-graph-lookahead` | 15 | 5 | 15 | 0 | 0 | 0.10 | 100.0 |
| `multipartite-graph-lookahead-adaptive` | 15 | 3 | 15 | 0 | 0 | 0.38 | 100.0 |
| `multipartite-graph-lookahead-hybrid` | 15 | 3 | 8 | 7 | 0 | 0.03 | 100.0 |
| `multipartite-graph-walk` | 15 | 7 | 0 | 0 | 0 | 0.23 | 100.0 |

### Strength 3

| Experiment | Rows | Runtime ms | Graph rows | Fallback rows | Lookahead evals | Heap delta MiB | Coverage % |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `multipartite-graph-lookahead` | 48 | 27 | 48 | 0 | 159 | 2.60 | 100.0 |
| `multipartite-graph-walk` | 49 | 23 | 0 | 0 | 0 | 0.73 | 100.0 |
| `multipartite-graph-lookahead-adaptive` | 50 | 27 | 50 | 0 | 94 | 3.00 | 100.0 |
| `multipartite-graph-lookahead-hybrid` | 52 | 25 | 21 | 31 | 84 | 2.54 | 100.0 |

### Strength 4

| Experiment | Rows | Runtime ms | Graph rows | Fallback rows | Lookahead evals | Heap delta MiB | Coverage % |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `multipartite-graph-lookahead` | 140 | 170 | 140 | 0 | 541 | 10.96 | 100.0 |
| `multipartite-graph-lookahead-hybrid` | 142 | 129 | 65 | 77 | 260 | 3.54 | 100.0 |
| `multipartite-graph-walk` | 142 | 117 | 0 | 0 | 0 | 1.06 | 100.0 |
| `multipartite-graph-lookahead-adaptive` | 147 | 168 | 147 | 0 | 147 | 2.64 | 100.0 |

### Strength 5

| Experiment | Rows | Runtime ms | Graph rows | Fallback rows | Lookahead evals | Heap delta MiB | Coverage % |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `multipartite-graph-walk` | 325 | 503 | 0 | 0 | 0 | 2.40 | 100.0 |
| `multipartite-graph-lookahead-hybrid` | 327 | 917 | 185 | 142 | 740 | 12.14 | 100.0 |
| `multipartite-graph-lookahead` | 330 | 730 | 319 | 11 | 1304 | 5.35 | 100.0 |
| `multipartite-graph-lookahead-adaptive` | 330 | 849 | 319 | 11 | 1304 | 15.37 | 100.0 |

### Strength 6

| Experiment | Rows | Runtime ms | Graph rows | Fallback rows | Lookahead evals | Heap delta MiB | Coverage % |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `multipartite-graph-lookahead` | 729 | 2 | 0 | 0 | 0 | 0.89 | 100.0 |
| `multipartite-graph-lookahead-adaptive` | 729 | 1 | 0 | 0 | 0 | 0.71 | 100.0 |
| `multipartite-graph-lookahead-hybrid` | 729 | 2 | 0 | 0 | 0 | 0.97 | 100.0 |
| `multipartite-graph-walk` | 729 | 2 | 0 | 0 | 0 | 1.05 | 100.0 |

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

| Experiment | Rows | Runtime ms | Graph rows | Fallback rows | Lookahead evals | Heap delta MiB | Coverage % |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `multipartite-graph-lookahead` | 24 | 8 | 24 | 0 | 0 | 4.91 | 100.0 |
| `multipartite-graph-lookahead-adaptive` | 24 | 5 | 24 | 0 | 0 | 4.10 | 100.0 |
| `multipartite-graph-lookahead-hybrid` | 24 | 5 | 13 | 11 | 0 | 3.68 | 100.0 |
| `multipartite-graph-walk` | 25 | 8 | 0 | 0 | 0 | 6.32 | 100.0 |

### Strength 3

| Experiment | Rows | Runtime ms | Graph rows | Fallback rows | Lookahead evals | Heap delta MiB | Coverage % |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `multipartite-graph-lookahead` | 112 | 164 | 112 | 0 | 377 | 0.90 | 100.0 |
| `multipartite-graph-lookahead-adaptive` | 114 | 133 | 114 | 0 | 214 | 8.03 | 100.0 |
| `multipartite-graph-lookahead-hybrid` | 116 | 117 | 50 | 66 | 200 | 8.49 | 100.0 |
| `multipartite-graph-walk` | 119 | 143 | 0 | 0 | 0 | 3.10 | 100.0 |

### Strength 4

| Experiment | Rows | Runtime ms | Graph rows | Fallback rows | Lookahead evals | Heap delta MiB | Coverage % |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `multipartite-graph-lookahead` | 439 | 1918 | 439 | 0 | 1699 | 1.43 | 100.0 |
| `multipartite-graph-walk` | 442 | 1659 | 0 | 0 | 0 | 3.44 | 100.0 |
| `multipartite-graph-lookahead-hybrid` | 446 | 1284 | 204 | 242 | 816 | 8.91 | 100.0 |
| `multipartite-graph-lookahead-adaptive` | 448 | 1625 | 448 | 0 | 448 | 9.15 | 100.0 |

### Strength 5

| Experiment | Rows | Runtime ms | Graph rows | Fallback rows | Lookahead evals | Heap delta MiB | Coverage % |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `multipartite-graph-walk` | 1392 | 11298 | 0 | 0 | 0 | 48.62 | 100.0 |
| `multipartite-graph-lookahead-hybrid` | 1410 | 9277 | 776 | 634 | 3104 | 41.54 | 100.0 |
| `multipartite-graph-lookahead` | 1418 | 12306 | 1301 | 117 | 5632 | 31.10 | 100.0 |
| `multipartite-graph-lookahead-adaptive` | 1419 | 11377 | 1301 | 118 | 5636 | 6.55 | 100.0 |

### Strength 6

| Experiment | Rows | Runtime ms | Graph rows | Fallback rows | Lookahead evals | Heap delta MiB | Coverage % |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `multipartite-graph-lookahead` | 4096 | 3 | 0 | 0 | 0 | 3.59 | 100.0 |
| `multipartite-graph-lookahead-adaptive` | 4096 | 4 | 0 | 0 | 0 | 4.85 | 100.0 |
| `multipartite-graph-lookahead-hybrid` | 4096 | 2 | 0 | 0 | 0 | 3.51 | 100.0 |
| `multipartite-graph-walk` | 4096 | 4 | 0 | 0 | 0 | 4.59 | 100.0 |

