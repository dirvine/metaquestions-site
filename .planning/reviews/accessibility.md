# Accessibility Review Summary

**Site:** davidirvine.com (Jekyll Blog)  
**Review Date:** 2026-02-18  
**Grade: B- (75/100)**

---

## Critical Issues (MUST FIX)

### 1. Missing Skip Navigation Link
**Location:** `_layouts/default.html`  
**Issue:** No "skip to main content" link exists. Keyboard users must tab through the entire header navigation on every page load to reach the main content.  
**Impact:** Blocks efficient navigation for screen reader and keyboard-only users.  
**Fix:** Add as the first focusable element in `<body>`:
```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```
And add `id="main-content"` to the `<main>` element.

### 2. Multiple Color Contrast Failures (WCAG AA)
**Location:** `assets/css/style.css`  

| Element | Color | Background | Ratio | Required | Status |
|---------|-------|------------|-------|----------|--------|
| `.card-date` | #808080 | #ffffff | 3.95:1 | 4.5:1 | ❌ FAIL |
| `.card-arrow` | #999999 | #ffffff | 2.85:1 | 4.5:1 | ❌ FAIL |
| `.post-meta` | #808080 | #f8f7f4 | ~3.9:1 | 4.5:1 | ❌ FAIL |
| `.footer-subtle` | #808080 @ 40% | #f8f7f4 | ~1.9:1 | 4.5:1 | ❌ FAIL |
| `.site-tagline` | #666666 | #f8f7f4 | ~5.3:1 | 4.5:1 | ⚠️ Marginal |

