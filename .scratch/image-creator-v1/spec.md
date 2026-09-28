# ImageCreator v1

Status: ready-for-agent

## Problem Statement

Creating an image for a concrete purpose (an app icon, a banner, an illustration) with an AI image API is tedious. The user has to call the API by hand or through a web UI tied to one vendor. The API only produces a few fixed sizes and formats, so the result needs a separate image editor to crop, resize and convert it into the size and file type actually needed (for example a 256×256 ICO). Iterating on the description means juggling several downloaded files and losing track of which attempt was the good one.

## Solution

A desktop app where the user describes an image in a Prompt, picks the Output size and Output format they actually need, and runs a Generation against an image API they configured once. Every Generation adds a Candidate to a Candidate history that can be browsed like a slider. The user can keep refining the Prompt, compare the Candidates, and Accept the one they like. Accept writes an Output file with exactly the requested size and format, wherever they choose in a Save dialog. The API connection (base URL, API key, model) is configured in a settings view and remembered across restarts.

## User Stories

### Provider settings

1. As a user, I want a settings icon button in the main view, so that I can reach the Provider settings at any time.
2. As a user, I want the settings view to replace the main view with a back arrow, so that configuring the API does not clutter the main view.
3. As a user, I want to enter the base URL of the image API, so that I can use OpenAI, Azure OpenAI or any OpenAI-compatible gateway.
4. As a user, I want to enter my API key, so that the app can authenticate against the image API.
5. As a user, I want to enter the model name, so that I can choose which image model generates my Candidates.
6. As a user, I want an explicit Save button in the settings view, so that half-typed values are never used by accident.
7. As a user, I want my Provider settings restored when I restart the app, so that I configure the API only once.
8. As a user, I want my API key stored encrypted on disk, so that other programs or people browsing my files cannot read it.
9. As a user, I want the settings view to show whether an API key is set without revealing it, so that I know the configuration is complete.
10. As a user, I want a Test connection button, so that I can verify URL and key without spending money on a Generation.
11. As a user, I want Test connection to show the API's error message when it fails, so that I can tell a wrong URL from a wrong key.
12. As a first-time user, I want the settings view to open automatically when no Provider settings exist, so that I am guided to the one thing I must do first.

### Prompt and Generation

13. As a user, I want a multi-line Prompt input, so that I can describe the image in detail.
14. As a user, I want a Generate button, so that I can send my Prompt to the image API.
15. As a keyboard user, I want Ctrl+Enter in the Prompt to start a Generation, so that I do not have to reach for the mouse.
16. As a user, I want a transparent-background checkbox, so that I can get images suitable for icons and overlays.
17. As a user, I want the transparent-background choice remembered across restarts, so that I do not re-tick it every session.
18. As a user, I want the app to ask the API for the supported size closest to my Output size's aspect ratio, so that as little as possible is cropped away later.
19. As a user of a model the app does not know, I want Generation to still work with a square default size, so that new or compatible models are usable.
20. As a user, I want a spinner and the elapsed time while a Generation runs, so that I know the app is working and how long it has taken.
21. As a user, I want a Cancel button during a Generation, so that I can abort a request I no longer want.
22. As a user, I want a cancelled Generation to add no Candidate, so that the Candidate history only contains real results.
23. As a user, I want to keep editing the Prompt while a Generation runs, so that I can prepare my next attempt.
24. As a user, I want Generate disabled while a Generation runs, so that I do not start overlapping requests by accident.
25. As a user, I want API and network errors shown in an inline error banner with the API's message, so that I understand what went wrong (invalid key, content policy, no connection).
26. As a user, I want the error banner to go away when I start the next Generation, so that stale errors do not confuse me.

### Output size and Output format

