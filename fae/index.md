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
    macos: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>',
    windows: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 12V6.75l6-1.32v6.48L3 12zm6.73-.07l8.27-.9V4.6l-8.27 1.46v5.88zM18 12.93l-8.27.9v5.83l8.27 1.36v-8.09zM9 13.07l-6 .57v5.48l6-1.33v-4.72z"/></svg>',
    linux: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.368 1.884 1.368.39 0 .739-.134 1.107-.415.368-.298.478-.637.724-.96.15-.198.378-.378.69-.378.311 0 .521.06.794.09.273.039.588-.02.905-.298.317-.269.448-.615.53-1.01.051-.244.082-.519.093-.802.012-.299-.01-.599-.065-.861l-.005-.022c-.003-.097-.011-.197-.028-.285-.044-.227-.103-.44-.176-.625-.073-.195-.158-.367-.237-.516-.079-.148-.164-.272-.246-.393-.082-.12-.148-.242-.183-.36-.082-.276-.102-.651-.081-1.152.022-.46.067-1.025.094-1.638.011-.292.023-.598.025-.911.013-1.28-.263-2.708-1.204-3.576-1.253-1.138-1.66-2.006-1.834-2.874-.087-.432-.114-.853-.163-1.285-.039-.29-.089-.582-.18-.862-.178-.559-.416-1.1-.831-1.499-.415-.399-.939-.646-1.573-.743-.2-.023-.375-.035-.546-.035zm.159 1.028c.142 0 .276.01.414.036.47.073.82.26 1.123.556.303.297.49.713.64 1.196.072.22.114.466.149.73.042.302.066.617.114.87.12.613.33 1.226.62 1.781.29.549.65 1.04 1.094 1.46l.003.003.003.003c.71.668.965 1.867.953 2.975a22.195 22.195 0 01-.024.878c-.028.637-.073 1.215-.095 1.693-.022.466-.009.913.107 1.33.058.2.148.38.262.537.113.157.214.28.295.425.082.145.15.293.207.46.056.163.1.347.13.546l.003.02c.005.057.012.117.016.176.04.205.055.42.045.639-.008.223-.035.45-.075.653-.042.205-.1.384-.18.519-.079.133-.173.192-.227.214-.054.02-.103.013-.183 0-.177-.038-.403-.09-.693-.09-.478 0-.863.272-1.098.57-.234.296-.335.568-.502.707-.168.134-.309.188-.596.188-.515 0-1.007-.438-1.267-1.02-.026-.04-.047-.109-.061-.128-.052-.073-.193-.138-.39-.181-.594-.073-1.68-.291-2.477-.18-.64.046-1.1.2-1.543.282-.444.073-.845.125-1.276-.023-.428-.152-.663-.205-.845-.096-.182.124-.236.377-.322.72-.09.344-.196.59-.478.756-.281.166-.673.204-1.258.002-.296-.102-.493-.195-.644-.321-.149-.13-.237-.303-.29-.539-.106-.469-.02-.888-.061-1.263-.028-.18-.055-.343-.069-.49-.005-.085-.025-.175.015-.294.04-.12.128-.238.372-.49.244-.246.475-.555.696-.884l.004-.006.003-.004c.093-.139.133-.282.154-.418.02-.137.023-.27.018-.406-.011-.27-.07-.512-.117-.662-.047-.15-.1-.272-.127-.373-.052-.205-.066-.442-.066-.64 0-.197.018-.341.028-.449.026-.272.024-.479-.019-.677-.043-.197-.141-.377-.318-.527-.44-.375-.959-.644-1.393-1.07-.434-.43-.755-.97-1.074-1.558-.636-1.17-1.074-2.618-.78-3.563.147-.472.406-.909.775-1.229.37-.323.834-.534 1.413-.607.578-.074 1.263-.024 2.07.173.806.197 1.323.482 1.87.694.278.107.565.196.876.235.311.04.649.025 1.017-.063.398-.09.796-.27 1.225-.464.429-.192.882-.398 1.41-.495a3.37 3.37 0 01.583-.05z"/></svg>'
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
