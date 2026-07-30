# DemoQA Book Store — Quality Engineering Portfolio

[![Playwright](https://img.shields.io/badge/Playwright-TypeScript-45ba4b?logo=playwright)](https://playwright.dev/)
[![Quality Gate](https://github.com/AngpeuK/demoqa-bookstore-quality/actions/workflows/quality.yml/badge.svg)](https://github.com/AngpeuK/demoqa-bookstore-quality/actions/workflows/quality.yml)
[![Quality](https://img.shields.io/badge/quality-risk--based-blue)](docs/test-plan.md)

Production-style quality engineering project for the [DemoQA Book Store](https://demoqa.com/books). It demonstrates how I approach quality as an engineering system: risks drive coverage, every automated check traces to a test case, API and UI layers are intentionally separated, and CI produces evidence useful for release decisions.

> This is a portfolio project against a public third-party demo environment. It is not affiliated with DemoQA. External availability and shared test data are treated as explicit test risks.

## What this project demonstrates

- Risk-based test strategy, scope, entry/exit criteria and release gates
- Traceable manual test cases for UI and REST API
- TypeScript + Playwright page objects and typed API clients
- Independent test data and cleanup for mutating API scenarios
- Smoke vs. regression tagging and layered execution
- CI quality gates, JUnit/HTML reports, traces, screenshots and videos
- Defect workflow, exploratory charters and release checklist

## Coverage map

| Layer          | Scope                          | Examples                                          |
| -------------- | ------------------------------ | ------------------------------------------------- |
| API contract   | Catalog, lookup, errors        | status, payload shape, business error             |
| API workflow   | Account + collection lifecycle | create → authorize → add → verify → delete        |
| UI smoke       | Catalog and authentication     | render, search, invalid login                     |
| UI regression  | Navigation and edge states     | details, no-result state                          |
| Non-functional | Assessed/documented            | accessibility, security, reliability, performance |

The detailed mapping is in [traceability.md](docs/traceability.md).

## Quick start

Prerequisites: Node.js 22.13+.

```bash
corepack enable
pnpm install --frozen-lockfile
npx playwright install --with-deps chromium
pnpm check
pnpm test:smoke
```

Useful commands:

```bash
pnpm test:api          # API project only
pnpm test:ui           # Chromium UI project only
pnpm test:regression   # tests tagged @regression
pnpm test:headed       # visible browser
pnpm report            # open the last HTML report
```

Copy `.env.example` to `.env` only when optional credentials are needed. Secrets must never be committed.

## Architecture

```text
tests/                 executable specifications
├── api/               contract and service workflows
└── ui/                user-facing behavior
src/
├── api/               typed HTTP clients
├── models/            domain contracts
└── pages/             UI page objects
docs/                  strategy, cases, traceability and operations
.github/workflows/     pull-request and scheduled quality gates
```

Assertions stay in tests, interaction details stay in clients/page objects, and test-owned users are always cleaned in `finally`. Authentication state is not shared between workers.

## CI model

- **Pull request / push:** static quality gates plus `@smoke` tests
- **Nightly / manual:** complete UI and API regression
- **Failure evidence:** Playwright HTML report, JUnit XML, traces, screenshots and videos
- **External dependency policy:** retries are limited to CI; failures are never silently ignored

See [test-plan.md](docs/test-plan.md) for release criteria and [ci-triage.md](docs/ci-triage.md) for failure classification.

## Documentation index

- [Test plan and strategy](docs/test-plan.md)
- [Test cases](docs/test-cases.md)
- [Requirements traceability matrix](docs/traceability.md)
- [Exploratory testing charters](docs/exploratory-charters.md)
- [Defect management](docs/defect-management.md)
- [CI failure triage](docs/ci-triage.md)
- [Release checklist](docs/release-checklist.md)
- [Architecture decisions](docs/adr/001-test-architecture.md)

## Engineering judgement

A broad browser matrix is deliberately not executed on every commit against a shared public demo site. Chromium smoke coverage provides fast feedback; the framework can add Firefox/WebKit projects when the execution environment and product risk justify the cost. Visual, load and destructive security testing are excluded because the target is not owned by this project.

## Author talking points

This repository is designed to support a technical interview discussion: why checks live at a particular layer, how false failures are controlled, how release evidence is produced, and what should change when the system moves from a demo environment to an owned production service.
