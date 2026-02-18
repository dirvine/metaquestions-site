# Performance Review: davidirvine.com Jekyll Blog

**Date:** 2026-02-18  
**Reviewer:** Performance Audit Agent  
**Scope:** Full stack performance review (Jekyll build, asset delivery, runtime, Core Web Vitals)

---

## Performance Review Summary

**Grade: C+/B- (7/10)**

The site is functional and follows basic best practices, but has several performance gaps that impact Core Web Vitals. It's a lightweight blog with good fundamentals but missing critical optimizations for font loading, image delivery, and caching headers.

---

## Critical Issues (MUST FIX)

### 1. **Google Fonts @import is Render-Blocking** 🔴
- **Location:** `assets/css/style.css` line 3
- **Issue:** Using `@import` in CSS to load Google Fonts blocks rendering
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Caveat:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  ```
- **Impact:** 
  - Adds ~200-500ms to First Contentful Paint (FCP)
  - Forces browser to download and parse CSS before discovering font request
  - No `font-display: swap` causes invisible text during load (FOIT)
- **Fix:** 
  - Move font loading to `<head>` with `preconnect` hints
  - Add `&display=swap` to font URL (already present - good!)
  - Consider using `link rel="preload"` for critical fonts

### 2. **Missing Preconnect Hints for External Domains** 🔴
- **Location:** `_layouts/default.html` `<head>`
- **Issue:** No `dns-prefetch` or `preconnect` for:
  - `fonts.googleapis.com`
  - `fonts.gstatic.com`
- **Impact:** DNS/TCP/TLS handshake adds ~100-300ms latency per domain
- **Fix:** Add to `<head>`:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  ```

---

## High Issues (SHOULD FIX)

### 3. **Unoptimized Hero Image (fae.jpg)** 🟡
- **Location:** `assets/images/fae.jpg`
- **Issue:** 
  - File size: 155KB (1024x559 pixels)
  - No WebP/AVIF version for modern browsers
  - No responsive image srcset
  - No `loading="lazy"` attribute in `fae/index.md`
- **Impact:** 
  - Affects LCP (Largest Contentful Paint)
  - 155KB is large for a hero image
- **Fix:**
  - Compress JPEG to ~60-80KB or provide WebP version (~30-50KB)
  - Add `loading="lazy"` for below-fold images
  - Consider `fetchpriority="high"` for above-fold hero

### 4. **CSS Not Minified in Source** 🟡
- **Location:** `assets/css/style.css`
- **Issue:** Source CSS is 9,274 bytes with comments and whitespace
- **Current State:** Jekyll appears to minify to 8,100 bytes in `_site`
- **Impact:** Minor, but could be better
- **Fix:** 
  - Add `sass: style: compressed` to `_config.yml` if using SCSS
  - Or use jekyll-minifier plugin
  - Could reduce to ~6KB with aggressive minification

### 5. **Missing Cache Headers for HTML/Fonts** 🟡
- **Location:** `firebase.json`
- **Issue:** Current headers only cache images, CSS, JS:
  ```json
  "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)"
  "source": "**/*.@(css|js)"
  ```
- **Missing:** 
  - Font files (woff2, woff, ttf)
  - HTML files (consider stale-while-revalidate strategy)
- **Fix:** Add:
  ```json
  {
    "source": "**/*.@(woff2|woff|ttf|otf|eot)",
    "headers": [{"key": "Cache-Control", "value": "max-age=31536000"}]
  }
  ```

### 6. **Fae Page JavaScript Blocks Rendering** 🟡
- **Location:** `fae/index.md` lines 41-106
- **Issue:** Synchronous inline script fetches GitHub API on page load
- **Impact:** 
  - Could delay Interactive (TTI)
  - API failure blocks download button rendering
- **Fix:** 
  - Add `async` or `defer` attributes if external
  - Show placeholder/skeleton UI while loading
  - Consider caching release data at build time

---

## Medium/Low Issues

### 7. **Favicon Chain Could Be Simplified** 🟢
- **Current:** 3 separate favicon files (16x16, 32x32, 180x180)
- **Size:** ~12KB total (reasonable)
- **Improvement:** Consider single SVG favicon for modern browsers with PNG fallback

