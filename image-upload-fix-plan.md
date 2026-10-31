# ImageBB Upload Fix Implementation Plan

## Problem Statement

The current implementation uploads images directly to `https://api.imgbb.com/1/upload` from the browser, causing:
1. CORS errors (browser blocks requests to external domains)
2. 503 Service Unavailable errors from ImageBB
3. API key exposure in client-side JavaScript

## Solution

Route all image uploads through the existing Next.js API route `/api/upload-image` instead of calling ImageBB directly from the browser.

## Tasks

### Task 1: Fix imageUploader.ts to use Next.js API route
- Modify `src/utils/imageUploader.ts` to call `/api/upload-image` instead of `https://api.imgbb.com/1/upload`
- Keep the same function signature: `uploadToImageBB(imageFile: File): Promise<string>`
- Update the function to send FormData to the Next.js API route

### Task 2: Update all components to use the modified uploadToImageBB
- Update `src/components/ui/tiptap-editor.tsx` to use the new upload function
- Update `src/components/modules/owner/blogs/addBlogModal.tsx` to use the new upload function
- Update `src/components/modules/owner/blogs/updateBlogModel.tsx` to use the new upload function
- Update `src/components/modules/owner/projects/addProjectModal.tsx` to use the new upload function
- Update `src/components/modules/owner/projects/updateProjectModal.tsx` to use the new upload function

### Task 3: Test the fix with Playwright
- Start development server
- Test image upload in blog creation
- Test image upload in project creation
- Test image upload in Tiptap editor
- Verify no CORS errors occur
- Verify successful image uploads work
- Stop development server

## Global Constraints
- Maintain existing function signatures
- No breaking changes to component interfaces
- Preserve error handling behavior
- Keep existing test coverage