# Security Policy

## Reporting a Vulnerability

Please do not open public issues for security vulnerabilities.

Report security problems to the Kozenet Pro maintainers through a private GitHub security advisory, or contact the project maintainers directly if advisories are not enabled yet.

## Pull Request Security Checks

Pull requests are checked with:

- CI for linting, TypeScript, content validation, and build health
- CodeQL for JavaScript and TypeScript code scanning
- Dependency Review for vulnerable dependency changes
- Dependabot for dependency and GitHub Actions updates

Maintainers should enable branch protection on `master` and require these checks before merging.
