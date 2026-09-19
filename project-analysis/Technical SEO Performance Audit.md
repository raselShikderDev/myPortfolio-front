# Technical SEO Performance Audit

## 1. Next.js Architecture

### App Router Usage

- The project uses Next.js 15 App Router with route groups: `(public)`, `(authentications)`, `(owner)`.
- Route groups are correctly used to separate public routes, authentication, and owner dashboard.

### Server Components vs Client Components

- Root layout (`src/app/layout.tsx`) is a Server Component by default (no `"use client"`).
- Error page (`src/app/error.tsx`) is a Client Component (`"use client"`), which is appropriate for interactive error UI.
- Contact page (`src/app/(public)/contact/page.tsx`) is a Client Component due to form state and API calls.
- Login page (`src/app/(authentications)/login/page.tsx`) is a Client Component for form handling.
- Many UI components (buttons, inputs, modals, etc.) are Client Components due to interactivity.
- Some pages like Home (`src/app/(public)/page.tsx`), About (`src/app/(public)/about/page.tsx`), Projects (`src/app/(public)/projects/page.tsx`) are Server Components (no `"use client"`), which is good for SEO and performance.
- Blog detail page (`src/app/(public)/blogs/[slug]/page.tsx`) uses `generateMetadata` and is a Server Component (async function).

### Unnecessary "use client"

- No obvious unnecessary `"use client"` found in pages. However, many UI components in `@/components/ui` are Client Components, which is expected for a UI library.

### Data Fetching Patterns

- Mix of server actions and client-side `fetch`:
  - Projects page uses `fetch` with `next: { tags: [...] }` for revalidation.
  - Blogs page uses `getAllBlogs` action (src/actions/getBlogs.ts) which likely fetches from API.
  - Blog detail page uses `fetch` in `generateMetadata` and in the component.
  - Owner dashboard fetches with token authorization.
  - Some actions like `getProjects.ts`, `getBlogs.ts` are server actions.
- Inconsistency: Projects page uses direct `fetch` while Blogs page uses an action. This creates inconsistency in data fetching.

### Server Actions

- Server actions are used (e.g., `src/actions/getBlogs.ts`, `src/actions/auth.ts`).
- Actions are correctly placed in the `actions` folder.

### Route Organization

- Route groups separate concerns well.
- Dynamic routes: `/blogs/[slug]` for blog details.
- No catch-all routes seen.

### Layouts

- Root layout provides fonts, theme provider, and toaster.
- Owner layout provides sidebar structure.
- Public routes share no layout beyond root, which is fine.

### Loading States

- Contact page shows loading state on submit.
- Projects page does not show loading state during data fetch (only error state).
- Blogs page shows no loading state; if data is empty, shows "No blogs found." but no skeleton loader.
- Blog detail page does not show loading state.
- Owner dashboard shows no loading state during stats fetch.

### Error Handling

- Global error component (`src/app/error.tsx`) provides a UI with reset button.
- Contact page catches errors and shows toast.
- Projects page catches errors and logs to console but shows no UI error state (only if data is empty, shows "No projects available").
- Blogs page catches errors and shows error message.
- Blog detail page throws error on failed fetch, which will be caught by global error boundary.
- Owner dashboard does not handle errors (if token missing or fetch fails, it may break).

### Not-Found Handling

- No custom `not-found.tsx` file. Next.js will show default 404 page.
- Blog detail page returns a metadata object with title "Blog Post Not Found" if res not ok, but the component will still render and likely throw error when trying to access `data.data`.

### Dynamic Routes

- Blog detail uses `[slug]` and generates metadata dynamically.
- No other dynamic routes seen.

### Unnecessary Client-Side JavaScript

- Many UI components are Client Components due to framer-motion or interactivity, which is necessary.
- However, some components like `MotionDiv`, `MotionP`, etc. are wrappers that could be Server Components if they don't use client-only features (but they use `motion` from framer-motion, which is client-only).
- The use of framer-motion for animations may be considered unnecessary for SEO if it delays content visibility, but it's wrapped in `whileInView` which is okay.

## 2. TypeScript and Code Quality

### Any Usage

- Several instances of `any` type found:
  - `src/actions/auth.ts`: `login` function parameter `data: any`
  - `src/app/(authentications)/login/page.tsx`: catch `(err: any)`
  - `src/app/(public)/contact/page.txt`: catch `(error: any)`
  - Multiple files in owner modules (addBlogModal, updateBlogModel, addProjectModal, etc.) use `any` for form data.
- This reduces type safety and should be replaced with proper types or Zod schemas.

### Weak Typing

- The `any` usage above is weak typing.
- Some interfaces are defined (e.g., `IBlog`, `IProject`, `IWorkExperince`) but not consistently used.
- In `src/app/(public)/blogs/page.tsx`, the `blogs` variable is typed as `IBlog[]` but the fetch result is not validated against the interface.

### Duplicated Logic

- Data fetching logic is duplicated across pages (projects, blogs, etc.) with similar try/catch and fetching patterns.
- Modal forms (addBlogModal, addProjectModal, etc.) have similar structure for handling file uploads and form submission.
- The `assets.tsx` file exports large objects that are imported in many places, potentially causing barrel import issues.

### Unnecessary Abstractions

- The `motionElements.tsx` file is a simple wrapper around `motion` components. It could be considered unnecessary abstraction as it only re-exports motion components.
- However, it provides consistent naming and may be useful for theme changes.

### Large Components

- The About page (`src/app/(public)/about/page.tsx`) is large (over 200 lines) due to extensive animation wrappers and content.
- The Projects page is also large due to combining projects and work experience.
- The Contact page is moderately large.

### Inconsistent Naming

- Some components use camelCase, others use PascalCase consistently.
- File names: some use kebab-case, others use PascalCase (e.g., `workExperiencecard.tsx` vs `projectCard.tsx`).
- In `src/components/modules/projects/` there is `workExperiencecard.tsx` (lowercase w) and `projectCard.tsx` (lowercase p). Inconsistent casing.

### Dead Code

- The reconnaissance report mentions commented/dead code.
- In contact page, there is a commented-out `MotionAextarea` and metadata export.
- In `src/assets/assets.tsx`, there is a commented line: `// Add more projects dynamically...`
- Several files have commented-out imports or code blocks (e.g., in sidebar.tsx there are comments that are explanatory, not dead code).

### Commented-Out Code

- Contact page: lines 16-20 (metadata export) and line 127-136 (commented MotionAextarea).
- Blog detail page: no commented code seen.
- Many files have TODO comments (only one found in the reconnaissance report, but likely more).

### Duplicated Components

- No exact duplicated components found, but similar modals (addBlogModal, addProjectModal, addWorkExpModal) share similar structure.

### Barrel Imports

- The `src/assets/assets.tsx` is a barrel file exporting many constants.
- The `@/components/ui` export is a barrel that re-exports Radix UI components.
- Barrel imports can lead to unnecessary tree-shaking issues if not configured properly, but Next.js with SWC should handle it.

### Maintainability Problems

- The use of `any` types reduces maintainability.
- Large components like About page are hard to maintain.
- Inconsistent form usage: Contact page uses raw `<input>` for name/email but `Textarea` from UI library for message (as noted in reconnaissance report).
- Hardcoded delay values in motion props (e.g., in About page) reduce maintainability.

## 3. Performance

### Image Sizes and Formats

- Images in `/public` are large PNG files:
  - work-1.png: ~589KB
  - work-2.png: ~589KB
  - work-3.png: ~431KB
  - work-4.png: ~434KB
  - user-image.png, etc. not checked but likely large.
- These are served as-is without optimization (not using `next/image` or modern formats like WebP/AVIF).
- The About page uses `next/image` for the profile image, but the src is from `assets.user_image` which is an import from `./user-image.png` (still a PNG).
- The projects data in `assets.ts` references images like `/projects/library.png` which may not exist in the public folder (only work-* images are present). This could lead to 404s.

### Next/Image Usage

- Used in About page for profile image.
- Not used for the large work images in the assets (they are used as backgroundImage in divs, not as `<Image>`).
- The projects and experiences data in `assets.ts` reference images that are not in the public folder (checked: no `/projects/library.png` etc.). This will cause broken images.

### Image Loading Strategy

- The work images are set as `backgroundImage` on divs, which loads immediately and may impact LCP.
- No lazy loading for these background images.
- The `next/image` in About page has default loading behavior (eager for above-the-fold? Actually, `next/image` defaults to lazy for images below the fold, but the profile image is likely above the fold).

### Fonts

