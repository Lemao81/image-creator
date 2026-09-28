# 03: Generate and Accept tracer bullet

**What to build:** The thinnest complete path through the app: the user types a Prompt, presses Generate, and the Candidate returned by the image API appears in the preview. Pressing Accept opens the Save dialog and writes the Candidate as a PNG file, byte for byte as the API returned it. No Output size, Output format, history, progress or error handling yet.

**Blocked by:** 02 Provider settings.

**Status:** ready-for-agent

- [ ] Generation goes through a provider interface with one OpenAI-compatible implementation (ADR 0001), running in the main process with the stored Provider settings.
- [ ] The request carries the Prompt and the configured model and asks for base64 image data.
- [ ] The resulting Candidate (image plus its Prompt) is shown in the preview.
- [ ] Accept opens a native Save dialog; confirming writes the Candidate as a PNG, cancelling writes nothing.
- [ ] End-to-end tests: the fake API receives Prompt and model and returns a fixture image; the preview shows it; Accept with a stubbed Save dialog writes a PNG identical to the fixture.

## Steps

1. Add the provider interface and the OpenAI-compatible Generation in the main process, exposed through the preload bridge, with the image endpoint in the fake server.
2. Add the Prompt input, Generate button and preview, with an end-to-end test.
3. Add Accept writing the Candidate through the Save dialog, with an end-to-end test.
