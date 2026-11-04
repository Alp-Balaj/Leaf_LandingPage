# Leaf Landing Page

The page a Leaf QR code opens. Built with [Astro](https://astro.build) as a static single page, with [GSAP](https://gsap.com) for the scroll-driven lifecycle scene.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

Requires Node 22.22 or later. Pushing to `main` deploys to Railway.

## Layout

- `src/pages/index.astro` assembles the page from the components in `src/prototypes/quiet-stone/`: header, hero (the animated lifecycle loop in `hero-bg/`), statement, the "How Leaf works" scene, pace, borrowers, quote, controls, demo form and footer. `styles.css` holds the shared styles and `motion.ts` the platform-only motion (reveals, glass header, parallax, custom scrollbar, mobile menu).
- `lifecycle-full/` is the six-stage scene: on a mouse-driven screen above 900px it pins and scrubs across the Leaf screenshots in `src/assets/lifecycle/` (`scrub.ts`); on phones, touch screens and under reduced motion it becomes stacked snap pages. Stage copy lives in `lifecycle-stages.ts`, card placement and phone crops in `lifecycle-full/screens.ts`.
- `public/` holds the brand marks, the two dashboard screenshots behind the quote and the favicon.

## Before launch

- Point the demo form (`src/prototypes/quiet-stone/Demo.astro`) at a real endpoint. It posts nowhere yet and only shows the thank-you message.
