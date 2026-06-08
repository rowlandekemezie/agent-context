# Roadmap

## Current status

Completed:

- TypeScript CLI in `src/`
- `dist/` build output
- pnpm package setup
- Vitest characterization tests
- command help/version behavior
- docs for commands and storage
- Zed agent skill in `skills/agent-context`
- GitHub Actions CI workflow

## Near-term work

1. Dogfood on real projects.
2. Push to `github.com/rowlandekemezie/agent-context`.
3. Confirm GitHub install works:

   ```sh
   pnpm add --global github:rowlandekemezie/agent-context
   ```

4. Add repository metadata to `package.json` after the GitHub repo exists.
5. Decide whether repo-local storage should be supported, for example:

   ```sh
   agent-context init --local
   ```

## Release checklist

Before any npm release:

- [ ] GitHub repo exists
- [ ] package name availability checked
- [ ] README install steps verified
- [ ] CI passes remotely
- [ ] `pnpm run check` passes
- [ ] `pnpm test` passes
- [ ] `pnpm run pack:dry-run` includes expected files
- [ ] storage format considered stable enough for `0.1.x`

## Product boundary

`agent-context` is not a task manager, issue tracker, agent framework, sync service, database, or AI API wrapper.

It is a small CLI for durable Markdown context across AI-assisted development sessions.
