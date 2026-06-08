# Open Source Hardening Notes

Keep the project boring and trustworthy.

## Priorities

1. Clear README.
2. Predictable CLI behavior.
3. Tests around real filesystem behavior.
4. Safe defaults that never touch user files during tests.
5. Small release process.

## Do not build yet

- cloud sync
- AI provider integrations
- plugin system
- web UI
- database storage
- full BDD/Cucumber setup
- task-manager features

## Testing rule

The highest-value tests run the built CLI against temporary directories and assert generated Markdown files.

Use descriptive test names. Do not add extra test tooling unless it solves a real maintainer problem.
