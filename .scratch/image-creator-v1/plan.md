# ImageCreator v1 plan

## [01 Project scaffold](issues/01-project-scaffold.md)

- [ ] 1.1 📦 Add Electron Forge with Vite and TypeScript and open a blank window
- [ ] 1.2 📦 Add React to the renderer with a placeholder main view
- [ ] 1.3 📦 Add Biome configuration and the check script
- [ ] 1.4 📦 Add the unit test runner, test script and sample test
- [ ] 1.5 Update CLAUDE.md with project structure and scripts

## [02 Provider settings](issues/02-provider-settings.md)

- [ ] 2.1 Add the settings store with the encrypted API key
- [ ] 2.2 Expose Provider settings through IPC and the preload bridge
- [ ] 2.3 Add the settings view with icon button, back arrow and Save
- [ ] 2.4 Add Test connection
- [ ] 2.5 Open the settings view on start when no Provider settings exist

## [03 Output size and format controls](issues/03-output-size-and-format.md)

- [ ] 3.1 Add the Output size rules module
- [ ] 3.2 Add the editable combo box and the width and height controls
- [ ] 3.3 Add the Output format dropdown with the ICO constraints
- [ ] 3.4 Persist and restore the last Output size and Output format

## [04 Generation](issues/04-generation.md)

- [ ] 4.1 Add the model size table and closest-aspect selection
- [ ] 4.2 Add the provider interface and the OpenAI-compatible implementation
- [ ] 4.3 Expose generate and cancel through IPC and the preload bridge
- [ ] 4.4 Add the Prompt input, transparency checkbox and Generate button
- [ ] 4.5 Add the running state with Cancel and the error banner
- [ ] 4.6 Show the new Candidate in the preview and persist transparency

## [05 Candidate history](issues/05-candidate-history.md)

- [ ] 5.1 Add the Candidate history state with selection and navigation
- [ ] 5.2 Add the slider UI with caption and "use this prompt"
- [ ] 5.3 Add the live crop preview for the current Output size
- [ ] 5.4 Add the upscaling warning and the JPEG transparency hint

## [06 Accept](issues/06-accept.md)

- [ ] 6.1 📦 Add the image processing library and PNG, JPEG and WebP conversion
- [ ] 6.2 📦 Add multi-resolution ICO output
- [ ] 6.3 Add the filename slug
- [ ] 6.4 Expose Accept through IPC with the Save dialog and remembered folder
- [ ] 6.5 Add the Accept button to the main view
