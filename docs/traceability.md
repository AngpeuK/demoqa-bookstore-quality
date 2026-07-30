# Requirements Traceability Matrix

| Requirement                                              | Risk          | Evidence         | Automation               | Status       |
| -------------------------------------------------------- | ------------- | ---------------- | ------------------------ | ------------ |
| REQ-CAT-01 Catalog is retrievable                        | R-03          | API-001, UI-001  | `catalog.spec.ts` API/UI | Covered      |
| REQ-CAT-02 Book can be identified by ISBN                | R-03          | API-002, UI-003  | API/UI                   | Covered      |
| REQ-CAT-03 Invalid ISBN is rejected predictably          | R-03          | API-003          | API                      | Covered      |
| REQ-SRCH-01 User can filter by title                     | R-04          | UI-002, UI-004   | UI                       | Covered      |
| REQ-AUTH-01 Invalid credentials are rejected generically | R-01          | UI-010           | UI                       | Covered      |
| REQ-AUTH-02 Valid user can obtain authorization          | R-01          | API-010          | API                      | Covered      |
| REQ-COLL-01 Authorized user can add a valid book         | R-02          | API-010          | API                      | Covered      |
| REQ-COLL-02 Collection persists in user profile          | R-02          | API-010          | API                      | Covered      |
| REQ-COLL-03 User/test data can be removed                | R-02/R-06     | API-010          | API cleanup              | Covered      |
| REQ-OWN-01 User cannot mutate another collection         | R-01          | API-012          | API                      | Covered      |
| REQ-ACC-01 Critical pages expose accessible names        | Accessibility | A11Y-001..003    | axe/Chromium             | Known defect |
| REQ-SESS-01 Session persists and is revoked on logout    | R-01          | UI-012/014/015   | UI                       | Covered      |
| REQ-COLL-04 Collection is manageable through UI          | R-02          | UI-020/021       | UI                       | Covered      |
| REQ-VAL-01 Account input follows validation policy       | R-01          | API-013/017..020 | API                      | Covered      |

Known product risks remain visible through expected-failure tests. The next automation increment should cover two-user read isolation and token expiry/refresh behavior, which require controlled time or token fixtures.
