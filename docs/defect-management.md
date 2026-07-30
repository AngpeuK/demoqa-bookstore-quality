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

## Observed defect DEF-001

**Title:** `[API][Security] Book lookup without ISBN exposes server stack trace`
**Severity:** Sev-2 High (information disclosure and unhandled server error)
**Endpoint:** `GET /BookStore/v1/Book` without the `ISBN` query parameter
**Expected:** HTTP 400 with a stable, non-sensitive validation payload
**Actual:** HTTP 500 HTML response containing Sequelize, filesystem paths and internal source locations
**Reproducibility:** Confirmed by Playwright and an independent HTTP request on 2026-07-30
**Automation:** `API-004` is retained as an expected failure using `test.fail`; an unexpected pass will fail the suite and signal that the defect may be fixed.
**Recommendation:** Validate `ISBN` before querying, return the documented error envelope and suppress production stack traces.

## Observed defect DEF-002

**Title:** `[Accessibility] Critical controls and brand images have no accessible names`
**Severity:** Sev-2 High (blocks screen-reader operation of critical navigation/search controls)
**Pages:** Catalog, Login and Registration
**Expected:** WCAG 2 A critical controls and meaningful images expose accessible names/alternatives
**Actual:** axe reports `button-name`, `image-alt` and `link-name` violations with critical/serious impact
**Reproducibility:** Confirmed independently on all three public pages on 2026-07-30
**Automation:** `A11Y-001..003` remain expected failures. If any page unexpectedly passes, CI fails to require review and removal/narrowing of the defect marker.
**Recommendation:** Name the icon-only search button, add useful `alt` text to the brand image, and give the linked logo an accessible name.

No other illustrative issue is presented as a live finding. Actual findings require reproducible evidence.
