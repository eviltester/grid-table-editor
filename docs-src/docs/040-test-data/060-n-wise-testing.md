---
sidebar_position: 6
title: "N-Wise Testing"
description: "Generate n-wise combinatorial test data from enum columns, compare generation strategies, and choose a strategy based on coverage strength and row count."
---

# N-Wise Test Data Generation

N-wise generation creates a covering set for enum columns. For a selected value of `n`, every value tuple across every group of `n` enum columns should appear at least once.

The **Generate Combinations** dialog only offers valid `n` values: from `2` up to the number of enum columns in the current schema.

Non-enum columns are still generated normally for each emitted combination row. Only enum columns participate in the finite n-wise coverage model.

## When to use n-wise generation

Use n-wise generation when:

- You have two or more enum fields with finite value sets.
- You want systematic coverage of value interactions.
- Full Cartesian generation would create too many rows.
- You want to compare pairwise, 3-wise, 4-wise, or stronger coverage before choosing the right test-data volume.

For `n = 2`, the generator covers every pair of enum values across every pair of enum columns. For `n = 3`, it covers every triplet, and so on. When `n` equals the number of enum columns, the result is full Cartesian coverage for those enum columns.

## Strategies

The dialog orders available strategies by the lowest-row evidence from the current comparison scenarios for the selected `n`. The best row-count choice can change by strength, so the order changes when you change `n`.

