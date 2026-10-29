# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## 1. Mandatory Workflow for Every Task

Before starting any task:

1. Read this `CLAUDE.md`.
2. Read `docs/DEVELOPMENT_MEMORY.md` if it exists.
3. Inspect `git status --short` and relevant diffs before editing. Preserve existing user changes.
4. Inspect the relevant source files, tests, package scripts, and existing architecture.
5. Identify what has already been implemented, what remains unfinished, and any known limitations.
6. Make focused changes that solve the actual problem. Do not repeatedly audit, plan, or rewrite documentation instead of implementing the requested work.

After completing each meaningful task:

1. Run the applicable checks and tests.
2. Review the final diff for unintended changes.
3. Update `docs/DEVELOPMENT_MEMORY.md` with the completed work, files changed, verification results, remaining issues, and useful next steps.
4. Update this `CLAUDE.md` only when stable project instructions, architecture, commands, or conventions have changed.
5. Give a concise final report based on actions actually completed.

Do not mark a task complete if required work remains unfinished. If blocked, explain the exact blocker and continue with other feasible work.

## 2. Project Commands

- Development server: `bun run dev` or `npm run dev`
- Production build: `bun run build` or `npm run build`
- Lint: `bun run lint` or `npm run lint`
- Tests: `bun test`
- Single test: `bun test tests/lib/apiConfig.test.ts`

Inspect `package.json` before selecting commands. Use the package manager and scripts appropriate to the repository. Do not assume that a listed script exists without checking.

Do not start duplicate development servers if an appropriate server is already running.

## 3. Browser Testing with Playwright CLI

Playwright CLI is expected to be installed and initialized in the development environment.

For tasks involving UI, forms, navigation, browser behavior, or user interactions:

1. Check the existing CLI with `playwright-cli --help`.
2. Reuse the existing installation, browser, configuration, and project setup.
3. Do not reinstall, reinitialize, or recreate Playwright setup on every task.
4. Do not install additional packages or browser tooling unless necessary and authorized.
5. Inspect the project's existing Playwright tests and configuration before creating new ones.
6. Start or reuse the development server as appropriate.
7. Use the CLI to reproduce the reported issue in the actual browser when possible.
8. After implementing a fix, repeat the same interaction and verify the result.
9. Inspect relevant browser console errors and network requests when investigating frontend or API issues.
10. Record what was tested and the actual results in `docs/DEVELOPMENT_MEMORY.md`.

Prefer repeatable automated regression tests when the project already supports them.

If the CLI is unavailable or browser testing is blocked, do not spend the entire task reinstalling tools. Report the specific blocker, continue with the available checks, and clearly distinguish browser-verified behavior from code-only verification.

Never claim that browser testing passed unless the interaction was actually tested.

## 4. Project Architecture

- Framework: Next.js 15 App Router, React 19, TypeScript.
- Runtime and package manager: Bun.
- Styling: Tailwind CSS 4, Radix UI, Lucide React, Framer Motion.
- Validation and forms: Zod, React Hook Form.

### Directory Structure

- `src/app/`: Next.js pages, layouts, and API routes.
  - `(authentications)/`: Authentication pages.
  - `(owner)/`: Protected dashboard pages, including blog management.
  - `(public)/`: Public pages, including blogs, projects, contact, and about.
  - `api/`: API integration endpoints.
- `src/components/`: Reusable UI and feature components.
- `src/actions/`: Server Actions and helper functions.
- `src/lib/`: Shared library configuration and utilities.
- `src/hooks/`: Custom React hooks.
- `src/interfaces/`: TypeScript interfaces.
- `src/utils/`: Utilities.
- `src/zodSchema/`: Zod schemas.

Verify the actual implementation before relying on this overview. Update it when the architecture changes.

## 5. Development Standards

- Make the smallest correct change that solves the problem.
- Avoid unrelated refactoring.
- Respect Next.js Server and Client Component boundaries.
- Preserve existing API endpoints, payload contracts, and authentication workflows unless a demonstrated defect requires a coordinated change.
- Maintain strict TypeScript typing.
- Avoid `any`, `@ts-ignore`, and `@ts-expect-error` unless there is a documented, justified exception.
- Never hardcode secrets, credentials, or API keys.
- Preserve safe HTML sanitization and URL validation.
- Do not weaken validation or change tests merely to make them pass.
- Investigate root causes rather than hiding symptoms.
- Do not claim success based solely on editing code or reading a successful command exit.

