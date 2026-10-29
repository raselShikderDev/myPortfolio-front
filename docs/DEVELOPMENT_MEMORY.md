# Development Memory

- **2026-10-30: Routing Performance Optimization Complete**
  - **Completed:**
    - Implemented caching for blog detail pages (`src/app/(public)/blogs/[slug]/page.tsx`): added `revalidate: 60` and tags `["blogs"]`.
    - Optimized dashboard statistics API (`src/app/(owner)/dashboard/page.tsx`): added `revalidate: 300` and tags `["stats"]`.
    - Removed redundant client-side JWT fetch from `src/components/modules/layout/nav.tsx`.
    - Fixed Tiptap import syntax error in `src/app/test-tiptap/page.tsx`.
  - **Verification:**
    - `bun run build` successful.
    - Navigation latency verified < 3s.
    - No redundant `/api/profile` calls.
  - **Status:** Complete.

- **Previous Memory:**
  - [tiptap-editor-fixes](tiptap-editor-fixes.md)
  - [routing-performance-complete](routing-performance-complete.md)
