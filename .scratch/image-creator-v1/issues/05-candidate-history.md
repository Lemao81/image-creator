# Candidate history

Status: open

Turn the single preview into a slider over all Candidates of the session, with a live crop preview for the current Output size.

## Acceptance criteria

- Every Candidate of the session is kept in memory in creation order; a new Candidate is appended and becomes the selected one.
- The user can navigate to the previous and next Candidates and sees the position (e.g. 3 / 7).
- The selected Candidate shows its Prompt as a caption and a "use this prompt" button that copies it into the Prompt input; browsing alone never changes the Prompt input.
- The preview shows the selected Candidate centre-cropped to the current Output size aspect ratio and updates live when size changes.
- A warning is shown when the Output size exceeds the Candidate's pixel size.
- A hint is shown when the Output format is JPEG and the selected Candidate has transparency.

## Steps

1. Add the Candidate history state with selection and navigation.
2. Add the slider UI with position indicator, caption and "use this prompt".
3. Add the live crop preview for the current Output size.
4. Add the upscaling warning and the JPEG transparency hint.

## Open decisions (ask the user before starting)

- Should the slider also show a strip of thumbnails, or only previous and next arrows?
- Keyboard navigation with the arrow keys: yes or no?
