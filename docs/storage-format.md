# Storage Format

Default storage root:

```txt
~/.config/agent-context/projects
```

Project storage path:

```txt
<AGENT_CONTEXT_HOME>/<project-name>/
```

`project-name` defaults to the current directory name. Override it with `AGENT_CONTEXT_PROJECT`.

## Layout

```txt
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

## Files

- `current-focus.md`: current objective, questions, and next step.
- `QUIRKS.md`: project constraints and gotchas.
- `progress-updates/*.md`: dated progress entries.
- `subtask-handoffs/pending/*.md`: handoffs waiting to be consumed.
- `subtask-handoffs/completed/<date>/*.md`: consumed handoffs.
- `features/`, `architecture/`, `research/`: dated planning docs.

The storage layout is user-facing. Treat changes as migrations.
