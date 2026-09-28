# Project scaffold

Status: open

Set up the Electron app skeleton so that later issues have a main process, a preload bridge and a React renderer to build on, plus checks the user can run on the host.

## Acceptance criteria

- The app starts in dev mode and shows one window with a React-rendered placeholder.
- Context isolation is on, node integration in the renderer is off, and a typed preload bridge exists (empty for now).
- `pnpm check` runs Biome (lint + format) with single quotes.
- A unit test runner is configured with one passing sample test, and `pnpm test` runs it.
- `node node_modules/typescript/bin/tsc --noEmit` passes.
- `CLAUDE.md` "Project state" describes the real structure and scripts.

## Steps

1. 📦 Add Electron Forge with the Vite plugin and TypeScript; main and preload processes open a blank window.
2. 📦 Add React to the renderer and render a placeholder main view.
3. 📦 Add Biome configuration and the `check` script.
4. 📦 Add the unit test runner, the `test` script and a sample test.
5. Update `CLAUDE.md` to describe the project structure and scripts.

## Open decisions (ask the user before starting)

- Unit test runner: Vitest (recommended, shares the Vite config) or another?
- End-to-end tests: CLAUDE.md mentions Cypress, which does not drive Electron well; use Playwright's Electron support instead, or skip E2E in v1?
