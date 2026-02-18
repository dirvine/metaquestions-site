/**
 * Fae Download Button Loader
 * Fetches the latest release from GitHub and generates platform-specific download buttons
 */
(function() {
  'use strict';
  
  var REPO = 'saorsa-labs/fae';
  var API  = 'https://api.github.com/repos/' + REPO + '/releases/latest';
  var ICONS = {
    macos: '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M11.18 12.98c-.52.78-1.06 1.56-1.91 1.57-.84.02-1.1-.5-2.06-.5s-1.25.48-2.05.51c-.65.03-1.15-.84-1.68-1.61C2.54 11.53 1.8 8.66 2.9 6.73c.55-.96 1.53-1.56 2.59-1.58.8-.02 1.56.54 2.06.54.49 0 1.41-.67 2.38-.57.4.01 1.55.16 2.28 1.24-2.06 1.2-1.7 4.32.47 5.15-.35.88-.82 1.75-1.5 2.47zM10.15 3.3c-.58.7-1.53 1.24-2.46 1.17-.1-.93.34-1.9.87-2.51C9.14 1.25 10.14.77 10.97.73c.08.97-.28 1.92-.82 2.57z"/></svg>',
    windows: '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M1.5 8.5V4.2l4.5-1v5.3H1.5zm5.5-.05l6-.65V2l-6 1.06v5.39zM13.5 9.15l-6 .65v5.2l6 1V9.15zM6 9.85l-4.5.4v4.15l4.5-1V9.85z"/></svg>',
    linux: '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 1C5.8 1 4.5 2.7 4.5 5c0 1.1.3 2 .7 2.8L3.5 10c-.4.5-.5 1-.5 1.5 0 1.4 1.8 2.5 5 2.5s5-1.1 5-2.5c0-.5-.1-1-.5-1.5l-1.7-2.2c.4-.8.7-1.7.7-2.8C11.5 2.7 10.2 1 8 1zm-2 4.5c0-.3.2-.5.5-.5s.5.2.5.5-.2.5-.5.5-.5-.2-.5-.5zm3 0c0-.3.2-.5.5-.5s.5.2.5.5-.2.5-.5.5-.5-.2-.5-.5zM6.5 7.5h3c-.2.6-.7 1-1.5 1s-1.3-.4-1.5-1z"/></svg>'
  };
  var ORDER = ['macos', 'windows', 'linux'];
  var PLATFORMS = {
    macos:   { label: 'macOS',   pattern: 'macos-arm64', ext: '.dmg' },
    windows: { label: 'Windows', pattern: 'windows-x86_64', ext: '.zip' },
    linux:   { label: 'Linux',   pattern: 'linux-x86_64', ext: '.tar.gz' }
  };

  /**
   * Detect the user's operating system from navigator properties
   * @returns {string} - 'macos', 'windows', or 'linux'
   */
  function detectOS() {
    var ua = navigator.userAgent || '';
    var p  = navigator.platform || '';
    if (/Mac/i.test(p) || /Mac/i.test(ua))    return 'macos';
    if (/Win/i.test(p) || /Win/i.test(ua))     return 'windows';
    if (/Linux/i.test(p) || /Linux/i.test(ua)) return 'linux';
    return 'linux';
  }

  /**
   * Find a matching asset in the release assets array
   * @param {Array} assets - Release assets
   * @param {string} pattern - Filename pattern to match
   * @param {string} ext - File extension
   * @returns {Object|null} - Matching asset or null
   */
  function findAsset(assets, pattern, ext) {
    for (var i = 0; i < assets.length; i++) {
      if (assets[i].name.indexOf(pattern) !== -1 && assets[i].name.endsWith(ext))
        return assets[i];
    }
    return null;
  }

  /**
   * Initialize the download buttons
   */
  function init() {
    var wrap   = document.getElementById('fae-get-buttons');
    if (!wrap) return;
    
    var userOS = detectOS();

    fetch(API)
      .then(function(r) { 
        if (!r.ok) throw new Error('Failed to fetch release');
        return r.json(); 
      })
      .then(function(release) {
        var assets = release.assets || [];
        var html = '';
        for (var i = 0; i < ORDER.length; i++) {
          var key  = ORDER[i];
          var plat = PLATFORMS[key];
          var asset = findAsset(assets, plat.pattern, plat.ext);
          var href = asset ? asset.browser_download_url : 'https://github.com/' + REPO + '/releases/latest';
          var cls  = 'fae-os-btn' + (key === userOS ? ' fae-os-active' : '');
          var label = 'Download Fae for ' + plat.label;
          html += '<a href="' + href + '" class="' + cls + '" aria-label="' + label + '">'
                + ICONS[key] + '<span>' + plat.label + '</span></a>';
        }
        wrap.innerHTML = html;
      })
      .catch(function(err) {
        console.warn('Failed to load Fae releases:', err);
        var href = 'https://github.com/' + REPO + '/releases/latest';
        wrap.innerHTML = '<a href="' + href + '" class="fae-os-btn fae-os-active" aria-label="View all Fae releases">All platforms</a>';
      });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
