# Security Policy

## Supported scope

Security reports for the automation framework, CI configuration and accidental secret exposure are accepted. DemoQA itself is a third-party training site and is not maintained by this repository; findings against it must follow the target owner's disclosure policy.

## Reporting

Do not open a public issue containing credentials, tokens, exploit payloads or sensitive evidence. Use GitHub's private vulnerability reporting for this repository when available, or contact the repository owner privately through their GitHub profile.

Include the affected commit, impact, minimal reproduction and a redacted proof of concept. Never include a live secret.

## Testing boundaries

This project permits passive inspection and low-impact functional security assertions. It explicitly excludes load testing, brute force, destructive payloads, vulnerability exploitation and automated active scanning of DemoQA without written authorization.

## Supply-chain controls

- immutable commit pinning for actions in the security workflow;
- High/Critical dependency audit gate;
- CodeQL `security-extended` SAST;
- full-history Gitleaks scanning;
- SPDX JSON SBOM generation;
- Dependabot for npm and GitHub Actions.
