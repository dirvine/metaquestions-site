# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal Jekyll blog for David Irvine, migrated from WordPress. Uses Jekyll 4.3 with the minima theme, deployed to Firebase Hosting.

## Development Commands

```bash
# Install dependencies
bundle install

# Run local server (http://localhost:4000)
bundle exec jekyll serve

# Build for production
bundle exec jekyll build

# Deploy to Firebase
firebase deploy
```

## Site Structure

- `_posts/` - Blog posts in Markdown with YAML front matter
- `_layouts/` - HTML templates (page.html, post.html via minima)
- `_includes/` - Reusable components
- `assets/` - CSS, images, static assets
- `essays.md` - Standalone essay page
- `_config.yml` - Jekyll configuration (permalinks, plugins, pagination)

## Post Format

Posts follow Jekyll convention: `_posts/YYYY-MM-DD-title.md` with front matter:
```yaml
---
layout: post
title: "Post Title"
date: YYYY-MM-DD
author: David Irvine
categories:
  - category1
  - category2
---
```

## Deployment

Site is deployed to Firebase Hosting. Build output (`_site/`) is deployed via `firebase deploy`.