27. As a user, I want width and height as editable combo boxes with common presets, so that I can pick typical sizes quickly.
28. As a user, I want to type any width and height from 1 to 4096, so that I can get exactly the size I need.
29. As a user, I want invalid size input flagged, so that I cannot Accept an impossible size.
30. As a user, I want changing the width to set the height to the same value, so that square images need only one choice.
31. As a user, I want to change the height independently after that, so that I can still get non-square images.
32. As a user, I want to choose PNG, JPEG, WebP or ICO as Output format, so that the file fits where I will use it.
33. As a user choosing ICO, I want the size kept square and at most 256, so that I cannot produce an invalid icon.
34. As a user, I want my last Output size and Output format restored on restart, so that repeated work (e.g. a series of icons) needs no re-setup.

### Candidate history and preview

35. As a user, I want every Candidate of the session kept, so that a worse later attempt never costs me a good earlier one.
36. As a user, I want a new Candidate appended and shown immediately, so that I see the result of my latest Generation.
37. As a user, I want to step to the previous and next Candidate, so that I can compare attempts.
38. As a user, I want to see my position in the Candidate history (e.g. 3 / 7), so that I know how many attempts exist.
39. As a user, I want each Candidate to show the Prompt it came from, so that I know which wording produced it.
40. As a user, I want a "use this prompt" button on a Candidate, so that I can continue refining from a good attempt.
41. As a user, I want browsing Candidates never to overwrite my Prompt input, so that I do not lose unsent edits.
42. As a user, I want the preview to show the Candidate cropped to my current Output size's aspect ratio, so that I see what will actually be saved.
43. As a user, I want the preview to update when I change the Output size, so that I can judge different sizes without a new Generation.
44. As a user, I want a warning when the Output size is larger than the Candidate, so that I know the Output file will be upscaled and blurry.
45. As a user, I want a hint when I choose JPEG for a Candidate with transparency, so that I know the transparent areas will become white.

### Accept

46. As a user, I want an Accept button for the shown Candidate, so that I can turn it into an Output file.
47. As a user, I want a native Save dialog on Accept, so that I choose where the Output file goes.
48. As a user, I want the Save dialog prefilled with a filename derived from the Candidate's Prompt, so that files are meaningfully named without typing.
49. As a user, I want the Save dialog to open in the folder I used last, including after a restart, so that a series of files lands together.
50. As a user, I want the Output file to have exactly the Output size, so that it fits its destination without further editing.
51. As a user, I want the Candidate centre-cropped rather than stretched or padded, so that the image is never distorted.
52. As a user, I want the Output file in exactly the chosen Output format, so that it opens in the program I need it for.
53. As a user, I want JPEG Output files to have transparent areas turned white, so that they do not render with black or random backgrounds.
54. As a user creating an icon, I want the ICO to contain every standard size (16, 32, 48, 256) up to my Output size plus the Output size itself, so that Windows displays it crisply everywhere.
55. As a user, I want cancelling the Save dialog to write nothing, so that Accept is safe to try.
56. As a user, I want to see an error when the Output file cannot be written, so that I do not assume it was saved.
57. As a user, I want the Candidate history kept after Accept, so that I can Accept the same or another Candidate again, e.g. as a PNG and as an ICO.

## Implementation Decisions

