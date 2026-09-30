# Task Execution Workflow

Follow this workflow for every roadmap task.

## Phase 1, Understand

Read:

1. Project context
2. Development rules
3. Current roadmap task
4. Relevant source files

Do not read the entire repository unless necessary.

## Phase 2, Inspect

Before editing, identify:

- relevant files
- existing implementation
- existing utilities
- existing API contracts
- dependencies
- potential side effects

Do not modify files during inspection.

## Phase 3, Plan

Create a short implementation plan.

The plan must contain:

- files expected to change
- purpose of each change
- any new file that may be required
- verification commands

If the task can be completed without creating a new file, prefer that.

## Phase 4, Confirm Scope

Before editing, verify:

- this change belongs to the current roadmap task
- it does not duplicate completed work
- it does not implement a future roadmap item
- it does not unnecessarily change architecture

## Phase 5, Implement

Make the minimum required changes.

Prefer modifying existing files.

Create new files only when justified by the project rules.

Do not perform unrelated cleanup.

## Phase 6, Verify

Run appropriate checks.

For normal code tasks:

bun run lint
bun run build

For testing tasks, also run the relevant test command.

## Phase 7, Review

Review:

git status

git diff

Check:

- unexpected files
- unrelated changes
- API contract changes
- security issues
- accidental formatting changes
- unnecessary dependencies

## Phase 8, Report

Report:

### Completed

What was implemented.

### Files Changed

Exact files.

### Verification

Commands and results.

### Remaining Issues

Only issues relevant to the current task.

### Out of Scope

Issues discovered but intentionally not changed.

## STOP RULE

After completing the requested task and reporting the result:

STOP.

Do not start another roadmap item.

Do not perform additional cleanup.

Do not create a follow-up implementation automatically.

Do not commit or push unless explicitly instructed.
