### Task 3: Implement tag-based caching for dashboard stats

**Description:** Update dashboard stats to use tag-based caching with longer revalidation time.

**Acceptance criteria:**
- [ ] Dashboard stats use `next: { tags: ["stats"], revalidate: 300 }` (5 minutes)
- [ ] Stats don't refresh on every dashboard navigation
- [ ] Stats refresh after 5 minutes or when tags are invalidated

**Verification:**
- [ ] Build succeeds: `npm run build` (or `bun run build`)
- [ ] Manual check: Navigate between dashboard pages - stats should not refresh
- [ ] DevTools Network shows cache hits for stats

**Dependencies:** None

**Files likely touched:**
- `src/app/(owner)/dashboard/page.tsx`

**Estimated scope:** Small (1 file)

---

**Current code to modify:**
In `src/app/(owner)/dashboard/page.tsx`, line 38-39, replace:
```typescript
const res = await fetch(`${BASE_URL}/blogs/stats`, {
  next: { revalidate: 60 },
});
```

With:
```typescript
const res = await fetch(`${BASE_URL}/blogs/stats`, {
  next: { tags: ["stats"], revalidate: 300 },
});
```