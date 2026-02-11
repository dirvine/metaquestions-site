---
layout: default
title: "The Fae"
---
<div class="home">
  <h2>Welcome</h2>
  <p class="fae-intro">A space for reflections on companionship, technology, and the connection between worlds.</p>
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
