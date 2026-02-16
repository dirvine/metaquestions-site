---
layout: default
title: "The Fae"
---
<div class="home">
  <div class="fae-hero">
    <img src="{{ '/assets/images/fae.jpg' | relative_url }}" alt="Fae - the gentle folk of Scotland's roots" class="fae-hero-img">
  </div>

  <div class="fae-download" id="fae-download">
    <a href="#" id="fae-download-btn" class="fae-download-btn" aria-label="Download Fae">
      <span class="fae-download-icon" id="fae-download-icon"></span>
      <span class="fae-download-text">
        <span class="fae-download-label">Let me help YOU!!</span>
        <span class="fae-download-detail" id="fae-download-detail">Detecting your system&hellip;</span>
      </span>
    </a>
    <div class="fae-download-alt" id="fae-download-alt">
      <div class="fae-download-alt-links" id="fae-download-alt-links"></div>
    </div>
  </div>

  <div class="cards-grid">
    {% assign sorted_fae = site.fae | sort: 'date' | reverse %}
    {% assign pinned = sorted_fae | where: 'pin', true %}
    {% assign unpinned = sorted_fae | where_exp: 'item', 'item.pin != true' %}
    {% for post in pinned %}
    <a href="{{ post.url | relative_url }}" class="card">
      <div class="card-content">
        <div class="card-date">{{ post.date | date: "%B %-d, %Y" }} &middot; Pinned</div>
        <div class="card-title">{{ post.title }}</div>
        <div class="card-description">{{ post.excerpt | strip_html | truncatewords: 40 }}</div>
      </div>
      <span class="card-arrow">&rarr;</span>
    </a>
    {% endfor %}
    {% for post in unpinned %}
    <a href="{{ post.url | relative_url }}" class="card">
      <div class="card-content">
        <div class="card-date">{{ post.date | date: "%B %-d, %Y" }}</div>
        <div class="card-title">{{ post.title }}</div>
        <div class="card-description">{{ post.excerpt | strip_html | truncatewords: 40 }}</div>
      </div>
      <span class="card-arrow">&rarr;</span>
    </a>
    {% endfor %}
  </div>
</div>

<script>
(function() {
  var REPO = 'saorsa-labs/fae';
  var API  = 'https://api.github.com/repos/' + REPO + '/releases/latest';

  var ICONS = {
    macos: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M11.18 12.98c-.52.78-1.06 1.56-1.91 1.57-.84.02-1.1-.5-2.06-.5s-1.25.48-2.05.51c-.65.03-1.15-.84-1.68-1.61C2.54 11.53 1.8 8.66 2.9 6.73c.55-.96 1.53-1.56 2.59-1.58.8-.02 1.56.54 2.06.54.49 0 1.41-.67 2.38-.57.4.01 1.55.16 2.28 1.24-2.06 1.2-1.7 4.32.47 5.15-.35.88-.82 1.75-1.5 2.47zM10.15 3.3c-.58.7-1.53 1.24-2.46 1.17-.1-.93.34-1.9.87-2.51C9.14 1.25 10.14.77 10.97.73c.08.97-.28 1.92-.82 2.57z"/></svg>',
    windows: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M1.5 8.5V4.2l4.5-1v5.3H1.5zm5.5-.05l6-.65V2l-6 1.06v5.39zM13.5 9.15l-6 .65v5.2l6 1V9.15zM6 9.85l-4.5.4v4.15l4.5-1V9.85z"/></svg>',
    linux: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1C5.8 1 4.5 2.7 4.5 5c0 1.1.3 2 .7 2.8L3.5 10c-.4.5-.5 1-.5 1.5 0 1.4 1.8 2.5 5 2.5s5-1.1 5-2.5c0-.5-.1-1-.5-1.5l-1.7-2.2c.4-.8.7-1.7.7-2.8C11.5 2.7 10.2 1 8 1zm-2 4.5c0-.3.2-.5.5-.5s.5.2.5.5-.2.5-.5.5-.5-.2-.5-.5zm3 0c0-.3.2-.5.5-.5s.5.2.5.5-.2.5-.5.5-.5-.2-.5-.5zM6.5 7.5h3c-.2.6-.7 1-1.5 1s-1.3-.4-1.5-1z"/></svg>'
  };

  var PLATFORMS = {
    macos:   { label: 'macOS',   pattern: 'macos-arm64', ext: '.dmg' },
    windows: { label: 'Windows', pattern: 'windows-x86_64', ext: '.zip' },
    linux:   { label: 'Linux',   pattern: 'linux-x86_64', ext: '.tar.gz' }
  };

  function detectOS() {
    var ua = navigator.userAgent || '';
    var p  = navigator.platform || '';
    if (/Mac/i.test(p) || /Mac/i.test(ua))         return 'macos';
    if (/Win/i.test(p) || /Win/i.test(ua))          return 'windows';
    if (/Linux/i.test(p) || /Linux/i.test(ua))      return 'linux';
    return 'linux';
  }

  function findAsset(assets, pattern, ext) {
    for (var i = 0; i < assets.length; i++) {
      var name = assets[i].name;
      if (name.indexOf(pattern) !== -1 && name.endsWith(ext)) {
        return assets[i];
      }
    }
    return null;
  }

  function init() {
    var btn      = document.getElementById('fae-download-btn');
    var icon     = document.getElementById('fae-download-icon');
    var detail   = document.getElementById('fae-download-detail');
    var altLinks = document.getElementById('fae-download-alt-links');
    var altWrap  = document.getElementById('fae-download-alt');
    var userOS   = detectOS();

    // Set primary button icon immediately
    icon.innerHTML = ICONS[userOS] || '';

    fetch(API)
      .then(function(r) { return r.json(); })
      .then(function(release) {
        var assets  = release.assets || [];
        var version = release.tag_name || '';
        var primary = PLATFORMS[userOS];
        var match   = findAsset(assets, primary.pattern, primary.ext);

        if (match) {
          btn.href = match.browser_download_url;
          detail.textContent = 'Download for ' + primary.label + ' \u00b7 ' + version;
        } else {
          btn.href = 'https://github.com/' + REPO + '/releases/latest';
          detail.textContent = 'View latest release \u00b7 ' + version;
        }

        // Build alt buttons for other platforms
        var html = '';
        for (var key in PLATFORMS) {
          if (key === userOS) continue;
          var plat  = PLATFORMS[key];
          var asset = findAsset(assets, plat.pattern, plat.ext);
          if (asset) {
            html += '<a href="' + asset.browser_download_url + '" class="fae-alt-btn">'
                  + '<span class="fae-alt-icon">' + ICONS[key] + '</span>'
                  + '<span class="fae-alt-text">'
                  + '<span class="fae-alt-os">' + plat.label + '</span>'
                  + '<span class="fae-alt-ext">' + plat.ext + '</span>'
                  + '</span>'
                  + '</a>';
          }
        }
        if (html) {
          altLinks.innerHTML = html;
          altWrap.style.display = '';
        }
      })
      .catch(function() {
        btn.href = 'https://github.com/' + REPO + '/releases/latest';
        detail.textContent = 'View latest release on GitHub';
        altWrap.style.display = 'none';
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>
