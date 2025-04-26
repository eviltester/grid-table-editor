---
slug: cli-and-faker-9
title: Updated Faker and added prototype CLI
authors: alan
tags: [release]
date: 2025-04-26T14:55
---

We have updated the version of Faker used for Test Data Generation and added a basic CLI.

<!--truncate-->

## Faker

[Faker](https://fakerjs.dev/guide/) is the test data generation library used by AnyWayData.

We have just updated the version in use to v9.7 so now the docs on the Faker site for API will match the test data generation here.

## CLI

We have also created prototype CLI of anwaydata to generate CSV files from the same data spec templates used in the UI.

So if you want to generate large amounts of data then you can so som from the CLI rather than the web UI.

CLI binaries are available from:

[/github.com/eviltester/grid-table-editor/releases/tag/v1.0.1](https://github.com/eviltester/grid-table-editor/releases/tag/v1.0.1)

Docs can be found here:

[github.com/eviltester/grid-table-editor/tree/v1.0.1/cli](https://github.com/eviltester/grid-table-editor/tree/v1.0.1/cli)

The CLI is built using bun so if you have bun installed you can run the CLI locally after cloning the repo.
