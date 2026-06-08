# agent-context

Local-first Markdown memory for AI-assisted software development.

## Why

AI coding agents are useful, but sessions lose context. `agent-context` creates and manages simple Markdown files for project focus, quirks, progress logs, handoffs, and lightweight planning docs so humans and agents can resume work with shared context.

No database. No service. No lock-in.

## Install

`agent-context` is package-ready, but you do not need to wait for a formal npm release to use it.

### Option 1: use from a local checkout

```sh
git clone <repo-url> agent-context
cd agent-context
pnpm install
pnpm run build
node dist/cli.js --help
node dist/cli.js init
```

### Option 2: link globally for local dogfooding

From a local checkout:

```sh
pnpm install
pnpm run build
pnpm link --global
agent-context --help
agent-context init
```

This is the recommended path while the project is pre-release.

### Option 3: install from GitHub

After the repository is pushed to GitHub, install directly from the repo:

```sh
pnpm add --global github:rowlandekemezie/agent-context
```

or:

```sh
npm install --global github:rowlandekemezie/agent-context
```

Until an npm package exists, prefer local linking or GitHub installation.

## Quick start

```sh
agent-context init
agent-context info
agent-context context
printf 'Implemented CLI scaffold.' | agent-context progress append
agent-context handoff create next-agent
agent-context doc create feature durable-context
```

## Generated structure

By default, `agent-context` stores files under:

```txt
~/.config/agent-context/projects/<project-name>/
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

- `AGENT_CONTEXT_HOME`: base directory for generated work plans
- `AGENT_CONTEXT_PROJECT`: project name used under `AGENT_CONTEXT_HOME`

## Commands

| Command | Purpose |
|---|---|
| `agent-context --help` / `agent-context help` | Show command help |
| `agent-context --version` | Show the package version |
| `agent-context init` | Create the project memory layout and print its path |
| `agent-context info` | Print JSON describing paths and directories |
| `agent-context context` | Print current focus, quirks, and recent progress |
| `agent-context progress path` | Ensure and print today’s progress file path |
| `agent-context progress list [n]` | List recent progress files |
| `agent-context progress append [file]` | Append progress from a file or stdin |
| `agent-context handoff create <slug>` | Create a pending handoff template |
| `agent-context handoff list` | List pending handoffs |
| `agent-context handoff consume` | Print pending handoffs and move them to completed |
| `agent-context doc create <feature\|architecture\|research> <slug>` | Create a dated planning doc |
| `agent-context doc list <feature\|architecture\|research> [n]` | List recent planning docs |

## Philosophy

`agent-context` is intentionally small:

- local-first
- Markdown-based
- CLI-driven
- agent-consumable
- easy to inspect and edit by hand

It is not a task manager, agent framework, sync service, database, or AI API wrapper.

## Project docs

- [Command reference](docs/commands.md)
- [Storage format](docs/storage-format.md)
- [Agent skill installation](docs/skill-installation.md)
- [Implementation plan](docs/implementation-plan.md)
- [Open source hardening notes](docs/research/open-source-hardening.md)
- [Contributing](CONTRIBUTING.md)

## Development

```sh
pnpm install
pnpm run build
pnpm run check
pnpm test
```

The current test strategy is characterization-first: lock down existing CLI behavior before refactoring or migrating to TypeScript.

## Agent skill

This repo includes an optional Zed agent skill in `skills/agent-context`. Install it with:

```sh
mkdir -p ~/.agents/skills
cp -R skills/agent-context ~/.agents/skills/agent-context
```

See [Agent skill installation](docs/skill-installation.md).
