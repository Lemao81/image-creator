# 02: Provider settings

**What to build:** The user opens the settings view from an icon button in the main view, enters base URL, API key and model, saves them, and finds them restored after a restart. The API key is encrypted on disk and never reaches the renderer; the view only shows whether a key is set. On a first start without Provider settings, the settings view opens automatically.

**Blocked by:** 01 Scaffold and end-to-end harness.

**Status:** ready-for-agent

- [ ] A settings icon button opens the settings view; a back arrow returns to the main view.
- [ ] Base URL, API key and model are persisted by an explicit Save and restored after relaunch.
- [ ] The API key is stored encrypted with `safeStorage`; the settings file does not contain it in plain text.
- [ ] The settings view shows whether an API key is set without revealing it; leaving the key field empty on Save keeps the stored key.
- [ ] Starting with an empty user-data folder opens the settings view directly.
- [ ] End-to-end tests cover saving, restoring after relaunch, the encrypted key and the first-run behaviour.

## Steps

1. Add the settings store in the main process with the encrypted API key, exposed through the preload bridge.
2. Add the settings view with icon button, back arrow and Save, with end-to-end tests.
3. Open the settings view on first run, with an end-to-end test.
