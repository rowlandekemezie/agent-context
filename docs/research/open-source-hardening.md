# Open Source Hardening Notes

This document captures the project-hardening guidance for turning `ai-work` from a personal script into a small OSS CLI.

## Target Users

1. Solo developers using AI coding agents.
2. Teams experimenting with agent-assisted development.
3. Maintainers who want durable project memory without adopting a large framework.
4. Developers who prefer transparent Markdown files over proprietary memory systems.

## Maintainer Priorities

The project should feel trustworthy before it grows features.

Priority order:

1. Clear positioning.
2. Installable package.
3. Predictable CLI behavior.
4. Characterization tests.
5. CI.
6. Documentation.
7. Refactor/TypeScript migration.
8. New features.

## What Not To Build Yet

Do not add these before the core CLI is polished:

- cloud sync
- plugins
- AI provider integrations
- a database
- a web UI
- multi-user collaboration
- Cucumber step-definition infrastructure
- a broad task-management model

## Testing Strategy

Use Vitest. Keep the most important tests black-box:

- spawn `node ai-work.mjs ...`
- set temp `cwd`
- set temp `AI_WORK_HOME`
- assert stdout/stderr/exit code
- inspect generated Markdown files

Use descriptive Gherkin-style names:

```js
it('Given a new project, when init runs, then it creates the base project memory layout', async () => {
  // ...
});
```

Do not add Cucumber unless non-engineers will read/write `.feature` files or the CLI becomes workflow-heavy enough to justify separate executable specifications.

## TypeScript Guidance

Use TypeScript later, not first.

Reasons to defer:

- current CLI already works
- tests should define the user-facing contract first
- TypeScript migration adds package/build complexity
- behavior-preserving refactor is easier after black-box tests exist

Adopt TypeScript when:

- command handlers split into modules
- a reusable core API emerges
- storage schemas become more complex
- contributor surface area grows

## Release Readiness Checklist

Before `0.1.0` public release:

- [x] package metadata exists
- [x] README exists
- [x] MIT license exists
- [x] changelog exists
- [x] Vitest characterization tests exist
- [x] package dry run exists
- [ ] CI exists and passes remotely
- [x] `--help` behavior exists
- [x] `--version` behavior exists
- [ ] command docs exist
- [ ] storage format docs exist
- [ ] GitHub repo URL is added to package metadata
- [ ] package name availability is confirmed
