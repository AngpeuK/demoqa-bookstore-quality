# Requirements Traceability Matrix

| Requirement                                              | Risk          | Evidence        | Automation               | Status  |
| -------------------------------------------------------- | ------------- | --------------- | ------------------------ | ------- |
| REQ-CAT-01 Catalog is retrievable                        | R-03          | API-001, UI-001 | `catalog.spec.ts` API/UI | Covered |
| REQ-CAT-02 Book can be identified by ISBN                | R-03          | API-002, UI-003 | API/UI                   | Covered |
| REQ-CAT-03 Invalid ISBN is rejected predictably          | R-03          | API-003         | API                      | Covered |
| REQ-SRCH-01 User can filter by title                     | R-04          | UI-002, UI-004  | UI                       | Covered |
| REQ-AUTH-01 Invalid credentials are rejected generically | R-01          | UI-010          | UI                       | Covered |
| REQ-AUTH-02 Valid user can obtain authorization          | R-01          | API-010         | API                      | Covered |
| REQ-COLL-01 Authorized user can add a valid book         | R-02          | API-010         | API                      | Covered |
| REQ-COLL-02 Collection persists in user profile          | R-02          | API-010         | API                      | Covered |
| REQ-COLL-03 User/test data can be removed                | R-02/R-06     | API-010         | API cleanup              | Covered |
| REQ-OWN-01 User cannot mutate another collection         | R-01          | API-012         | Planned                  | Gap—P0  |
| REQ-ACC-01 Core journey is keyboard accessible           | Accessibility | NF-001          | Manual                   | Planned |

The highest open gap is ownership isolation (REQ-OWN-01). It is documented rather than hidden and should be the next automation increment.
