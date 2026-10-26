# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Development Server:** `bun run dev` (or `npm run dev`) - starts Next.js with Turbopack.
- **Build:** `bun run build` (or `npm run build`) - creates a production build.
- **Linting:** `bun run lint` (or `npm run lint`) - runs ESLint.
- **Testing:** `bun test` - runs all unit tests via Bun.
- **Single Test:** `bun test tests/lib/apiConfig.test.ts` - runs a specific test file.

## High-Level Architecture

- **Framework:** Next.js 15 (App Router), React 19, TypeScript.
- **Runtime & Package Manager:** Bun.
- **Styling:** Tailwind CSS 4, Radix UI, Lucide React icons, Framer Motion.
- **Validation & Forms:** Zod, React Hook Form.

### Directory Structure (`src/`)

- `src/app/` — Next.js App Router pages and API routes.
  - `(authentications)/` — Auth-related pages (e.g., login).
  - `(owner)/` — Protected admin dashboard pages (`manage-blogs`, `manage-projects`, `manage-experiences`).
  - `(public)/` — Public-facing portfolio pages (`about`, `blogs`, `contact`, `projects`).
  - `api/` — Backend API integration endpoints.
- `src/components/` — Reusable React components (`modules/`, `ui/`, `previewImage/`).
- `src/actions/` — Server Actions and helper functions.
- `src/lib/` — Centralized library configurations (e.g., `apiConfig.ts`).
- `src/hooks/` — Custom React hooks.
- `src/interfaces/` — TypeScript interfaces.
- `src/utils/` — Utility functions.
- `src/zodSchema/` — Zod validation schemas.

## Development Rules & Best Practices

- **Minimal Changes:** Make the smallest change that correctly completes the task. Do not perform broad unrelated refactoring.
- **Server/Client Components:** Respect Next.js boundaries. Do not add `"use client"` or convert Server Components to Client Components unless strictly required.
- **API Contracts:** Preserve existing API contracts, endpoint paths, and payload formats.
- **Type Safety:** Maintain strict TypeScript types. Avoid using `any`, `@ts-ignore`, or `@ts-expect-error`.
- **Security:** Never hardcode secrets, API keys, or credentials. Protect cookie-based and token authentication workflows.

## Mandatory Safety & Security Guardrails

### 1. Files & Directories
- **Never delete, remove, truncate, or destructively overwrite** any file or directory without explicit user approval.
- **Preserve uncommitted changes, untracked files, configuration, backups, and user data.**
- Before asking for approval to remove or overwrite anything, provide the exact target paths and describe precisely what would be lost.
- Avoid bulk deletion scripts, wildcard removals, or recursive purge operations.

### 2. Databases & Persistent Data
- **Never drop, reset, truncate, or run destructive migrations/scripts** on any database, schema, table, or collection without explicit user approval.
- Only safe, read-only inspections or non-destructive migrations explicitly requested by the user are permitted.
- Treat every database as production or containing non-recoverable state.

### 3. Git & Remote Operations
- **Never execute `git push`** (normal, force, or tags) to any remote without explicit user approval.
- Before requesting approval to push, state the remote name, target branch, commit hashes, and a summary of commits to be published.
- **Never discard uncommitted work, hard reset history (`git reset --hard`), or perform destructive rebases** without explicit approval.
- Always inspect `git status` and `git diff` safely before proposing commits or changes.

### 4. Elevated & Destructive Actions
- Always require user approval before installing untrusted packages/binaries, altering security configurations/permissions, or triggering infrastructure deployment actions.
