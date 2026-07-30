# Exploratory Testing Charters

Use 45-minute timeboxes. Capture environment, test data, observations, questions and evidence; distinguish defects from product questions.

## Charter A — Session and authorization boundaries

Explore login, logout, token expiry, Back/Forward, refresh and direct profile URLs with two users. Look for stale protected data, cross-user access, inconsistent UI/API state and credentials in client-visible storage.

## Charter B — Search and catalog resilience

Vary casing, whitespace, Unicode, long input, punctuation, rapid edits, slow network and failed requests. Look for misleading empty states, layout breaks, stale results and recovery without refresh.

## Charter C — Collection state transitions

Add/remove the same book repeatedly, mix UI and API changes, refresh during actions and use two tabs. Look for duplicates, lost updates, incorrect confirmation and non-idempotent cleanup.

## Charter D — Inclusive use

Complete catalog → book details → login using keyboard and a screen reader. Inspect focus visibility/order, accessible names, zoom at 200%, contrast and error association.

## Session note template

- Charter / tester / date / build:
- Data and environment:
- Coverage performed:
- Observations and evidence:
- Defects / questions:
- Risks remaining:
- Follow-up recommendation:
