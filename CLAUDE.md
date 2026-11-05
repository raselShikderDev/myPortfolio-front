
# Project Instructions

## 1. Project Overview

- Framework: Next.js 15 App Router.
- UI: React 19, TypeScript, Tailwind CSS 4.
- Runtime and package manager: Bun.
- UI libraries: Radix UI, Lucide React, Framer Motion.
- Forms and validation: React Hook Form and Zod.

Follow the existing project architecture and conventions. Verify the actual source code before relying on this overview.

## 2. Before Starting a Task

- Follow the global CLAUDE.md instructions already loaded.
- Read `docs/DEVELOPMENT_MEMORY.md` when relevant to the task.
- Inspect `git status --short` and relevant diffs before editing.
- Read only the source files, tests, and configuration relevant to the task.
- Inspect existing implementations before creating new components or utilities.
- Identify the actual problem and make focused changes.
- Do not repeatedly audit or rewrite documentation instead of implementing the requested work.

## 3. Project Structure

- `src/app/`: Next.js pages, layouts, and routes.
- `src/components/`: Shared and feature components.
- `src/actions/`: Server Actions.
- `src/lib/`: Shared utilities and configuration.
- `src/hooks/`: Custom React hooks.
- `src/interfaces/`: TypeScript interfaces.
- `src/utils/`: Utility functions.
- `src/zodSchema/`: Zod schemas.
- `docs/DEVELOPMENT_MEMORY.md`: Development progress and project decisions.

Authentication, owner, and public route groups are located under `src/app/`.

Verify paths before modifying files.

## 4. Development Standards

- Respect Server Component and Client Component boundaries.
- Preserve existing API endpoints, request payloads, and authentication workflows.
- Use strict TypeScript typing.
- Avoid `any`, `@ts-ignore`, and unnecessary type assertions.
- Validate inputs and preserve existing sanitization and URL validation.
- Do not hardcode credentials or secrets.
- Do not weaken validation or suppress real errors.
- Avoid unrelated refactoring and unnecessary dependencies.
- Inspect dependency and lockfile changes after package installation.

## 5. Package Manager and Commands

Use Bun unless the existing project configuration requires otherwise.

Inspect `package.json` before selecting commands.

Common commands:

- Development: `bun run dev`
- Build: `bun run build`
- Lint: `bun run lint`
- Tests: `bun test`

Run only the checks relevant to the current implementation during development.

Do not run the entire test suite after every individual file edit.

Run final validation after the implementation is complete.

## 6. Testing Strategy

### During implementation

- Run targeted tests when a meaningful change is ready.
- Prefer the smallest relevant test command.
- Do not rerun unchanged tests without a reason.
- After a failure, inspect the error before attempting another run.
- Do not repeat failed commands without addressing their cause.

### Before completion

- Inspect the final diff.
- Run available TypeScript checks.
- Run lint.
- Run relevant tests or the complete test suite.
- Run the production build.
- Report actual exit codes and results.
- Clearly identify skipped or blocked checks.

Do not claim success unless the checks actually passed.

## 7. Playwright Browser Testing

Use the installed Playwright CLI skill for browser-related development and verification.

- Read the installed skill instructions before using it.
- Check whether Playwright is already installed and initialized.
- Reuse existing browser and project configuration.
- Do not reinstall or reinitialize tools unnecessarily.
- Reuse an existing development server where possible.
- Verify the actual user interaction after implementing a fix.
- Inspect relevant console errors and failed network requests.
- Test responsive layouts when relevant.
- Do not claim browser verification unless it was actually performed.

If browser testing is blocked, report the precise reason and continue with available checks.

## 8. Development Server Management

- Check whether the project server is already running before starting another.
- Identify the project directory, process ID, and port.
- Reuse existing servers when possible.
- Do not terminate unrelated Node.js processes.
- Stop only servers started specifically for the current task.
- Verify the process has stopped before reporting successful shutdown.
- Keep the server running only when explicitly requested.

## 9. Project Development Memory

Use `docs/DEVELOPMENT_MEMORY.md` as a concise record of meaningful progress.

Update it after meaningful implementation work with:

- Date and task summary.
- Established root cause.
- Important implementation decisions.
- Files changed.
- Commands actually executed and their results.
- Browser interactions actually verified.
- Remaining issues and next steps.

Do not record secrets or full command logs.

Do not rewrite the entire memory file after every small change.

Update this CLAUDE.md only when stable project architecture, conventions, or commands change.

## 10. Completion Report

At completion, report:

1. What was implemented.
2. Relevant files changed.
3. Checks actually executed.
4. Actual test and build results.
5. Browser verification, when relevant.
6. Remaining issues or limitations.

Distinguish implemented, tested, browser-verified, and unverified behavior.

Never claim an unverified task is complete.
