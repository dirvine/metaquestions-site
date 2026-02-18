## Error Handling & Resilience Review
**Grade: C+ (6.5/10)**

*Review Date: 2026-02-18*
*Scope: Jekyll static site (davidirvine.com) deployed to Firebase Hosting*

---

### Critical Issues (MUST FIX)

#### 1. Missing 404 Error Page
**Location:** Root of site / firebase.json
**Issue:** No `404.html` page exists in the source or generated `_site`. The `firebase.json` has a rewrite rule that sends ALL unmatched routes to `index.html`:
```json
"rewrites": [{
  "source": "**",
  "destination": "/index.html"
}]
```
**Risk:** Users accessing broken/deleted links will see the homepage instead of a proper 404 error, causing confusion and SEO issues.
**Fix:** 
- Create `404.md` or `404.html` in the root
- Add to firebase.json:
```json
"error_pages": {
  "404": "/404.html"
}
```
- Remove or restrict the catch-all rewrite rule

#### 2. CI/CD Pipeline Has No Failure Handling
**Location:** `.github/workflows/firebase-deploy.yml`
**Issues:**
- No `continue-on-error: false` explicitly set
- No health check after deployment
- No rollback mechanism on deployment failure
- No notification on build/deploy failure
- Deployment proceeds even if Jekyll build has warnings
**Risk:** Failed builds could deploy partial/broken sites; no visibility into deployment failures.
**Fix:** Add explicit error handling, post-deploy health check, and failure notifications.

#### 3. Future-Dated Posts Published
**Location:** `_posts/2026-02-11-*.md` (2 posts)
**Issue:** Jekyll by default publishes future-dated posts. The site has posts dated 2026-02-11 which is in the future.
**Risk:** Unfinished/draft posts may be accidentally published.
**Fix:** Add to `_config.yml`:
```yaml
future: false
```

---

### High Issues (SHOULD FIX)

#### 4. No Strict Front Matter Validation
**Location:** `_config.yml`
**Issue:** No `strict_front_matter: true` setting. Jekyll will silently ignore posts with invalid YAML frontmatter.
**Risk:** Posts with syntax errors in frontmatter will be silently skipped during build without warning.
**Fix:** Add to `_config.yml`:
```yaml
strict_front_matter: true
```

#### 5. Templates Missing Variable Existence Checks
**Location:** `_layouts/page.html`, `_layouts/post.html`
**Issues:**
- `page.html` line 6: `{{ page.title }}` - no fallback if title missing
- `post.html` line 11: `{{ page.title }}` - no fallback if title missing
- `post.html` line 13: `{{ page.date }}` - no check if date missing (will cause build error)
**Risk:** Missing frontmatter fields cause empty display or build failures.
**Fix:** Use Liquid conditionals or default filters:
```liquid
<h1 class="page-title">{{ page.title | default: "Untitled" }}</h1>
```

#### 6. Site Author Data Without Null Checks
**Location:** `_layouts/default.html` lines 49-52
**Issue:** Direct access to `site.author.name`, `site.author.twitter`, `site.author.location` without checking if `site.author` exists or if sub-fields are defined.
**Risk:** If `_config.yml` author section is modified/removed, site builds but shows empty values or errors.
**Fix:** Use default filters:
```liquid
<p>&copy; {{ site.time | date: '%Y' }} {{ site.author.name | default: "Author" }}</p>
```

#### 7. External Font Dependency Without Fallback Strategy
**Location:** `assets/css/style.css` line 3
**Issue:** Google Fonts imported via `@import` with only generic font-family fallbacks (`sans-serif`, `cursive`). If fonts.googleapis.com is blocked or fails, the site degrades to system fonts which may not match design intent.
**Risk:** Poor user experience on slow connections or in regions with Google blocked.
**Fix:** 
- Use `font-display: swap` for better loading behavior
- Consider self-hosting critical fonts
- Add more specific system font fallbacks

#### 8. Empty Collection Not Handled in Index
**Location:** `index.html`
**Issue:** No check if `site.posts` is empty before rendering the cards grid.
**Risk:** If all posts are removed or filtered, the page shows empty "Recent Posts" section without explanation.
**Fix:** Add conditional:
```liquid
{% if site.posts.size > 0 %}
  <!-- render posts -->
{% else %}
  <p>No posts yet.</p>
{% endif %}
```

---

### Medium/Low Issues

