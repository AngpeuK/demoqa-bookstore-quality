# Test Cases

Priority: P0 critical, P1 high, P2 normal. Automation IDs map directly to test titles.

## Catalog and search

| ID     | Pri | Type        | Preconditions         | Steps                                  | Expected result                                | Auto    |
| ------ | --: | ----------- | --------------------- | -------------------------------------- | ---------------------------------------------- | ------- |
| UI-001 |  P0 | UI smoke    | Site available        | Open `/books`                          | Heading and at least one book row render       | Yes     |
| UI-002 |  P0 | UI smoke    | Catalog loaded        | Enter exact title in search            | Only matching title remains                    | Yes     |
| UI-003 |  P1 | UI          | Matching book visible | Open `Git Pocket Guide`                | URL, ISBN, title and author match              | Yes     |
| UI-004 |  P1 | UI negative | Catalog loaded        | Search unique absent text              | Zero rows and `Page 1 of 0` shown              | Yes     |
| UI-005 |  P2 | UI          | Catalog loaded        | Search by partial author, clear search | Relevant subset appears; full catalog restores | Planned |
| UI-006 |  P2 | UI          | Catalog > page size   | Change page size; navigate pages       | Row count and page state are correct           | Planned |

## Authentication and profile

| ID     | Pri | Type        | Preconditions       | Steps                     | Expected result                            | Auto                     |
| ------ | --: | ----------- | ------------------- | ------------------------- | ------------------------------------------ | ------------------------ |
| UI-010 |  P0 | UI negative | Unknown credentials | Submit login form         | Generic error; user remains on login page  | Yes                      |
| UI-011 |  P0 | UI          | Valid account       | Sign in                   | Profile shown and session established      | Planned; secret required |
| UI-012 |  P1 | UI          | Authenticated       | Log out, use browser Back | Protected data is not exposed              | Planned                  |
| UI-013 |  P1 | UI security | Login page          | Submit script-like input  | Input treated as data; no script execution | Manual/safe only         |

## API catalog

| ID      | Pri | Type        | Request                                     | Expected result                                       | Auto    |
| ------- | --: | ----------- | ------------------------------------------- | ----------------------------------------------------- | ------- |
| API-001 |  P0 | Contract    | `GET /BookStore/v1/Books`                   | 200; non-empty list; valid core types and ISBN format | Yes     |
| API-002 |  P0 | Contract    | `GET /BookStore/v1/Book?ISBN=9781449325862` | 200; requested ISBN/title returned                    | Yes     |
| API-003 |  P1 | Negative    | Lookup unknown 13-digit ISBN                | 400; code `1205`; actionable message                  | Yes     |
| API-004 |  P1 | Negative    | Lookup without ISBN                         | 400; stable validation error                          | Planned |
| API-005 |  P2 | Reliability | Repeat read-only catalog request            | Semantically consistent response                      | Planned |

## API account and collection

| ID      | Pri | Type          | Preconditions / steps                                          | Expected result                                 | Auto                            |
| ------- | --: | ------------- | -------------------------------------------------------------- | ----------------------------------------------- | ------------------------------- |
| API-010 |  P0 | Workflow      | Create unique user → token → add book → read profile → cleanup | Correct status/state at each step; user deleted | Yes                             |
| API-011 |  P0 | Authorization | Add book without bearer token                                  | 401; no state change                            | Planned                         |
| API-012 |  P0 | Ownership     | Token for user A attempts mutation for user B                  | Request denied; B unchanged                     | Planned                         |
| API-013 |  P1 | Validation    | Create user with weak password                                 | 400 with password-policy message                | Planned                         |
| API-014 |  P1 | Conflict      | Create duplicate username                                      | 406/conflict semantics; original unchanged      | Planned                         |
| API-015 |  P1 | Idempotency   | Add same ISBN twice                                            | Defined conflict; no duplicate collection rows  | Planned                         |
| API-016 |  P1 | Cleanup       | Delete all books then read profile                             | 204 and empty collection                        | Covered within workflow cleanup |

## Manual non-functional checks

| ID     | Risk          | Check                                     | Acceptance heuristic                                         |
| ------ | ------------- | ----------------------------------------- | ------------------------------------------------------------ |
| NF-001 | Accessibility | Keyboard-only catalog/login journey       | Visible focus, logical order, actionable controls reachable  |
| NF-002 | Accessibility | Screen-reader names and heading structure | Controls have meaningful names; no major hierarchy violation |
| NF-003 | Security      | Token/session exposure inspection         | No credentials/token in URL or committed artifacts           |
| NF-004 | Performance   | Catalog response/UI render sampling       | Baseline recorded; material regressions investigated         |
| NF-005 | Resilience    | Slow/failed catalog request               | User sees recoverable behavior rather than silent corruption |
