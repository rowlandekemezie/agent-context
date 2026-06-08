# ai-work Implementation Plan

`ai-work` is being shaped into a small, credible OSS CLI for local-first Markdown memory in AI-assisted software development.

## Product Positioning

Working tagline:

> Local-first Markdown memory for AI-assisted software development.

Core promise:

> Keep current focus, project quirks, progress logs, handoffs, and planning docs in durable Markdown so humans and AI agents can resume work with context.

`ai-work` is:

- local-first
- Markdown-based
- CLI-driven
- agent-consumable
- easy to inspect and edit by hand

`ai-work` is not:

- a task manager
- a Jira/Linear replacement
- a database
- an AI API wrapper
- an agent framework
- a sync service

## Guiding Decisions

| Question | Decision |
|---|---|
| Should this become OSS? | Yes, if kept intentionally small and polished |
| First implementation step | Package + docs + characterization tests |
| Rewrite first? | No |
| TypeScript? | Yes later, after tests lock current behavior |
| Test runner | Vitest |
| E2E style | Gherkin-style Vitest descriptions |
| Full Cucumber/Gherkin tooling | Not initially |
| Package manager | pnpm |
| Minimum Node | Node 20+ |
| License | MIT |
| Build system | Plain `tsc` later, no bundler initially |

## Milestone 1 — OSS Package Skeleton

Status: complete.

Goal: make the project installable and recognizable as an npm package.

Completed:

- `package.json`
- `pnpm-lock.yaml`
- `README.md`
- `LICENSE`
- `CHANGELOG.md`
- `.gitignore`
- `vitest.config.js`
- package dry-run script

Acceptance criteria:

- `pnpm install` succeeds
- `pnpm run check` succeeds
- `pnpm test` succeeds
- `pnpm run pack:dry-run` includes expected publish files

## Milestone 2 — Characterization Tests

Status: complete for first pass.

Goal: lock down current CLI behavior before refactoring.

Current coverage:

- `init`
- `info`
- `context`
- `progress path`
- `progress list`
- `progress append` from stdin
- `progress append` from file
- empty progress append failure
- `handoff create`
- `handoff list`
- `handoff consume`
- no pending handoffs
- `doc create`
- `doc list`
- invalid doc type
- unknown command usage
- default project-name behavior

Test principles:

- Run the real CLI in subprocesses.
- Use temporary directories for filesystem isolation.
- Set `AI_WORK_HOME` and `AI_WORK_PROJECT` in tests.
- Never write tests against the real user config directory.
- Prefer Gherkin-style test names without introducing Cucumber yet.

## Milestone 3 — OSS UX Hardening

Status: in progress.

Goal: make the CLI predictable for first-time users.

Tasks:

- [x] Add explicit `--help` and `help` behavior.
- [x] Add explicit `--version` behavior.
- [x] Improve usage output formatting.
- [ ] Ensure invalid commands produce actionable messages.
- [x] Add tests for help/version/usage behavior.
- [ ] Consider making command errors include examples.

Acceptance criteria:

- `ai-work --help` exits successfully and prints command reference.
- `ai-work help` exits successfully and prints command reference.
- `ai-work --version` exits successfully and prints package version.
- Existing characterization tests still pass.

## Milestone 4 — CI and Package Validation

Status: in progress.

Goal: verify every change with the same checks maintainers expect locally.

Tasks:

- Add GitHub Actions workflow.
- Run on pull requests and pushes to `main`.
- Use pnpm with frozen lockfile.
- Run syntax check, tests, and package dry run.
- Test Node 20 and 22 initially.

Acceptance criteria:

- CI installs dependencies with pnpm.
- CI runs `pnpm run check`.
- CI runs `pnpm test`.
- CI runs `pnpm run pack:dry-run`.

## Milestone 5 — Documentation Depth

Status: not started.

Goal: make the project understandable without reading source.

Tasks:

- Add `docs/commands.md`.
- Add `docs/storage-format.md`.
- Add `docs/workflows.md`.
- Add `docs/adr/0001-local-first-markdown-store.md`.
- Add `docs/adr/0002-characterization-before-typescript.md`.
- Link docs from README.

Acceptance criteria:

- New users understand where files are written.
- Maintainers understand why TypeScript migration is deferred.
- Contributors understand the current testing strategy.

## Milestone 6 — Storage Convention Decision

Status: not started.

Current default:

```txt
~/.config/ai-work/dev-plans/<project-name>/
```

Open question: should OSS users be able to opt into repo-local storage?

Possible future option:

```sh
ai-work init --local
```

which could create:

```txt
.ai-work/
```

Decision guidance:

- Keep current global config default until docs/tests are mature.
- Consider repo-local storage only after clarifying migration and privacy implications.
- Do not silently change the existing default storage layout.

## Milestone 7 — TypeScript Migration

Status: deferred.

Goal: improve maintainability without changing user-facing behavior.

Prerequisites:

- Characterization tests passing.
- Help/version behavior covered.
- CI passing.
- Package dry run passing.

Recommended structure:

```txt
src/
  cli.ts
  commands/
    init.ts
    info.ts
    context.ts
    progress.ts
    handoff.ts
    doc.ts
  core/
    paths.ts
    dates.ts
    files.ts
    markdown.ts
    errors.ts
    clock.ts
```

Build approach:

- Native ESM TypeScript.
- `tsc` only at first.
- Emit to `dist/`.
- Package `bin` points to `./dist/cli.js`.
- Avoid bundling until there is a clear reason.

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| TypeScript migration breaks behavior | Characterization tests first |
| Tests write to real user files | Use temp dirs and `AI_WORK_HOME` in every test |
| Gherkin tooling adds friction | Use Gherkin-style Vitest names only |
| Project becomes overengineered | Keep scope to CLI + Markdown memory |
| Storage layout changes break users | Document layout and defer layout changes |
| Package publishes wrong files | Keep `pnpm run pack:dry-run` in CI |
