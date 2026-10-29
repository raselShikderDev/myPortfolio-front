# Task List: Routing Performance Optimization

## Phase 1: Blog Detail Page Caching (Highest Impact)

### Task 1: Add caching to blog detail page data fetch
**Description:** Remove `cache: "no-store"` and add proper caching with tags to blog detail page.

**Acceptance criteria:**
- [ ] Blog detail page uses `next: { revalidate: 60, tags: ["blogs"] }` instead of `cache: "no-store"`
- [ ] Page still loads fresh blog data after 60 seconds
- [ ] Navigation to blog detail page is significantly faster

**Verification:**
- [ ] Build succeeds: `npm run build`
- [ ] Manual check: Navigate to blog detail page and measure load time in DevTools
- [ ] Network tab shows cached responses

**Dependencies:** None

**Files likely touched:**
- `src/app/(public)/blogs/[slug]/page.tsx`

**Estimated scope:** Small (1 file)

### Task 2: Verify blog detail page loads faster after caching
**Description:** Test that blog detail page navigation performance is improved.

**Acceptance criteria:**
- [ ] Blog detail navigation takes <3 seconds (vs minutes before)
- [ ] Only one API call made for blog data (not multiple)
- [ ] Cache headers show proper caching behavior

**Verification:**
- [ ] Manual check: Use DevTools Network tab to measure navigation time
- [ ] Manual check: Verify cache headers are present
- [ ] Test navigation from manage-blogs to blog detail

**Dependencies:** Task 1

**Files likely touched:**
- (Verification only, no code changes)

**Estimated scope:** Small (testing only)

## Checkpoint: Blog Detail Performance
- [ ] Blog detail navigation time reduced from minutes to <3 seconds
- [ ] Network tab shows single API call per navigation (cached)
- [ ] Tests pass (if any for blog pages)

## Phase 2: Dashboard Stats Optimization

### Task 3: Implement tag-based caching for dashboard stats
**Description:** Update dashboard stats to use tag-based caching with longer revalidation time.

**Acceptance criteria:**
- [ ] Dashboard stats use `next: { tags: ["stats"], revalidate: 300 }` (5 minutes)
- [ ] Stats don't refresh on every dashboard navigation
- [ ] Stats refresh after 5 minutes or when tags are invalidated

**Verification:**
- [ ] Build succeeds: `npm run build`
- [ ] Manual check: Navigate between dashboard pages - stats should not refresh
- [ ] DevTools Network shows cache hits for stats

**Dependencies:** None

**Files likely touched:**
- `src/app/(owner)/dashboard/page.tsx`

**Estimated scope:** Small (1 file)

### Task 4: Verify dashboard stats load faster and cache correctly
**Description:** Test that dashboard navigation is faster with proper caching.

**Acceptance criteria:**
- [ ] Dashboard navigation time reduced by 50%+
- [ ] Stats API called <5 times per minute (cache hits)
- [ ] Stats data remains accurate despite caching

**Verification:**
- [ ] Manual check: Measure dashboard navigation time
- [ ] Manual check: Monitor Network tab during multiple dashboard navigations
- [ ] Verify stats values are correct

**Dependencies:** Task 3

**Files likely touched:**
- (Verification only, no code changes)

**Estimated scope:** Small (testing only)

## Checkpoint: Dashboard Performance
- [ ] Dashboard navigation time reduced
- [ ] Stats API called <5 times per minute (cache hits)

## Phase 3: Navbar JWT Verification Removal

### Task 5: Remove redundant JWT fetch from Navbar client component
**Description:** Remove the useEffect that fetches user profile from navbar, as middleware already validates tokens.

**Acceptance criteria:**
- [ ] Navbar no longer fetches `/api/profile` on mount
- [ ] Navbar still shows/hides Dashboard link based on auth state
- [ ] No useEffect fetch calls in Navbar component

**Verification:**
- [ ] Build succeeds: `npm run build`
- [ ] Manual check: Test all top-level navigation routes
- [ ] Verify Dashboard link appears/disappears correctly

**Dependencies:** None

**Files likely touched:**
- `src/components/modules/layout/nav.tsx`

**Estimated scope:** Small (1 file)

### Task 6: Test all top-level navigation routes
**Description:** Verify that removing navbar JWT fetch doesn't break any navigation.

**Acceptance criteria:**
- [ ] Home → Blogs navigation works
- [ ] Blogs → Projects navigation works  
- [ ] Projects → Contact navigation works
- [ ] All routes load in <3 seconds

**Verification:**
- [ ] Manual check: Navigate through all top-level routes
- [ ] Check browser console for errors
- [ ] Verify middleware still protects dashboard routes

**Dependencies:** Task 5

**Files likely touched:**
- (Verification only, no code changes)

**Estimated scope:** Small (testing only)

### Task 7: Verify token-based UI updates still work
**Description:** Ensure that any UI that depends on user tokens still updates correctly.

**Acceptance criteria:**
- [ ] Dashboard link appears when user is logged in
- [ ] Login link appears when user is not logged in
- [ ] No token-related UI breaks

**Verification:**
- [ ] Manual check: Login/logout and verify UI updates
- [ ] Test with different user roles (if applicable)
- [ ] Check all auth-dependent UI elements

**Dependencies:** Task 5

**Files likely touched:**
- (Verification only, no code changes)

**Estimated scope:** Small (testing only)

## Checkpoint: Complete Navigation Flow
- [ ] All top-level navigate in <3 seconds
- [ ] Dashboard navigate in <2 seconds
- [ ] Blog detail navigate in <3 seconds
- [ ] No console errors