### 8. **Missing Service Worker / PWA Support** 🟢
- **Impact:** No offline capability, no app-like experience
- **Priority:** Low for blog, but nice-to-have

### 9. **No Critical CSS Inlining** 🟢
- **Impact:** External CSS blocks rendering (minor for 8KB file)
- **Current:** CSS is render-blocking but small enough to be acceptable
- **Fix (optional):** Inline above-fold CSS for sub-1s LCP target

### 10. **Jekyll Build: Pagination at 10 Posts** 🟢
- **Current:** `paginate: 10` in `_config.yml`
- **Assessment:** Reasonable, keeps page weight ~27KB HTML
- **Total posts:** ~40 (good manageable number)

---

## Performance Strengths ✅

### 1. **Good Core Configuration**
- Jekyll `JEKYLL_ENV=production` used in CI
- SEO and sitemap plugins configured
- Proper canonical URLs and meta tags

### 2. **Firebase CDN with Compression**
- Automatic gzip/brotli compression via Firebase
- Global CDN distribution
- Clean URL rewrites configured

### 3. **No Render-Blocking JavaScript**
- No external JS libraries loaded
- Only inline script for Fae page
- No jQuery, no analytics (privacy-friendly!)

### 4. **Lightweight Page Weight**
- HTML: ~27KB per page
- CSS: ~8KB (minified)
- Images: Optimized favicons
- Total page weight: ~35KB without images

### 5. **Efficient CSS Selectors**
- Uses BEM-like naming conventions
- No deeply nested selectors
- Minimal use of `*` universal selector (only for reset)
- CSS custom properties for theming (maintainable)

### 6. **Accessibility Considerations**
- Proper heading hierarchy
- Focus states defined
- Skip links not needed (simple navigation)

### 7. **Clean Jekyll Setup**
- Minimal plugins (4 essential ones)
- Good exclude patterns in `_config.yml`
- No plugin bloat

---

## Core Web Vitals Assessment

| Metric | Current Estimate | Target | Status |
|--------|-----------------|--------|--------|
| **LCP** | ~1.5-2.5s | <2.5s | ⚠️ At Risk |
| **FCP** | ~1.0-1.5s | <1.8s | ✅ Good |
| **TTFB** | ~100-200ms | <600ms | ✅ Excellent |
| **CLS** | ~0 | <0.1 | ✅ Excellent |
| **INP** | ~50ms | <200ms | ✅ Excellent |

**Notes:**
- LCP is at risk due to font loading strategy and hero image
- CLS is excellent (no layout shifts, stable design)
- INP will be excellent (no complex interactions)

---

## Recommended Priority Order

### Immediate (Week 1)
1. Add `preconnect` hints to `_layouts/default.html`
2. Move Google Fonts from `@import` to `<link>` in HTML
3. Add `loading="lazy"` to fae.jpg

### Short-term (Month 1)
4. Compress or convert fae.jpg to WebP
5. Add font file cache headers to `firebase.json`
6. Optimize Fae page JavaScript loading

### Long-term (Future)
7. Consider Critical CSS inlining
8. Add service worker for offline support
9. Implement responsive images with `srcset`

---

## File References

| File | Purpose | Size |
|------|---------|------|
| `_layouts/default.html` | Main layout | 58 lines |
| `assets/css/style.css` | Stylesheet | 9,274 bytes |
| `firebase.json` | Hosting config | 36 lines |
| `_config.yml` | Jekyll config | 76 lines |
| `assets/images/fae.jpg` | Hero image | 155KB |

---

## Estimated Performance Impact of Fixes

| Fix | FCP Improvement | LCP Improvement | Bandwidth Saved |
|-----|-----------------|-----------------|-----------------|
| Preconnect hints | -100-200ms | -50-100ms | 0KB |
| Font loading fix | -200-400ms | -100-200ms | 0KB |
| Image optimization | 0ms | -200-400ms | ~75KB |
| CSS minification | -50ms | 0ms | ~2KB |
| **Total Potential** | **-350-650ms** | **-350-700ms** | **~77KB** |

---

*Review completed. This site has solid fundamentals but would benefit significantly from the Critical and High priority fixes listed above.*
