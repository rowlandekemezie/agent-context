# Command Reference

## Global commands

```sh
agent-context --help
agent-context help
agent-context --version
```

Help and version commands do not initialize storage.

## Environment

| Variable | Default | Purpose |
|---|---|---|
| `AGENT_CONTEXT_HOME` | `~/.config/agent-context/projects` | Storage root |
| `AGENT_CONTEXT_PROJECT` | current directory name | Project key under the storage root |

## Commands

### `agent-context init`

Creates the project memory layout and prints its path.

### `agent-context info`

Prints resolved paths as JSON.

### `agent-context context`

Prints `current-focus.md`, `QUIRKS.md`, and up to three recent progress files.

### `agent-context progress path`

Creates today’s progress file if needed and prints its path.

### `agent-context progress list [n]`

Lists recent progress files. Defaults to `3`.

### `agent-context progress append [file]`

Appends progress from a file, or from stdin when no file is passed.

```sh
printf 'Fixed the CLI help output.' | agent-context progress append
agent-context progress append notes.md
```

### `agent-context handoff create <slug>`

Creates a pending handoff template.

### `agent-context handoff list`

Lists pending handoff files.

### `agent-context handoff consume`

Prints pending handoffs and moves them to `completed/<date>/`.

### `agent-context doc create <feature|architecture|research> <slug>`

Creates a dated planning doc.

### `agent-context doc list <feature|architecture|research> [n]`

Lists recent planning docs. Defaults to `10`.

## Ownership

Progress and handoffs are safe for agents to append/create during normal work. `current-focus.md` and `QUIRKS.md` should be changed only with explicit user direction or review. See [Ownership Model](ownership-model.md).
