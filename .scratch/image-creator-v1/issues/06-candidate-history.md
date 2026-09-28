# 06: Candidate history

**What to build:** Every Generation of the session adds a Candidate to the Candidate history, which the user browses like a slider: previous and next, with the position shown. Each Candidate shows the Prompt it came from and offers "use this prompt" to copy it into the Prompt input; browsing alone never changes the Prompt input. Accept works on the shown Candidate and leaves the history unchanged.

**Blocked by:** 03 Generate and Accept tracer bullet.

**Status:** ready-for-agent

- [ ] A new Candidate is appended to the Candidate history and shown.
- [ ] Previous and next navigate the Candidates; the position is shown (e.g. 3 / 7).
- [ ] The shown Candidate's Prompt appears as a caption with a "use this prompt" button.
- [ ] Browsing does not change the Prompt input; "use this prompt" replaces it.
- [ ] Accept writes the shown Candidate; the history is unchanged afterwards.
- [ ] End-to-end tests with distinct fixture images per Generation cover navigation, captions, "use this prompt" and Accepting an earlier Candidate.

## Steps

1. Add the Candidate history slider with navigation and position, with end-to-end tests.
2. Add the Prompt caption and "use this prompt", with end-to-end tests.

## Open decisions (ask the user before starting)

- Should the slider also show a strip of thumbnails, or only previous and next?
- Keyboard navigation with the arrow keys: yes or no?
