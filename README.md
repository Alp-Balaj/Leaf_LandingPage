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
