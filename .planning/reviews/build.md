## Build & Deploy Review Summary
**Grade: B+ (7.5/10)**

The build and deployment pipeline is generally well-structured with modern GitHub Actions, proper Ruby dependency caching, and correct Firebase integration. However, there is one **critical issue** with the Firebase rewrite configuration that will break direct links to blog posts and pages.

---

### Critical Issues (MUST FIX)

#### 1. SPA Rewrite Rule Breaks Static Site Routing
**File**: `firebase.json`
**Issue**: The rewrite rule `"source": "**"` → `"destination": "/index.html"` treats the Jekyll site as a Single Page Application (SPA). This causes **all URLs to return index.html**, breaking:
- Direct links to blog posts (e.g., `/2024/01/01/my-post/`)
- Direct links to pages (e.g., `/about/`)
- Browser refresh on any page other than home
- SEO crawlability of individual pages

**Fix**: Remove the rewrite rule entirely for a static site like Jekyll:
```json
{
  "hosting": {
    "public": "_site",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [{"key": "Cache-Control", "value": "max-age=31536000"}]
      },
      {
        "source": "**/*.@(css|js)",
        "headers": [{"key": "Cache-Control", "value": "max-age=31536000"}]
      }
    ]
  }
}
```

---

### High Issues (SHOULD FIX)

#### 2. Missing URL Configuration in Jekyll
**File**: `_config.yml`
**Issue**: The `url` field is empty (`url: ""`). This impacts:
- RSS feed generation (jekyll-feed)
- SEO meta tags (jekyll-seo-tag)
- Sitemap generation (jekyll-sitemap)
- Canonical URLs

**Fix**: Set the production URL:
```yaml
url: "https://davidirvine.com"
```

#### 3. No Pull Request Preview Deployments
**File**: `.github/workflows/firebase-deploy.yml`
**Issue**: The workflow only triggers on `main` branch pushes. There is no staging environment or PR preview for validating changes before production.

**Fix**: Add a separate job or workflow for PR previews using Firebase Hosting channels:
```yaml
# Add to existing workflow or create new file
on:
  pull_request:
    branches: [ main ]

jobs:
  preview:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.2'
          bundler-cache: true
      - name: Build Jekyll site
        run: bundle exec jekyll build
        env:
          JEKYLL_ENV: staging
      - name: Deploy to Firebase Preview Channel
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          projectId: metaquestions-site
          channelId: pr-${{ github.event.number }}
```

#### 4. Firebase CLI Version Not Pinned
**File**: `.github/workflows/firebase-deploy.yml` (line 32)
**Issue**: `npm install -g firebase-tools` installs the latest version without pinning. Major version updates could introduce breaking changes or unexpected behavior.

**Fix**: Pin to a specific major version:
```yaml
- name: Install Firebase CLI
  run: npm install -g firebase-tools@^13.0.0
```

---

### Medium/Low Issues

#### 5. No Build Artifacts for Debugging
**File**: `.github/workflows/firebase-deploy.yml`
**Issue**: The built `_site` directory is not uploaded as an artifact, making it difficult to debug build issues or inspect the output without deploying.

**Fix**: Add artifact upload step before deployment:
```yaml
- name: Upload build artifacts
  uses: actions/upload-artifact@v4
  with:
    name: site-build
    path: _site/
    retention-days: 7
```

#### 6. Missing Cache Headers for HTML Files
**File**: `firebase.json`
**Issue**: HTML files don't have cache-control headers. While browsers may cache them, explicit headers are recommended for CDN behavior.

**Fix**: Add cache header for HTML (short cache for content, long for static):
```json
{
  "source": "**/*.html",
  "headers": [
    {
      "key": "Cache-Control",
      "value": "public, max-age=3600, stale-while-revalidate=86400"
    }
  ]
}
```

