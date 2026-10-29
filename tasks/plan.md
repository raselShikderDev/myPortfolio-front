# Implementation Plan: Routing Performance Optimization

## Overview 
Fix slow navigation (minutes delay when navigating to blog detail pages) by eliminating redundant JWT verifications, enabling Next.js caching on blog detail pages, and implementing tag-based caching for dashboard stats.

## Architecture Decisions
- **Approach 1: Server Component Data Fetching** - Move data fetching from client components to server components to eliminate per-navigation API calls
- **Approach 2: Caching Strategy** - Use Next.js fetch cache and tags to prevent redundant backend queries
- **Approach 3: Middleware Reliability** - Rely on middleware for token validation instead of client-side API calls

## Performance Bottleneck Analysis

### Critical Issues Identified
1. **Navbar Client-Side JWT Verification** ([nav.tsx:40-45](src/components/modules/layout/nav.tsx#L40-L45))
   - Runs on EVERY top-level navigation with no caching
   - Adds 200-500ms per navigation
   - Redundant - middleware already validates token
   
2. **No Caching on Blog Detail Pages** ([blogs/[slug]/page.tsx:40](src/app/(public)/blogs/[slug]/page.tsx#L40))
   - `cache: "no-store"` prohibits Next.js caching
   - Forces fresh API call on every navigation
   - Primary cause of minutes-long load times

3. **Dashboard Stats Without Tag-Based Caching** ([dashboard/page.tsx:32-40](src/app/(owner)/dashboard/page.tsx#L32-L40))
   - Uses `revalidate: 60` which still fetches on every navigation
   - Should use `tags: ["stats"], revalidate: 300` for efficient caching

### Design Choices
- **Stop fetching user data in Navbar** - Middleware is the source of truth for auth
- **Add caching to blog detail pages** - Cache for 60s with tags for invalidation
- **Add tag-based caching to dashboard** - Reduce frequency from 60s to 300s (5 min)
- **Keep existing patterns** - Don't change data fetching strategy, just improve caching

## Task List

### Phase 1: Blog Detail Page Caching (Highest Impact)
- [ ] Task 1: Add caching to blog detail page data fetch
- [ ] Task 2: Verify blog detail page loads faster after caching

### Checkpoint: Blog Detail Performance
- [ ] Blog detail navigation time reduced from minutes to <3 seconds
- [ ] Network tab shows single API call per navigation (cached)
- [ ] Tests pass (if any for blog pages)

### Phase 2: Dashboard Stats Optimization
- [ ] Task 3: Implement tag-based caching for dashboard stats
- [ ] Task 4: Verify dashboard stats load faster and cache correctly

### Checkpoint: Dashboard Performance
- [ ] Dashboard navigation time reduced
- [ ] Stats API called <5 times per minute (cache hits)

### Phase 3: Navbar JWT Verification Removal
- [ ] Task 5: Remove redundant JWT fetch from Navbar client component
- [ ] Task 6: Test all top-level navigation routes
- [ ] Task 7: Verify token-based UI updates still work

### Checkpoint: Complete Navigation Flow
- [ ] All top-level navigate in <3 seconds
- [ ] Dashboard navigate in <2 seconds
- [ ] Blog detail navigate in <3 seconds
- [ ] No console errors

## Estimated Work Scope
- Total estimated time: 1-2 hours
- Tasks: 7 small tasks
- Files to modify: 6 files
- Risk level: Low (each change is isolated and reversible)

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Cache inaccuracy after data changes | Low | Use tags for proper invalidation (60s blog, 5min stats) |
| Navbar removal breaks auth UI | Medium | Test all routes; middleware still validates tokens |
| Backend still slow (N+1 queries) | High | Add follow-up task to investigate backend queries |

## Open Questions
1. **Backend query investigation needed**: Does the backend execute N+1 queries or unbounded fetches? This is not visible in frontend code.
2. **Has anyone measured actual API response times?** Backend may be slow even with good caching.
3. **Is production data small?** If there are 1000+ blogs, even optimized queries may be slow.

## Verification Strategy
After each phase:
1. Navigate through routes and measure network time using DevTools
2. Check browser console for errors
3. Verify cache headers in DevTools Network tab
4. Test both hot (cached) and cold (fresh) navigations