#### 9. No Pagination Empty State
**Location:** `_config.yml` (pagination settings)
**Issue:** If posts exceed `paginate: 10`, pagination pages are generated but no empty state for edge cases.
**Likelihood:** Low (37 posts currently, well above threshold)
**Fix:** Ensure pagination templates handle edge cases.

#### 10. Post Categories Defined But Unused
**Location:** `_config.yml` lines 52-60, `_posts/*.md`
**Issue:** Categories are defined in config and listed in CLAUDE.md as standard, but 0 of 37 posts have categories defined.
**Risk:** Inconsistent metadata; if categories are added later, existing posts won't be categorized.
**Fix:** Either add categories to posts or remove from config if not used.

#### 11. Favicon References Without Existence Check
**Location:** `_layouts/default.html` lines 13-15
**Issue:** References to favicon files without verifying they exist in `assets/images/`.
**Risk:** 404 errors for favicon requests if files are missing.
**Fix:** Verify favicon files exist or add build check.

#### 12. No Build Output Validation
**Location:** CI/CD pipeline
**Issue:** No validation that `_site/` contains expected files (index.html, css, etc.) before deployment.
**Risk:** Partial builds could deploy successfully.
**Fix:** Add build validation step to CI/CD.

#### 13. Twitter Link Hardcoded Without Check
**Location:** `_layouts/default.html` line 51
**Issue:** Direct use of `site.author.twitter` without checking if it exists.
**Fix:** Add conditional:
```liquid
{% if site.author.twitter %}
  <a href="https://twitter.com/{{ site.author.twitter }}">Twitter</a>
{% endif %}
```

#### 14. GitHub Releases API Error Handling (Good but Could Be Better)
**Location:** `fae/index.md` lines 94-97
**Current:** Has basic catch handler for fetch() failure.
**Issue:** Only logs to console, no user-facing error message for complete failure.
**Fix:** Add user-visible error state.

---

### Error Handling Strengths

#### 1. Good Use of Default Filters in Default Layout
**Location:** `_layouts/default.html`
- Line 7: `{{ page.excerpt | default: site.description | strip_html | truncatewords: 50 }}` - Graceful fallback for missing excerpts
- Line 10: Same pattern for OG description
- Line 9: Conditional title with else fallback

#### 2. Conditional Author Display in Post Layout
**Location:** `_layouts/post.html` line 14
```liquid
{% if page.author %} by {{ page.author }}{% endif %}
```
Good pattern for optional fields.

#### 3. Conditional Navigation Links in Post Layout
**Location:** `_layouts/post.html` lines 23-28
Previous/next post links only render if URLs exist - prevents broken navigation.

#### 4. Collection-Specific Navigation Logic
**Location:** `_layouts/default.html` lines 23-37, `_layouts/post.html` lines 6-10
Smart handling for Fae collection vs regular posts with different navigation paths.

#### 5. Fae Collection Sorting and Filtering
**Location:** `fae/index.md` lines 15-17
Good use of Liquid filters to handle pinned vs unpinned posts with graceful handling if no posts exist in either category.

#### 6. JavaScript Fetch Error Handling
**Location:** `fae/index.md` lines 94-97
The GitHub releases fetch has a catch block that provides a fallback UI if the API fails.

#### 7. Responsive Design Fallbacks
**Location:** `assets/css/style.css` lines 524-557
Good media query coverage with adjusted font sizes for mobile.

---

### Recommendations Summary

| Priority | Action | File(s) |
|----------|--------|---------|
| Critical | Create 404.html page | `404.md` |
| Critical | Add error_page config | `firebase.json` |
| Critical | Fix rewrite rule | `firebase.json` |
| Critical | Add future: false | `_config.yml` |
| Critical | Add CI health check | `.github/workflows/firebase-deploy.yml` |
| High | Add strict_front_matter | `_config.yml` |
| High | Add title fallbacks | `_layouts/page.html`, `_layouts/post.html` |
| High | Add author null checks | `_layouts/default.html` |
| High | Improve font loading | `assets/css/style.css` |
| High | Add empty posts check | `index.html` |
| Medium | Add categories to posts | `_posts/*.md` |
| Medium | Validate build output | CI/CD |

---

### Production Readiness Checklist

- [ ] 404 page exists and is configured in firebase.json
- [ ] CI/CD has failure detection and notifications
- [ ] All templates have fallbacks for missing variables
- [ ] External dependencies have graceful degradation
- [ ] Build validates output before deployment
- [ ] Future posts are blocked from publishing
- [ ] Frontmatter is strictly validated
- [ ] Health check runs after deployment

**Current Status:** 0/8 complete
