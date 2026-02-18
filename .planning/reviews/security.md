# Security Review: davidirvine.com Jekyll Blog

**Review Date:** 2026-02-18  
**Reviewer:** Security Audit (Automated + Manual)  
**Scope:** Jekyll static site, Firebase Hosting, GitHub Actions CI/CD

---

## Security Review Summary

**Grade: B+ (85/100)**

The site demonstrates solid security fundamentals for a static Jekyll blog. Dependencies are reasonably up-to-date, no secrets are exposed, and the attack surface is minimal by design (static site). The primary concerns center around missing security headers and CI/CD hardening opportunities.

---

### Critical Issues (MUST FIX)

*No critical issues identified.*

---

### High Issues (SHOULD FIX)

#### 1. Missing Security Headers in Firebase Hosting
**File:** `firebase.json`  
**Risk:** XSS, clickjacking, MIME-type sniffing attacks  
**Description:** The current configuration lacks essential security headers:
- No `Content-Security-Policy` (CSP)
- No `X-Frame-Options` (clickjacking protection)
- No `X-Content-Type-Options` (MIME-sniffing protection)
- No `Referrer-Policy`
- No `Strict-Transport-Security` (HSTS)

**Recommendation:** Add comprehensive security headers:

```json
{
  "headers": [
    {
      "source": "**",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

#### 2. SPA Rewrite Rule May Mask 404s
**File:** `firebase.json`  
**Risk:** Information disclosure, unexpected behavior  
**Description:** The rewrite rule `"source": "**", "destination": "/index.html"` turns all 404s into 200 OK responses with the homepage content. This can:
- Mask broken links instead of returning proper 404 status
- Confuse search engines
- Potentially expose sensitive information if files are referenced but missing

**Recommendation:** Consider if SPA behavior is truly needed for a static blog. If not, remove the rewrite rule. If needed for specific routes, narrow the pattern:

```json
"rewrites": [
  {
    "source": "/app/**",
    "destination": "/app/index.html"
  }
]
```

#### 3. Unpinned NPM Package in CI/CD
**File:** `.github/workflows/firebase-deploy.yml:32`  
**Risk:** Supply chain attack, unexpected breaking changes  
**Description:** `npm install -g firebase-tools` installs the latest version without pinning. A compromised firebase-tools release could compromise deployment.

**Recommendation:** Pin to a specific version and use checksum verification:

```yaml
- name: Install Firebase CLI
  run: npm install -g firebase-tools@13.31.1
