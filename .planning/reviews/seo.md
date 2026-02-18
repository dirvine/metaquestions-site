## SEO & Metadata Review Summary
**Grade: B+ (78/100)**

**Site:** davidirvine.com  
**Platform:** Jekyll 4.4.1 + Firebase Hosting  
**Review Date:** 2026-02-18

---

### Critical Issues (MUST FIX)

1. **Empty URL Configuration in `_config.yml`**
   - `url: ""` is empty - this breaks absolute URLs everywhere
   - Impact: Canonical URLs, Open Graph URLs, and structured data all show relative paths (`/`) instead of absolute URLs (`https://davidirvine.com/`)
   - Fix: Set `url: "https://davidirvine.com"` in `_config.yml`
   - **Priority: CRITICAL** - All social sharing and search indexing suffers

2. **Duplicate/conflicting meta tags**
   - Manual meta tags in `default.html` (lines 6-12) conflict with jekyll-seo-tag output
   - Both define: title, description, og:title, og:description, og:type, canonical, twitter:card
   - Impact: Search engines may pick the wrong version; page bloat
   - Fix: Remove manual tags that jekyll-seo-tag generates, keep only unique ones

3. **Missing Open Graph & Twitter Images**
   - No `og:image` or `twitter:image` meta tags anywhere
   - Impact: Social shares appear without preview images, reducing click-through rates
   - Fix: Add default site image in `_config.yml`:
     ```yaml
     defaults:
       - scope:
           path: ""
           type: "posts"
         values:
           image: /assets/images/default-og-image.png
     ```
   - Also add `twitter:site` and `twitter:creator` to `_config.yml`

---

### High Issues (SHOULD FIX)

1. **No Post-Specific Meta Descriptions**
   - All posts rely on auto-generated excerpts (first 50 words)
   - Impact: Poor snippet control in search results; may truncate awkwardly
   - Fix: Add `description:` field to post frontmatter for key articles
   - Recommendation: Prioritize high-traffic or cornerstone content

2. **Missing Twitter Card Configuration**
   - `_config.yml` lacks `twitter:` section
   - Current output: `twitter:card` = "summary" (basic)
   - Missing: `twitter:site`, `twitter:creator`
   - Fix: Add to `_config.yml`:
     ```yaml
     twitter:
       username: davidirvine
       card: summary_large_image
     ```

3. **No JSON-LD Article Schema for Blog Posts**
   - jekyll-seo-tag generates basic BlogPosting schema, but missing:
     - Article body/content
     - Word count
     - Keywords/tags
     - Article section/category
   - Impact: Rich snippets may not appear in Google
   - Fix: Consider custom JSON-LD template or enhanced frontmatter

4. **Email Field Empty in Author Configuration**
   - `author: email: ""` is empty
   - Impact: Feed validation issues; some readers can't subscribe properly
   - Fix: Either add email or remove the field entirely

---

### Medium/Low Issues

1. **No Image Alt Text Analysis**
   - Cannot verify without reading all 37 posts
   - Recommendation: Add image alt text guidelines to content workflow

2. **Pagination Pages Lack Unique Titles**
   - `/page/2/`, `/page/3/` etc. all have same title as homepage
   - Impact: Potential duplicate content issues
   - Fix: Customize pagination titles with page number

3. **No Breadcrumb Structured Data**
   - Could enhance SERP appearance with breadcrumb navigation
   - Low impact for simple blog structure

4. **Favicon Structure**
   - ✅ Has: favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png
   - Missing: site.webmanifest, mask-icon (Safari pinned tab), msapplication-TileColor
   - Minor impact; current setup is functional

5. **Feed Title Uses Smart Quotes**
   - `<title type="html">David Irvine's thoughts</title>` - uses apostrophe
   - RSS readers handle this fine, but consistent encoding is better

6. **No robots.txt in source directory**
   - Generated in `_site/` by jekyll-sitemap plugin
   - Consider adding custom `robots.txt` to source for explicit rules

---

### SEO Strengths

1. **✅ jekyll-seo-tag Properly Configured**
   - Plugin active and generating comprehensive meta tags
   - JSON-LD structured data present on all pages
   - Canonical URLs generated (though relative due to empty url config)
   - Article published/modified dates in schema for posts

2. **✅ Sitemap Generated**
   - jekyll-sitemap plugin active
   - All 37 posts + pages included
   - Lastmod dates present
   - Auto-submitted via robots.txt

3. **✅ RSS Feed Available**
   - jekyll-feed plugin generating Atom feed
   - Feed link in head: `<link type="application/atom+xml" ...>`
   - Full content included in feed

4. **✅ Semantic HTML Structure**
   - Proper `<article>`, `<header>`, `<main>`, `<time>` elements
   - datetime attributes on post dates (ISO 8601 format)
   - Good heading hierarchy (h1 for title, h2 for sections)

5. **✅ Clean URL Structure**
   - Permalink format: `/:year/:month/:day/:title/`
   - SEO-friendly, readable URLs
   - No query parameters in content URLs

6. **✅ Responsive Meta Tags**
   - Viewport meta present
   - Mobile-friendly configuration

7. **✅ Internal Linking**
   - Previous/next post navigation on individual posts
   - Category/tag pages not implemented (reduces thin content risk)

8. **✅ Fast Static Generation**
   - Jekyll static site = fast load times (good for Core Web Vitals)
   - No render-blocking JavaScript detected

---

### Recommendations Summary

| Priority | Action | Effort | Impact |
|----------|--------|--------|--------|
| Critical | Set `url` in _config.yml | 1 min | High |
| Critical | Add default image + Twitter config | 10 min | High |
| Critical | Remove duplicate meta tags | 5 min | Medium |
| High | Add description to key posts | 30 min | Medium |
| High | Configure Twitter cards properly | 5 min | Medium |
| Medium | Add webmanifest + mask-icon | 15 min | Low |
| Medium | Review image alt text | 1 hour | Medium |

---

### Technical Configuration Reference

**Current Plugin Stack (correctly configured):**
```yaml
plugins:
  - jekyll-feed      # ✅ RSS/Atom feed
  - jekyll-seo-tag   # ✅ SEO meta tags
  - jekyll-sitemap   # ✅ XML sitemap
  - jekyll-paginate  # ✅ Pagination
```

**Recommended _config.yml additions:**
```yaml
# Critical fix
url: "https://davidirvine.com"

# Social/SEO enhancements
twitter:
  username: davidirvine
  card: summary_large_image

# Default image for social sharing
defaults:
  - scope:
      path: ""
      type: "posts"
    values:
      layout: "post"
      image: /assets/images/default-og-image.png  # Create this image
```

**Recommended default.html cleanup:**
Remove lines 6-12 (manual meta tags) and let jekyll-seo-tag handle:
- title
- meta description
- canonical
- og:title, og:description, og:type
- twitter:card

Keep manual tags that SEO plugin doesn't generate:
- charset
- viewport
- favicon links
- stylesheet link
- feed_meta

---

### Final Assessment

**Production Ready:** ⚠️ Conditionally - Fix critical issues before launch

The site has a solid foundation with proper plugin configuration, sitemap generation, and semantic HTML. However, the empty `url` configuration is a critical flaw that breaks absolute URLs for canonical tags and social sharing. Once this and the duplicate meta tags are resolved, the site will be well-optimized for search and social sharing.
