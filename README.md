# ENDTECH AI SOLUTIONS — Corporate Website

**Engineering Intelligence. Building the Future.**

A modern, responsive, multi-page corporate website for ENDTECH AI SOLUTIONS — an African
technology company specializing in AI Engineering, Software Development, Cybersecurity,
Automation, Digital Solutions and Risk Management.

---

## Tech Stack

| Layer      | Technology                                             |
|------------|--------------------------------------------------------|
| Markup     | HTML5 (semantic, SEO-friendly, accessible)             |
| Styling    | CSS3 (custom design system in `css/style.css`)         |
| Framework  | Bootstrap 5.3 (grid, navbar, modal, forms) — via CDN   |
| Icons      | Bootstrap Icons 1.11 — via CDN                          |
| Fonts      | Google Fonts: Space Grotesk (headings), Inter (body)   |
| Logic      | Vanilla JavaScript (ES5-safe, modular, no frameworks)  |

No React / Vue / Angular / Tailwind — intentionally dependency-light and easy to maintain.

## File Structure

```
ENDTECH-AI-SOLUTIONS/
├── index.html                  # Home: hero, capabilities, services, process, CTA
├── about.html                  # About: story, mission, vision, values, stats
├── services.html               # Services: 6 services + category filtering
├── solutions.html              # Solutions: ENDSELL AI, management systems, AI assistants
├── projects.html               # Portfolio: 3 projects + detail modals
├── ai.html                     # AI & Automation capability page
├── cybersecurity.html          # Security services, dashboard visual, engagement model
├── software-development.html   # Custom software: scope, stack capabilities, delivery
├── risk-management.html        # Risk services + risk matrix visual
├── contact.html                # Contact form (JS validation) + info placeholders
├── privacy.html                # Privacy Policy
├── terms.html                  # Terms & Conditions
│
├── css/
│   └── style.css               # Complete design system (dark + light themes)
│
├── js/
│   ├── main.js                 # Theme, navbar, reveal, counters, filters, modal, UX
│   ├── animations.js           # Hero node-network canvas + code typewriter
│   └── validation.js           # Contact form validation (uses secure-backend placeholder)
│
├── assets/
│   ├── images/                 # Add real images / og-cover.png here
│   ├── icons/                  # Custom icons if needed
│   └── logo/                   # Logo files (currently: inline CSS/SVG logo)
│
└── README.md
```

## Running Locally

No build step required.

```bash
# Option 1: just open index.html in a browser

# Option 2 (recommended, clean URLs & correct relative paths):
npx serve .          # or
python3 -m http.server 8000
```

Then visit `http://localhost:8000` (or the printed port).

## Customization Checklist

Replace the clearly marked placeholders before going live:

1. **Domain** — search for `endtech-ai.example.com` and replace all canonical/OG URLs.
2. **Contact details** — phone, WhatsApp, email and location on `contact.html`
   (each is marked with a "Placeholder" note).
3. **Social links** — footer & contact page `href="#"` links → real profile URLs.
4. **OG image** — add `assets/images/og-cover.png` (1200×630 recommended).
5. **Statistics** — counters on `index.html` / `about.html` (`data-count` attributes).
6. **Form backend** — `js/validation.js` contains a marked `fetch("/api/contact", …)`
   placeholder. Wire it to a **secure server endpoint** that sanitizes input,
   rate-limits and holds any API keys. **Never** put secrets in frontend JS.

## Features

- Sticky glassmorphic navbar with mobile hamburger menu
- Animated hero: AI node-network canvas, terminal-style code panel, typewriter
- Scroll-reveal animations (IntersectionObserver) with staggered delays
- Animated stat counters on scroll into view
- Dark / light theme toggle, persisted via localStorage (preference only)
- Services category filtering
- Project detail modals (Bootstrap) populated from in-page `<template>` blocks
- Contact form validation: required fields, email & phone format, message length
- Floating back-to-top button + lightweight preloader
- Accessibility: skip link, ARIA labels, focus-visible styles, `prefers-reduced-motion`
- SEO: unique titles/descriptions, Open Graph, Twitter cards, canonical URLs,
  one primary H1 per page, semantic landmarks

## Security Notes

- No API keys, passwords or secrets anywhere in the frontend.
- localStorage is used **only** for the theme preference key `endtech-theme`.
- Contact form submission is a client-side demo until the marked backend endpoint
  is connected.
- External resources are loaded from reputable CDNs (Bootstrap, Google Fonts, jsDelivr).

## Browser Support

Latest Chrome, Firefox, Edge and Safari (mobile & desktop). CSS uses widely supported
features with graceful fallbacks; JS is framework-free with IntersectionObserver guards.

---

© 2026 ENDTECH AI SOLUTIONS. All rights reserved.
