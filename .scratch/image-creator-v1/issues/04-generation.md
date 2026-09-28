# Generation

Status: open

Send the Prompt to the configured OpenAI-compatible image API and show the resulting Candidate in the preview, with progress, cancel and error reporting.

## Acceptance criteria

- The provider interface has one implementation for the OpenAI-compatible Images protocol, using the Provider settings from the main process.
- The requested size is the configured model's supported size with the closest aspect ratio to the Output size; unknown models use 1024×1024. This selection is unit-tested.
- The transparent-background checkbox is sent with the request and remembered across restarts.
- Generate and Ctrl+Enter start a Generation; only one runs at a time.
- While running: a spinner, the elapsed time and a Cancel button. Cancel aborts the request and creates no Candidate.
- API and network errors show in an inline error banner with the API's message.
- A successful Generation adds a Candidate (image as returned plus its Prompt) and shows it in the preview.

## Steps

1. Add the model size table and closest-aspect selection with unit tests.
2. Add the provider interface and the OpenAI-compatible implementation with abort support.
3. Expose generate and cancel through IPC and the preload bridge.
4. Add the Prompt input, transparent-background checkbox and Generate button with Ctrl+Enter.
5. Add the running state with spinner, elapsed time and Cancel, and the error banner.
6. Show the new Candidate in the preview and persist the transparent-background setting.

## Open decisions (ask the user before starting)

- Which models go into the size table initially (e.g. gpt-image-1, gpt-image-1-mini, dall-e-3, dall-e-2)?
- Request timeout: none (rely on Cancel), or a fixed limit such as 120 s?
