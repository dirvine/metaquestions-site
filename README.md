# Metaquestions - Jekyll Site

Personal blog by David Irvine, migrated from WordPress to Jekyll.

## Local Development

### Prerequisites
- Ruby (2.7+)
- Bundler

### Setup
```bash
bundle install
```

### Run locally
```bash
bundle exec jekyll serve
```
Visit `http://localhost:4000`

### Build for production
```bash
bundle exec jekyll build
```

## Firebase Deployment

### Prerequisites
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Create a Firebase project at https://console.firebase.google.com

### Deploy
```bash
# Build the Jekyll site
bundle exec jekyll build

# Deploy to Firebase
firebase deploy
```

## Structure
- `_posts/` - Blog posts in Markdown
- `_layouts/` - Page templates
- `_includes/` - Reusable components
- `assets/` - CSS, images, etc.
- `_config.yml` - Site configuration
