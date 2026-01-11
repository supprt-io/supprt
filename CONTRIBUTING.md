# Contributing to Supprt Widget

First off, thank you for considering contributing to Supprt! It's people like you that make Supprt such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct: be respectful, inclusive, and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (code snippets, configuration, etc.)
- **Describe the behavior you observed and what you expected**
- **Include screenshots or GIFs** if applicable
- **Include your environment** (browser, OS, Node.js version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the proposed enhancement**
- **Explain why this enhancement would be useful**
- **Include mockups or examples** if applicable

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the commit conventions** (see below)
3. **Add tests** if applicable
4. **Ensure the build passes** (`npm run build`)
5. **Ensure linting passes** (`npm run lint`)
6. **Update documentation** if needed

## Development Setup

### Prerequisites

- Node.js 20+
- npm 9+

### Getting Started

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/supprt.git
cd supprt

# Install dependencies
npm install

# Start development mode (watch)
npm run dev

# Run linter
npm run lint

# Run type check
npm run typecheck

# Build for production
npm run build
```

### Project Structure

```
supprt/
├── src/
│   ├── components/     # Preact components
│   ├── styles/         # CSS styles
│   ├── types/          # TypeScript types
│   ├── api.ts          # API client
│   ├── config.ts       # Configuration
│   ├── index.ts        # Main entry point
│   └── widget.tsx      # Widget root component
├── dist/               # Build output (generated)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) for automatic versioning and changelog generation.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description | Version Bump |
|------|-------------|--------------|
| `feat` | A new feature | Minor |
| `fix` | A bug fix | Patch |
| `docs` | Documentation changes | Patch (README only) |
| `style` | Code style changes (formatting, etc.) | Patch |
| `refactor` | Code refactoring | Patch |
| `perf` | Performance improvements | Patch |
| `test` | Adding or updating tests | None |
| `chore` | Maintenance tasks | None |
| `ci` | CI/CD changes | None |

### Breaking Changes

For breaking changes, add `BREAKING CHANGE:` in the commit body or `!` after the type:

```bash
feat!: remove deprecated API methods

BREAKING CHANGE: The `init()` method has been replaced with `mount()`.
```

### Examples

```bash
# Feature
feat(chat): add typing indicator

# Bug fix
fix(styles): correct button alignment on mobile

# Documentation
docs(README): add Vue.js integration example

# Breaking change
feat!: change configuration API

BREAKING CHANGE: Configuration is now passed as an object instead of individual parameters.
```

## Style Guide

### TypeScript

- Use TypeScript strict mode
- Prefer `interface` over `type` for object shapes
- Export types from dedicated files in `src/types/`
- Use meaningful variable and function names

### CSS

- Use CSS custom properties for theming
- Follow BEM-like naming convention
- Keep styles scoped to components

### Code Quality

- Run `npm run lint` before committing
- Run `npm run typecheck` to ensure type safety
- Keep functions small and focused
- Write self-documenting code

## Release Process

Releases are automated using [semantic-release](https://semantic-release.gitbook.io/):

1. All commits to `main` are analyzed
2. Version is determined based on commit types
3. Changelog is automatically generated
4. Package is published to npm
5. GitHub release is created

**You don't need to manually update the version or changelog!**

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
