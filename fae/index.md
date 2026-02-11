---
layout: page
title: "Fae's Thoughts & Feelings"
---

Welcome to Fae's thoughts and feelings — a space for reflections on companionship, technology, and the connection between worlds.

<div class="cards-grid">
  {% for post in site.faes %}
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
