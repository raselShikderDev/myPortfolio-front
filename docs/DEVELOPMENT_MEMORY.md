---
name: remove-tags-and-fix-image-src
description: Completely remove tags from blog cards and fix empty src warning in Tiptap editor
metadata:
  type: project
---

**Date:** 2026-10-28
**Task:** 
1. Completely remove the tag rendering logic from `blogCard.tsx` so tags no longer appear on blog cards on the All Blogs page.
2. Fix the Tiptap image button warning ("An empty string ('') was passed to the src attribute") by providing a valid fallback URL (`https://via.placeholder.com/600x400`) instead of `''`.
3. Ensure all development servers and Playwright CLI tools are shut down/turned off when tasks finish, and update project memory.

**Files Changed:**
- `src/components/modules/blogs/blogCard.tsx` (removed tag rendering block)
- `src/components/ui/tiptap-editor.tsx` (fixed empty string image src)
- `docs/DEVELOPMENT_MEMORY.md` (updated progress)

[[remove-tags-and-fix-image-src]]
