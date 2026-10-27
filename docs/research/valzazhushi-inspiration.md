# valzazhushi.com — what to borrow for Leaf

Source: https://valzazhushi.com/ (architecture and interiors portfolio), crawled with Playwright on 2026-10-27.
Pages crawled: `/`, `/projects/`, `/studio/`, `/contact/`, two project pages, `/sq/`.

## Stack (and why it matters)

- Astro, same as Leaf, with `ClientRouter` (view transitions) and the prefetch script.
- **No GSAP, no Lenis, no animation library.** All motion is about 5 KB of vanilla JS plus CSS transitions. Native scroll is kept; the scrollbar is custom.
- Fonts: **Marcellus** (display serif) and **Figtree** (body), self-hosted woff2.
- i18n through `/sq/` and `/de/` route prefixes.

## Design tokens (copy as-is, then re-colour)

```css
--ease: cubic-bezier(.22, 1, .36, 1);        /* easeOutQuint — used for EVERYTHING */
--gutter: clamp(20px, 5vw, 72px);
--section: clamp(96px, 14vw, 200px);          /* vertical rhythm between sections */
--max: 1440px;
--t-xl: clamp(1.75rem, 1.3rem + 1.8vw, 2.75rem);
--t-2xl: clamp(2.25rem, 1.5rem + 3vw, 4rem);
--rule: color-mix(in srgb, var(--ink) 14%, transparent);   /* hairline dividers */
--glass-alpha: .92; --glass-blur-radius: 10px;
```

Palette: stone `#e9e3d7`, ink `#24201c`, bronze accent `#8e5f34` (also `::selection`), patina `#6f8f82`.
The page is ~90% stone/ink with a single dark band in the middle (the disciplines section). Accent colour is used only on hover and selection.

Type: display serif at weight 400, hero `clamp(2.6rem, 1.4rem + 5vw, 6.25rem)`, line-height 1.04, `max-width: 13ch`.
Labels: 12px, weight 500, `letter-spacing: .18em`, uppercase, muted (`--ink-soft` = 62% ink mixed into the background).
Nav: 14px, `letter-spacing: .06em`.

## Animations

| What | How | Numbers |
|---|---|---|
| **Hero image settle** | `@keyframes hero-in`: `scale(1.12)` to `1` on the image | 2.8s, `--ease` |
| **Hero text rise** | `@keyframes rise`: `opacity 0, translateY(24px)` to rest; title delay .3s, footer rule delay .55s | 1.6s, `both` |
| **Scroll cue** | 1px x 28px line after "Scroll", `scaleY(0 → 1)` from the top, infinite | 2.4s |
| **Scroll reveal (fade)** | `[data-reveal]` starts `opacity:0; translateY(28px)`; an IntersectionObserver (`rootMargin: 0 0 -10% 0`) adds `.is-in` once, then unobserves | 1.3s, delay via `--d` |
| **Scroll reveal (mask)** | `[data-reveal=mask]`: `clip-path: inset(100% 0 0)` to `inset(0)`. Images wipe in from the bottom | 1.6s |
| **Stagger** | Inline `--d` on siblings: 0 / .08 / .16 / .24 / .32s (lists), .1s steps (columns) | |
| **Parallax** | `[data-parallax]` images: `translate3d(0, (centerOffset * -factor)px, 0) scale(1.14)` on scroll. Scale hides the edges. Only runs for elements within 200px of the viewport | default factor .1 |
| **Smart header** | `is-scrolled` after the hero; `is-hidden` (`translateY(-100%)`) after scrolling down 64px, shown again after 32px up. Never hidden at the page bottom | .55s |
| **Glass header** | Transparent over the hero, ink-on-stone text swaps to stone-on-photo. After scrolling: 92% stone plus `blur(10px)`. Driven by an `@property --solid` number so the colour and blur animate together | .5s |
| **Disciplines hover** | Hovering or focusing a row swaps the sticky 4:5 image (crossfade plus `scale(1.06 → 1)`), and the row title shifts `translateX(10px)` and tints bronze | .9s / 1.4s |
| **Link underline** | `background-size: 0 → 100%` of a 1px gradient on hover | .5s |
| **Custom scrollbar** | Native hidden; 7px glass thumb (`backdrop-filter: blur(12px) saturate(1.4)`) fades in while scrolling and fades out after .9s idle. Draggable | |
| **Mobile menu** | Full-screen glass panel with large serif links; opacity driven by the `@property --menu` number | .5s |
| **Reduced motion** | Everything above is inside `prefers-reduced-motion: no-preference`, so without JS or with reduced motion, content is simply visible | |

