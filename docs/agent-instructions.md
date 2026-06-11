# Agent Instructions

`agent-context` is agent-agnostic. The core interface is the `agent-context` CLI plus plain Markdown files on disk.

Any agent can use it if its instructions tell it when to run the commands and how to treat the generated files.

## CLI requirement

The CLI should be available as `agent-context` on `PATH`:

```sh
agent-context --help
```

Until an npm package is published, install from a local checkout:

```sh
pnpm install
pnpm run build
npm install --global .
agent-context --help
```

After npm release, the intended install command is:

```sh
npm install --global agent-context
```

## Portable instruction

Copy this into the instruction mechanism your agent supports, such as `AGENTS.md`, `CLAUDE.md`, repository rules, memories, or a custom prompt:

```md
At the start of non-trivial work, run `agent-context context` to restore current focus, quirks, and recent progress.

After meaningful changes, validation runs, or decisions, append a short note with `agent-context progress append`.

Before stopping with unfinished work, create a handoff with `agent-context handoff create <slug>`.

Create durable planning notes with `agent-context doc create <feature|architecture|research> <slug>` when a plan or decision should survive beyond the current session.

Do not store secrets, tokens, or credentials.

Do not silently rewrite `current-focus.md` or `QUIRKS.md`; ask first, make explicitly requested edits only, or propose changes in progress/handoff notes.
```
