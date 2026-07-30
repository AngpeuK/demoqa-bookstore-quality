# Test Plan and Quality Strategy

**System under test:** DemoQA Book Store UI and REST API  
**Document version:** 1.0  
**Owner:** QA Engineering  
**Approach:** risk-based, API-first, automation-supported

## 1. Objective

Provide decision-grade evidence that users can discover books, authenticate, and manage a personal collection while the underlying API preserves contract, authorization and data integrity.

## 2. Product risks

| ID   | Risk                                           | Likelihood | Impact | Priority | Primary mitigation                               |
| ---- | ---------------------------------------------- | ---------: | -----: | -------: | ------------------------------------------------ |
| R-01 | Unauthorized access or collection modification |          3 |      5 |       15 | API authorization and ownership tests            |
| R-02 | Account/collection data loss or leakage        |          3 |      5 |       15 | isolated lifecycle and cleanup checks            |
| R-03 | Catalog unavailable or malformed               |          4 |      4 |       16 | contract smoke checks on every change            |
| R-04 | Search returns incorrect or stale results      |          3 |      3 |        9 | UI positive/negative filtering checks            |
| R-05 | UI blocked by third-party ads/scripts          |          4 |      2 |        8 | targeted locator strategy and triage policy      |
| R-06 | Shared demo environment causes false failures  |          4 |      3 |       12 | unique data, no shared state, bounded CI retries |

Score = likelihood × impact on a 1–5 scale. Scores ≥12 receive automated coverage first.

## 3. Scope

### In scope

- Public catalog retrieval, ISBN lookup and error contracts
- Registration, token generation, authorization and collection lifecycle
- UI catalog rendering, filtering, detail navigation and invalid login
- Chromium desktop smoke/regression coverage
- Functional reliability, response semantics and test-data isolation

### Out of scope

- DemoQA infrastructure, advertising integrations and content correctness supplied by third parties
- Destructive security testing, penetration testing or sustained load testing
- Email/account recovery (not exposed by the application)
- Mobile-native apps, localization and payment flows
- Production SLO validation (no owned observability or traffic profile)

## 4. Test levels and allocation

- **API contract:** fastest feedback for status codes, schema-critical fields and error semantics.
- **API workflow:** business state transitions and ownership boundaries.
- **UI smoke:** user-visible critical path and wiring.
- **UI regression:** navigation, filtering and error/empty states.
- **Exploratory:** accessibility, resilience, session behavior and unexpected sequences.

Automation follows the lowest useful layer; UI tests exist only where rendering/integration adds risk coverage.

## 5. Environments and data

| Environment | URL                  | Purpose             | Constraint                                |
| ----------- | -------------------- | ------------------- | ----------------------------------------- |
| Public demo | `https://demoqa.com` | Portfolio execution | shared, uncontrolled, ads/CDN variability |
| CI runner   | GitHub-hosted Ubuntu | repeatable gates    | outbound network required                 |

Mutating tests generate unique usernames. Cleanup executes in `finally`. Credentials may be provided only through environment variables or CI secrets.

## 6. Entry criteria

- Target UI and API are reachable over HTTPS.
- Catalog contains at least one usable book.
- Node.js and pinned dependencies install successfully.
- Test scope and risk priorities are agreed.

## 7. Exit and release criteria

- Static gates (`format`, `lint`, `typecheck`) pass.
- 100% critical smoke tests pass after one controlled rerun.
- No open Sev-1/Sev-2 product defects in the tested scope.
- Any Sev-3 acceptance has a named owner and documented residual risk.
- Report and failure evidence are retained by CI.

An external outage produces **Blocked**, not **Passed**. A retry that passes remains visible as flaky evidence and requires trend review.

## 8. Defect severity

- **Sev-1 Critical:** security/data-loss issue or entire service unusable; release stop.
- **Sev-2 High:** critical journey unavailable without workaround; release stop.
- **Sev-3 Medium:** material degradation with workaround; product-owner decision.
- **Sev-4 Low:** cosmetic/minor usability issue; backlog candidate.

Priority is assigned separately using reach, frequency, business timing and workaround cost.

## 9. Metrics and reporting

- pass/fail/blocked by risk and layer;
- critical-risk requirement coverage;
- failure cause: product / test / environment;
- flaky-test rate and rerun recovery rate;
- escaped defects and mean time to diagnose;
- suite duration and slowest-test trend.

Raw test counts alone are not used as a quality proxy.

## 10. Roles

| Role          | Accountability                                                  |
| ------------- | --------------------------------------------------------------- |
| QA            | strategy, evidence, triage facilitation, quality recommendation |
| Developer     | unit/component coverage, diagnosis, fixes, reviewability        |
| Product owner | risk acceptance and release decision                            |
| Platform      | CI reliability, secrets and retention policy                    |

## 11. Deliverables

Plan, test cases, traceability matrix, automated suites, CI configuration, HTML/JUnit evidence, exploratory charters, defect workflow and release checklist.
