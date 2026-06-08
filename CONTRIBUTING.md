# Contributing

Thanks for your interest in `agent-context`.

## Development Setup

```sh
pnpm install
pnpm run build
pnpm run check
pnpm test
```

## Project Direction

`agent-context` is intentionally small: a local-first Markdown memory CLI for AI-assisted software development.

Before adding features, prefer improvements that make the current CLI easier to understand, test, and maintain.

## Testing

Tests should protect user-facing CLI behavior.

Prefer black-box characterization tests that:

- run the real CLI in a subprocess
- use temporary directories
- set `AGENT_CONTEXT_HOME`
- assert generated files and command output

Do not write tests that touch a real user `~/.config/agent-context` directory.

## TypeScript Migration

Do not migrate code to TypeScript until the current behavior is covered by characterization tests and CI is passing.