- **Stack**: Electron Forge with the Vite plugin, TypeScript, React in the renderer. Biome for lint and format.
- **Process split**: all API calls, file writes, dialogs and persistence run in the main process. The renderer is sandboxed with context isolation and no node integration, and talks to the main process only through a narrow, typed preload bridge. The API key never reaches the renderer; the renderer only learns whether a key is set.
- **Preload bridge surface**: roughly these operations: load and save Provider settings; test the connection; start a Generation and cancel it; Accept a Candidate with an Output size and Output format; load and save the remembered main-view preferences.
- **Provider** (ADR 0001): a small provider interface with a single implementation for the OpenAI-compatible Images protocol. Generation calls the image-generation endpoint under the configured base URL with the Prompt, model, chosen generation size and background option, and asks for base64 image data. Test connection calls the models endpoint. Requests are abortable for Cancel.
- **Generation size selection**: a built-in table of known models and their supported sizes; the size whose aspect ratio is closest to the Output size wins; unknown models fall back to 1024×1024.
- **Candidate**: the image bytes exactly as returned by the API plus the Prompt it came from. It does not store Output size or Output format (ADR 0002). The Candidate history lives in renderer memory only.
- **Output pipeline** (ADR 0002): on Accept, the main process centre-crops and resizes the Candidate to the Output size, then encodes the Output format. JPEG flattens transparency onto white. ICO bundles the standard sizes (16, 32, 48, 256) up to the Output size plus the Output size. The image library choice is left open until that work starts (a native but fast library vs. a pure-JS one without packaging concerns).
- **Output size rules**: presets 16, 32, 48, 64, 128, 256, 512, 768, 1024, 1536, 2048; typed integers 1–4096. A width change always copies to height. With ICO, the maximum is 256 and height is locked to width.
- **Filename slug**: derived from the Candidate's Prompt, lower-case words joined by hyphens, plus the Output format's extension; the length limit is left open.
- **Persistence**: one JSON file in the app's user-data folder holding the Provider settings (API key encrypted via Electron `safeStorage`), the last Output size, Output format, transparent-background setting and last Save folder. The Prompt and the Candidate history are not persisted.
- **Settings view**: an in-app view replacing the main view, with a back arrow, explicit Save and Test connection. It opens automatically on start when no Provider settings exist.
- **Platform**: Windows first, packaged as a Windows installer; no Windows-specific code.

## Testing Decisions

- **One seam: the running app.** Tests are end-to-end, driving the real Electron app with Playwright's Electron support. Only the app's external boundaries are faked:
  - The image API is a local fake OpenAI-compatible HTTP server started by the tests. It serves fixture images for image generation, answers the models endpoint, can be set to fail or respond slowly, and records received requests.
  - The native Save dialog is stubbed from inside the test to return a path in a temp folder.
  - The user-data folder is a fresh temp folder per test, so first-run behaviour and persistence across restarts are tested by relaunching the app against it.
- **A good test checks only observable behaviour**: what the UI shows (preview, history position, captions, warnings, error banner, settings view), what the fake API received (Prompt, model, generation size, background option), and the Output file on disk (existence, dimensions, format, ICO contained sizes). Tests never reach into component state, IPC messages or internal modules.
- **Covered through this seam**: Provider settings persistence and first-run behaviour, Test connection success and failure, Generation with generation size selection, Cancel and error banner, the width-to-height coupling and ICO constraints, Candidate history navigation and "use this prompt", Accept with cropping, format conversion, JPEG flattening, multi-resolution ICO, filename prefill and remembered Save folder.
- **No unit-test seam in v1.** A second seam at the output pipeline (Candidate plus Output size and Output format in, file bytes out) may be added later if a rule proves hard to reach through the UI.
- **Prior art**: none yet; the repo has no tests. The first end-to-end test and the fake image API server become the prior art for all following ones.

## Out of Scope

- Image APIs other than the OpenAI-compatible Images protocol (Stability, Imagen, Replicate, user-defined request templates).
- Editing or refining a Candidate through the API's image-edit endpoint; every Generation starts from the Prompt alone.
- More than one Candidate per Generation.
- Generation parameters beyond Prompt, model, size and transparent background (quality, style, seed, negative prompts).
- Persisting the Candidate history or the Prompt across restarts; removing Candidates or capping the history.
- Output formats beyond PNG, JPEG, WebP and ICO; letterboxing or stretching instead of centre-cropping.
- A per-model editable list of supported sizes in the settings view.
- Revealing the stored API key.
- macOS and Linux installers, code signing and auto-update.

## Further Notes

- Terms follow `CONTEXT.md`. Decisions with lasting consequences are recorded in ADR 0001 (OpenAI-compatible Images protocol) and ADR 0002 (Output size applied locally).
- Supported sizes differ per model and change over time (e.g. gpt-image-1 supports 1024×1024, 1536×1024 and 1024×1536; dall-e-3 supports 1024×1024, 1792×1024 and 1024×1792); the built-in table must be easy to extend.
- `safeStorage` depends on an OS keyring; on Windows this is DPAPI and always available.
- In this sandbox `node_modules` comes from Windows, so the end-to-end tests run on the host, not in the sandbox.