```

Consider using `package.json` with `package-lock.json` and `npm ci` for reproducible installs.

---

### Medium/Low Issues

#### 4. Google Fonts External Dependency
**File:** `assets/css/style.css:3`  
**Risk:** Privacy (user IP exposed to Google), availability dependency  
**Description:** `@import url('https://fonts.googleapis.com/...')` loads fonts from Google's CDN. This:
- Exposes visitor IPs to Google
- Creates a dependency on Google's infrastructure
- Prevents SRI (Subresource Integrity) usage for CSS imports

**Recommendation:** Consider self-hosting fonts or using system font stack as fallback:

```css
/* Option 1: Self-hosted (preferred for privacy) */
@font-face {
  font-family: 'Inter';
  src: url('/assets/fonts/Inter-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}

/* Option 2: System font fallback */
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

#### 5. Firebase Token in Environment Variable
**File:** `.github/workflows/firebase-deploy.yml:35-37`  
**Risk:** Token exposure in logs (low risk with GitHub Actions masking)  
**Description:** While GitHub Actions masks secrets in logs, passing tokens via CLI args can sometimes leak in error messages or process lists.

**Recommendation:** Use environment variable without CLI argument (firebase-tools supports `FIREBASE_TOKEN` env var directly):

```yaml
- name: Deploy to Firebase
  run: firebase deploy --only hosting --project metaquestions-site
  env:
    FIREBASE_TOKEN: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
```

#### 6. Twitter Link Uses HTTP (Potential)
**File:** `_layouts/default.html:51`  
**Risk:** Mixed content warnings, MITM attacks  
**Description:** Link to `https://twitter.com/` is correctly using HTTPS. No issue here - verified secure.

#### 7. Jekyll URL Configuration Empty
**File:** `_config.yml:12-13`  
**Risk:** SEO issues, potential canonical URL problems  
**Description:** `url: ""` and `baseurl: ""` are empty. For production, set the canonical URL:

```yaml
url: "https://davidirvine.com"
baseurl: ""
```

---

### Security Strengths

1. **No Secrets in Codebase**: No API keys, tokens, or credentials found in any configuration files

2. **Minimal Attack Surface**: Static site has no server-side code, databases, or user input processing

3. **Up-to-Date Dependencies**: All gems are current stable versions:
   - Jekyll 4.4.1 (latest)
   - REXML 3.4.4 (not affected by CVE-2025-58767)
   - Webrick 1.9.2 (latest)
   - Kramdown 2.5.2 (recent)

4. **No Inline Scripts**: Clean separation of concerns, no inline JavaScript or event handlers

5. **Reproducible Builds**: Uses `bundler-cache: true` ensuring consistent Ruby gem versions

6. **Proper Jekyll Environment**: Sets `JEKYLL_ENV: production` during build

7. **No User Input**: Static site eliminates XSS, SQL injection, and most injection attack vectors

8. **Modern GitHub Actions**: Uses current action versions (`@v4`)

---

### Dependency Vulnerability Analysis

| Package | Version | Status | Notes |
|---------|---------|--------|-------|
| jekyll | 4.4.1 | ✅ Secure | CVE-2021-28834 patched |
| rexml | 3.4.4 | ✅ Secure | Above CVE-2025-58767 range (3.3.3-3.4.1) |
| webrick | 1.9.2 | ✅ Secure | Old CVEs (2010-2011) don't apply |
| kramdown | 2.5.2 | ✅ Secure | Recent stable version |
| rouge | 4.7.0 | ✅ Secure | Syntax highlighter |
| addressable | 2.8.8 | ✅ Secure | URL handling library |
| jekyll-seo-tag | 2.8.0 | ✅ Secure | Official Jekyll plugin |
| jekyll-sitemap | 1.4.0 | ✅ Secure | Official Jekyll plugin |
| jekyll-feed | 0.17.0 | ✅ Secure | Official Jekyll plugin |

---

### Recommendations Summary

| Priority | Action | Effort |
|----------|--------|--------|
| High | Add security headers to firebase.json | 30 min |
| High | Pin firebase-tools version in CI | 5 min |
| Medium | Review SPA rewrite rule necessity | 15 min |
| Medium | Consider self-hosting fonts | 1 hour |
| Low | Set canonical URL in _config.yml | 5 min |
| Low | Use FIREBASE_TOKEN env var without --token | 5 min |

---

### Threat Model

**High Risk Threats (Mitigated):**
- XSS attacks - Mitigated by no user input and static content
- SQL injection - Not applicable (no database)
- Server compromise - Not applicable (static hosting)

**Medium Risk Threats (Partially Mitigated):**
- Clickjacking - Needs X-Frame-Options header
- MIME-type attacks - Needs X-Content-Type-Options header
- MITM - Uses HTTPS but missing HSTS header

**Low Risk Threats:**
- Supply chain attacks - Partially mitigated by using official plugins
- Privacy leaks - Google Fonts exposes IPs to third party

---

## Conclusion

The davidirvine.com Jekyll blog is **production-ready** with minor security enhancements recommended. The static site architecture provides inherent security benefits, and the dependency management is well-maintained. Addressing the missing security headers and CI/CD hardening would elevate this to an A-grade security posture.

**Next Review Recommended:** 6 months or after significant dependency updates
