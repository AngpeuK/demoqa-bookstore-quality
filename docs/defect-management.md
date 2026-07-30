# Defect Management

## Workflow

`New → Triaged → Ready → In progress → Ready for QA → Verified → Closed`

Alternatives: `Duplicate`, `Cannot reproduce`, `Won't fix / accepted risk`, or `Blocked`. Reopened defects retain the original evidence and add the failing build.

## Required defect fields

- concise outcome-focused title;
- environment, timestamp and build/commit;
- preconditions and non-sensitive test data;
- minimal reproducible steps;
- expected vs. actual result;
- severity and proposed priority with rationale;
- frequency and last known good behavior;
- evidence: trace, request/response (redacted), screenshot/video/log;
- suspected scope, workaround and related requirement/test.

## Example (illustrative, not claimed as a live defect)

**Title:** `[Catalog][Search] Clearing a no-result query does not restore catalog rows`  
**Severity:** Sev-2 if universal; otherwise Sev-3  
**Environment:** Public demo, Chromium, build timestamp required  
**Precondition:** Catalog initially contains books  
**Steps:** Search a unique missing phrase → confirm empty state → clear search  
**Expected:** Full catalog is restored without reload  
**Actual:** Rows remain absent  
**Evidence:** Attach trace and network response  
**Notes:** Reproduce three times; compare API catalog availability; do not file until observed.

No fabricated issues are presented as findings in this portfolio. Actual findings require reproducible evidence.
