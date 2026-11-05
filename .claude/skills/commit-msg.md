---
name: commit-msg
description: Generate a structured commit message for staged changes and commit them
---

# Commit Message Generator

Follow this workflow when generating a commit message and committing staged changes:

1. **Check Staged Changes:**
   Run `git diff --staged` to verify that changes are staged. If nothing is staged, stop immediately and inform the user to stage their changes first (`git add <files>`).

2. **Read the Staged Diff:**
   Analyze the staged diff to understand what was changed and why.

3. **Generate Commit Message:**
   Format the commit message using Conventional Commits:
   ```
   type(scope): short subject

   - bullet of what changed
   - bullet of why
   ```
   - **Types:** `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`.
   - **Subject:** Under 60 characters, imperative mood.
   - **Body:** Bullet points explaining *what* changed and *why* (optional but encouraged).
   - **Important:** Never include a `Co-Authored-By` trailer for commits made through this skill.

4. **Commit:**
   Run `git commit -m "..."` using the generated message.
