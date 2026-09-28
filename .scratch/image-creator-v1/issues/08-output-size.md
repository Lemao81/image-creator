# 08: Output size

**What to build:** The user picks the Output size with two editable combo boxes (presets or typed values); changing the width copies it into the height, which can then be adjusted independently. The API is asked for the configured model's supported size with the closest aspect ratio, the preview shows the Candidate centre-cropped to the Output size's aspect ratio, and Accept writes a file of exactly the Output size (ADR 0002). A warning appears when the Output file would be upscaled. The last Output size is remembered.

**Blocked by:** 03 Generate and Accept tracer bullet.

**Status:** ready-for-agent

- [ ] Width and height offer presets 16, 32, 48, 64, 128, 256, 512, 768, 1024, 1536, 2048 and accept typed integers 1–4096; invalid input is flagged and blocks Accept.
- [ ] Changing the width always sets the height to the same value.
- [ ] The generation size is the configured model's supported size with the closest aspect ratio; unknown models use 1024×1024.
- [ ] The preview shows the shown Candidate centre-cropped to the Output size's aspect ratio and updates live when the size changes.
- [ ] A warning is shown when the Output size exceeds the Candidate's pixel size.
- [ ] Accept writes a PNG with exactly the Output size, centre-cropped and resized.
- [ ] The last Output size is restored after relaunch.
- [ ] End-to-end tests cover the width-to-height coupling, validation, the generation size received by the fake API for known and unknown models, the Output file's dimensions, the upscaling warning and the restored size.

## Steps

1. Add the width and height combo boxes with validation, coupling and persistence, with end-to-end tests.
2. Choose the generation size from the model size table, with end-to-end tests.
3. 📦 Add the image library and crop and resize the Output file on Accept, with end-to-end tests.
4. Add the live crop preview and the upscaling warning, with end-to-end tests.

## Open decisions (ask the user before starting)

- Image library: `sharp` (fast, native binary that must be unpacked from the asar archive when packaging) or a pure-JS library such as `jimp` (slower, no native packaging issues)?
- Which models go into the size table initially (e.g. gpt-image-1, gpt-image-1-mini, dall-e-3, dall-e-2)?