Common thread: **one easing, long durations (1.3–2.8s), small distances (24–28px).** It feels calm because nothing is fast or large.

## Layout ideas

- **Home:** full-height photo hero with the headline bottom-left, a hairline rule above a two-part footer row (caption left, "Scroll" cue right). Intro paragraph with an offset overlapping image pair. Four selected projects alternating image left/right (about 60/40 split) with a small label, title, one-line blurb and "View project" underline link. Dark band. Pull quote over a darkened photo. Four-column process with roman numerals. Closing CTA headline that is itself the email link.
- **Projects:** big title plus filter row (`aria-pressed` buttons with a live count). The grid cycles shapes: wide, tall + tall, wide-flipped. Filtering re-runs the cycle so the layout never leaves holes.
- **Project page:** full-bleed hero with the title at the bottom-left, a metadata column beside a large lead paragraph, then mixed image sizes with tiny uppercase captions, ending in a "Next project" banner.
- **Studio:** the approach as three short columns, then drawings and technical sheets treated as content.
- **Footer:** dark, large wordmark, three tiny uppercase columns (Index / Contact / Language).
- No form, no stats, no badges. The email address is the whole call to action.

## Translating to Leaf

Leaf's current page is dark, small and well-organised; this site's strength is **pacing and restraint**. Concrete steps, roughly ordered by value for effort:

1. **Adopt the motion system wholesale.** One `--ease`, `data-reveal` plus the IntersectionObserver, `--d` stagger, long 1.3s durations. About 40 lines of JS, no dependency. Leaf already ships gsap, motion and animejs; none are needed for this.
2. **Hero entrance:** headline `rise` (1.6s, .3s delay), supporting copy and buttons at .55s. Replace the static logo with a slow `scale(1.12 → 1)` settle on a hero visual.
3. **Mask reveals** for product screenshots instead of fades. A clip-path wipe on a UI screenshot looks deliberate.
4. **The "How Leaf works" accordion → disciplines-style list.** Hover or focus a step (Apply … Collect) and a sticky panel beside the list crossfades to that step's screen, with the step title nudging 10px. Same interaction, and it fits the six-step flow.
5. **Smart glass header** with the hide-on-scroll-down, show-on-scroll-up behaviour and the transparent-to-blurred transition over the hero.
6. **Labels and hairlines:** replace boxes and cards with `--rule` dividers and uppercase letter-spaced labels. Leaf already leans this way.
7. **Larger section spacing** (`--section`: 96–200px) and an oversized display line per section. Leaf's sections are fairly tight by comparison.
8. **Make the closing CTA headline the link**, with a color-only hover (`.5s`). Keep the form, but with the same underline-only inputs.
9. **Optional polish:** custom glass scrollbar, parallax on one image only (factor .1), view transitions through Astro's `ClientRouter` if Leaf gains more pages.

Things not to copy: the warm beige palette and serif (Leaf is a fintech product; keep its dark theme and sans, or pick a serif only for display headlines), and the photo-led layout (Leaf needs product visuals instead of interiors).

## Raw capture

Scratchpad (not in repo): full-page screenshots, hero filmstrip (150 ms to 3 s), header states, disciplines hover, mobile menu, `home.html`, the two CSS files and the Base script. Re-run with the scripts if needed.
