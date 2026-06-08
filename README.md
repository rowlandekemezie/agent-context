# ai-work

Local-first Markdown memory for AI-assisted software development.

## Why

AI coding agents are useful, but sessions lose context. `ai-work` creates and manages simple Markdown files for project focus, quirks, progress logs, handoffs, and lightweight planning docs so humans and agents can resume work with shared context.

No database. No service. No lock-in.

## Install

```sh
npm install -g ai-work
```

Or run from a local checkout:

```sh
pnpm install
pnpm exec ai-work init
```

## Quick start

```sh
ai-work init
ai-work info
ai-work context
printf 'Implemented CLI scaffold.' | ai-work progress append
ai-work handoff create next-agent
ai-work doc create feature durable-context
```

## Generated structure

By default, `ai-work` stores files under:

```txt
~/.config/ai-work/dev-plans/<project-name>/
  current-focus.md
  QUIRKS.md
  architecture/
  features/
  progress-updates/
  research/
  subtask-handoffs/
    pending/
    completed/
```

You can override storage with environment variables:

- `AI_WORK_HOME`: base directory for generated work plans
- `AI_WORK_PROJECT`: project name used under `AI_WORK_HOME`

## Commands

| Command | Purpose |
|---|---|
| `ai-work --help` / `ai-work help` | Show command help |
| `ai-work --version` | Show the package version |
| `ai-work init` | Create the project memory layout and print its path |
| `ai-work info` | Print JSON describing paths and directories |
| `ai-work context` | Print current focus, quirks, and recent progress |
| `ai-work progress path` | Ensure and print today’s progress file path |
| `ai-work progress list [n]` | List recent progress files |
| `ai-work progress append [file]` | Append progress from a file or stdin |
| `ai-work handoff create <slug>` | Create a pending handoff template |
| `ai-work handoff list` | List pending handoffs |
| `ai-work handoff consume` | Print pending handoffs and move them to completed |
| `ai-work doc create <feature\|architecture\|research> <slug>` | Create a dated planning doc |
| `ai-work doc list <feature\|architecture\|research> [n]` | List recent planning docs |

## Philosophy

`ai-work` is intentionally small:

- local-first
- Markdown-based
- CLI-driven
- agent-consumable
- easy to inspect and edit by hand

It is not a task manager, agent framework, sync service, database, or AI API wrapper.

## Project docs

- [Implementation plan](docs/implementation-plan.md)
- [Open source hardening notes](docs/research/open-source-hardening.md)
- [Contributing](CONTRIBUTING.md)

## Development

```sh
pnpm install
pnpm run check
pnpm test
```

The current test strategy is characterization-first: lock down existing CLI behavior before refactoring or migrating to TypeScript.
