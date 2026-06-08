---
name: agent-context
description: Uses the agent-context CLI as durable Markdown memory for AI-assisted software projects. Use when restoring project context, recording progress, creating handoffs, creating planning docs, or when the user mentions agent-context, current focus, progress logs, or agent handoffs.
---

# agent-context

Use `agent-context` to keep project context in local Markdown files across agent sessions.

## Start a session

```sh
agent-context context
```

Use the output to understand current focus, quirks, and recent progress before changing code.

## Record progress

```sh
printf 'Completed <change>. Validation: <commands/results>.' | agent-context progress append
```

Append progress after meaningful changes, validation runs, or decisions.

## Create a handoff

```sh
agent-context handoff create next-session
```

Use handoffs when work is unfinished or another agent/session should continue.

## Create planning docs

```sh
agent-context doc create feature my-feature
agent-context doc create architecture my-decision
agent-context doc create research my-topic
```

## Ownership and safety

- Append progress freely after meaningful work.
- Create handoffs before stopping with unresolved work.
- Do not silently rewrite `current-focus.md` or `QUIRKS.md`; ask, make an explicitly requested edit, or propose the update in progress/handoff notes.
- Treat feature, architecture, and research docs as shared drafts unless the user says otherwise.
- Do not store secrets, tokens, or credentials.
- In tests, set `AGENT_CONTEXT_HOME` and `AGENT_CONTEXT_PROJECT` to temporary values.

## Install this skill

From the `agent-context` repository root:

```sh
mkdir -p ~/.agents/skills
cp -R skills/agent-context ~/.agents/skills/agent-context
```
