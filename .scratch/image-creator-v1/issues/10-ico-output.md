# 10: ICO output

**What to build:** The user chooses ICO as Output format to create an app icon. The size is kept square and at most 256, and Accept writes a multi-resolution `.ico` containing every standard size (16, 32, 48, 256) up to the Output size plus the Output size itself.

**Blocked by:** 09 JPEG, WebP and transparent background.

**Status:** ready-for-agent

- [ ] ICO is offered in the Output format dropdown.
- [ ] With ICO, the size is at most 256 and the height stays locked to the width.
- [ ] Accept writes an `.ico` containing the standard sizes up to the Output size plus the Output size.
- [ ] End-to-end tests cover the size constraints and parse the written `.ico` to check the contained sizes.

## Steps

1. Add ICO to the Output format dropdown with the size constraints, with end-to-end tests.
2. 📦 Write multi-resolution ICO files on Accept, with end-to-end tests.

## Open decisions (ask the user before starting)

- When switching to ICO with a width above 256: clamp it to 256 automatically, or flag it as invalid?
