# Command Reference

`ai-work` manages local Markdown memory for AI-assisted software development.

## Global Options

```sh
ai-work --help
ai-work -h
ai-work help
ai-work --version
ai-work -v
```

Help and version commands do not initialize storage.

## Environment Variables

| Variable | Purpose |
|---|---|
| `AI_WORK_HOME` | Base directory for generated work plans |
| `AI_WORK_PROJECT` | Project name used below `AI_WORK_HOME` |

## Commands

### `ai-work init`

Creates the project memory layout and prints the project directory.

### `ai-work info`

Prints JSON containing resolved paths and directory locations.

### `ai-work context`

Prints `current-focus.md`, `QUIRKS.md`, and up to three recent progress files.

### `ai-work progress path`

Ensures today’s progress file exists and prints its path.

### `ai-work progress list [n]`

Lists recent progress files, newest first. Defaults to `3`.

### `ai-work progress append [file]`

Appends progress from `file`, or from stdin when no file is provided.

```sh
printf 'Implemented help command.' | ai-work progress append
ai-work progress append notes.md
```

### `ai-work handoff create <slug>`

Creates a pending handoff template.

### `ai-work handoff list`

Lists pending handoff files.

### `ai-work handoff consume`

Prints pending handoffs and moves them to a dated completed directory.

### `ai-work doc create <feature|architecture|research> <slug>`

Creates a dated planning doc in the requested category.

### `ai-work doc list <feature|architecture|research> [n]`

Lists recent planning docs for a category. Defaults to `10`.
