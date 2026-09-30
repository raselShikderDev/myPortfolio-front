# Development Rules

## Core Principle

Make the smallest change that correctly completes the current task.

The existing application is functional.

Do not rewrite working code merely because another implementation appears cleaner.

## Before Editing

Before changing code:

1. Inspect the relevant existing implementation.
2. Identify the existing pattern.
3. Identify dependencies between affected files.
4. Check whether an existing utility already solves the problem.
5. Determine the minimum files that need modification.

Do not edit immediately after discovering a possible improvement.

## Scope

Work only on the current roadmap task.

Do not:

- perform unrelated refactoring
- rename unrelated files
- rename unrelated functions
- reorganize directories
- rewrite working components
- update unrelated dependencies
- redesign the application
- implement future roadmap tasks

If an unrelated issue is discovered:

- do not fix it automatically
- mention it in the final report under "Out of Scope"

## Creating Files

Creating a new file requires a clear reason.

Create a new file only when:

1. The current task explicitly requires it, OR
2. The functionality is genuinely reusable, OR
3. The existing architecture clearly requires separation.

Before creating a file, check whether an existing file can reasonably contain the functionality.

Do NOT create:

- duplicate utilities
- speculative abstractions
- unnecessary wrapper files
- generic frameworks
- one-use helper files without a clear architectural reason

## Dependencies

Do not install a new dependency unless the current task genuinely requires it.

Before installing a dependency:

1. Check whether the repository already contains a suitable solution.
2. Check whether native Next.js, React, TypeScript, or existing libraries can solve it.
3. Only install when necessary.

Never add dependencies merely for convenience.

## API Contracts

Never change existing API contracts unless explicitly required.

Preserve:

- endpoint paths
- HTTP methods
- request bodies
- query parameters
- headers
- cookies
- authentication behavior
- response structures
- interfaces

Do not invent endpoints.

## Authentication

Authentication is security-sensitive.

Do not:

- expose tokens
- log credentials
- move sensitive tokens into localStorage
- weaken cookie security
- bypass existing authentication checks
- replace the authentication architecture without explicit instruction

## Environment Variables

Never hardcode:

- API keys
- passwords
- tokens
- credentials
- secrets

Never print secret values in output.

Do not commit environment files containing secrets.

## TypeScript

Maintain existing type safety.

Do not use:

- `any`
- `@ts-ignore`
- `@ts-expect-error`

to hide errors unless explicitly justified.

Do not weaken TypeScript configuration to make a task pass.

## Client and Server

Respect Next.js server/client boundaries.

Do not unnecessarily add:

"use client"

Do not move server-only logic into Client Components.

Do not move Client Components to Server Components if they require client functionality.

## Error Handling

Do not silently swallow errors.

Preserve useful error information.

Do not expose sensitive information through errors.

Do not create a large error-handling framework for a small problem.

## Editing Behavior

Do not perform broad automated replacements without reviewing the affected files.

Do not change line endings or formatting across unrelated files.

Do not rewrite entire files when a focused edit is sufficient.

## Git

Do not commit automatically.

Do not push automatically.

Only commit when explicitly instructed.

Before a commit:

- inspect git status
- inspect the diff
- verify the task
- verify there are no unrelated modifications

## Verification

For relevant tasks run:

bun run lint
bun run build

If a command fails because of an external/environment issue, identify it accurately.

Do not change unrelated application code merely to hide an environment problem.

## Completion

A task is complete when:

1. The requested functionality is implemented.
2. Relevant verification passes.
3. No task-related errors remain.
4. The changed files are limited to the task scope.

Then STOP.

Do not continue with additional improvements.
