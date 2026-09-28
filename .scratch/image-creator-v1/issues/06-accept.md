# Accept

Status: open

Turn the selected Candidate into an Output file with the exact Output size and Output format, written to a location chosen in a native Save dialog.

## Acceptance criteria

- The selected Candidate is centre-cropped and resized to the Output size, then converted to the Output format.
- JPEG output replaces transparency with white.
- ICO output contains every standard size (16, 32, 48, 256) up to the Output size plus the Output size itself.
- The Save dialog is prefilled with a filename slug from the Candidate's Prompt plus the format extension, and opens in the last Save folder, which is remembered across restarts.
- Cancelling the dialog writes nothing; a write error is shown to the user.
- The Candidate history is unchanged after Accept.
- Cropping, resizing, conversion and the filename slug are covered by unit tests.

## Steps

1. 📦 Add the image processing library and the crop, resize and convert module for PNG, JPEG and WebP with unit tests.
2. 📦 Add ICO output with multiple resolutions.
3. Add the filename slug with unit tests.
4. Expose Accept through IPC with the Save dialog and the remembered Save folder.
5. Add the Accept button to the main view.

## Open decisions (ask the user before starting)

- Image library: `sharp` (fast, native binary that must be unpacked from the asar archive when packaging) or a pure-JS library such as `jimp` (slower, no native packaging issues)?
- Maximum length of the filename slug (e.g. first 6 words or 50 characters)?
