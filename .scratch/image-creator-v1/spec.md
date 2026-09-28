# ImageCreator v1

A desktop app that creates image files from a Prompt using a configurable, OpenAI-compatible image API. The user iterates on the Prompt, browses the resulting Candidates and Accepts one into an Output file. Terms follow `CONTEXT.md`; the key decisions are recorded in `docs/adr/0001` and `docs/adr/0002`.

## Stack and architecture

- Electron Forge with the Vite plugin, TypeScript, and React in the renderer.
- All API calls and file writes run in the main process. The renderer uses a narrow preload bridge with context isolation, and the API key never reaches the renderer.
- Only the OpenAI-compatible Images protocol is spoken, behind a provider interface (ADR 0001).
- Windows first; no Windows-specific code.

## Main view

- **Prompt**: multi-line input. Ctrl+Enter starts a Generation.
- **Output size**: width and height as editable combo boxes.
  - Presets: 16, 32, 48, 64, 128, 256, 512, 768, 1024, 1536, 2048. Typed values from 1 to 4096 are allowed.
  - Changing width always copies the value into height; height can then be changed independently.
- **Output format**: PNG, JPEG, WebP or ICO.
  - With ICO, the size is square and at most 256, and height stays locked to width.
- **Transparent background**: a checkbox, sent with the Generation.
- **Generate**:
  - Only one Generation runs at a time. While it runs, a spinner, the elapsed time and a Cancel button are shown.
  - Cancel aborts the request, and no Candidate is created.
  - The Prompt stays editable during a Generation.
  - API errors appear in an inline error banner above the preview, showing the API's message.
- **Candidate history**: a slider over all Candidates of the session, newest added at the end.
  - Each Candidate shows its Prompt as a caption, with a "use this prompt" button. Browsing never overwrites the Prompt input.
  - The preview shows the Candidate cropped to the current Output size.
  - A warning is shown when the Output size exceeds the Candidate's pixel size (upscaling).
  - A hint is shown when the format is JPEG and the Candidate has transparency.
  - Held in memory only, with no removal and no cap.
- **Accept**: see below.
- A settings icon button opens the settings view.

## Generation

- The API is asked for the supported size of the configured model whose aspect ratio is closest to the Output size. Supported sizes come from a built-in table of known models; unknown models fall back to 1024×1024.
- Each Generation yields exactly one Candidate. It stores the image as returned by the API plus its Prompt.
- Output size and Output format are not part of the Candidate; they are read at Accept time (ADR 0002).

## Accept

- The selected Candidate is centre-cropped and resized to the Output size, then converted to the Output format:
  - JPEG: transparent pixels become white.
  - ICO: a multi-resolution file containing every standard size (16, 32, 48, 256) up to the Output size, plus the Output size itself.
- A native Save dialog opens:
  - It is prefilled with a filename slug from the Candidate's Prompt (e.g. `red-fox-in-snow.png`) and the last Save folder.
  - Cancelling the dialog writes nothing.
- The Candidate history stays unchanged, so the same Candidate can be Accepted again with another size or format.

## Settings view

- An in-app view that replaces the main view, with a back arrow.
- Fields: base URL, API key, model.
- **Save** persists the Provider settings.
- **Test connection** calls `GET {baseUrl}/models` with the entered values and reports success or the error.
- Opens automatically on start when no Provider settings exist.

## Persistence

- Provider settings are stored in a JSON file in the app's user-data folder. The API key is encrypted with Electron `safeStorage`.
- The last Output size, Output format, transparent-background setting and Save folder are also stored.
- The Prompt and the Candidate history are not persisted.
