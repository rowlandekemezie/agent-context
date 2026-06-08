# Contributing

## Setup

```sh
pnpm install
pnpm run build
pnpm run check
pnpm test
```

## Scope

`agent-context` should stay small: a local-first Markdown context CLI for AI-assisted work.

Prefer changes that improve:

- CLI clarity
- filesystem safety
- test coverage
- documentation accuracy

Avoid adding cloud sync, AI provider integrations, databases, plugin systems, or workflow-platform features until the core CLI is stable.

## Testing

Tests should protect user-facing CLI behavior:

- run the built CLI in a subprocess
- use temporary directories
- set `AGENT_CONTEXT_HOME` and `AGENT_CONTEXT_PROJECT`
- assert stdout, stderr, exit code, and generated files

Never write tests against a real `~/.config/agent-context` directory.
