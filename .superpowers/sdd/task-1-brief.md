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

---

**Current code to modify:**
In `src/app/(public)/blogs/[slug]/page.tsx`, line 40-41, replace:
```typescript
const res = await fetch(`${BASE_URL}/blogs/${slug}`, {
  cache: "no-store",
});
```

With:
```typescript
const res = await fetch(`${BASE_URL}/blogs/${slug}`, {
  next: { revalidate: 60, tags: ["blogs"] },
});
```

**Note:** The `generateMetadata` function on lines 14-16 already uses `next: { tags: ["blogs"] }` - keep this pattern.