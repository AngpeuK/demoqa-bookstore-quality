# ADR-001: Layered Playwright Architecture

**Status:** Accepted  
**Decision:** Use Playwright Test for both HTTP and browser checks, with typed clients/page objects and separate CI projects.

## Context

The portfolio must show UI and API automation without duplicating orchestration, reporting or CI infrastructure. The target is a shared external demo environment, so isolation and diagnostic evidence matter more than maximal browser count.

## Decision

- One runner and assertion model for API/UI.
- Separate test projects and directory boundaries.
- Typed domain contracts and API clients; page objects expose intent, not assertions.
- Unique mutating data and `finally` cleanup.
- Critical smoke on changes; full regression nightly/on demand.
- Failure-only trace/video/screenshot plus JUnit/HTML reports.

## Consequences

The setup is compact and easy to operate, but Playwright is not a full schema validator or load-testing tool. If API contracts grow, add OpenAPI validation at the client boundary. If performance becomes release-critical, add a purpose-built tool and owned workload model rather than forcing it into this suite.
