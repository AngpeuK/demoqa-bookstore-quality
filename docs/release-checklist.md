# Release Readiness Checklist

- [ ] Intended change and impacted risks are identified.
- [ ] Static checks pass with pinned lockfile.
- [ ] P0 smoke tests pass; reruns/flakes are reviewed.
- [ ] Targeted regression for impacted requirements passes.
- [ ] No unaccepted Sev-1/Sev-2 defects remain.
- [ ] Security, accessibility and data/privacy impact assessed.
- [ ] Test evidence is attached and traceable to the build.
- [ ] Environment outage is not misreported as a product pass.
- [ ] Rollback/mitigation and monitoring owner are known.
- [ ] Residual risks are explicit and accepted by the accountable owner.

**QA recommendation:** Go / Go with accepted risk / No-go / Blocked. QA supplies evidence; the accountable product owner makes the release decision.
