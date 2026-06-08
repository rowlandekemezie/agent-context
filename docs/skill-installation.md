# Agent Skill Installation

`agent-context` ships with an optional Zed agent skill that teaches agents how to use the CLI as durable project memory.

## Install from this repo

From the repository root:

```sh
mkdir -p ~/.agents/skills
cp -R skills/agent-context ~/.agents/skills/agent-context
```

Restart or reload the agent environment if needed, then ask the agent to use the `agent-context` skill.

## What the skill does

The skill instructs agents to:

- restore context with `agent-context context`
- inspect paths with `agent-context info`
- record meaningful progress with `agent-context progress append`
- create handoffs with `agent-context handoff create`
- create planning notes with `agent-context doc create`
- avoid storing secrets in generated Markdown

## Requirements

The CLI should be available on `PATH` as `agent-context`, or the agent should know the path to the built CLI.

Recommended pre-release setup:

```sh
pnpm install
pnpm run build
pnpm link --global
agent-context --help
```

If you do not link globally, use the built CLI directly:

```sh
node dist/cli.js --help
```
