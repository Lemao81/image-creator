# 05: Generation progress and errors

**What to build:** While a Generation runs, the user sees a spinner with the elapsed time and can Cancel it; a cancelled Generation adds no Candidate. Only one Generation runs at a time, the Prompt stays editable, and Ctrl+Enter starts a Generation. When the API or network fails, an inline error banner above the preview shows the API's message until the next Generation starts.

**Blocked by:** 03 Generate and Accept tracer bullet.

**Status:** ready-for-agent

- [ ] A running Generation shows a spinner and the elapsed time.
- [ ] Cancel aborts the request; no Candidate is added and the preview is unchanged.
- [ ] Generate is disabled while a Generation runs; the Prompt remains editable.
- [ ] Ctrl+Enter in the Prompt starts a Generation.
- [ ] API and network errors show in an inline error banner with the API's message; the banner clears when the next Generation starts.
- [ ] End-to-end tests use a slow and a failing fake API response to cover progress, Cancel and the error banner.

## Steps

1. Add the running state with spinner, elapsed time, Cancel and disabled Generate, with end-to-end tests.
2. Add the error banner, with end-to-end tests.
3. Add Ctrl+Enter to start a Generation, with an end-to-end test.

## Open decisions (ask the user before starting)

- Request timeout: none (rely on Cancel), or a fixed limit such as 120 s?
