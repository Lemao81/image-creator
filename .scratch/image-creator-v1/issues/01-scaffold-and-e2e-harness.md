# 01: Scaffold and end-to-end harness

**What to build:** The app starts as a Windows desktop app showing an empty main view, and an end-to-end test proves it. This is the prefactoring every later ticket builds on: the process split with a typed preload bridge, the Biome check, a Windows installer build, and the end-to-end harness with its fake image API server and per-test temp user-data folder.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] The app starts in dev mode and shows one window with a React-rendered, empty main view.
- [ ] The renderer runs with context isolation, without node integration, and reaches the main process only through a typed preload bridge.
- [ ] A Windows installer can be built.
- [ ] `pnpm check` runs Biome lint and format with single quotes.
- [ ] `pnpm test:e2e` launches the app with Playwright against a fresh temp user-data folder and asserts that the main view is shown.
- [ ] A fake OpenAI-compatible HTTP server can be started and stopped by tests (no endpoints yet).
- [ ] `CLAUDE.md` "Project state" describes the real structure and scripts.

## Steps

1. 📦 Add Electron Forge with the Vite plugin and TypeScript; the main process opens a window through a context-isolated preload.
2. 📦 Render an empty main view with React.
3. 📦 Add Biome configuration and the `check` script.
4. 📦 Add the Playwright end-to-end harness with the fake image API server and an app launch test.
5. Update `CLAUDE.md` with the project structure and scripts.

## Open decisions (ask the user before starting)

- Windows installer maker: Squirrel (Forge default, per-user, auto-update friendly) or WiX/MSI? **Answer:** Squirrel.