#### 7. No Workflow Concurrency Control
**File**: `.github/workflows/firebase-deploy.yml`
**Issue**: Multiple rapid pushes to main could trigger overlapping deployments, potentially causing race conditions or failed deploys.

**Fix**: Add concurrency control:
```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

#### 8. Node.js Setup After Jekyll Build
**File**: `.github/workflows/firebase-deploy.yml`
**Issue**: Node.js setup happens after Jekyll build. While functionally correct (Firebase CLI only needed for deploy), the logical ordering could be clearer.

**Note**: This is a minor style issue, not a functional problem.

---

### Build & Deploy Strengths

#### 1. Modern GitHub Actions Versions
- Uses `actions/checkout@v4` (latest)
- Uses `ruby/setup-ruby@v1` (official, maintained)
- Uses `actions/setup-node@v4` (latest)

#### 2. Proper Ruby Dependency Management
- Ruby version pinned to `3.2` (good balance of stability and modern features)
- `bundler-cache: true` enables efficient gem caching between builds
- `Gemfile.lock` committed for reproducible builds

#### 3. Correct Jekyll Build Configuration
- `JEKYLL_ENV=production` properly set for production builds
- Uses `bundle exec` for proper gem context
- Default `_site` output directory used consistently

#### 4. Security-Conscious Secret Handling
- Firebase token passed via environment variable (`$FIREBASE_TOKEN`)
- Uses `secrets.FIREBASE_SERVICE_ACCOUNT` (appropriately named)
- No hardcoded credentials in workflow

#### 5. Appropriate Trigger Configuration
- Triggers on `push` to `main` (correct for production)
- Includes `workflow_dispatch` for manual deployments

#### 6. Good Asset Caching Strategy
- Images cached for 1 year (immutable content)
- CSS/JS cached for 1 year (versioned by content hash in Jekyll)
- Firebase ignore patterns properly exclude build artifacts

#### 7. Consistent Project Targeting
- `.firebaserc` sets default project
- Workflow explicitly specifies `--project metaquestions-site`
- No ambiguity about deployment target

---

### Recommendations Summary

| Priority | Action | Effort | Impact |
|----------|--------|--------|--------|
| 🔴 Critical | Fix Firebase rewrite rule | 5 min | Fixes broken routing |
| 🟠 High | Set Jekyll `url` in _config.yml | 2 min | Improves SEO/feeds |
| 🟠 High | Add PR preview workflow | 30 min | Improves review process |
| 🟠 High | Pin Firebase CLI version | 2 min | Prevents breaking changes |
| 🟡 Medium | Add build artifacts | 5 min | Improves debugging |
| 🟡 Medium | Add HTML cache headers | 10 min | Better CDN performance |
| 🟡 Medium | Add concurrency control | 5 min | Prevents race conditions |
| 🟢 Low | Reorder setup steps | 2 min | Cleaner workflow |

---

### Files Reviewed

| File | Status | Notes |
|------|--------|-------|
| `.github/workflows/firebase-deploy.yml` | ⚠️ Needs fixes | See issues #1, #4, #5, #7 |
| `firebase.json` | 🔴 Critical issue | SPA rewrite breaks static routing |
| `.firebaserc` | ✅ Good | Correct default project |
| `Gemfile` | ✅ Good | Clean dependency specification |
| `Gemfile.lock` | ✅ Good | Properly committed, up-to-date |
| `_config.yml` | ⚠️ Needs fix | Missing `url` configuration |

---

### Build Verification Checklist

- [ ] `bundle exec jekyll build` succeeds locally
- [ ] `_site` directory contains expected HTML files
- [ ] Direct links to posts work (e.g., `file:///_site/2024/01/01/post/index.html`)
- [ ] Firebase rewrite rule removed or fixed
- [ ] `JEKYLL_ENV=production bundle exec jekyll build` produces correct output
- [ ] `firebase deploy --dry-run` validates configuration

---

*Review Date: 2026-02-18*
*Reviewer: Build & Deploy Review Agent*
