# CI Failure Triage

## First response

1. Check whether static gates, API, UI or infrastructure failed.
2. Open Playwright report and the first-failure trace; inspect request timing and DOM snapshot.
3. Reproduce with the exact project and test ID, not the whole suite.
4. Classify: **product**, **test**, **environment**, or **unknown**.
5. Record owner and next action. A rerun is evidence, not a fix.

## Classification heuristics

| Signal                                       | Likely class  | Action                                       |
| -------------------------------------------- | ------------- | -------------------------------------------- |
| Stable assertion mismatch and valid response | Product       | File/associate defect, preserve evidence     |
| Locator no longer maps to intended control   | Test          | Update abstraction after confirming UX       |
| DNS/5xx/timeouts across unrelated tests      | Environment   | Mark blocked, check target availability      |
| Passes only on retry repeatedly              | Unknown/flaky | Quarantine only with owner, issue and expiry |

## Flake policy

- CI retries are capped at two and reported.
- Never add arbitrary sleeps.
- A flaky P0 test is treated as loss of release evidence.
- Quarantine requires a linked issue, owner, reason and removal date.
- Fix synchronization, isolation or observability at the source.