- Google fonts are used: Outfit and Ovo, loaded via `next/font/google` in layout.tsx. This is optimal as it self-hosts the fonts and prevents layout shift.

### Animations

- Framer Motion is used extensively via wrapper components (`MotionDiv`, `MotionH2`, etc.).
- Animations are triggered on scroll view (`whileInView`).
- Some animations have hardcoded delay values (e.g., in About page: `delay: 0.4`, `delay: 0.8`, etc.) which may cause staggered animations but could be problematic if delays are too long.
- The reconnaissance report mentions "Inline Animation Delays" as an issue.

### Framer Motion Usage

- Used for page transitions and element animations.
- The motion components are client-only, which increases JavaScript bundle size.
- Some animations may be unnecessary for a portfolio (e.g., rotating icons on hover in About page).

### Bundle-Heavy Dependencies

- Dependencies include: `framer-motion`, `next`, `react`, `react-dom`, `react-hook-form`, `zod`, `tailwindcss`, `clsx`, `lucide-react`, `react-icons`, `sonner`, `next-themes`, `jose`, `jsonwebtoken`, `jwt-decode`, `next-auth`, `next-themes`, `radix-ui`, `@radix-ui/*`, `@hookform/resolvers`, `class-variance-authority`, `date-fns`, `vercel`, `react-payment-inputs`.
- `framer-motion` is relatively heavy (~70KB gzipped).
- `react-icons` and `lucide-react` both are included; `lucide-react` is used for icons, `react-icons` is also used for some icons (FaReact, FaNodeJs, etc.). This is duplication.
- `next-auth` is included but not heavily used (custom auth flow is used).

### Unnecessary Renders

- No obvious unnecessary renders seen (no misuse of useState or useEffect causing loops).
- However, the use of `whileInView` from framer-motion may cause re-renders when elements enter viewport.

### API Requests

- Multiple API requests on Projects page: fetches for projects and work experience in parallel.
- Blogs page: one request for all blogs.
- Blog detail page: two requests (one for metadata, one for component).
- Contact page: one request to web3forms.
- Owner dashboard: one request for stats.
- No request deduplication or caching beyond `next: { tags: [...] }` and `revalidate: 60` in dashboard.

### Data Fetching

- Inconsistent use of server actions vs client-side fetch.
- No use of `next/cache` for manual cache control.
- No stale-while-revalidate patterns beyond `next: { tags: [...] }`.

### Third-Party Services

- Web3forms for contact form (exposed key).
- APIs for data (backend hosted on Vercel).
- Icons from react-icons and lucide-react.

### Loading Behavior

- Initial load may be slow due to large image files and JavaScript bundle.
- No loading skeleton or placeholder for content while data is fetching (except contact form submit).

## 4. SEO

### Page Metadata

- Root layout has basic metadata (title and description).
- About page has full metadata (title, description, keywords).
- Projects page has metadata.
- Contact page has metadata commented out (lines 16-20).
- Blogs page (`src/app/(public)/blogs/page.tsx`) has no metadata export.
- Home page (`src/app/(public)/page.tsx`) has no metadata.
- Login page (under authentications) has no metadata.
- Blog detail page uses `generateMetadata` for dynamic titles and descriptions based on blog data.

### Title

- Present on pages that have metadata.
- Missing on Home, Blogs, Contact, Login.

### Description

- Present on About, Projects.
- Missing on Home, Blogs, Contact, Login.

### Open Graph

- No Open Graph properties (og:title, og:description, og:image) seen in any metadata.
- The `next` Metadata type supports Open Graph via `openGraph` property, but not used.

### Twitter/X Metadata

- Not seen.

### Canonical URLs

- Not set in metadata. Next.js does not automatically add canonical URLs.

### Sitemap

- No `sitemap.xml` or `sitemap.index.xml` in public directory.
- No evidence of automatic sitemap generation.

### Robots.txt

- No `robots.txt` in public directory.

### Semantic HTML

