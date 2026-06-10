# Roadmap

## Current status

Completed:

- TypeScript CLI in `src/`
- generated `dist/` build output
- pnpm package setup
- Vitest characterization tests
- command help/version behavior
- docs for commands and storage
- portable agent instructions
- documented ownership model for agent-managed vs human-directed context
- GitHub Actions CI workflow
- GitHub repository and package metadata

## Near-term work

1. Dogfood on real projects.
2. Decide whether repo-local storage should be supported, for example:

   ```sh
   agent-context init --local
   ```

## Release checklist

Before any npm release:

- [ ] GitHub repo exists
- [ ] package name availability checked
- [ ] npm package install steps defined and verified
- [ ] CI passes remotely
- [ ] `pnpm run check` passes
- [ ] `pnpm test` passes
- [ ] `pnpm run pack:dry-run` includes expected files
- [ ] storage format considered stable enough for `0.1.x`

## Product boundary

`agent-context` is not a task manager, issue tracker, agent framework, sync service, database, or AI API wrapper.

It is a small CLI for durable Markdown context across AI-assisted development sessions.
