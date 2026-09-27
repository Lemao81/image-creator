# Issue tracker: Local Markdown

Issues and specs for this repo live as markdown files in `.scratch/`.

## Conventions

- One feature per directory: `.scratch/<feature-slug>/`
- The spec is `.scratch/<feature-slug>/spec.md`
- Implementation issues are one file per ticket at `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01`, never a single combined tickets file
- Triage state is recorded as a `Status:` line near the top of each issue file
- Comments and conversation history append to the bottom of the file under a `## Comments` heading

## Implementation plan

Every set of implementation issues gets a plan at `.scratch/<feature-slug>/plan.md`.

- Size issues as usual: by deliverable feature, with acceptance criteria. Never shrink an issue to fit a single commit.
- Each issue lists its work as numbered `## Steps`; one step is exactly one commit, so an issue usually spans several steps.
- `plan.md` has one `## [NN Issue title](issues/NN-slug.md)` heading per issue, with its steps below as checkboxes (`- [ ] 1.1 Step title`), in execution order.
- Mark a step that edits `package.json` with 📦: the user runs `pnpm install` before reviewing it.
- Decisions that must wait until work starts go in an issue's `## Open decisions (ask the user before starting)` section.
- "Move on with the plan" means: take the next unticked step; if it is the first step of its issue, read the issue and ask its open decisions first, recording the answers in the issue; do only that step, tick its box, and stop without committing; commit the step and its tick together only when the user explicitly says to. When an issue's last step is ticked, set its `Status:` to `resolved`.

## When a skill says "publish to the issue tracker"

Create a new file under `.scratch/<feature-slug>/` (creating the directory if needed).

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. The user will normally pass the path or the issue number directly.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a file with one **child** file per ticket.

- **Map**: `.scratch/<effort>/map.md` (the Notes / Decisions-so-far / Fog body).
- **Child ticket**: `.scratch/<effort>/issues/NN-<slug>.md`, numbered from `01`, with the question in the body. A `Type:` line records the ticket type (`research`/`prototype`/`grilling`/`task`); a `Status:` line records `claimed`/`resolved`.
- **Blocking**: a `Blocked by: NN, NN` line near the top. A ticket is unblocked when every file it lists is `resolved`.
- **Frontier**: scan `.scratch/<effort>/issues/` for files that are open, unblocked, and unclaimed; first by number wins.
- **Claim**: set `Status: claimed` and save before any work.
- **Resolve**: append the answer under an `## Answer` heading, set `Status: resolved`, then append a context pointer (gist + link) to the map's Decisions-so-far in `map.md`.
