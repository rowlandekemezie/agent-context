# Agent Skill Installation

`agent-context` includes a Zed agent skill that teaches agents to use the CLI as durable project memory.

## Install

From the repository root:

```sh
mkdir -p ~/.agents/skills
cp -R skills/agent-context ~/.agents/skills/agent-context
```

Restart or reload the agent environment if needed.

## CLI requirement

The CLI should be available as `agent-context`:

```sh
pnpm install
pnpm run build
pnpm link --global
agent-context --help
```

## What the skill does

It instructs agents to:

- restore context with `agent-context context`
- record progress with `agent-context progress append`
- create handoffs with `agent-context handoff create`
- create planning docs with `agent-context doc create`
- avoid storing secrets in generated Markdown
