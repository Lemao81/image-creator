# Provider settings

Status: open

Let the user configure the image API (base URL, API key, model) in a settings view, persist it on disk with the key encrypted, and verify it with a connection test.

## Acceptance criteria

- A settings icon button in the main view opens the settings view; a back arrow returns to the main view.
- Base URL, API key and model can be entered and are persisted by Save; they are restored on app start.
- The API key is encrypted with `safeStorage` on disk and is never sent to the renderer. The field shows whether a key is set, without revealing it.
- Test connection calls `GET {baseUrl}/models` with the entered values and shows success or the error message.
- When no Provider settings exist at start, the settings view opens automatically.
- The settings store is covered by unit tests.

## Steps

1. Add the settings store in the main process: a JSON file in the user-data folder with the API key encrypted via `safeStorage`.
2. Expose load and save of Provider settings through IPC and the preload bridge.
3. Add the settings view with the icon button, back arrow and Save.
4. Add Test connection.
5. Open the settings view automatically on start when no Provider settings exist.

## Open decisions (ask the user before starting)

- Should the API key field allow revealing the stored key, or only replacing it?
