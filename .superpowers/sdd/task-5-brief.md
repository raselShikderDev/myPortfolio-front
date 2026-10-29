### Task 5: Remove redundant JWT fetch from Navbar client component

**Description:** Remove the useEffect that fetches user profile from navbar, as middleware already validates tokens.

**Acceptance criteria:**
- [ ] Navbar no longer fetches `/api/profile` on mount
- [ ] Navbar still shows/hides Dashboard link based on auth state
- [ ] No useEffect fetch calls in Navbar component
- [ ] Dashboard link appears/disappears correctly based on token state

**Verification:**
- [ ] Build succeeds: `npm run build` (or `bun run build`)
- [ ] Manual check: Navigate between routes - navbar should still work
- [ ] DevTools Network should show NO `/api/profile` calls on navigation
- [ ] Test login/logout functionality

**Dependencies:** None

**Files likely touched:**
- `src/components/modules/layout/nav.tsx`

**Estimated scope:** Small (1 file)

---

**Current code to remove:**
In `src/components/modules/layout/nav.tsx` lines 40-45, remove this entire useEffect:
```typescript
useEffect(() => {
  fetch("/api/profile")
    .then(async (res) => (res.ok ? res.json() : null))
    .then((data) => setTokens(data))
    .catch(console.error);
}, []);
```

**Why This Change:**
- The middleware already validates the token before routing
- Navbar JWT fetch is redundant and adds ~200-500ms per navigation
- Middleware cookie check is sufficient for auth state

**Important:** Do NOT modify anything else in the file. Only remove the useEffect fetch.