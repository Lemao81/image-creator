# ImageCreator v1 plan

## [01 Scaffold and end-to-end harness](issues/01-scaffold-and-e2e-harness.md)

- [ ] 1.1 📦 Add Electron Forge with Vite and TypeScript and a context-isolated window
- [ ] 1.2 📦 Render an empty main view with React
- [ ] 1.3 📦 Add Biome configuration and the check script
- [ ] 1.4 📦 Add the Playwright harness, fake image API server and launch test
- [ ] 1.5 Update CLAUDE.md with project structure and scripts

## [02 Provider settings](issues/02-provider-settings.md)

- [ ] 2.1 Add the settings store with the encrypted API key
- [ ] 2.2 Add the settings view with icon button, back arrow and Save
- [ ] 2.3 Open the settings view on first run

## [03 Generate and Accept tracer bullet](issues/03-generate-and-accept-tracer-bullet.md)

- [ ] 3.1 Add the provider interface and OpenAI-compatible Generation
- [ ] 3.2 Add the Prompt input, Generate button and preview
- [ ] 3.3 Add Accept writing the Candidate through the Save dialog

## [04 Test connection](issues/04-test-connection.md)

- [ ] 4.1 Add Test connection

## [05 Generation progress and errors](issues/05-generation-progress-and-errors.md)

- [ ] 5.1 Add the running state with spinner, elapsed time and Cancel
- [ ] 5.2 Add the error banner
- [ ] 5.3 Add Ctrl+Enter to start a Generation

## [06 Candidate history](issues/06-candidate-history.md)

- [ ] 6.1 Add the Candidate history slider with navigation and position
- [ ] 6.2 Add the Prompt caption and "use this prompt"

## [07 Filename and remembered Save folder](issues/07-filename-and-save-folder.md)

- [ ] 7.1 Prefill the Save dialog with the filename slug
- [ ] 7.2 Remember the last Save folder across restarts

## [08 Output size](issues/08-output-size.md)

- [ ] 8.1 Add the width and height combo boxes with coupling and persistence
- [ ] 8.2 Choose the generation size from the model size table
- [ ] 8.3 📦 Add the image library and crop and resize on Accept
- [ ] 8.4 Add the live crop preview and the upscaling warning

## [09 JPEG, WebP and transparent background](issues/09-jpeg-webp-and-transparency.md)

- [ ] 9.1 Add the Output format dropdown with PNG, JPEG and WebP
- [ ] 9.2 Add the transparent-background checkbox
- [ ] 9.3 Add the JPEG transparency hint

## [10 ICO output](issues/10-ico-output.md)

- [ ] 10.1 Add ICO to the Output format dropdown with the size constraints
- [ ] 10.2 📦 Write multi-resolution ICO files on Accept
