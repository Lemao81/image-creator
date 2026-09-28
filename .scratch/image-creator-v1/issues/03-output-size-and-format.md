# Output size and format controls

Status: open

Add the main-view controls for Output size and Output format, with the width-to-height coupling and the ICO constraints, and remember the last values across restarts.

## Acceptance criteria

- Width and height are editable combo boxes with presets 16, 32, 48, 64, 128, 256, 512, 768, 1024, 1536, 2048; typed integers from 1 to 4096 are accepted and anything else is flagged as invalid.
- Changing width always sets height to the same value; height can then be changed independently.
- Output format offers PNG, JPEG, WebP and ICO.
- With ICO, the size is limited to 256 and height is locked to width.
- The last Output size and Output format are restored on app start.
- The size rules (validation, coupling, ICO constraint) are covered by unit tests.

## Steps

1. Add the Output size rules as a pure module with unit tests.
2. Add the editable combo box component and the width and height controls.
3. Add the Output format dropdown with the ICO constraints.
4. Persist and restore the last Output size and Output format.

## Open decisions (ask the user before starting)

- When switching to ICO with a width above 256, clamp it to 256 automatically or flag it as invalid?
