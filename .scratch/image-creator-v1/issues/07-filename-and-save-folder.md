# 07: Filename and remembered Save folder

**What to build:** On Accept, the Save dialog is prefilled with a meaningful filename derived from the Candidate's Prompt (e.g. `red-fox-in-snow.png`) and opens in the folder the user saved to last, also after a restart.

**Blocked by:** 03 Generate and Accept tracer bullet.

**Status:** ready-for-agent

- [ ] The default filename is the Prompt as lower-case words joined by hyphens, stripped of characters invalid in filenames, plus the extension.
- [ ] The Save dialog opens in the last Save folder; the folder is persisted and restored after relaunch.
- [ ] End-to-end tests inspect the options passed to the stubbed Save dialog, including after a relaunch.

## Steps

1. Prefill the Save dialog with the filename slug, with end-to-end tests.
2. Remember the last Save folder across restarts, with end-to-end tests.

## Open decisions (ask the user before starting)

- Maximum length of the filename slug (e.g. first 6 words or 50 characters)?
