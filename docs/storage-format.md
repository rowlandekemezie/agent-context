# Storage Format

By default, `agent-context` writes to:

```txt
~/.config/agent-context/projects/<project-name>/
```

The default project name is the basename of the current working directory. Override it with `AGENT_CONTEXT_PROJECT`.

Override the storage root with `AGENT_CONTEXT_HOME`.

## Directory Layout

```txt
<AGENT_CONTEXT_HOME>/<project-name>/
  current-focus.md
  QUIRKS.md
  architecture/
  features/
  progress-updates/
    YYYY-MM-DD-progress.md
  research/
  subtask-handoffs/
    pending/
      YYYY-MM-DD-HH-MM-SS-slug.md
    completed/
      YYYY-MM-DD/
        YYYY-MM-DD-HH-MM-SS-slug.md
```

## File Contracts

### `current-focus.md`

The primary session-restoration file. It records project metadata, current goal, open questions, and next step.

### `QUIRKS.md`

Project-specific constraints, patterns, reminders, and gotchas.

### `progress-updates/*.md`

Daily append-only progress logs. The work date rolls back to the prior day before 06:00 local time.

### `subtask-handoffs/pending/*.md`

Templates intended for another agent or future session.

### `subtask-handoffs/completed/YYYY-MM-DD/*.md`

Consumed handoffs moved out of the pending queue.

### `features/`, `architecture/`, `research/`

Dated planning notes created by `agent-context doc create`.

## Stability

The current storage layout is part of the CLI’s user-facing contract. Future layout changes should be documented and migration-aware.
