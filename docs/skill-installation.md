# Agent Skill Installation

`ai-work` ships with an optional Zed agent skill that teaches agents how to use the CLI as durable project memory.

## Install from this repo

From the repository root:

```sh
mkdir -p ~/.agents/skills
cp -R skills/ai-work ~/.agents/skills/ai-work
```

Restart or reload the agent environment if needed, then ask the agent to use the `ai-work` skill.

## What the skill does

The skill instructs agents to:

- restore context with `ai-work context`
- inspect paths with `ai-work info`
- record meaningful progress with `ai-work progress append`
- create handoffs with `ai-work handoff create`
- create planning notes with `ai-work doc create`
- avoid storing secrets in generated Markdown

## Requirements

The CLI should be available on `PATH` as `ai-work`, or the agent should know the path to the built CLI.

Recommended pre-release setup:

```sh
pnpm install
pnpm run build
pnpm link --global
ai-work --help
```

If you do not link globally, use the built CLI directly:

```sh
node dist/cli.js --help
```
