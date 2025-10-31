# Contributing to Simple Shopping List

Thank you for your interest in contributing to Simple Shopping List! We welcome contributions from everyone who shares our commitment to privacy-first, user-focused software.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Contributing Code](#contributing-code)
  - [Improving Documentation](#improving-documentation)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Requirements](#testing-requirements)
- [Privacy Commitments](#privacy-commitments)

---

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

**TL;DR**: Be respectful, inclusive, and constructive. No harassment, discrimination, or toxic behavior.

---

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report:
1. **Check existing issues** - Your bug might already be reported
2. **Try the latest version** - The bug might already be fixed
3. **Test in a clean environment** - Rule out local configuration issues

**When reporting a bug, include**:
- Clear, descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots (if applicable)
- Platform and version (Web/iOS/Android, browser/OS version)
- Console errors or logs (if available)

**Template**:
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**
- Platform: [Web/iOS/Android]
- Browser/OS: [e.g., Chrome 120, iOS 17.2]
- App Version: [e.g., 0.1.0]
```

### Suggesting Features

We love feature ideas, but we're committed to staying **simple and privacy-first**.

**Before suggesting a feature**:
- Check if it aligns with our [privacy principles](README.md#project-principles)
- Search existing issues and discussions
- Consider if it could be optional (respecting user choice)

**When suggesting a feature, include**:
- Clear use case or problem it solves
- How it maintains privacy commitments
- Whether it should be optional
- Mockups or examples (if applicable)

**We're especially interested in**:
- Accessibility improvements
- Performance optimizations
- Privacy-preserving features
- Local-only functionality

**We'll likely decline**:
- Features requiring network access
- Cloud sync or account systems
- Analytics or telemetry
- Complex features that bloat the app

### Contributing Code

1. **Fork the repository**
2. **Create a feature branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following our code style
4. **Test thoroughly** on the target platform
5. **Commit with clear messages**
6. **Push to your fork**
7. **Open a Pull Request**

### Improving Documentation

Documentation improvements are always welcome:
- Fix typos or unclear explanations
- Add examples or use cases
- Improve setup instructions
- Translate documentation (future)

---

## Development Setup

### Web App

**Prerequisites**:
- Node.js 18+ and npm
- Git

**Setup**:
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/simple-shopping-list.git
cd simple-shopping-list/web

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5174
```

**Project Structure**:
```
web/
├── src/
│   ├── components/       # React components
│   ├── contexts/         # React Context providers
│   ├── services/         # Database and business logic
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Root component
│   └── main.tsx          # Entry point
├── public/               # Static assets
├── index.html            # HTML template
└── package.json
```

### iOS App (Coming Soon)

Prerequisites and setup instructions will be added when iOS development begins.

### Android App (Coming Soon)

Prerequisites and setup instructions will be added when Android development begins.

---

## Pull Request Process

1. **Ensure your code**:
   - Follows the code style guidelines
   - Passes all existing tests
   - Includes new tests for new features
   - Maintains privacy commitments
   - Doesn't add external dependencies without discussion

2. **Update documentation**:
   - Update README if adding features
   - Add JSDoc comments for new functions
   - Update CHANGELOG.md (when available)

3. **PR Description** should include:
   - What changes you made and why
   - Issue number (if applicable): "Fixes #123"
   - Screenshots (for UI changes)
   - How you tested it

4. **Review Process**:
   - Maintainers will review your PR
   - Address any requested changes
   - Once approved, a maintainer will merge

5. **After merge**:
   - Delete your feature branch
   - Pull the latest `main` branch
   - Celebrate! You're a contributor!

---

## Code Style Guidelines

### General Principles

- **Clarity over cleverness** - Write code that's easy to understand
- **Privacy first** - No external calls, no data leakage
- **Keep it simple** - Avoid unnecessary complexity
- **DRY principle** - Don't repeat yourself

### TypeScript/JavaScript

- Use **TypeScript** for all new code
- Use **functional components** and hooks in React
- Follow **React best practices** (hooks rules, avoid prop drilling)
- Use **meaningful variable names** (no single letters except loop indices)
- Add **JSDoc comments** for exported functions

**Example**:
```typescript
/**
 * Adds a new item to the shopping list and updates recent items.
 * @param name - The name of the item to add
 * @param departmentId - The department ID for organization
 * @returns Promise that resolves when item is added
 */
export async function addItem(name: string, departmentId: string): Promise<void> {
  // Implementation
}
```

### React Components

- Use **PascalCase** for component names
- Use **camelCase** for prop names
- Keep components **small and focused** (single responsibility)
- Extract complex logic to **custom hooks**
- Use **React Context** for global state, not prop drilling

### CSS/Tailwind

- Use **Tailwind utility classes** where possible
- Group related utilities (layout, then colors, then spacing)
- Extract repeated patterns to custom classes in `index.css`
- Use CSS variables for theme colors
- Support both **light and dark mode**

### Git Commits

Use **conventional commits** format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring (no feature change)
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, tooling

**Examples**:
```
feat(web): add export data functionality

Users can now export all their shopping lists and items as JSON
for backup purposes. Includes both "replace" and "merge" import modes.

Closes #42
```

```
fix(web): correct department sorting in shopping view

Items are now properly sorted by department.sortOrder field.
```

---

## Testing Requirements

### Web App

**Before submitting a PR**:
- Manually test your changes in the browser
- Test in both **light and dark mode**
- Test on **mobile viewport** (Chrome DevTools)
- Check browser console for errors
- Test with **existing data** (not just fresh database)

**Future**: We'll add automated tests (Jest, React Testing Library) in Phase 2.

### iOS/Android

Testing requirements will be added when native development begins.

---

## Privacy Commitments

**All contributions MUST maintain these guarantees**:

1. ✅ **No network requests** - Except downloading the app itself
2. ✅ **No external APIs** - Everything runs locally
3. ✅ **No analytics or telemetry** - We don't track anything
4. ✅ **No user accounts** - No sign-up or login systems
5. ✅ **Local storage only** - All data stays on device
6. ✅ **No ads** - Never, ever

**If your PR violates any of these**, it will be rejected, no matter how good the feature is.

**Acceptable**:
- IndexedDB, localStorage (web)
- Core Data (iOS)
- Room Database (Android)
- File system access (local only)

**Not Acceptable**:
- `fetch()` or `XMLHttpRequest` to external servers
- Third-party analytics (Google Analytics, Mixpanel, etc.)
- Ad networks
- Cloud storage APIs (iCloud, Google Drive, etc.)
- OAuth or authentication systems

---

## Questions?

- **General questions**: Open a [Discussion](../../discussions)
- **Bug reports**: Open an [Issue](../../issues)
- **Feature ideas**: Open a [Discussion](../../discussions) first
- **Security concerns**: See SECURITY.md (coming soon)

---

## Recognition

All contributors will be recognized in:
- GitHub's contributor list (automatic)
- CHANGELOG.md (for significant contributions)
- Special thanks in releases (for major features)

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License, the same license as the project.

---

**Thank you for contributing to privacy-respecting, user-focused software!**

*Simple Shopping List - Because your grocery list is nobody's business but yours.*
