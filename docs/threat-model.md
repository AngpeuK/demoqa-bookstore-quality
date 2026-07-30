# Lightweight Threat Model

## Assets

- account credentials and bearer tokens;
- user identity and book collection data;
- CI tokens, workflow permissions and repository integrity;
- dependency lockfile and build/test evidence.

## Trust boundaries

```text
User/browser → DemoQA UI → Account/BookStore API → database
Developer commit → GitHub Actions → npm/actions supply chain → test artifacts
```

## Primary threats and controls

| Threat                                | STRIDE                 |     Risk | Control / evidence                                  |
| ------------------------------------- | ---------------------- | -------: | --------------------------------------------------- |
| Token theft or replay                 | Spoofing               |     High | negative token tests, secret scan, artifact hygiene |
| Cross-user collection mutation        | Tampering/Elevation    | Critical | `API-012` ownership test                            |
| Internal stack trace disclosure       | Information disclosure |     High | `DEF-001`, expected-failure contract                |
| Accessible-name failures block users  | Denial of service      |     High | axe checks, `DEF-002`                               |
| Malicious/vulnerable dependency       | Tampering/Elevation    |     High | frozen lockfile, audit, dependency review, SBOM     |
| Compromised workflow action           | Tampering              |     High | immutable SHA pinning, least-privilege permissions  |
| Committed credential                  | Information disclosure | Critical | Gitleaks full-history scan and `.env` exclusion     |
| Unsafe active scanning of third party | Operational/legal      |     High | passive/low-impact test boundary in `SECURITY.md`   |

## Residual risk

The project cannot validate production key management, database authorization, rate limits, audit logging, token expiry under controlled time, or infrastructure configuration because DemoQA is external and unowned. Those gaps are explicit and are not represented as passed security controls.
