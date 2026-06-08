---
name: ai-work
description: Uses the ai-work CLI as durable Markdown memory for AI-assisted software projects. Use when restoring project context, tracking progress, creating handoffs, recording planning docs, or when the user mentions ai-work, current focus, progress logs, or agent handoffs.
---

# ai-work

Use `ai-work` to maintain project memory in local Markdown files so humans and agents can resume work across sessions.

## Quick start

At the beginning of a session:

```sh
ai-work context
```

When you need paths or environment details:

```sh
ai-work info
```

After meaningful progress:

```sh
printf 'Completed <specific change>. Validation: <commands/results>.' | ai-work progress append
```

For another agent or future session:

```sh
ai-work handoff create next-agent
```

For planning docs:

```sh
ai-work doc create feature my-feature
ai-work doc create architecture my-decision
ai-work doc create research my-topic
```

## Workflow

1. Run `ai-work context` before starting non-trivial work.
2. Treat `current-focus.md` as the source of current objective, open questions, and next step.
3. Use `QUIRKS.md` for project-specific constraints and gotchas.
4. Append progress after completed milestones, validation runs, or important decisions.
5. Create handoffs before stopping with unresolved work.
6. Create docs for feature, architecture, or research notes that should outlive the chat.

## Safety rules

- Do not store secrets, API keys, tokens, or private credentials in ai-work files.
- Do not overwrite user-edited memory files unless the user asks.
- Prefer append-only progress updates over rewriting history.
- Use `AI_WORK_HOME` and `AI_WORK_PROJECT` when testing to avoid touching real user memory.

## Install this skill

From the `ai-work` repository root:

```sh
mkdir -p ~/.agents/skills
cp -R skills/ai-work ~/.agents/skills/ai-work
```

Then restart or reload the agent environment if required.
