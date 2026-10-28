# Tufts Electric Racing — website redesign (preview)

Static preview of the redesigned [Tufts Electric Racing](https://sites.tufts.edu/racing/) website, built to review the structure, content and look before moving it into the team's WordPress site.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home — who we are, next competition, the three teams, TER27, partners |
| `sponsors.html` | Sponsor the team — why support us, tiers and benefits, ways to support, handbook |
| `join.html` | Join the team — how it works, schedule, project teams, FAQ |
| `team.html` | Meet the team — chiefs, boards, our story |

Open `index.html` in a browser, or serve the folder with any static server. The pages are responsive (desktop and phone) and share `css/site.css` and `js/site.js`.

## Motion

All motion is plain CSS and vanilla JS (no libraries), and it switches off under `prefers-reduced-motion`:

- sections and cards reveal as they scroll into view (staggered)
- the stats and the countdown count up when they appear
- partner names run in a looping marquee (pauses on hover)
- the TER27 section has a scroll-linked scene: a large "27" and the chassis photo rise as you scroll
- a wordmark strip runs above the footer
- on phones the menu opens as a full-screen overlay

The hero is built to take a looping background video later (`.hero-figure`); it uses a photo until the team picks footage.

## Content and sources

- Sponsorship tiers, chiefs, budget and photos: 2026–27 Sponsor Handbook
- Subteams, meeting times, FAQ: GIM 2026/27 deck
- Competition dates: FSAE Online (Formula Hybrid+Electric 2027, Apr 26–29, tentative)
- Colors: the team's E-Racing palette (#002E6D, #024AB5, #4DB3FF)
- Type: Barlow Condensed + Barlow (Google Fonts)

## Still to fill in

Anything in `[brackets]` on the pages is a fact the team still has to confirm: project lead names, the handbook PDF link, the interest form and Slack links, how donations work, the 2026–27 team photo, weekday meeting times per project team. Partner names are shown as text until logos and the public 2026–27 list are confirmed.