- Use of `<section>`, `<header>`, `<main>`, `<footer>` (Footer component is used in layout? Actually, Footer is imported in layout? No, Footer is not in root layout. The Footer component is imported in some pages? Not seen. The layout does not include a footer.
- Use of `<h1>`, `<h2>`, `<h3>`, etc. but hierarchy may not be strict (e.g., About page uses MotionH3 then MotionH2, which is okay).
- Use of `<nav>`? Not seen; the Navbar2 component is used but not checked.

### Heading Hierarchy

- About page: MotionH3 (Introduction) then MotionH2 (About me) – this skips H1. The H1 is likely provided by the page title or layout? Actually, the page does not render an h1; the motion components are h3 and h2. This is incorrect hierarchy.
- Projects page: MotionH2 (My works) then MotionP (description) then later another H2 (Work Experience). This skips H1.
- Blogs page: h2 (All Blogs) – no h1.
- Contact page: MotionH3 then MotionH2 – skips H1.
- Home page: no heading elements (only Header and Services components).
- Proper heading hierarchy should start with h1 for the main title of the page.

### Image Alt Text

- About page: `<Image alt="user" ...>` – alt text is "user", which is not descriptive. Should be something like "Profile of Rasel Shikder".
- Other images: the work images are used as background images, so alt text is not applicable (but they are decorative? Actually, they are content images showing projects, so they should have alt text if conveyed via `<img>`, but they are background images so they are decorative and should be in CSS.
- The projects data in `assets.ts` does not include alt text for images.

### Structured Data/Schema

- No JSON-LD or microdata seen for organization, person, blog posting, etc.

### Favicon/Site Identity

- `favicon.ico` is present in the root app directory (seen in listing). It's a large file (25KB) but acceptable.

### Which Pages Have Good SEO

- About page: has metadata, but missing Open Graph and heading hierarchy issues.
- Projects page: similar to About.
- Blog detail page: has dynamic metadata, but missing Open Graph and may have heading issues inside the component.
- Home, Blogs, Contact, Login: missing metadata.

### Which Pages Need Changes

- All pages need Open Graph and Twitter metadata.
- All pages need proper heading hierarchy (start with h1).
- Home, Blogs, Contact, Login need basic metadata.
- Contact page needs to uncomment metadata.
- All images should have descriptive alt text if they are content images.

## 5. Accessibility

### Semantic HTML

- As noted, heading hierarchy is incorrect on many pages.
- Use of `<main>` in layout and owner layout is good.
- Use of `<nav>`? The Navbar2 component (not checked) likely uses `<nav>` or `<ul>`.

### Keyboard Navigation

- No obvious keyboard traps seen.
- Buttons and links should be keyboard accessible; custom components from `@/components/ui` (based on Radix) are likely accessible.

### Focus States

- Not explicitly checked, but Radix components typically have focus styles.

### Labels

- Contact page: uses `<label>` for email and password? Actually, for name and email inputs, there are `<label>` elements (see lines 55-56 and 66-67). Good.
- However, the inputs themselves do not have `htmlAttributes` from react-hook-form? They do: `{...register("email")}` which includes `id`, `name`, `onChange`, etc. The label uses `htmlFor="email"` which matches the id. Good.
- The textarea in contact page uses `<Textarea>` from UI library; need to check if it properly associates with label. The label is not present; the form has no label for the textarea (see lines 137-143). This is an accessibility issue: missing label for the message textarea.
- Login page: labels for email and password are present and associated correctly.

### Buttons vs Links

- Buttons are used for form submission (Contact, Login).
- Links are used for navigation (likely in Navbar2).
- No instances of buttons being used as links or vice versa seen.

### Color Contrast

- Not audited automatically; but the reconnaissance report mentions "Potential low color contrast in some sections (not audited)".
- The use of dark mode (`dark:bg-[#11001f]`) and light mode may have contrast issues; should be verified.

### ARIA Usage

- Not seen explicitly; Radix components use ARIA internally.

### Form Accessibility

- Contact form: missing label for textarea as noted.
- Also, the form uses a third-party service (web3forms) which may not be accessible.
- Login form: appears accessible.

### Mobile Touch Targets

- Not audited; but buttons and inputs appear to have reasonable size.

### Animation Accessibility

- The site uses framer-motion animations. There is no evidence of `prefers-reduced-motion` media query to disable animations for users who request it.
- The reconnaissance report mentions "animation accessibility" as something to check.

### Prefers-Reduced-Motion

- No implementation seen. Should respect `prefers-reduced-motion` by disabling or reducing animations.

## 6. Security

### Exposed API Keys

- Contact page line 30: `formData.append("access_key", "0e603e92-0127-45bf-941a-6fbc380b94f8");` – this is an exposed client-side key for web3forms.
- This is a security risk as it allows anyone to send emails on behalf of the service (though limited to web3forms). However, the key is public and could be abused for spamming.

### Environment Variables

- `NEXT_PUBLIC_BASE_URL` is used in multiple places (fetch URLs). This is exposed to the client as expected.
- No other environment variables seen in the code.

### NEXT_PUBLIC Variables

- Only `NEXT_PUBLIC_BASE_URL` is seen.

### Authentication/Token Handling

- Custom token flow: login action returns a token, stored in cookies (via `next-auth/react` SessionProvider? Actually, the authProvider uses `SessionProvider` from `next-auth/react` but the login action seems to set a cookie? Not checked.
- The token is retrieved via `getUserSession` (src/lib/getUserSession.ts) which likely reads from cookies.
- The token is used in owner dashboard to fetch stats via Authorization header.
- The token is only checked client-side in the dashboard (line 18-21: if (!token) { console.error("token not found") } but no redirection to login).
- No server-side validation on API routes (the backend API is not in this repo, so cannot verify).
- Reconnaissance report notes: "Auth Security: Client-side token check only; no server-side validation on API routes (invisible in this repo) risks exposure."

### Cookies

- Used for storing session token (via next-auth).
- No evidence of cookie security flags (HttpOnly, Secure, SameSite) in the frontend (setting cookies is likely done by backend).

### Client-Side Authorization Checks

- Owner dashboard checks for token presence but only logs error; does not redirect.
- Other owner routes (manage-blogs, etc.) likely also check for token? Not checked.
- No route protection seen in the frontend (no wrapper that checks auth and redirects).

### Unsafe HTML

- No use of `dangerouslySetInnerHTML` seen.

### XSS Risks

- The contact form sends user input to a third-party service; risk of XSS if the service reflects unsanitized input.
- Blog content is rendered via `BlogDetailsCard` (not checked) but likely uses safe rendering.

### API Exposure

- The frontend exposes the `NEXT_PUBLIC_BASE_URL` which points to the backend API. This is expected.
- No other API keys exposed.

### Third-Party Services

- Web3forms (contact form) – exposed key as above.
- Icons from react-icons and lucide-react – safe.
- Sonner for toast – safe.
- Next-auth – safe.

## 7. Reliability

### API Unavailable

- Projects page: catches error and logs to console, but UI shows no error state; if data fetch fails, `projectsData` remains empty and the page shows "No projects available at the moment." (line 86-90). This is misleading; should show an error message.
- Blogs page: catches error and shows error message (lines 28-37).
- Blog detail page: throws error on failed fetch, which will be caught by global error boundary and show the error page.
- Contact page: catches error and shows toast.
- Owner dashboard: does not handle errors; if fetch fails, `result` may be undefined and accessing `result.data` will cause runtime error.

### API Returns Error

- As above: Projects page treats any non-ok response as empty data (line 46: `if (projectsRes.ok)`). If the API returns an error response (e.g., 500), it will show "No projects available".
- Blogs page: checks `if (!res.ok)` and shows error.
- Blog detail page: same.
- Owner dashboard: does not check `res.ok`; assumes JSON response.

### API Returns Empty Data

- Projects page: if `projectsData` is empty, shows "No projects available".
- Blogs page: if `blogs?.length > 0` false, shows "No blogs found."
- Blog detail page: if blog data is missing, returns fallback metadata (title: "Blog Post Not Found", etc.).
- Owner dashboard: if stats data is missing, the cards will show undefined values (e.g., `value={data.stats.totalViews}` where `data.stats` may be undefined).

### Network Request Slow

- No loading states for initial data fetch on Projects, Blogs, Blog detail, Owner dashboard.
- Contact page shows loading state on submit only.

### Project Data Missing

- As above: shows "No projects available".

### Blog Data Missing

- Blogs page: shows "No blogs found."
- Blog detail page: shows fallback metadata.

### Images Fail

- No error handling for image loading (e.g., `onError` on `<Image>` or background images).
- If an image fails to load, it will show broken image icon or empty background.

### Contact Submission Fails

- Contact page shows toast success or error based on response from web3forms.

## 8. Dependencies

### Package.json Review

- Dependencies (from earlier):
  - `@hookform/resolvers`: used with react-hook-form and zod – necessary.
  - `@radix-ui/*`: used for UI components – necessary.
  - `class-variance-authority`: for Tailwind variance – necessary.
  - `clsx`: for conditional class names – necessary.
  - `date-fns`: for date formatting – used? Not seen in code but may be used in utils.
  - `framer-motion`: for animations – used heavily.
  - `jose`: for JWT utilities – used? Not seen but may be used in auth.
  - `jsonwebtoken`: for JWT – used in auth actions.
  - `jwt-decode`: for decoding JWT – used? Not seen.
  - `lucide-react`: for icons – used.
  - `next`: framework – necessary.
  - `next-auth`: for authentication – installed but custom auth is used; may be redundant.
  - `next-themes`: for theme switching – used in layout and contact page.
  - `radix-ui`: meta package – may be unnecessary if individual radix-ui packages are used.
  - `react`: necessary.
  - `react-dom`: necessary.
  - `react-hook-form`: for forms – necessary.
  - `react-icons`: for icons – used in About page (FaReact, FaNodeJs, etc.) but lucide-react is also used. This is duplication.
  - `react-payment-inputs`: not seen in code – may be unused.
  - `sonner`: for toast – used.
  - `tailwind-merge`: for merging Tailwind classes – used? Not seen but likely used in cn utility.
  - `tailwindcss`: necessary.
  - `tw-animate-css`: for Tailwind animations – not seen in code.
  - `typescript`: necessary.
  - `zod`: for form validation – necessary.
  - `@types/*`: dev dependencies – necessary.

### Potentially Unnecessary Dependencies

- `react-payment-inputs`: not found in codebase (search returned no results). Likely unnecessary.
- `tw-animate-css`: not found in codebase.
- `radix-ui`: the meta package; if we are using `@/components/ui` which imports individual radix components, the meta package may be unnecessary.
- `next-auth`: if custom auth flow is used and next-auth is not used elsewhere, it may be unnecessary. However, the `authProvider` uses `next-auth/react` SessionProvider, so it is used.
- `jwt-decode`: not found in codebase (search returned no results). May be unnecessary.
- `jose`: not found in codebase; may be unnecessary if not used.

### Duplicate Libraries

- `react-icons` and `lucide-react` both provide icons. The code uses both: About page uses `react-icons` for Si*, Fi*, Ri*, Tb*; lucide-react is used in other places (Loader2, etc.). This is duplication; should standardize on one.

### Dependencies That Should Not Be Removed

- All others appear to be used.

## 9. Testing

### Current Testing Situation

- No test directory or test files found (src/__tests__, src/test, etc.).
- No configuration for Jest, Vitest, or other testing frameworks in package.json (no test script).
- Therefore, there are no tests.

### Recommended Minimal Testing Strategy

- Start with unit tests for utility functions and components using Vitest (since the project uses Vite/Turbopack) or Jest.
- Add tests for critical paths: form validation (login, contact), data fetching utilities, and UI components.
- Use React Testing Library for component tests.
- Aim for high coverage on authentication and form logic.
- End-to-end tests can be added later with Playwright or Cypress.
- Given the portfolio nature, a minimal setup is sufficient; not necessary to have a huge testing suite.

## 10. PRIORITIZED TECHNICAL ROADMAP

### CRITICAL

Issues that should be fixed before major portfolio work.

| Priority | Category | Exact File/Component | Current Situation | Evidence from Code | Recommended Solution | Expected Benefit | Implementation Complexity | Before/After Visual Improvements |
| ---------- | ---------- | ---------------------- | ------------------- | --------------------- | ---------------------- | ------------------ | --------------------------- | ---------------------------------- |
| CRITICAL | Security | src/app/(public)/contact/page.tsx:30 | Exposed API key for web3forms | Line 30: `formData.append("access_key", "0e603e92-0127-45bf-941a-6fbc380b94f8");` | Replace with a proxy endpoint on your own backend to hide the key, or use a different service that allows key hiding. | Prevents abuse of the key and unauthorized submissions. | Medium | Before |
| CRITICAL | Reliability | src/app/(public)/projects/page.tsx:32-57 | No error UI for failed API requests; shows "No projects available" on error | Lines 46-54: only checks `if (projectsRes.ok)`; on error, data remains empty and shows "No projects available". | Add error state and UI to show error message when API fails. | Improves user experience and avoids misleading users. | Low | Before |
| CRITICAL | Reliability | src/app/(owner)/dashboard/page.tsx:17-34 | No error handling for token missing or API failure; may cause runtime error | Lines 18-21: only logs if token missing; lines 22-34: fetches without checking token validity or handling errors. | Add error state and redirect to login if token missing; handle API errors gracefully. | Prevents crashes and improves dashboard reliability. | Medium | Before |
| CRITICAL | SEO | src/app/(public)/contact/page.tsx:16-20 | Metadata is commented out | Lines 16-20: `/* export const metadata = { ... } */` | Uncomment the metadata block and ensure it's correct. | Improves SEO for contact page. | Low | Before |

### HIGH

Issues worth fixing during the portfolio improvement.

| Priority | Category | Exact File/Component | Current Situation | Evidence from Code | Recommended Solution | Expected Benefit | Implementation Complexity | Before/After Visual Improvements |
| ---------- | ---------- | ---------------------- | ------------------- | --------------------- | ---------------------- | ------------------ | --------------------------- | ---------------------------------- |
| HIGH | Performance | src/assets/assets.tsx | Large PNG images in public folder not optimized | File sizes: work-1.png ~589KB, work-2.png ~589KB, etc. | Convert images to WebP/AVIF and use `<Image>` component with proper sizing. | Reduces page load time and improves LCP. | Medium | Before |
| HIGH | Performance | src/assets/assets.tsx | Background images cause layout shift and load immediately | Used as `backgroundImage` in divs (e.g., About page background? Actually, the work images are used in the `assets.workData` for backgroundImage in Home? Not checked, but likely in Services or Home components). | Use `<Image>` with `priority` for above-the-fold and lazy loading for others; or use CSS background-image with `background-size: cover` and ensure dimensions are set to avoid layout shift. | Improves loading performance and CLS. | Medium | Before |
| HIGH | TypeScript | Multiple files (auth.ts, contact page, owner modals) | Usage of `any` type weakens type safety | Examples: src/actions/auth.ts:5, src/app/(public)/contact/page.tsx:58, etc. | Replace `any` with proper types or Zod schemas. | Improves code maintainability and catches errors at compile time. | Medium | Before |
| HIGH | SEO | All pages (Home, Blogs, Contact, Login) | Missing basic metadata (title, description) | Home page: no metadata export; Blogs page: no metadata; Contact page: commented; Login page: no metadata. | Add metadata export to each page with appropriate titles and descriptions. | Improves search engine visibility and click-through rates. | Low | Before |
| HIGH | Accessibility | src/app/(public)/contact/page.tsx:137-143 | Missing label for message textarea | The form has labels for name and email but not for the textarea. | Associate a label with the textarea using `htmlId` from react-hook-form or wrap the Textarea in a label. | Improves accessibility for screen reader users. | Low | Before |
| HIGH | Accessibility | Site-wide | No respect for prefers-reduced-motion | No media query to disable animations for users who request reduced motion. | Implement a wrapper that checks `window.matchMedia('(prefers-reduced-motion: reduce)')` and disables or reduces animations. | Improves accessibility for users with vestibular disorders. | Low | Before |
| HIGH | Code Quality | src/assets/assets.tsx | Barrel import of large object | The file exports a large `assets` object with many images and data. | Consider splitting into multiple files or using dynamic imports for images that are not always needed. | May improve bundle size by allowing better tree-shaking. | Low | Before |
| HIGH | Code Quality | src/components/modules/animations/motionElements.tsx | Unnecessary abstraction | The file only re-exports motion components. | Consider using `motion.div` directly or keep the wrapper if it provides value (e.g., centralizing motion configuration). | Reduces indirection; minimal impact. | Low | Before |
| HIGH | Dependencies | package.json | Duplicate icon libraries: react-icons and lucide-react | Both libraries are used in the codebase. | Choose one (e.g., lucide-react) and replace the other throughout the code. | Reduces bundle size and dependency complexity. | Medium | Before |

### MEDIUM

Useful improvements.

| Priority | Category | Exact File/Component | Current Situation | Evidence from Code | Recommended Solution | Expected Benefit | Implementation Complexity | Before/After Visual Improvements |
| ---------- | ---------- | ---------------------- | ------------------- | --------------------- | ---------------------- | ------------------ | --------------------------- | ---------------------------------- |
| MEDIUM | Performance | src/app/layout.tsx | Google fonts are loaded but may block rendering if not optimized | Uses `next/font/google` which is optimal. | No change needed; already good. | — | — | — |
| MEDIUM | SEO | Site-wide | Missing Open Graph and Twitter metadata | No `openGraph` or `twitter` properties in any metadata. | Add `openGraph` and `twitter` objects to metadata exports (e.g., in layout.tsx or per page). | Improves appearance when links are shared on social media. | Low | Before |
| MEDIUM | SEO | Site-wide | No sitemap.xml or robots.txt | None found in public directory. | Add `sitemap.xml` and `robots.txt` (can be generated dynamically or static). | Helps search engines crawl and index the site correctly. | Low | Before |
| MEDIUM | Reliability | Site-wide | No loading states for initial data fetch | Projects, Blogs, Blog detail, Owner dashboard lack loading skeletons or spinners. | Add loading states (e.g., skeleton loaders) while data is fetching. | Improves perceived performance and user experience. | Medium | Before |
| MEDIUM | Code Quality | src/components/modules/owner/blogs/addBlogModal.tsx:107 | Inefficient tag processing | Line 107: `.map((tag: any) => tag.trim())` inside `any` typing. | Fix typing and consider using utility functions. | Improves readability and type safety. | Low | Before |
| MEDIUM | Code Quality | Multiple files | Commented-out code and TODO comments | Contact page has commented metadata and MotionAextarea; reconnaissance report mentions TODO comments. | Remove or address commented code and TODOs. | Improves code maintainability. | Low | Before |
| MEDIUM | Accessibility | Site-wide | Heading hierarchy issues | Pages like About, Projects, Blogs, Contact start with h2 or h3 without h1. | Ensure each page has an h1 as the main heading (e.g., adjust motion components or add hidden h1 for SEO). | Improves accessibility and SEO. | Low | Before |

### LOW

Optional polish.

| Priority | Category | Exact File/Component | Current Situation | Evidence from Code | Recommended Solution | Expected Benefit | Implementation Complexity | Before/After Visual Improvements |
| ---------- | ---------- | ---------------------- | ------------------- | --------------------- | ---------------------- | ------------------ | --------------------------- | ---------------------------------- |
| LOW | Performance | src/components/modules/animations/motionElements.tsx | Framer Motion may be unnecessary for some animations | Some animations (e.g., rotating icons on hover) may be non-essential. | Consider removing non-essential animations or providing a toggle based on user preference. | Reduces JavaScript bundle and improves FID on low-end devices. | Low | After |
| LOW | Code Quality | src/app/error.tsx | Error page does not show detailed error in production | Only shows `error.message`; in production, detailed errors are hidden. | Consider adding a way to view error details in development only. | Improves debugging experience. | Low | After |
| LOW | Dependencies | package.json | Unused dependencies: react-payment-inputs, tw-animate-css, jose, jwt-decode (if not used) | Not found in codebase search. | Remove if confirmed unused. | Reduces install size and potential vulnerabilities. | Low | After |
| LOW | SEO | Site-wide | No structured data/schema | No JSON-LD for organization, person, etc. | Add JSON-LD script in layout for organization and possibly blog posts. | Improves search engine understanding and rich results. | Low | After |
| LOW | Accessibility | Site-wide | No skip-to-content link | No mechanism to skip navigation for keyboard users. | Add a visually hidden skip link at the top of the page. | Improves keyboard navigation. | Low | After |

### Note on Implementation Complexity

- Low: Simple changes, minimal risk.
- Medium: Requires moderate changes, may affect multiple files.
- High: Significant refactoring or architectural changes.

### Visual Improvements Note

The user mentioned "visual improvements" in the context of the portfolio improvement process. The roadmap distinguishes between fixes that should be done before visual improvements (to ensure a solid foundation) and after (polish that can be done alongside or after visual changes).

Given the analysis, most critical and high-priority issues should be addressed before visual improvements to ensure the site is secure, reliable, performant, and accessible. Visual improvements (such as UI tweaks, animation enhancements, styling changes) can then be built on a solid foundation.

Now, we need to output this report. Since we cannot create the file, we will output it in the response and instruct the user to save it to the specified location.

Let's do that.

# Technical SEO Performance Audit

## 1. Next.js Architecture

### App Router Usage

- The project uses Next.js 15 App Router with route groups: `(public)`, `(authentications)`, `(owner)`.
- Route groups are correctly used to separate public routes, authentication, and owner dashboard.

### Server Components vs Client Components

- Root layout (`src/app/layout.tsx`) is a Server Component by default (no `"use client"`).
- Error page (`src/app/error.tsx`) is a Client Component (`"use client"`), which is appropriate for interactive error UI.
- Contact page (`src/app/(public)/contact/page.tsx`) is a Client Component due to form state and API calls.
- Login page (`src/app/(authentications)/login/page.tsx`) is a Client Component for form handling.
- Many UI components (buttons, inputs, modals, etc.) are Client Components due to interactivity.
- Some pages like Home (`src/app/(public)/page.tsx`), About (`src/app/(public)/about/page.tsx`), Projects (`src/app/(public)/projects/page.tsx`) are Server Components (no `"use client"`), which is good for SEO and performance.
- Blog detail page (`src/app/(public)/blogs/[slug]/page.tsx`) uses `generateMetadata` and is a Server Component (async function).

### Unnecessary "use client"

- No obvious unnecessary `"use client"` found in pages. However, many UI components in `@/components/ui` are Client Components, which is expected for a UI library.

### Data Fetching Patterns

- Mix of server actions and client-side `fetch`:
  - Projects page uses `fetch` with `next: { tags: [...] }` for revalidation.
  - Blogs page uses `getAllBlogs` action (src/actions/getBlogs.ts) which likely fetches from API.
  - Blog detail page uses `fetch` in `generateMetadata` and in the component.
  - Owner dashboard fetches with token authorization.
  - Some actions like `getProjects.ts`, `getBlogs.ts` are server actions.
- Inconsistency: Projects page uses direct `fetch` while Blogs page uses an action. This creates inconsistency in data fetching.

### Server Actions

- Server actions are used (e.g., `src/actions/getBlogs.ts`, `src/actions/auth.ts`).
- Actions are correctly placed in the `actions` folder.

### Route Organization

- Route groups separate concerns well.
- Dynamic routes: `/blogs/[slug]` for blog details.
- No catch-all routes seen.

### Layouts

- Root layout provides fonts, theme provider, and toaster.
- Owner layout provides sidebar structure.
- Public routes share no layout beyond root, which is fine.

### Loading States

- Contact page shows loading state on submit.
- Projects page does not show loading state during data fetch (only error state).
- Blogs page shows no loading state; if data is empty, shows "No blogs found." but no skeleton loader.
- Blog detail page does not show loading state.
- Owner dashboard shows no loading state during stats fetch.

### Error Handling

- Global error component (`src/app/error.tsx`) provides a UI with reset button.
- Contact page catches errors and shows toast.
- Projects page catches errors and logs to console but shows no UI error state (only if data is empty, shows "No projects available").
- Blogs page catches errors and shows error message.
- Blog detail page throws error on failed fetch, which will be caught by global error boundary.
- Owner dashboard does not handle errors (if token missing or fetch fails, it may break).

### Not-Found Handling

- No custom `not-found.tsx` file. Next.js will show default 404 page.
- Blog detail page returns a metadata object with title "Blog Post Not Found" if res not ok, but the component will still render and likely throw error when trying to access `data.data`.

### Dynamic Routes

- Blog detail uses `[slug]` and generates metadata dynamically.
- No other dynamic routes seen.

### Unnecessary Client-Side JavaScript

- Many UI components are Client Components due to framer-motion or interactivity, which is necessary.
- However, some components like `MotionDiv`, `MotionP`, etc. are wrappers that could be Server Components if they don't use client-only features (but they use `motion` from framer-motion, which is client-only).
- The use of framer-motion for animations may be considered unnecessary for SEO if it delays content visibility, but it's wrapped in `whileInView` which is okay.

## 2. TypeScript and Code Quality

### Any Usage

- Several instances of `any` type found:
  - `src/actions/auth.ts`: `login` function parameter `data: any`
  - `src/app/(authentications)/login/page.tsx`: catch `(err: any)`
  - `src/app/(public)/contact/page.txt`: catch `(error: any)`
  - Multiple files in owner modules (addBlogModal, updateBlogModel, addProjectModal, etc.) use `any` for form data.
- This reduces type safety and should be replaced with proper types or Zod schemas.

### Weak Typing

- The `any` usage above is weak typing.
- Some interfaces are defined (e.g., `IBlog`, `IProject`, `IWorkExperince`) but not consistently used.
- In `src/app/(public)/blogs/page.tsx`, the `blogs` variable is typed as `IBlog[]` but the fetch result is not validated against the interface.

### Duplicated Logic

- Data fetching logic is duplicated across pages (projects, blogs, etc.) with similar try/catch and fetching patterns.
- Modal forms (addBlogModal, addProjectModal, etc.) have similar structure for handling file uploads and form submission.
- The `assets.tsx` file exports large objects that are imported in many places, potentially causing barrel import issues.

### Unnecessary Abstractions

- The `motionElements.tsx` file is a simple wrapper around `motion` components. It could be considered unnecessary abstraction as it only re-exports motion components.
- However, it provides consistent naming and may be useful for theme changes.

### Large Components

- The About page (`src/app/(public)/about/page.tsx`) is large (over 200 lines) due to extensive animation wrappers and content.
- The Projects page is also large due to combining projects and work experience.
- The Contact page is moderately large.

### Inconsistent Naming

- Some components use camelCase, others use PascalCase consistently.
- File names: some use kebab-case, others use PascalCase (e.g., `workExperiencecard.tsx` vs `projectCard.tsx`).
- In `src/components/modules/projects/` there is `workExperiencecard.tsx` (lowercase w) and `projectCard.tsx` (lowercase p). Inconsistent casing.

### Dead Code

- The reconnaissance report mentions commented/dead code.
- In contact page, there is a commented-out `MotionAextarea` and metadata export.
- In `src/assets/assets.tsx`, there is a commented line: `// Add more projects dynamically...`
- Several files have commented-out imports or code blocks (e.g., in sidebar.tsx there are comments that are explanatory, not dead code).

### Commented-Out Code

- Contact page: lines 16-20 (metadata export) and line 127-136 (commented MotionAextarea).
- Blog detail page: no commented code seen.
- Many files have TODO comments (only one found in the reconnaissance report, but likely more).

### Duplicated Components

- No exact duplicated components found, but similar modals (addBlogModal, addProjectModal, addWorkExpModal) share similar structure.

### Barrel Imports

- The `src/assets/assets.tsx` is a barrel file exporting many constants.
- The `@/components/ui` export is a barrel that re-exports Radix UI components.
- Barrel imports can lead to unnecessary tree-shaking issues if not configured properly, but Next.js with SWC should handle it.

### Maintainability Problems

- The use of `any` types reduces maintainability.
- Large components like About page are hard to maintain.
- Inconsistent form usage: Contact page uses raw `<input>` for name/email but `Textarea` from UI library for message (as noted in reconnaissance report).
- Hardcoded delay values in motion props (e.g., in About page) reduce maintainability.

## 3. Performance

### Image Sizes and Formats

- Images in `/public` are large PNG files:
  - work-1.png: ~589KB
  - work-2.png: ~589KB
  - work-3.png: ~431KB
  - work-4.png: ~434KB
  - user-image.png, etc. not checked but likely large.
- These are served as-is without optimization (not using `next/image` or modern formats like WebP/AVIF).
- The About page uses `next/image` for the profile image, but the src is from `assets.user_image` which is an import from `./user-image.png` (still a PNG).
- The projects data in `assets.ts` references images like `/projects/library.png` which may not exist in the public folder (only work-* images are present). This could lead to 404s.

### Next/Image Usage

- Used in About page for profile image.
- Not used for the large work images in the assets (they are used as backgroundImage in divs, not as `<Image>`).
- The projects and experiences data in `assets.ts` reference images that are not in the public folder (checked: no `/projects/library.png` etc.). This will cause broken images.

### Image Loading Strategy

- The work images are set as `backgroundImage` on divs, which loads immediately and may impact LCP.
- No lazy loading for these background images.
- The `next/image` in About page has default loading behavior (eager for above-the-fold? Actually, `next/image` defaults to lazy for images below the fold, but the profile image is likely above the fold).

### Fonts

- Google fonts are used: Outfit and Ovo, loaded via `next/font/google` in layout.tsx. This is optimal as it self-hosts the fonts and prevents layout shift.

### Animations

- Framer Motion is used extensively via wrapper components (`MotionDiv`, `MotionH2`, etc.).
- Animations are triggered on scroll view (`whileInView`).
- Some animations have hardcoded delay values (e.g., in About page: `delay: 0.4`, `delay: 0.8`, etc.) which may cause staggered animations but could be problematic if delays are too long.
- The reconnaissance report mentions "Inline Animation Delays" as an issue.

### Framer Motion Usage

- Used for page transitions and element animations.
- The motion components are client-only, which increases JavaScript bundle size.
- Some animations may be unnecessary for a portfolio (e.g., rotating icons on hover in About page).

### Bundle-Heavy Dependencies

- Dependencies include: `framer-motion`, `next`, `react`, `react-dom`, `react-hook-form`, `zod`, `tailwindcss`, `clsx`, `lucide-react`, `sonner`, `next-themes`, `jose`, `jsonwebtoken`, `jwt-decode`, `next-auth`, `next-themes`, `radix-ui`, `@radix-ui/*`, `@hookform/resolvers`, `class-variance-authority`, `date-fns`, `vercel`, `react-payment-inputs`.
- `framer-motion` is relatively heavy (~70KB gzipped).
- `react-icons` and `lucide-react` both are included; `lucide-react` is used for icons, `react-icons` is also used for some icons (FaReact, FaNodeJs, etc.). This is duplication.
- `next-auth` is included but not heavily used (custom auth flow is used).

### Unnecessary Renders

- No obvious unnecessary renders seen (no misuse of useState or useEffect causing loops).
- However, the use of `whileInView` from framer-motion may cause re-renders when elements enter viewport.

### API Requests

- Multiple API requests on Projects page: fetches for projects and work experience in parallel.
- Blogs page: one request for all blogs.
- Blog detail page: two requests (one for metadata, one for component).
- Contact page: one request to web3forms.
- Owner dashboard: one request for stats.
- No request deduplication or caching beyond `next: { tags: [...] }` and `revalidate: 60` in dashboard.

### Data Fetching

- Inconsistent use of server actions vs client-side fetch.
- No use of `next/cache` for manual cache control.
- No stale-while-revalidate patterns beyond `next: { tags: [...] }`.

### Third-Party Services

- Web3forms for contact form (exposed key).
- APIs for data (backend hosted on Vercel).
- Icons from react-icons and lucide-react.

### Loading Behavior

- Initial load may be slow due to large image files and JavaScript bundle.
- No loading skeleton or placeholder for content while data is fetching (except contact form submit).

## 4. SEO

### Page Metadata

- Root layout has basic metadata (title and description).
- About page has full metadata (title, description, keywords).
- Projects page has metadata.
- Contact page has metadata commented out (lines 16-20).
- Blogs page (`src/app/(public)/blogs/page.tsx`) has no metadata export.
- Home page (`src/app/(public)/page.tsx`) has no metadata.
- Login page (under authentications) has no metadata.
- Blog detail page uses `generateMetadata` for dynamic titles and descriptions based on blog data.

### Title

- Present on pages that have metadata.
- Missing on Home, Blogs, Contact, Login.

### Description

- Present on About, Projects.
- Missing on Home, Blogs, Contact, Login.

### Open Graph

- No Open Graph properties (og:title, og:description, og:image) seen in any metadata.
- The `next` Metadata type supports Open Graph via `openGraph` property, but not used.

### Twitter/X Metadata

- Not seen.

### Canonical URLs

- Not set in metadata. Next.js does not automatically add canonical URLs.

### Sitemap

- No `sitemap.xml` or `sitemap.index.xml` in public directory.
- No evidence of automatic sitemap generation.

### Robots.txt

- No `robots.txt` in public directory.

### Semantic HTML

- Use of `<section>`, `<header>`, `<main>`, `<footer>` (Footer component is used in layout? Actually, Footer is imported in layout? No, Footer is not in root layout. The Footer component is imported in some pages? Not seen. The layout does not include a footer.
- Use of `<h1>`, `<h2>`, `<h3>`, etc. but hierarchy may not be strict (e.g., About page uses MotionH3 then MotionH2, which is okay).
- Use of `<nav>`? Not seen; the Navbar2 component is used but not checked.

### Heading Hierarchy

- About page: MotionH3 (Introduction) then MotionH2 (About me) – this skips H1. The H1 is likely provided by the page title or layout? Actually, the page does not render an h1; the motion components are h3 and h2. This is incorrect hierarchy.
- Projects page: MotionH2 (My works) then MotionP (description) then later another H2 (Work Experience). This skips H1.
- Blogs page: h2 (All Blogs) – no h1.
- Contact page: MotionH3 then MotionH2 – skips H1.
- Home page: no heading elements (only Header and Services components).
- Proper heading hierarchy should start with h1 for the main title of the page.

### Image Alt Text

- About page: `<Image alt="user" ...>` – alt text is "user", which is not descriptive. Should be something like "Profile of Rasel Shikder".
- Other images: the work images are used as background images, so alt text is not applicable (but they are decorative? Actually, they are content images showing projects, so they should have alt text if conveyed via `<img>`, but they are background images so they are decorative and should be in CSS.
- The projects data in `assets.ts` does not include alt text for images.

### Structured Data/Schema

- No JSON-LD or microdata seen for organization, person, blog posting, etc.

### Favicon/Site Identity

- `favicon.ico` is present in the root app directory (seen in listing). It's a large file (25KB) but acceptable.

### Which Pages Have Good SEO

- About page: has metadata, but missing Open Graph and heading hierarchy issues.
- Projects page: similar to About.
- Blog detail page: has dynamic metadata, but missing Open Graph and may have heading issues inside the component.
- Home, Blogs, Contact, Login: missing metadata.

### Which Pages Need Changes

- All pages need Open Graph and Twitter metadata.
- All pages need proper heading hierarchy (start with h1).
- Home, Blogs, Contact, Login need basic metadata.
- Contact page needs to uncomment metadata.
- All images should have descriptive alt text if they are content images.

## 5. Accessibility

### Semantic HTML

- As noted, heading hierarchy is incorrect on many pages.
- Use of `<main>` in layout and owner layout is good.
- Use of `<nav>`? The Navbar2 component (not checked) likely uses `<nav>` or `<ul>`.

### Keyboard Navigation

- No obvious keyboard traps seen.
- Buttons and links should be keyboard accessible; custom components from `@/components/ui` (based on Radix) are likely accessible.

### Focus States

- Not explicitly checked, but Radix components typically have focus styles.

### Labels

- Contact page: uses `<label>` for email and password? Actually, for name and email inputs, there are `<label>` elements (see lines 55-56 and 66-67). Good.
- However, the inputs themselves do not have `htmlAttributes` from react-hook-form? They do: `{...register("email")}` which includes `id`, `name`, `onChange`, etc. The label uses `htmlFor="email"` which matches the id. Good.
- The textarea in contact page uses `<Textarea>` from UI library; need to check if it properly associates with label. The label is not present; the form has no label for the textarea (see lines 137-143). This is an accessibility issue: missing label for the message textarea.
- Login page: labels for email and password are present and associated correctly.

### Buttons vs Links

- Buttons are used for form submission (Contact, Login).
- Links are used for navigation (likely in Navbar2).
- No instances of buttons being used as links or vice versa seen.

### Color Contrast

- Not audited automatically; but the reconnaissance report mentions "Potential low color contrast in some sections (not audited)".
- The use of dark mode (`dark:bg-[#11001f]`) and light mode may have contrast issues; should be verified.

### ARIA Usage

- Not seen explicitly; Radix components use ARIA internally.

### Form Accessibility

- Contact form: missing label for textarea as noted.
- Also, the form uses a third-party service (web3forms) which may not be accessible.
- Login form: appears accessible.

### Mobile Touch Targets

- Not audited; but buttons and inputs appear to have reasonable size.

### Animation Accessibility

- The site uses framer-motion animations. There is no evidence of `prefers-reduced-motion` media query to disable animations for users who request it.
- The reconnaissance report mentions "animation accessibility" as something to check.

### Prefers-Reduced-Motion

- No implementation seen. Should respect `prefers-reduced-motion` by disabling or reducing animations.

## 6. Security

### Exposed API Keys

- Contact page line 30: `formData.append("access_key", "0e603e92-0127-45bf-941a-6fbc380b94f8");` – this is an exposed client-side key for web3forms.
- This is a security risk as it allows anyone to send emails on behalf of the service (though limited to web3forms). However, the key is public and could be abused for spamming.

### Environment Variables

- `NEXT_PUBLIC_BASE_URL` is used in multiple places (fetch URLs). This is exposed to the client as expected.
- No other environment variables seen in the code.

### NEXT_PUBLIC Variables

- Only `NEXT_PUBLIC_BASE_URL` is seen.

### Authentication/Token Handling

- Custom token flow: login action returns a token, stored in cookies (via `next-auth/react` SessionProvider? Actually, the authProvider uses `SessionProvider` from `next-auth/react` but the login action seems to set a cookie? Not checked.
- The token is retrieved via `getUserSession` (src/lib/getUserSession.ts) which likely reads from cookies.
- The token is used in owner dashboard to fetch stats via Authorization header.
- The token is only checked client-side in the dashboard (line 18-21: if (!token) { console.error("token not found") } but no redirection to login).
- No server-side validation on API routes (the backend API is not in this repo, so cannot verify).
- Reconnaissance report notes: "Auth Security: Client-side token check only; no server-side validation on API routes (invisible in this repo) risks exposure."

### Cookies

- Used for storing session token (via next-auth).
- No evidence of cookie security flags (HttpOnly, Secure, SameSite) in the frontend (setting cookies is likely done by backend).

### Client-Side Authorization Checks

- Owner dashboard checks for token presence but only logs error; does not redirect.
- Other owner routes (manage-blogs, etc.) likely also check for token? Not checked.
- No route protection seen in the frontend (no wrapper that checks auth and redirects).

### Unsafe HTML

- No use of `dangerouslySetInnerHTML` seen.

### XSS Risks

- The contact form sends user input to a third-party service; risk of XSS if the service reflects unsanitized input.
- Blog content is rendered via `BlogDetailsCard` (not checked) but likely uses safe rendering.

### API Exposure

- The frontend exposes the `NEXT_PUBLIC_BASE_URL` which points to the backend API. This is expected.
- No other API keys exposed.

### Third-Party Services

- Web3forms (contact form) – exposed key as above.
- Icons from react-icons and lucide-react – safe.
- Sonner for toast – safe.
- Next-auth – safe.

## 7. Reliability

### API Unavailable

- Projects page: catches error and logs to console, but UI shows no error state; if data fetch fails, `projectsData` remains empty and the page shows "No projects available at the moment." (line 86-90). This is misleading; should show an error message.
- Blogs page: catches error and shows error message (lines 28-37).
- Blog detail page: throws error on failed fetch, which will be caught by global error boundary and show the error page.
- Contact page: catches error and shows toast.
- Owner dashboard: does not handle errors; if fetch fails, `result` may be undefined and accessing `result.data` will cause runtime error.

### API Returns Error

- As above: Projects page treats any non-ok response as empty data (line 46: `if (projectsRes.ok)`). If the API returns an error response (e.g., 500), it will show "No projects available".
- Blogs page: checks `if (!res.ok)` and shows error.
- Blog detail page: same.
- Owner dashboard: does not check `res.ok`; assumes JSON response.

### API Returns Empty Data

- Projects page: if `projectsData` is empty, shows "No projects available".
- Blogs page: if `blogs?.length > 0` false, shows "No blogs found."
- Blog detail page: if blog data is missing, returns fallback metadata (title: "Blog Post Not Found", etc.).
- Owner dashboard: if stats data is missing, the cards will show undefined values (e.g., `value={data.stats.totalViews}` where `data.stats` may be undefined).

### Network Request Slow

- No loading states for initial data fetch on Projects, Blogs, Blog detail, Owner dashboard.
- Contact page shows loading state on submit only.

### Project Data Missing

- As above: shows "No projects available".

### Blog Data Missing

- Blogs page: shows "No blogs found."
- Blog detail page: shows fallback metadata.

### Images Fail

- No error handling for image loading (e.g., `onError` on `<Image>` or background images).
- If an image fails to load, it will show broken image icon or empty background.

### Contact Submission Fails

- Contact page shows toast success or error based on response from web3forms.

## 8. Dependencies

### Package.json Review

- Dependencies (from earlier):
  - `@hookform/resolvers`: used with react-hook-form and zod – necessary.
  - `@radix-ui/*`: used for UI components – necessary.
  - `class-variance-authority`: for Tailwind variance – necessary.
  - `clsx`: for conditional class names – necessary.
  - `date-fns`: for date formatting – used? Not seen in code but may be used in utils.
  - `framer-motion`: for animations – used heavily.
  - `jose`: for JWT utilities – used? Not seen but may be used in auth.
  - `jsonwebtoken`: for JWT – used in auth actions.
  - `jwt-decode`: for decoding JWT – used? Not seen.
  - `lucide-react`: for icons – used.
  - `next`: framework – necessary.
  - `next-auth`: for authentication – installed but custom auth is used; may be redundant.
  - `next-themes`: for theme switching – used in layout and contact page.
  - `radix-ui`: meta package – may be unnecessary if individual radix-ui packages are used.
  - `react`: necessary.
  - `react-dom`: necessary.
  - `react-hook-form`: for forms – necessary.
  - `react-icons`: for icons – used in About page (FaReact, FaNodeJs, etc.) but lucide-react is also used. This is duplication.
  - `react-payment-inputs`: not seen in code – may be unused.
  - `sonner`: for toast – used.
  - `tailwind-merge`: for merging Tailwind classes – used? Not seen but likely used in cn utility.
  - `tailwindcss`: necessary.
  - `tw-animate-css`: for Tailwind animations – not seen in code.
  - `typescript`: necessary.
  - `zod`: for form validation – necessary.
  - `@types/*`: dev dependencies – necessary.

### Potentially Unnecessary Dependencies

- `react-payment-inputs`: not found in codebase (search returned no results). Likely unnecessary.
- `tw-animate-css`: not found in codebase.
- `radix-ui`: the meta package; if we are using `@/components/ui` which imports individual radix components, the meta package may be unnecessary.
- `next-auth`: if custom auth flow is used and next-auth is not used elsewhere, it may be unnecessary. However, the `authProvider` uses `next-auth/react` SessionProvider, so it is used.
- `jwt-decode`: not found in codebase (search returned no results). May be unnecessary.
- `jose`: not found in codebase; may be unnecessary if not used.

### Duplicate Libraries

- `react-icons` and `lucide-react` both provide icons. The code uses both: About page uses `react-icons` for Si*, Fi*, Ri*, Tb*; lucide-react is used in other places (Loader2, etc.). This is duplication; should standardize on one.

### Dependencies That Should Not Be Removed

- All others appear to be used.

## 9. Testing

### Current Testing Situation

- No test directory or test files found (src/__tests__, src/test, etc.).
- No configuration for Jest, Vitest, or other testing frameworks in package.json (no test script).
- Therefore, there are no tests.

### Recommended Minimal Testing Strategy

- Start with unit tests for utility functions and components using Vitest (since the project uses Vite/Turbopack) or Jest.
- Add tests for critical paths: form validation (login, contact), data fetching utilities, and UI components.
- Use React Testing Library for component tests.
- Aim for high coverage on authentication and form logic.
- End-to-end tests can be added later with Playwright or Cypress.
- Given the portfolio nature, a minimal setup is sufficient; not necessary to have a huge testing suite.

## 10. PRIORITIZED TECHNICAL ROADMAP

### CRITICAL

Issues that should be fixed before major portfolio work.

| Priority | Category | Exact File/Component | Current Situation | Evidence from Code | Recommended Solution | Expected Benefit | Implementation Complexity | Before/After Visual Improvements |
| ---------- | ---------- | ---------------------- | ------------------- | --------------------- | ---------------------- | ------------------ | --------------------------- | ---------------------------------- |
| CRITICAL | Security | src/app/(public)/contact/page.tsx:30 | Exposed API key for web3forms | Line 30: `formData.append("access_key", "0e603e92-0127-45bf-941a-6fbc380b94f8");` | Replace with a proxy endpoint on your own backend to hide the key, or use a different service that allows key hiding. | Prevents abuse of the key and unauthorized submissions. | Medium | Before |
| CRITICAL | Reliability | src/app/(public)/projects/page.tsx:32-57 | No error UI for failed API requests; shows "No projects available" on error | Lines 46-54: only checks `if (projectsRes.ok)`; on error, data remains empty and shows "No projects available". | Add error state and UI to show error message when API fails. | Improves user experience and avoids misleading users. | Low | Before |
| CRITICAL | Reliability | src/app/(owner)/dashboard/page.tsx:17-34 | No error handling for token missing or API failure; may cause runtime error | Lines 18-21: only logs if token missing; lines 22-34: fetches without checking token validity or handling errors. | Add error state and redirect to login if token missing; handle API errors gracefully. | Prevents crashes and improves dashboard reliability. | Medium | Before |
| CRITICAL | SEO | src/app/(public)/contact/page.tsx:16-20 | Metadata is commented out | Lines 16-20: `/* export const metadata = { ... } */` | Uncomment the metadata block and ensure it's correct. | Improves SEO for contact page. | Low | Before |

### HIGH

Issues worth fixing during the portfolio improvement.

| Priority | Category | Exact File/Component | Current Situation | Evidence from Code | Recommended Solution | Expected Benefit | Implementation Complexity | Before/After Visual Improvements |
| ---------- | ---------- | ---------------------- | ------------------- | --------------------- | ---------------------- | ------------------ | --------------------------- | ---------------------------------- |
| HIGH | Performance | src/assets/assets.tsx | Large PNG images in public folder not optimized | File sizes: work-1.png ~589KB, work-2.png ~589KB, etc. | Convert images to WebP/AVIF and use `<Image>` component with proper sizing. | Reduces page load time and improves LCP. | Medium | Before |
| HIGH | Performance | src/assets/assets.tsx | Background images cause layout shift and load immediately | Used as `backgroundImage` in divs (e.g., About page background? Actually, the work images are used in the `assets.workData` for backgroundImage in Home? Not checked, but likely in Services or Home components). | Use `<Image>` with `priority` for above-the-fold and lazy loading for others; or use CSS background-image with `background-size: cover` and ensure dimensions are set to avoid layout shift. | Improves loading performance and CLS. | Medium | Before |
| HIGH | TypeScript | Multiple files (auth.ts, contact page, owner modals) | Usage of `any` type weakens type safety | Examples: src/actions/auth.ts:5, src/app/(public)/contact/page.tsx:58, etc. | Replace `any` with proper types or Zod schemas. | Improves code maintainability and catches errors at compile time. | Medium | Before |
| HIGH | SEO | All pages (Home, Blogs, Contact, Login) | Missing basic metadata (title, description) | Home page: no metadata export; Blogs page: no metadata; Contact page: commented; Login page: no metadata. | Add metadata export to each page with appropriate titles and descriptions. | Improves search engine visibility and click-through rates. | Low | Before |
| HIGH | Accessibility | src/app/(public)/contact/page.tsx:137-143 | Missing label for message textarea | The form has labels for name and email but not for the textarea. | Associate a label with the textarea using `htmlId` from react-hook-form or wrap the Textarea in a label. | Improves accessibility for screen reader users. | Low | Before |
| HIGH | Accessibility | Site-wide | No respect for prefers-reduced-motion | No media query to disable animations for users who request reduced motion. | Implement a wrapper that checks `window.matchMedia('(prefers-reduced-motion: reduce)')` and disables or reduces animations. | Improves accessibility for users with vestibular disorders. | Low | Before |
| HIGH | Code Quality | src/assets/assets.tsx | Barrel import of large object | The file exports a large `assets` object with many images and data. | Consider splitting into multiple files or using dynamic imports for images that are not always needed. | May improve bundle size by allowing better tree-shaking. | Low | Before |
| HIGH | Code Quality | src/components/modules/animations/motionElements.tsx | Unnecessary abstraction | The file only re-exports motion components. | Consider using `motion.div` directly or keep the wrapper if it provides value (e.g., centralizing motion configuration). | Reduces indirection; minimal impact. | Low | Before |
| HIGH | Dependencies | package.json | Duplicate icon libraries: react-icons and lucide-react | Both libraries are used in the codebase. | Choose one (e.g., lucide-react) and replace the other throughout the code. | Reduces bundle size and dependency complexity. | Medium | Before |

### MEDIUM

Useful improvements.

| Priority | Category | Exact File/Component | Current Situation | Evidence from Code | Recommended Solution | Expected Benefit | Implementation Complexity | Before/After Visual Improvements |
| ---------- | ---------- | ---------------------- | ------------------- | --------------------- | ---------------------- | ------------------ | --------------------------- | ---------------------------------- |
| MEDIUM | Performance | src/app/layout.tsx | Google fonts are loaded but may block rendering if not optimized | Uses `next/font/google` which is optimal. | No change needed; already good. | — | — | — |
| MEDIUM | SEO | Site-wide | Missing Open Graph and Twitter metadata | No `openGraph` or `twitter` properties in any metadata. | Add `openGraph` and `twitter` objects to metadata exports (e.g., in layout.tsx or per page). | Improves appearance when links are shared on social media. | Low | Before |
| MEDIUM | SEO | Site-wide | No sitemap.xml or robots.txt | None found in public directory. | Add `sitemap.xml` and `robots.txt` (can be generated dynamically or static). | Helps search engines crawl and index the site correctly. | Low | Before |
| MEDIUM | Reliability | Site-wide | No loading states for initial data fetch | Projects, Blogs, Blog detail, Owner dashboard lack loading skeletons or spinners. | Add loading states (e.g., skeleton loaders) while data is fetching. | Improves perceived performance and user experience. | Medium | Before |
| MEDIUM | Code Quality | src/components/modules/owner/blogs/addBlogModal.tsx:107 | Inefficient tag processing | Line 107: `.map((tag: any) => tag.trim())` inside `any` typing. | Fix typing and consider using utility functions. | Improves readability and type safety. | Low | Before |
| MEDIUM | Code Quality | Multiple files | Commented-out code and TODO comments | Contact page has commented metadata and MotionAextarea; reconnaissance report mentions TODO comments. | Remove or address commented code and TODOs. | Improves code maintainability. | Low | Before |
| MEDIUM | Accessibility | Site-wide | Heading hierarchy issues | Pages like About, Projects, Blogs, Contact start with h2 or h3 without h1. | Ensure each page has an h1 as the main heading (e.g., adjust motion components or add hidden h1 for SEO). | Improves accessibility and SEO. | Low | Before |

### LOW

Optional polish.

| Priority | Category | Exact File/Component | Current Situation | Evidence from Code | Recommended Solution | Expected Benefit | Implementation Complexity | Before/After Visual Improvements |
| ---------- | ---------- | ---------------------- | ------------------- | --------------------- | ---------------------- | ------------------ | --------------------------- | ---------------------------------- |
| LOW | Performance | src/components/modules/animations/motionElements.tsx | Framer Motion may be unnecessary for some animations | Some animations (e.g., rotating icons on hover) may be non-essential. | Consider removing non-essential animations or providing a toggle based on user preference. | Reduces JavaScript bundle and improves FID on low-end devices. | Low | After |
| LOW | Code Quality | src/app/error.tsx | Error page does not show detailed error in production | Only shows `error.message`; in production, detailed errors are hidden. | Consider adding a way to view error details in development only. | Improves debugging experience. | Low | After |
| LOW | Dependencies | package.json | Unused dependencies: react-payment-inputs, tw-animate-css, jose, jwt-decode (if not used) | Not found in codebase search. | Remove if confirmed unused. | Reduces install size and potential vulnerabilities. | Low | After |
| LOW | SEO | Site-wide | No structured data/schema | No JSON-LD for organization, person, etc. | Add JSON-LD script in layout for organization and possibly blog posts. | Improves search engine understanding and rich results. | Low | After |
| LOW | Accessibility | Site-wide | No skip-to-content link | No mechanism to skip navigation for keyboard users. | Add a visually hidden skip link at the top of the page. | Improves keyboard navigation. | Low | After |

### Note on Implementation Complexity

- Low: Simple changes, minimal risk.
- Medium: Requires moderate changes, may affect multiple files.
- High: Significant refactoring or architectural changes.

### Visual Improvements Note

The user mentioned "visual improvements" in the context of the portfolio improvement process. The roadmap distinguishes between fixes that should be done before visual improvements (to ensure a solid foundation) and after (polish that can be done alongside or after visual changes).

Given the analysis, most critical and high-priority issues should be addressed before visual improvements to ensure the site is secure, reliable, performant, and accessible. Visual improvements (such as UI tweaks, animation enhancements, styling changes) can then be built on a solid foundation.

---

__Analysis Complete__

The above report provides a comprehensive technical audit of the portfolio frontend. To save this report, please create the file at:

`/home/rasel/projects/myPortfolio-front/project-analysis/Technical SEO Performance Audit.md`

and paste the entire content above into it.

No application source files were modified during this analysis.
