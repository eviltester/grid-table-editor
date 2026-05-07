---
slug: interfaces-and-deployment-docs-release
title: "New Interfaces and Deployment Options: CLI, API, MCP, and Dockerized Web UI"
authors: [alan]
tags: [release, docs, api, mcp, web-ui, cli, deployment]
date: 2026-05-01T18:00
---

This release adds major new ways to run and integrate AnyWayData: a CLI workflow, a REST API, MCP support, and a Dockerized Web UI setup.

You can now choose the interface that best matches your workflow, from local scripting to service integrations and agent/tooling connections.

<!-- truncate -->

## What Is New

- CLI usage for local scripts and automation.
- REST API for HTTP and OpenAPI-driven integrations.
- MCP transport for tool/agent ecosystems over stdio.
- Dockerized Web UI for container-based interactive usage.

## Web UI

You can run the Web UI as a Dockerized deployment, as well as hosted and local static modes.

Use this when you want an interactive, browser-first way to import, edit, generate, and export data.

Read it here:

- [Web UI](/docs/interfaces-and-deployment/web-ui)

## REST API

The REST API gives you programmatic generation over HTTP with OpenAPI and Swagger support.

Use this for service-to-service calls, CI integrations, and tooling that consumes API contracts.

Read it here:

- [REST API](/docs/interfaces-and-deployment/rest-api)

## MCP

MCP support adds stdio-based integration for MCP-capable hosts and tools.

Use this for agent-driven workflows where MCP is the preferred transport model.

Read it here:

- [MCP](/docs/interfaces-and-deployment/mcp)

## CLI (Node and Bun)

The CLI adds direct command-line generation with Node/npm and Bun workflows.

Use this for scripts, local batch tasks, and shell pipeline automation.

Read it here:

- [CLI (Node and Bun)](/docs/interfaces-and-deployment/cli-node-and-bun)

## Choosing The Right Interface

- Choose **Web UI** for interactive use.
- Choose **REST API** for HTTP integration and OpenAPI-first workflows.
- Choose **MCP** for stdio tool integrations in MCP hosts.
- Choose **CLI** for local and CI scripting.

Overview and quick links:

- [Interfaces & Deployment Overview](/docs/interfaces-and-deployment/overview)
