# Ownership Model

`agent-context` separates operational memory from canonical project intent.

## Default ownership

| Area | Purpose | Default owner | Automation level |
|---|---|---|---|
| `current-focus.md` | current goal, open questions, next step | human-directed | explicit or proposed updates |
| `QUIRKS.md` | durable constraints and gotchas | human-reviewed | explicit append only |
| `progress-updates/` | session history and validation notes | agent | append freely after meaningful work |
| `subtask-handoffs/` | continuation notes for another session | agent or human | create before stopping unfinished work |
| `features/` | feature plans | shared | agent drafts, human curates |
| `architecture/` | architecture notes and decisions | shared | agent drafts, human approves |
| `research/` | research notes | shared | agent drafts, human curates |

## Principle

Agents may append operational memory freely.

Agents should not silently rewrite canonical intent. For `current-focus.md` and `QUIRKS.md`, agents should either:

- ask before changing them,
- make an explicit user-requested edit, or
- propose the update in progress/handoff notes.

## Practical guidance

Agents should usually:

- run `agent-context context` at the start of non-trivial work,
- append progress after meaningful changes or validation,
- create a handoff before stopping with unresolved work,
- create feature/architecture/research docs for durable plans.

Humans should usually own:

- the active objective,
- priority changes,
- durable project constraints,
- final architecture decisions.

## Automation direction

Prefer deterministic CLI commands and agent-side judgement over embedding AI-provider logic in the CLI.

Useful future commands could include:

- `agent-context focus set`
- `agent-context status`
- `agent-context session end`
- `agent-context handoff create --from-progress`
