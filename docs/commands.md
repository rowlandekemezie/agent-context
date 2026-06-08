# Command Reference

`agent-context` manages local Markdown memory for AI-assisted software development.

## Global Options

```sh
agent-context --help
agent-context -h
agent-context help
agent-context --version
agent-context -v
```

Help and version commands do not initialize storage.

## Environment Variables

| Variable | Purpose |
|---|---|
| `AGENT_CONTEXT_HOME` | Base directory for generated work plans |
| `AGENT_CONTEXT_PROJECT` | Project name used below `AGENT_CONTEXT_HOME` |

## Commands

### `agent-context init`

Creates the project memory layout and prints the project directory.

### `agent-context info`

Prints JSON containing resolved paths and directory locations.

### `agent-context context`

Prints `current-focus.md`, `QUIRKS.md`, and up to three recent progress files.

### `agent-context progress path`

Ensures today’s progress file exists and prints its path.

### `agent-context progress list [n]`

Lists recent progress files, newest first. Defaults to `3`.

### `agent-context progress append [file]`

Appends progress from `file`, or from stdin when no file is provided.

```sh
printf 'Implemented help command.' | agent-context progress append
agent-context progress append notes.md
```

### `agent-context handoff create <slug>`

Creates a pending handoff template.

### `agent-context handoff list`

Lists pending handoff files.

### `agent-context handoff consume`

Prints pending handoffs and moves them to a dated completed directory.

### `agent-context doc create <feature|architecture|research> <slug>`

Creates a dated planning doc in the requested category.

### `agent-context doc list <feature|architecture|research> [n]`

Lists recent planning docs for a category. Defaults to `10`.
