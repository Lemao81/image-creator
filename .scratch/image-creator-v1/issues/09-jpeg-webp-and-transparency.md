# 09: JPEG, WebP and transparent background

**What to build:** The user chooses the Output format (PNG, JPEG or WebP) and can ask for a transparent background. Accept writes the Output file in the chosen format; JPEG turns transparent areas white, and a hint warns about this when the shown Candidate has transparency. The format and the transparent-background setting are remembered.

**Blocked by:** 08 Output size.

**Status:** ready-for-agent

- [ ] An Output format dropdown offers PNG, JPEG and WebP; Accept writes that format with the matching extension.
- [ ] JPEG Output files have transparent areas flattened onto white.
- [ ] A transparent-background checkbox is sent with the Generation.
- [ ] A hint is shown when JPEG is chosen and the shown Candidate has transparency.
- [ ] The last Output format and transparent-background setting are restored after relaunch.
- [ ] End-to-end tests check the written file's format, the flattened pixels of a JPEG from a transparent fixture, the background option received by the fake API, the hint and the restored settings.

## Steps

1. Add the Output format dropdown with PNG, JPEG and WebP conversion and persistence, with end-to-end tests.
2. Add the transparent-background checkbox with persistence, with end-to-end tests.
3. Add the JPEG transparency hint, with an end-to-end test.