**Impact:** Users with low vision or color blindness cannot read important metadata.  
**Fix:** Darken text colors:
- `.card-date`, `.post-meta`: change to `--gray-700` (#404040)
- `.card-arrow`: change to `--gray-600` (#666666) minimum
- `.footer-subtle`: increase opacity to 0.8 or use `--gray-600`

### 3. Incomplete Focus Indicators
**Location:** `assets/css/style.css`  
**Issue:** Only `.card` has explicit focus styles. Navigation links (`.site-nav a`), footer links (`.site-footer a`), `.back-home`, and `.post-navigation a` lack visible focus indicators.  
**Impact:** Keyboard users cannot see which element has focus.  
**Fix:** Add global focus styles:
```css
a:focus-visible,
button:focus-visible {
  outline: 2px solid var(--black);
  outline-offset: 2px;
}
```

---

## High Issues (SHOULD FIX)

### 4. No Reduced Motion Support
**Location:** `assets/css/style.css`  
**Issue:** Animations (card hover transforms, smooth scrolling) have no `prefers-reduced-motion` media query.  
**Impact:** Can trigger vestibular disorders (motion sickness, dizziness).  
**Fix:** Add:
```css
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  .card {
    transition: none;
  }
  .card:hover {
    transform: none;
  }
}
```

### 5. No ARIA Labels on Icon-Only Links
**Location:** `fae/index.md` (JavaScript-generated content)  
**Issue:** Download buttons use icon-only SVGs (macOS, Windows, Linux icons) without accompanying text labels for screen readers.  
**Impact:** Screen reader users cannot identify the purpose of these buttons.  
**Fix:** The `title` attribute exists, but add explicit `aria-label`:
```javascript
html += '<a href="' + href + '" class="' + cls + '" aria-label="Download Fae for ' + plat.label + '">'
```

### 6. Missing Page Language Direction Support
**Location:** `_layouts/default.html`  
**Issue:** While `lang="en"` is set, there's no mechanism for content in other languages.  
**Impact:** Screen readers may mispronounce non-English content.  
**Priority:** Low (single-language site currently)

---

## Medium/Low Issues

### 7. Card Component as Anchor Wraps Block Elements
**Location:** `index.html`, `fae/index.md`  
**Issue:** The entire card is an `<a>` element containing block-level content (divs). While technically valid in HTML5, this can cause verbose screen reader announcements.  
**Impact:** Screen readers may read the entire card content as a single link text.  
**Fix:** Consider restructuring with the heading as the link:
```html
<article class="card">
  <h2><a href="...">{{ post.title }}</a></h2>
  ...
</article>
```

### 8. Time Element Missing Semantic Context
**Location:** `_layouts/post.html`  
**Issue:** The `<time>` element exists but could benefit from additional context for screen readers.  
**Current:** `<time datetime="...">February 11, 2026</time>`  
**Fix:** Add screen-reader-only prefix:
```html
<time datetime="...">
  <span class="sr-only">Published on </span>February 11, 2026
</time>
```

### 9. Favicon Links Missing Accessibility Consideration
**Location:** `_layouts/default.html`  
**Issue:** While favicons don't strictly need alt text, the Apple touch icon could have `role="img"` for clarity.  
**Priority:** Very Low

### 10. No Announcement for Dynamic Content
**Location:** `fae/index.md`  
**Issue:** The download buttons are loaded via JavaScript/fetch, but there's no ARIA live region to announce when content loads or fails.  
**Fix:** Add `aria-live="polite"` region for loading status.

---

## Accessibility Strengths

### 1. ✅ Semantic HTML Structure
- Proper use of `<header>`, `<nav>`, `<main>`, `<footer>`, `<article>`
- Heading hierarchy is logical (h1 → h2 → h3)
- `<time>` elements with datetime attributes
- `<blockquote>` used for quotations

### 2. ✅ Good Base Typography
- Body text: 15px (minimum recommended)
- Line height: 1.7-1.8 (excellent for readability)
- Max-width: 800px (optimal measure for reading)
- Responsive font sizing for mobile

### 3. ✅ Visible Link Styling in Content
- Post content links are underlined (`text-decoration: underline`)
- Good color contrast for body text links

### 4. ✅ Alt Text on Hero Image
- `fae/index.md` has descriptive alt text: "Fae - the gentle folk of Scotland's roots"

### 5. ✅ Formatted Date for Screen Readers
- `<time datetime="{{ page.date | date_to_xmlschema }}">` provides machine-readable dates

### 6. ✅ Logical Tab Order
- DOM order matches visual order
- No tabindex manipulation that would disrupt natural flow

### 7. ✅ Print Styles Consideration
- Dark code blocks on light background (would print reasonably well)

---

## Recommendations Summary

| Priority | Issue | Effort |
|----------|-------|--------|
| 🔴 Critical | Add skip navigation link | Low |
| 🔴 Critical | Fix color contrast (4 locations) | Low |
| 🔴 Critical | Add focus indicators for all links | Low |
| 🟡 High | Add reduced-motion support | Low |
| 🟡 High | Fix icon-only button labels | Low |
| 🟢 Medium | Restructure card links | Medium |
| 🟢 Medium | Add semantic context to dates | Low |

---

## Testing Recommendations

Before deploying, test with:
1. **Keyboard-only navigation** (Tab, Shift+Tab, Enter, Space)
2. **Screen readers:** NVDA (Windows), VoiceOver (macOS/iOS), TalkBack (Android)
3. **Browser dev tools:** Lighthouse accessibility audit, Firefox Accessibility Inspector
4. **Color contrast analyzers:** WebAIM Contrast Checker, axe DevTools
5. **Motion sensitivity:** Test with `prefers-reduced-motion: reduce` enabled

---

## Compliance Checklist

| WCAG 2.1 Criterion | Status | Notes |
|-------------------|--------|-------|
| 1.1.1 Non-text Content | ✅ Pass | Alt text present on content images |
| 1.3.1 Info and Relationships | ✅ Pass | Semantic HTML used |
| 1.4.3 Contrast (Minimum) | ❌ Fail | Multiple contrast failures |
| 2.1.1 Keyboard | ⚠️ Partial | Missing skip link, some focus issues |
| 2.2.2 Pause, Stop, Hide | ✅ Pass | No auto-playing content |
| 2.4.3 Focus Order | ✅ Pass | Logical order |
| 2.4.4 Link Purpose | ✅ Pass | Links have context |
| 2.4.7 Focus Visible | ❌ Fail | Incomplete focus indicators |
| 2.5.3 Label in Name | ⚠️ Partial | Icon buttons need review |
| 4.1.2 Name, Role, Value | ✅ Pass | Standard HTML elements used |

---

*Review conducted by automated analysis and manual code inspection.*