| Strategy | Available for | When to pick it | References |
| --- | --- | --- | --- |
| Greedy | 2-wise and higher | Pick as the general default for low rows with low runtime. It led the current 3-wise and 5-wise samples overall. | [Greedy covering-array family](https://asu.elsevierpure.com/en/publications/a-density-based-greedy-algorithm-for-higher-strength-covering-arr) |
| IPOG-style | 2-wise and higher | Pick for predictable low runtime at higher strengths. It tracked Greedy closely and tied it on some larger samples. | [NIST IPOG](https://www.nist.gov/publications/ipog-general-strategy-t-way-software-testing) |
| AETG-style | 2-wise and higher | Pick when you can spend more runtime to chase compact output. It was strongest for 4-wise row count in the samples. | [AETG reference summary](https://jserd.springeropen.com/articles/10.1186/s40411-017-0043-z) |
| PICT-inspired GCD | 2-wise and higher | Pick for 2-wise when row count matters. It produced the fewest pairwise rows in the current comparison samples. | [Microsoft PICT](https://github.com/microsoft/pict) |
| Bach AllPairs | 2-wise only | Pick for 2-wise when you want Bach Allpairs-style pair-frequency balancing. It targets lower row counts than the simple legacy pairwise algorithm while staying fast. | [James Bach Satisfice AllPairs](https://www.satisfice.com/download/allpairs) |
| Hypergraph vertex | 2-wise and higher | Pick as the graph-informed comparator that stays closer on rows than compatibility graph, with higher runtime. | [Covering arrays on hypergraphs](https://arxiv.org/abs/1508.07393) |
| Compatibility graph | 2-wise and higher | Pick for comparison against graph-style compatibility scoring. It was usually behind the best row-count choices. | [NIST covering arrays](https://math.nist.gov/coveringarrays/coveringarray.html) |
| Pairwise (simple) | 2-wise only | Pick for legacy-compatible 2-wise output. It is stable and familiar, though PICT, AETG, and Bach AllPairs used fewer rows in sample runs. | [NIST covering arrays](https://math.nist.gov/coveringarrays/coveringarray.html) |

## Scenario 6x3 Data Set

For Cartesian all combinations the number of rows would be 729.

```text
P1
enum("1.1","1.2","1.3")
P2
enum("2.1","2.2","2.3")
P3
enum("3.1","3.2","3.3")
P4
enum("4.1","4.2","4.3")
P5
enum("5.1","5.2","5.3")
P6
enum("6.1","6.2","6.3")
```

### Scenario 6x3 - Strength 2

| Algorithm | Rows | Total tuples | Covered tuples | Coverage % | Runtime ms |
| --- | ---: | ---: | ---: | ---: | ---: |
| pict-gcd | 13 | 135 | 135 | 100.0 | 2 |
| aetg | 14 | 135 | 135 | 100.0 | 10 |
| hypergraph-vertex | 14 | 135 | 135 | 100.0 | 6 |
| compatibility-graph | 16 | 135 | 135 | 100.0 | 3 |
| bach-allpairs | 16 | 135 | 135 | 100.0 | n/a |
| greedy | 17 | 135 | 135 | 100.0 | 2 |
| ipog | 17 | 135 | 135 | 100.0 | 1 |
| pairwise | 17 | 135 | 135 | 100.0 | n/a |

### Scenario 6x3 - Strength 3

| Algorithm | Rows | Total tuples | Covered tuples | Coverage % | Runtime ms |
| --- | ---: | ---: | ---: | ---: | ---: |
| aetg | 45 | 540 | 540 | 100.0 | 36 |
| greedy | 48 | 540 | 540 | 100.0 | 3 |
| pict-gcd | 48 | 540 | 540 | 100.0 | 4 |
| hypergraph-vertex | 50 | 540 | 540 | 100.0 | 21 |
| compatibility-graph | 51 | 540 | 540 | 100.0 | 21 |
| ipog | 58 | 540 | 540 | 100.0 | 2 |

### Scenario 6x3 - Strength 4

| Algorithm | Rows | Total tuples | Covered tuples | Coverage % | Runtime ms |
| --- | ---: | ---: | ---: | ---: | ---: |
| aetg | 134 | 1215 | 1215 | 100.0 | 90 |
| greedy | 137 | 1215 | 1215 | 100.0 | 10 |
| hypergraph-vertex | 141 | 1215 | 1215 | 100.0 | 145 |
| pict-gcd | 142 | 1215 | 1215 | 100.0 | 8 |
| compatibility-graph | 153 | 1215 | 1215 | 100.0 | 100 |
| ipog | 169 | 1215 | 1215 | 100.0 | 4 |

### Scenario 6x3 - Strength 5

| Algorithm | Rows | Total tuples | Covered tuples | Coverage % | Runtime ms |
| --- | ---: | ---: | ---: | ---: | ---: |
| greedy | 288 | 1458 | 1458 | 100.0 | 4 |
| aetg | 308 | 1458 | 1458 | 100.0 | 108 |
| ipog | 318 | 1458 | 1458 | 100.0 | 4 |
| hypergraph-vertex | 330 | 1458 | 1458 | 100.0 | 421 |
| pict-gcd | 331 | 1458 | 1458 | 100.0 | 6 |
| compatibility-graph | 368 | 1458 | 1458 | 100.0 | 405 |

### Scenario 6x3 - Strength 6

| Algorithm | Rows | Total tuples | Covered tuples | Coverage % | Runtime ms |
| --- | ---: | ---: | ---: | ---: | ---: |
| aetg | 729 | 729 | 729 | 100.0 | 0 |
| compatibility-graph | 729 | 729 | 729 | 100.0 | 1 |
| greedy | 729 | 729 | 729 | 100.0 | 0 |
| hypergraph-vertex | 729 | 729 | 729 | 100.0 | 1 |
| ipog | 729 | 729 | 729 | 100.0 | 0 |
| pict-gcd | 729 | 729 | 729 | 100.0 | 0 |

## Scenario 6x4 Data Set

For Cartesian all combinations the number of rows would be 4096.

```text
P1
enum("1.1","1.2","1.3","1.4")
P2
enum("2.1","2.2","2.3","2.4")
P3
enum("3.1","3.2","3.3","3.4")
P4
enum("4.1","4.2","4.3","4.4")
P5
enum("5.1","5.2","5.3","5.4")
P6
enum("6.1","6.2","6.3","6.4")
```

### Scenario 6x4 - Strength 2

| Algorithm | Rows | Total tuples | Covered tuples | Coverage % | Runtime ms |
| --- | ---: | ---: | ---: | ---: | ---: |
| aetg | 23 | 240 | 240 | 100.0 | 18 |
| pict-gcd | 23 | 240 | 240 | 100.0 | 3 |
| compatibility-graph | 24 | 240 | 240 | 100.0 | 4 |
| hypergraph-vertex | 26 | 240 | 240 | 100.0 | 6 |
| bach-allpairs | 28 | 240 | 240 | 100.0 | n/a |
| greedy | 28 | 240 | 240 | 100.0 | 1 |
| ipog | 28 | 240 | 240 | 100.0 | 1 |
| pairwise | 28 | 240 | 240 | 100.0 | n/a |

### Scenario 6x4 - Strength 3

| Algorithm | Rows | Total tuples | Covered tuples | Coverage % | Runtime ms |
| --- | ---: | ---: | ---: | ---: | ---: |
| greedy | 64 | 1280 | 1280 | 100.0 | 4 |
| ipog | 64 | 1280 | 1280 | 100.0 | 3 |
| aetg | 105 | 1280 | 1280 | 100.0 | 112 |
| pict-gcd | 110 | 1280 | 1280 | 100.0 | 11 |
| hypergraph-vertex | 115 | 1280 | 1280 | 100.0 | 122 |
| compatibility-graph | 120 | 1280 | 1280 | 100.0 | 60 |

### Scenario 6x4 - Strength 4

| Algorithm | Rows | Total tuples | Covered tuples | Coverage % | Runtime ms |
| --- | ---: | ---: | ---: | ---: | ---: |
| aetg | 420 | 3840 | 3840 | 100.0 | 320 |
| pict-gcd | 440 | 3840 | 3840 | 100.0 | 25 |
| hypergraph-vertex | 446 | 3840 | 3840 | 100.0 | 2184 |
| greedy | 448 | 3840 | 3840 | 100.0 | 29 |
| ipog | 448 | 3840 | 3840 | 100.0 | 14 |
| compatibility-graph | 495 | 3840 | 3840 | 100.0 | 1017 |

### Scenario 6x4 - Strength 5

| Algorithm | Rows | Total tuples | Covered tuples | Coverage % | Runtime ms |
| --- | ---: | ---: | ---: | ---: | ---: |
| greedy | 1024 | 6144 | 6144 | 100.0 | 23 |
| ipog | 1024 | 6144 | 6144 | 100.0 | 23 |
| aetg | 1335 | 6144 | 6144 | 100.0 | 1477 |
| hypergraph-vertex | 1375 | 6144 | 6144 | 100.0 | 11946 |
| pict-gcd | 1414 | 6144 | 6144 | 100.0 | 89 |
| compatibility-graph | 1534 | 6144 | 6144 | 100.0 | 9611 |

### Scenario 6x4 - Strength 6

| Algorithm | Rows | Total tuples | Covered tuples | Coverage % | Runtime ms |
| --- | ---: | ---: | ---: | ---: | ---: |
| aetg | 4096 | 4096 | 4096 | 100.0 | 2 |
| compatibility-graph | 4096 | 4096 | 4096 | 100.0 | 2 |
| greedy | 4096 | 4096 | 4096 | 100.0 | 3 |
| hypergraph-vertex | 4096 | 4096 | 4096 | 100.0 | 3 |
| ipog | 4096 | 4096 | 4096 | 100.0 | 3 |
| pict-gcd | 4096 | 4096 | 4096 | 100.0 | 3 |

## Experimental graph family

The multipartite graph walk and lookahead experiments remain outside the normal generator code path. See the experimental n-wise report in the repository under `experiments/n-wise/` for the current graph-family comparison.
