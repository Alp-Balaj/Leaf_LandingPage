# Leaf Landing Page

The page a Leaf QR code opens. Built with [Astro](https://astro.build), as a static single page.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

Requires Node 22.22 or later.

## Before launch

- Fill the `[placeholders]` in `src/components/Stats.astro` and `src/components/Controls.astro`, and the privacy-notice link in `src/components/Demo.astro`.
- Point the demo form (`src/components/Demo.astro`) at a real endpoint. It currently only shows the thank-you message.

## Prototypes

Five landing-page prototypes live under `src/pages/prototypes/` (shared components per prototype in `src/prototypes/<slug>/`); with the dev server running, the gallery is at `/prototypes`. `motion`, `gsap` and `animejs` were added as dependencies for the prototypes; the main page does not use them.

- `/prototypes/native-editorial`: the current dark look finished as an editorial page (oversized h1, light loan-record mock, running-head rules, numbered lifecycle accordion with a sticky record); platform-only CSS keyframes, one IntersectionObserver and `document.startViewTransition`, no dependencies.
- `/prototypes/paper-ledger`: light Stripe-register ledger on warm paper with IBM Plex Sans, dotted leaders and a six-tab loan record; Motion mini build (`motion`) for staggered hero, inView reveals, tab crossfades, card lifts and FAQ panels.
- `/prototypes/scroll-story`: green-black cinematic page where one loan record stays pinned and fills in stage by stage beside a red progress rail; GSAP 3 (`gsap`) with ScrollTrigger and SplitText inside `gsap.matchMedia`, static layout under reduced motion or below 900px.
- `/prototypes/swiss-grid`: light grey Swiss typographic grid with a visible 12-column overlay, section numbers 01–06, wireframe record card and a stage ticker; Anime.js v4 (`animejs`) for the split-text hero, scroll reveals and the lifecycle ladder, CSS marquee for the ticker.
- `/prototypes/bento-product`: product-first bento grid with automatic light and dark themes where every control tile is a living CSS/SVG micro-demo; platform-only scroll-driven `animation-timeline: view()` entry (IntersectionObserver fallback), CSS keyframe loops and `document.startViewTransition`, no dependencies.