## 6. Project Memory

Use `docs/DEVELOPMENT_MEMORY.md` as the persistent record of development progress.

### Before each task

Read the memory file if it exists. Use it to identify:

- Completed features and fixes.
- Current implementation status.
- Known bugs and unresolved issues.
- Important design decisions and API contracts.
- Commands and tests already verified.
- The next unfinished step, where relevant.

Verify important claims against the current source code when appropriate. Memory is a reference, not proof that the current implementation still behaves as documented.

### After each meaningful task

Update the memory file with concise, factual information:

- Date and task summary.
- Root cause, if established.
- Important implementation decisions.
- Files changed.
- Commands actually run and their results.
- Browser interactions actually verified.
- Remaining problems and next steps.

Distinguish verified facts from assumptions and unverified behavior.

Do not record secrets, tokens, credentials, or unnecessary personal information.

Avoid duplicating the entire `CLAUDE.md`, pasting full command logs, or maintaining an enormous chronological transcript. Keep only information that will help the next development session.

If a task is incomplete, record it as incomplete rather than claiming it is finished.

If no meaningful implementation or verification occurred, do not manufacture a completion entry.

### Keep CLAUDE.md stable

Update `CLAUDE.md` only when persistent instructions, project architecture, standard commands, or development conventions change.

Do not rewrite this file after every task just to record progress. Record task progress in `docs/DEVELOPMENT_MEMORY.md`.

## 7. Mandatory Safety and Security Guardrails

### Files and directories

- Never delete, remove, truncate, or destructively overwrite files or directories without explicit user approval.
- Preserve uncommitted changes, untracked files, configuration, backups, and user data.
- Before requesting approval for deletion or destructive overwriting, identify the exact paths and explain what would be lost.
- Avoid bulk deletion scripts, wildcard removals, and recursive purge operations.

### Databases and persistent data

- Never drop, reset, truncate, or run destructive migrations or scripts against a database, schema, table, or collection without explicit user approval.
- Treat databases as potentially containing production or non-recoverable data.
- Prefer read-only inspection and non-destructive changes unless otherwise authorized.

### Git and remote operations

- Never execute `git push`, including force pushes or tag pushes, without explicit user approval.
- Before requesting approval, state the remote, target branch, commit hashes, and summary of changes to be published.
- Never discard uncommitted work, run `git reset --hard`, or perform destructive rebases without explicit approval.
- Inspect `git status --short` and relevant diffs before making changes.
- Never commit or push unless the user explicitly requests it.

### Elevated and destructive actions

- Require approval before installing untrusted packages or binaries, changing security configurations or permissions, or triggering infrastructure deployments.
- Follow the active tool permission rules. Do not attempt to bypass permission denials or approval requirements.
- Do not modify Claude Code settings or unrelated configuration when the requested task concerns application code.

## 8. Definition of Done

A task is complete when:

- The requested implementation is actually present.
- Relevant tests and checks have been run where available.
- Relevant browser interactions have been tested when required and possible.
- The final diff has been reviewed.
- Development memory has been updated when meaningful progress occurred.
- Remaining limitations are disclosed honestly.

Final reports must distinguish implemented, tested, browser-verified, and unverified behavior.

## 9. Development Server and Playwright Rules

- Before starting a development server, check whether the project is already running and identify its port and process.
- Prefer reusing an existing development server rather than starting another instance.
- Start servers in a visible, dedicated terminal whenever possible.
- Do not launch detached or background development servers unless explicitly necessary.
- For Playwright testing, reuse the existing server when available.
- If you start a server specifically for a task, stop the process you started after testing is complete.
- Never terminate unrelated Node.js processes or other applications.
- Before finishing, verify whether any server started by the task is still running. Report any server that could not be stopped.
- Do not kill processes by name alone; identify the process ID and confirm it belongs to this project.
