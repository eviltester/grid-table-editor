---
sidebar_position: 1
title: "Overview"
description: "Choose the right AnyWayData interface: Web UI, REST API, MCP, or CLI."
---

Use this section to pick the right interface for your workflow and run it locally or with Docker.

## Interface Matrix

| Interface | Best For | Transport | Local | Docker |
| --- | --- | --- | --- | --- |
| [Web UI](/docs/interfaces-and-deployment/web-ui) | Interactive editing and conversion | Browser HTTP | Yes | Yes |
| [REST API](/docs/interfaces-and-deployment/rest-api) | HTTP automation and OpenAPI | HTTP | Yes | Yes |
| [MCP](/docs/interfaces-and-deployment/mcp) | Agent/tool integrations | stdio | Yes | Yes |
| [CLI (Node/Bun)](/docs/interfaces-and-deployment/cli-node-and-bun) | Scriptable local batch generation | Process args/stdout | Yes | Usually local |

## Decision Guide

- Use **Web UI** when you want a visual editor and quick conversion workflows.
- Use **REST API** when you need service-to-service automation, OpenAPI, or Swagger UI.
- Use **MCP** when you are integrating with MCP-capable clients/agents over stdio.
- Use **CLI** when you want lightweight local scripting and pipeline-friendly output.

## Next Pages

- [Web UI](/docs/interfaces-and-deployment/web-ui)
- [REST API](/docs/interfaces-and-deployment/rest-api)
- [MCP](/docs/interfaces-and-deployment/mcp)
- [CLI (Node and Bun)](/docs/interfaces-and-deployment/cli-node-and-bun)
