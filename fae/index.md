---
layout: default
title: "The Fae"
---

<div class="home">
  <div class="fae-hero">
    <img src="{{ '/assets/images/fae.jpg' | relative_url }}" alt="Fae - the gentle folk of Scotland's roots" class="fae-hero-img" loading="lazy">
    <div class="fae-get" id="fae-get">
      <span class="fae-get-label">Let me help you</span>
      <span class="fae-get-buttons" id="fae-get-buttons" aria-live="polite" aria-busy="true">
        <span class="fae-os-btn">Loading...</span>
      </span>
    </div>
  </div>

  <div class="cards-grid">
    {% assign sorted_fae = site.fae | sort: 'date' | reverse %}
    {% assign pinned = sorted_fae | where: 'pin', true %}
    {% assign unpinned = sorted_fae | where_exp: 'item', 'item.pin != true' %}
    {% for post in pinned %}
    <article class="card">
      <a href="{{ post.url | relative_url }}" class="card-link" aria-label="Read {{ post.title }}">
        <div class="card-content">
          <div class="card-date">{{ post.date | date: "%B %-d, %Y" }} &middot; Pinned</div>
          <h2 class="card-title">{{ post.title }}</h2>
          <div class="card-description">{{ post.excerpt | strip_html | truncatewords: 40 }}</div>
        </div>
        <span class="card-arrow" aria-hidden="true">&rarr;</span>
      </a>
    </article>
    {% endfor %}
    {% for post in unpinned %}
    <article class="card">
      <a href="{{ post.url | relative_url }}" class="card-link" aria-label="Read {{ post.title }}">
        <div class="card-content">
          <div class="card-date">{{ post.date | date: "%B %-d, %Y" }}</div>
          <h2 class="card-title">{{ post.title }}</h2>
          <div class="card-description">{{ post.excerpt | strip_html | truncatewords: 40 }}</div>
        </div>
        <span class="card-arrow" aria-hidden="true">&rarr;</span>
      </a>
    </article>
    {% endfor %}
  </div>
</div>

<script src="{{ '/assets/js/fae-download.js' | relative_url }}" defer></script>
