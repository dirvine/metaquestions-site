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
      <span class="fae-download-label">Let me help YOU!!</span>
      <span class="fae-download-detail" id="fae-download-detail">Detecting your system&hellip;</span>
    </a>
    <div class="fae-download-alt" id="fae-download-alt">
      <span class="fae-download-alt-label">Also available for</span>
      <span class="fae-download-alt-links" id="fae-download-alt-links"></span>
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

  // Preferred download per platform: label, asset name pattern, file extension
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
    var btn     = document.getElementById('fae-download-btn');
    var detail  = document.getElementById('fae-download-detail');
    var altLinks = document.getElementById('fae-download-alt-links');
    var altWrap  = document.getElementById('fae-download-alt');
    var userOS  = detectOS();

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
          // Fallback to release page
          btn.href = 'https://github.com/' + REPO + '/releases/latest';
          detail.textContent = 'View latest release \u00b7 ' + version;
        }

        // Build alt links for other platforms
        var alts = [];
        for (var key in PLATFORMS) {
          if (key === userOS) continue;
          var plat  = PLATFORMS[key];
          var asset = findAsset(assets, plat.pattern, plat.ext);
          if (asset) {
            alts.push('<a href="' + asset.browser_download_url + '">' + plat.label + '</a>');
          }
        }
        if (alts.length > 0) {
          altLinks.innerHTML = alts.join(' &middot; ');
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
