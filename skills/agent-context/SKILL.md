---
name: agent-context
description: Uses the agent-context CLI as durable Markdown memory for AI-assisted software projects. Use when restoring project context, tracking progress, creating handoffs, recording planning docs, or when the user mentions agent-context, current focus, progress logs, or agent handoffs.
---

# agent-context

Use `agent-context` to maintain project memory in local Markdown files so humans and agents can resume work across sessions.

## Quick start

At the beginning of a session:

```sh
agent-context context
```

When you need paths or environment details:

```sh
agent-context info
```

After meaningful progress:

```sh
printf 'Completed <specific change>. Validation: <commands/results>.' | agent-context progress append
```

For another agent or future session:

```sh
agent-context handoff create next-agent
```

For planning docs:

```sh
agent-context doc create feature my-feature
agent-context doc create architecture my-decision
agent-context doc create research my-topic
```

## Workflow

1. Run `agent-context context` before starting non-trivial work.
2. Treat `current-focus.md` as the source of current objective, open questions, and next step.
3. Use `QUIRKS.md` for project-specific constraints and gotchas.
4. Append progress after completed milestones, validation runs, or important decisions.
5. Create handoffs before stopping with unresolved work.
6. Create docs for feature, architecture, or research notes that should outlive the chat.

## Safety rules

- Do not store secrets, API keys, tokens, or private credentials in agent-context files.
- Do not overwrite user-edited memory files unless the user asks.
- Prefer append-only progress updates over rewriting history.
- Use `AGENT_CONTEXT_HOME` and `AGENT_CONTEXT_PROJECT` when testing to avoid touching real user memory.

## Install this skill

From the `agent-context` repository root:

```sh
mkdir -p ~/.agents/skills
cp -R skills/agent-context ~/.agents/skills/agent-context
```

Then restart or reload the agent environment if required.
