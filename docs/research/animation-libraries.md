# Animation libraries for the Leaf landing page

Researched 2026-10-26 against primary sources only (official docs, GitHub, npm registry, license texts, MDN/caniuse, WebKit/Mozilla release notes). Bundle sizes marked **measured** were produced locally with esbuild (`--bundle --minify --format=esm --target=es2022`, gzip level 9) against the exact versions listed; vendor-stated numbers are quoted separately. Anything not confirmed from a primary source is marked **unverified**.

Page context (given, not re-investigated): Astro 7.4.1, single page, no islands, vanilla TS in `<script>` tags, `html { scroll-behavior: smooth }` plus a `prefers-reduced-motion` override already in `global.css`. Four concrete needs: (a) hero text reveal, (b) scroll-triggered section reveals, (c) "25%" count-up, (d) Lifecycle accordion height animation.

## Summary and recommendation

Ranked for **this** page (four small effects on a single, dark, minimal marketing page):

1. **Native first (zero dependencies).** All four needs are covered by platform features that are Baseline or near-Baseline today: CSS keyframes with `animation-delay` for the hero stagger (a); `IntersectionObserver` toggling a class for one-shot reveals (b); a ~25-line `requestAnimationFrame` count-up started from the same observer (c); and a `grid-template-rows: 0fr -> 1fr` transition (works everywhere) or `Element.animate()` on `height` for the accordion (d). The existing `prefers-reduced-motion` rule in `global.css` gates all of it. See "Native-only" below; it is the baseline against which every library has to justify its bytes.
2. **Motion (`motion/mini` + `inView` + `stagger`) if a library is wanted** -- MIT, measured **4.9 kB gzip** for that exact combo, `inView` is IntersectionObserver-based and fires once by default, `animate` drives WAAPI. It replaces the hand-written observer/stagger code with a uniform API at roughly the cost of one small icon. Per-word text splitting is *not* in the free package (`splitText` is a paid Motion+ feature), so (a) stays line-level or needs a manual word wrap.
3. **Anime.js v4 if word/line-level hero splitting at zero cost is a must** -- MIT, free `splitText` with an accessibility clone, `onScroll` with `repeat: false` for one-shot reveals, `createScope({ mediaQueries })` has a documented reduced-motion pattern. Measured 14.8-22 kB gzip depending on modules. Caveats: a 5.0 beta is on npm, 103 open issues, single sponsor-funded maintainer.
4. **GSAP** -- the most capable (SplitText with `autoSplit`/ARIA, `ScrollTrigger.batch`), and 100% free since 3.13 under Webflow's Standard "No Charge" license. But core + ScrollTrigger + SplitText measured **48.3 kB gzip**, i.e. ~10x the Motion-mini combo, for effects this page can do natively; the license is proprietary (not OSI), with a clause against building Webflow-competing animation tools (irrelevant here, but worth knowing).
5. **AutoAnimate** -- not a fit. Verified in source that it only observes `childList` mutations; toggling `hidden` on the Lifecycle panel triggers nothing.
6. **Lenis** -- skip unless the design brief explicitly wants "smoothed" wheel scrolling. It is not an animation library, it conflicts with the existing `scroll-behavior: smooth` rule (the current stylesheet no longer neutralises it), blocks anchor links unless `anchors: true`, and the page is short.

**Suggested minimal combo:** native CSS + IntersectionObserver for (a)(b)(d) and a rAF counter for (c). If you prefer one API for all four: `motion/mini` + `inView` + `stagger` (~5 kB gzip). Add Anime.js only if word-level hero splitting becomes a requirement. Do not add GSAP, AutoAnimate or Lenis for this page.

## Comparison table

| | Motion | GSAP | Anime.js | Lenis | AutoAnimate | Native CSS/IO |
|---|---|---|---|---|---|---|
| Version / date | 14.6.0, 2026-10-22 ([npm](https://registry.npmjs.org/motion/latest)) | 3.15.0, 2026-04-13 ([npm](https://registry.npmjs.org/gsap/latest)) | 4.5.0, 2026-06-22; `beta` tag 5.0.0-beta.2 2026-08-17 ([npm](https://registry.npmjs.org/animejs)) | 1.3.27, 2026-10-15; `dev` tag 2.0.0-dev.5 ([npm](https://registry.npmjs.org/lenis)) | 0.10.0, 2026-07-10 ([npm](https://registry.npmjs.org/@formkit%2Fauto-animate)) | n/a |
| Size, measured gzip | mini `animate` 3.7 kB; `inView` 0.6 kB; mini+inView+stagger **4.9 kB**; hybrid `animate`+inView+stagger 26.4 kB; +`scroll` 29.1 kB | core 27.7 kB; +ScrollTrigger 45.3 kB; +SplitText **48.3 kB** | animate+stagger 14.8 kB; +splitText 17.6 kB; +onScroll 19.3 kB; all three 22.0 kB | 5.4 kB | 3.2 kB | 0 |
| Vendor-stated size | mini 3.2 kB, hybrid 22 kB, inView 0.5 kB, scroll 3.8 kB ([animate](https://motion.dev/docs/animate), [inView](https://motion.dev/docs/inview), [scroll](https://motion.dev/docs/scroll)) | none stated | "24.50 KB" total, Scroll +4.30, Stagger +0.48 (units unstated, [animejs.com](https://animejs.com/)) | "under 5kb" ([lenis.dev](https://lenis.dev/)) | none stated | -- |
| License | MIT | Standard "No Charge" GSAP License (Webflow, proprietary, free incl. commercial) | MIT | MIT | MIT | -- |
| Maintenance | 11 releases in Oct 2026 alone; 34.6k stars ([GitHub](https://github.com/motiondivision/motion)) | 3 releases in 12 months; 29.8k stars, 7 open issues ([GitHub](https://github.com/greensock/GSAP)) | last stable Jun 2026, v5 betas Aug 2026; 73.9k stars, 103 open issues, sponsor-funded ([GitHub](https://github.com/juliangarnier/anime)) | 1.3.27 Oct 2026, v2 dev builds; 16.9k stars ([GitHub](https://github.com/darkroomengineering/lenis)) | 1 release in 2026; 13.9k stars, 40 open issues ([GitHub](https://github.com/formkit/auto-animate)) | browser vendors |
| Reduced motion | manual, or `scopeMotion({ matchMedia: "reducedMotion" })` | manual via `gsap.matchMedia()` (documented pattern) | manual via `createScope({ mediaQueries })` (documented pattern) | built-in `respectReducedMotion: true` | built-in auto-disable | CSS media query (already in `global.css`) |
| (a) hero reveal | good (no free text split) | excellent (SplitText) | excellent (splitText free) | n/a | no | good (CSS keyframes; manual word split) |
| (b) scroll reveals | excellent (`inView`) | excellent (ScrollTrigger `once`/`batch`) | good (`onScroll` `repeat:false`) | n/a | no | good (IO + class) |
| (c) count-up | good (`animate(0, 25, { onUpdate })`, hybrid only) | good (tween a plain object) | good (animate a JS object) | n/a | no | good (rAF, ~25 lines) |
| (d) accordion height | good (animate `height` px) | good | good | n/a | **no** (ignores `hidden` toggle) | good (grid `0fr/1fr` or WAAPI) |

## 1. Motion (`motion`, vanilla build)

- **Version / release:** 14.6.0 published 2026-10-22; 14.0.0 (2026-10-02) was a breaking release that only removed internal APIs kept for `framer-motion` 13.x compatibility ([npm time](https://registry.npmjs.org/motion), [CHANGELOG](https://github.com/motiondivision/motion/blob/main/CHANGELOG.md)). 14.x added `animateLayout` (14.1), hardware-accelerated independent transforms (14.2), `stagger` `grid`/`from: "edges" | "random"` (14.3), the `drag` gesture for JS (14.4), `scopeMotion` (14.5) and "improved tree-shaking" (14.6).
- **Package shape:** `motion` depends on `framer-motion` and `tslib`; `react`/`react-dom` are peer deps but marked optional in `peerDependenciesMeta`, so npm will not pull React in; `sideEffects: false` ([npm manifest](https://registry.npmjs.org/motion/latest)). Esbuild tree-shook the vanilla entry down to the sizes above, so the React half does not leak into the bundle.
- **License:** MIT ([npm](https://registry.npmjs.org/motion/latest), [GitHub](https://github.com/motiondivision/motion)).
- **Vanilla API:** `animate` in two builds -- `import { animate } from "motion/mini"` ("3.2kb", HTML/SVG via native browser APIs, springs only via the `spring` import, registered CSS variables only) and `import { animate } from "motion"` ("22kb" hybrid: independent transforms, colors, objects, single numbers with `onUpdate`, sequences) ([animate docs](https://motion.dev/docs/animate)). `inView(target, callback, { margin, amount, root })` is "built on the browser's native Intersection Observer API", fires the callback once by default (return a function from the callback to also get leave events), and returns a stop function ([inView docs](https://motion.dev/docs/inview)). `stagger(duration, { startDelay, from, ease })` plugs into `delay` ([stagger docs](https://motion.dev/docs/stagger)). `scroll()` is scroll-linked (not triggered) and uses the browser's `ScrollTimeline` "where possible" ([scroll docs](https://motion.dev/docs/scroll)). `scopeMotion(setup, { transition, matchMedia })` groups animations and can run setup only while a media query matches; it accepts the shorthand `reducedMotion` or a raw `"(prefers-reduced-motion: reduce)"` string ([scopeMotion docs](https://motion.dev/docs/scope-motion)).
- **`splitText` is not in the free package:** "Not included in the free motion package", "splitText is exclusive to Motion+ members", imported from `motion-plus` ([split-text docs](https://motion.dev/docs/split-text)). `motion-plus` 1.5.1 was last published 2025-07-23 ([npm](https://registry.npmjs.org/motion-plus)).
- **Reduced motion:** the documented `MotionConfig reducedMotion` / `useReducedMotion` tools are React-only ([react-accessibility](https://motion.dev/docs/react-accessibility)); for vanilla use `scopeMotion`'s `matchMedia` or a manual `matchMedia` check. Nothing in the vanilla docs disables animations automatically.
- **Astro:** no page on motion.dev mentions Astro (site search returned only third-party guides). Nothing special is needed: import inside a processed `<script>`; the code never runs on the server.
- **Fit:** (a) `animate` + `stagger` on `h1`, lede, CTAs; per-word split must be hand-rolled or paid. (b) `inView` is exactly this. (c) hybrid `animate(0, 25, { duration: 1.2, onUpdate })`; the mini build cannot animate numbers. (d) `animate(panel, { height: [0, panel.scrollHeight + "px"] })` then clear the inline height.

```astro
<script>
  import { animate } from "motion/mini";
  import { inView, stagger } from "motion";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    animate(".hero [data-reveal]", { opacity: [0, 1], transform: ["translateY(12px)", "none"] },
      { duration: 0.6, delay: stagger(0.08) });
    inView("section[data-reveal]", (el) => {
      animate(el, { opacity: [0, 1], transform: ["translateY(16px)", "none"] }, { duration: 0.5 });
    }, { margin: "0px 0px -15% 0px" });
  }
</script>
```

## 2. GSAP

- **Version / release:** 3.15.0 published 2026-04-13 (headline: `easeReverse`, deprecating `yoyoEase`); 3.14.x Dec 2025; 3.13.0 2025-04-30 ([npm time](https://registry.npmjs.org/gsap), [3.15 blog](https://gsap.com/blog/3-15/)).
- **Licensing after the Webflow acquisition:** the 3.13 post states "the entire GSAP toolset is FREE, even for commercial use!", that "all of the bonus plugins have been added to the main GSAP Github repository" and npm, and that Club GSAP ended ([3.13 blog](https://gsap.com/blog/3-13/)). The README says "GSAP is now 100% FREE including ALL of the bonus plugins like SplitText" ([GitHub](https://github.com/greensock/GSAP)); the pricing page says "GSAP is now 100% free for all users, thanks to Webflow's support" ([pricing](https://gsap.com/pricing/)). `ScrollTrigger.js`, `SplitText.js` and `ScrambleTextPlugin.js` ship in the public npm tarball (checked locally in `gsap@3.15.0`).
- **License text:** `package.json` says `Standard 'no charge' license: https://gsap.com/standard-license.`; there is no LICENSE file in the repo root or the npm package ([GitHub API listing](https://api.github.com/repos/greensock/GSAP/contents)). The gsap.com license page renders client-side and could not be fetched as text; the ScanCode LicenseDB mirror of the Standard "No Charge" GSAP License (effective 2025-04-30) shows Webflow as licensor granting "a non-exclusive, worldwide license to use, reproduce, display, and implement GSAP Products" for Permitted Uses "by any person or entity" on "any website, web application, or digital interface", with Prohibited Uses limited to solutions that compete with Webflow's visual animation tools, reverse engineering for Competitive Products, and removing proprietary notices ([ScanCode LicenseDB](https://scancode-licensedb.aboutcode.org/gsap-standard-no-charge-2025.html)). **Unverified:** the live gsap.com text matches the mirror word for word.
- **Sizes (measured):** core 70.1 kB min / 27.7 kB gzip; core + ScrollTrigger 45.3 kB gzip; core + ScrollTrigger + SplitText 48.3 kB gzip. GSAP publishes no official numbers; the docs only say SplitText's 3.13 rewrite is "half the size" of the old one ([SplitText docs](https://gsap.com/docs/v3/Plugins/SplitText/)). `sideEffects: false`, but plugins must be imported from `gsap/ScrollTrigger` etc. and registered with `gsap.registerPlugin()` or the bundler may drop them ([Installation](https://gsap.com/docs/v3/Installation/)).
- **Relevant features:** ScrollTrigger `once: true` ("play once when scrolling forward and never get reset or replayed"), `toggleActions`, `scrub`, `ScrollTrigger.batch(targets, vars)` whose `onEnter` receives an array of elements for a staggered group reveal ([ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [batch](https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.batch()/)). SplitText splits chars/words/lines, `autoSplit` re-splits after font load or width change (create tweens inside `onSplit`), and `aria: "auto"` (default) adds an `aria-label` to the split element and `aria-hidden` to the fragments ([SplitText docs](https://gsap.com/docs/v3/Plugins/SplitText/)).
- **Reduced motion:** documented via `gsap.matchMedia()` with `"(prefers-reduced-motion: reduce)"` / `no-preference` handlers; everything created inside a handler is reverted automatically when the query stops matching ([matchMedia docs](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/)).
- **Astro:** no official docs page; the forum threads on Astro are user Q&A ([forum 39684](https://gsap.com/community/forums/topic/39684-gsap-astro/)). Importing in a processed `<script>` is enough; just never import GSAP in frontmatter (server side).
- **Fit:** all four needs trivially, and (a) is best-in-class thanks to SplitText's accessibility handling, but at ~45-48 kB gzip for a page that needs four modest effects.

```astro
<script>
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.from(".hero [data-reveal]", { y: 12, opacity: 0, stagger: 0.08, duration: 0.6 });
    ScrollTrigger.batch("section[data-reveal]", {
      once: true, start: "top 85%",
      onEnter: (els) => gsap.from(els, { y: 16, opacity: 0, stagger: 0.1 }),
    });
  });
</script>
```

## 3. Anime.js v4

- **Version / release:** stable `latest` is 4.5.0 (2026-06-22, adapter API + Three.js adapter); 4.4.0 (2026-04-29) added `scrambleText` and had breaking transform-order changes; 4.0.0 shipped 2025-04-03; `splitText` moved to the `animejs/text` subpath in 4.2.0 (2025-09-29). npm also carries `5.0.0-beta.1/2` under the `beta` dist-tag (Aug 2026); no GitHub release notes exist for them, so their content is **unverified** ([npm time](https://registry.npmjs.org/animejs), [GitHub releases](https://github.com/juliangarnier/anime/releases), [splitText docs](https://animejs.com/documentation/text/splittext)).
- **License / maintainer:** MIT; Julian Garnier, 73.9k stars, 103 open issues, GitHub-Sponsors funded ([GitHub](https://github.com/juliangarnier/anime), [npm](https://registry.npmjs.org/animejs/latest)).
- **Module API:** ESM with subpath exports (`./text`, `./scope`, `./utils`, `./waapi`, `./engine`, `./animation`, `./timeline`, ...) and `sideEffects` only on adapters ([npm manifest](https://registry.npmjs.org/animejs/latest)); `import { animate, stagger } from 'animejs'` is the README pattern. Homepage: "Keep your bundle size small by only importing the parts you need", with a module table totalling "24.50 KB" (Timer 5.60, Animation +5.20, Scroll +4.30, Stagger +0.48, WAAPI 3.50; unit of measure not stated) ([animejs.com](https://animejs.com/)). **Measured:** animate+stagger 14.8 kB gzip; + `splitText` 17.6 kB; + `onScroll` 19.3 kB; all three 22.0 kB.
- **ScrollObserver (`onScroll`):** set as `autoplay: onScroll({...})` with `container`, `target`, `axis`, `enter`/`leave` thresholds (defaults `'end start'` / `'start end'`), `repeat` (default `true`; `false` reverts the observer after the linked object completes, i.e. one-shot), `sync` modes: method-name string (default `'play pause'`, `'play'` for enter-only), `true`/`1` for scrubbed progress, plus smooth and eased modes; callbacks `onEnter`, `onLeave`, `onUpdate`, `onResize` ([settings](https://animejs.com/documentation/events/onscroll/scrollobserver-settings/), [repeat](https://animejs.com/documentation/events/onscroll/scrollobserver-settings/repeat), [method names](https://animejs.com/documentation/events/onscroll/scrollobserver-synchronisation-modes/method-names), [playback progress](https://animejs.com/documentation/events/onscroll/scrollobserver-synchronisation-modes/playback-progress)). Whether it uses IntersectionObserver or scroll events is **unverified**.
- **Text:** `splitText(target, { lines, words, chars, accessible, includeSpaces, debug })` returns a `TextSplitter` with `.lines/.words/.chars`, `addEffect()`, `refresh()`, `revert()`; `accessible` (default `true`) "Creates an accessible cloned element that preserves the structure of the original split element" ([splitText](https://animejs.com/documentation/text/splittext), [accessible](https://animejs.com/documentation/text/splittext/textsplitter-settings/accessible)).
- **Reduced motion:** documented pattern -- `createScope({ mediaQueries: { reduceMotion: '(prefers-reduced-motion)' } }).add(self => { ... duration: self.matches.reduceMotion ? 0 : 1250 })` ([mediaQueries](https://animejs.com/documentation/scope/scope-parameters/mediaqueries)).
- **Astro:** no official page; plain `<script>` import works. Docs header still labels the version selector "4.0.0" while npm is at 4.5.0.
- **Fit:** (a) best free option for word/line splitting; (b) `onScroll({ repeat: false, sync: 'play' })`; (c) animate a plain object (`animate({ n: 0 }, { n: 25, onUpdate })`); (d) animate `height`.

```astro
<script>
  import { animate, stagger, onScroll, createScope } from "animejs";
  import { splitText } from "animejs/text";
  createScope({ mediaQueries: { reduce: "(prefers-reduced-motion: reduce)" } }).add(({ matches }) => {
    if (matches.reduce) return;
    const { words } = splitText(".hero h1", { words: true });
    animate(words, { opacity: [0, 1], y: ["0.4em", 0], delay: stagger(40), duration: 600 });
    document.querySelectorAll("section[data-reveal]").forEach((el) =>
      animate(el, { opacity: [0, 1], y: [16, 0], duration: 500,
        autoplay: onScroll({ target: el, enter: "bottom top+=15%", repeat: false, sync: "play" }) }));
  });
</script>
```

## 4. Lenis (smooth scroll)

- **Version / release:** 1.3.27 published 2026-10-15; `2.0.0-dev.0..5` on the `dev` tag (Aug-Sep 2026) ([npm time](https://registry.npmjs.org/lenis)). MIT, darkroom.engineering, 16.9k stars ([GitHub](https://github.com/darkroomengineering/lenis)).
- **Size:** "under 5kb" claimed ([lenis.dev](https://lenis.dev/)); **measured** 18.5 kB min / 5.4 kB gzip for `new Lenis({ autoRaf: true, anchors: true })`. Zero runtime dependencies ([README](https://github.com/darkroomengineering/lenis)).
- **What it is:** a wheel/touch interpolation layer over native scroll ("no CSS transforms, no hijacked scrollbars"), not an animation library; it provides no reveal, stagger or counter primitives.
- **Caveats verified from the README:** "By default, Lenis will prevent anchor links from working while scrolling" -- pass `anchors: true` (or a `ScrollToOptions` object) to re-enable them; `autoRaf` defaults to `false` (you must run `lenis.raf(time)` yourself or set `autoRaf: true`); CSS scroll-snap is unsupported (`lenis/snap`); Safari is capped at 60 fps; smooth scroll stops over iframes; `syncTouch` is unstable on iOS < 16; nested scrollers need `data-lenis-prevent` or `allowNestedScroll` ([README](https://github.com/darkroomengineering/lenis)).
- **`scroll-behavior: smooth`:** Lenis 1.1.18's stylesheet contained `.lenis.lenis-smooth{scroll-behavior:auto!important}` ([unpkg lenis@1.1.18](https://unpkg.com/lenis@1.1.18/dist/lenis.css)); the 1.3.27 stylesheet no longer has that rule (it only sets `html.lenis { height: auto }`, `overflow: clip` while stopped, `overscroll-behavior: contain` on prevented elements, and iframe `pointer-events: none`) (checked locally in `lenis@1.3.27/dist/lenis.css`). The current README does not mention `scroll-behavior` at all. So with the existing `html { scroll-behavior: smooth }` in `global.css`, native and Lenis smoothing would both apply to anchor jumps; **unverified** how 1.3.27 behaves in that case -- remove or override the rule if Lenis is adopted.
- **Reduced motion:** built in. `respectReducedMotion: true` by default: smoothing is disabled (`lerp` forced to 1), programmatic scrolls become instant, the instance keeps running for WebGL sync, and the preference is tracked live via `lenis.prefersReducedMotion` ([README](https://github.com/darkroomengineering/lenis)).
- **GSAP:** the README ships the canonical ScrollTrigger hookup (`lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(t => lenis.raf(t * 1000))`, `gsap.ticker.lagSmoothing(0)`); GSAP's docs point to `scrollerProxy()` for third-party smooth scrollers and do not name Lenis ([ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)).
- **Astro:** `import Lenis from "lenis"; import "lenis/dist/lenis.css";` inside a `<script>`; the CSS import is bundled by Vite.
- **Fit:** none of (a)-(d). Only worth it if the brief wants the inertial "feel"; it adds a wheel-interception layer on a page that already has native smooth anchor scrolling.

## 5. AutoAnimate (`@formkit/auto-animate`)

- **Version / release:** 0.10.0 published 2026-07-10 (previous: 0.9.0 Sep 2025, 0.8.2 Apr 2024) ([npm time](https://registry.npmjs.org/@formkit%2Fauto-animate)). MIT; FormKit; 13.9k stars, 40 open issues ([GitHub](https://github.com/formkit/auto-animate)). **Measured** 7.9 kB min / 3.2 kB gzip.
- **What it does:** "a single function -- `autoAnimate` -- that accepts a parent element"; animations trigger only when an immediate child is **added, removed, or moved**; the parent receives `position: relative` if static; flex children with `flex-grow: 1` are a known weak spot ([docs](https://auto-animate.formkit.com/)). Defaults from source: `{ duration: 250, easing: "ease-in-out" }`, option `disrespectUserMotionPreference` ("It is not recommended to use this"); the controller exposes `enable()/disable()/isEnabled()` ([src/index.ts](https://raw.githubusercontent.com/formkit/auto-animate/master/src/index.ts)).
- **Reduced motion:** built in -- it checks `window.matchMedia("(prefers-reduced-motion: reduce)")` and disables itself ([docs](https://auto-animate.formkit.com/), [source](https://raw.githubusercontent.com/formkit/auto-animate/master/src/index.ts)).
- **Accordion verdict:** the per-parent observer is created with `mo.observe(el, { childList: true })` -- no `attributes`, no `subtree`; the Resize/IntersectionObservers only refresh cached coordinates. Toggling `hidden` on the panel therefore produces **no** animation. It would only work if the panel node were physically inserted/removed, which fights the current `aria-expanded` + `hidden` pattern and keeps collapsed content out of the DOM.
- **Fit:** (d) only with a DOM-insert rewrite; nothing for (a)(b)(c). Not recommended here.

## 6. Native-only: how far CSS + IntersectionObserver gets

Support figures from caniuse (global usage as of fetch) and MDN; version numbers are first supporting release.

| Feature | Chrome/Edge | Firefox | Safari | Global | Baseline |
|---|---|---|---|---|---|
| Web Animations API (`Element.animate`) | 84 | 75 | 13.1 | 97.2% ([caniuse](https://caniuse.com/web-animation)) | Widely available since March 2020 ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate)) |
| `@starting-style` | 117 | 129 | 17.5 | 93.05% ([caniuse](https://caniuse.com/mdn-css_at-rules_starting-style)) | Baseline 2024 (Aug 2024) ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style)) |
| View Transitions, same-document | 111 | 144 | 18.0 | 92.9% ([caniuse](https://caniuse.com/view-transitions)) | -- |
| `::details-content` | 131 | 143 | 18.4 | 89.46% ([caniuse](https://caniuse.com/mdn-css_selectors_details-content)) | Baseline 2025 (Sep 2025) ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/::details-content)) |
| `@view-transition` (cross-document) | 126 | none | 18.2 | 87.9% ([caniuse](https://caniuse.com/mdn-css_at-rules_view-transition)) | -- |
| `animation-timeline: scroll()/view()` | 115 | **159, ships 2026-10-27** | 26.0 | 87.84% ([caniuse](https://caniuse.com/mdn-css_properties_animation-timeline)) | "Limited availability", not Baseline ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline)) |
| `interpolate-size: allow-keywords` | 129 | none | none (through 27.2) | 71.74% ([caniuse](https://caniuse.com/mdn-css_properties_interpolate-size)) | not Baseline, experimental ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/interpolate-size)) |

- **Scroll-driven animations:** Safari 26.0 shipped them as a headline feature with an `animation-timeline: view()` + `animation-range` card example ([WebKit: Safari 26.0 features](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/)); the June 2025 WebKit guide (then "Safari 26 beta") recommends wrapping them in a reduced-motion media query ([WebKit guide](https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/)). Firefox 159 "ships on October 27, 2026" with "Scroll-driven animations are now enabled by default" ([MDN Firefox 159](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/159)), i.e. the day after this research; Firefox 158 and earlier do not support them, so a CSS-only `view()` reveal needs a no-animation fallback (unsupported browsers simply show the final state if you author the keyframes with `animation-fill-mode: both` and keep the element visible by default). Note that `view()` timelines are *scrubbed* -- scrolling back up reverses the reveal -- which is why one-shot reveals are better served by IntersectionObserver. Chrome's guide confirms these run off the main thread ([Chrome docs](https://developer.chrome.com/docs/css-ui/scroll-driven-animations)).
- **(a) Hero reveal, zero JS:** CSS keyframes on `[data-reveal]` children with incremental `animation-delay`; word-level splitting means wrapping words in `<span>` at build time in the `.astro` template (Astro renders on the server, so the split costs nothing at runtime). Add `aria-label` on the heading if you split it, mirroring what SplitText/Anime.js do.
- **(b) Section reveals:** one `IntersectionObserver` with `rootMargin: "0px 0px -15% 0px"`, add `.is-in`, `unobserve`. CSS does the transition. This is the same mechanism Motion's `inView` wraps ([inView docs](https://motion.dev/docs/inview)).
- **(c) Counter:** same observer starts a `requestAnimationFrame` loop that eases 0 -> 25 over ~1.2 s and writes `textContent`; keep the final "25%" in the HTML so it is correct without JS. A CSS-only `@property` + `counter()` approach exists but renders in a pseudo-element; **unverified** here and not recommended for a headline stat.
- **(d) Accordion:** keep the button + `aria-expanded` + `hidden` semantics for a11y but animate the panel with `grid-template-rows: 0fr -> 1fr` on a wrapper (works in every browser that supports grid; remove `hidden` first, then flip the class), or `panel.animate([{ height: 0 }, { height: panel.scrollHeight + "px" }], { duration: 250, easing: "ease-out" })` via WAAPI (97.2%). `interpolate-size: allow-keywords` would make `height: auto` transitions one line of CSS but is Chromium-only today, so use it only as progressive enhancement. Switching to `<details>` would unlock `::details-content` + `transition-behavior: allow-discrete` fades (Baseline 2025) at the cost of rewriting the component.
- **Demo form -> thank-you swap:** `document.startViewTransition(() => swapBlocks())` with a `view-transition-name` on the card gives a cross-fade/morph in 92.9% of browsers and degrades to an instant swap elsewhere ([MDN View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)).
- **Reduced motion:** the existing `prefers-reduced-motion` override in `global.css` covers CSS animations/transitions; gate the rAF counter and WAAPI calls with `matchMedia("(prefers-reduced-motion: reduce)").matches`.

```astro
<script>
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add("is-in");
      if (e.target.matches("[data-count]")) countUp(e.target as HTMLElement);
      io.unobserve(e.target);
    }
  }, { rootMargin: "0px 0px -15% 0px" });
  document.querySelectorAll("[data-reveal], [data-count]").forEach((el) => io.observe(el));

  function countUp(el: HTMLElement) {
    const end = Number(el.dataset.count), t0 = performance.now(), dur = reduce ? 0 : 1200;
    const tick = (t: number) => {
      const p = dur ? Math.min(1, (t - t0) / dur) : 1, eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * eased) + "%";
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
</script>
```

## Astro specifics

- Processed `<script>` tags (no attributes other than `src`) are TypeScript by default, bundle local files and npm modules, become `type="module"`, are deduplicated so a component used N times ships its script once, and small ones are inlined; `is:inline` opts out of all processing ([Astro client-side scripts](https://docs.astro.build/en/guides/client-side-scripts/)). Frontmatter "runs on the server and is not available in the browser", so never import a DOM-touching library in frontmatter -- only inside `<script>`. No `client:` directive is involved because none of these are framework islands.
- `<ClientRouter />` from `astro:transitions` still exists in the current docs and Astro 7; the 7.0 upgrade guide only removes the deprecated `astro:transitions` constants/helpers (`TRANSITION_BEFORE_PREPARATION`, `isTransitionBeforeSwapEvent()`, `createAnimationScope()`, ...) in favour of string event names such as `astro:after-swap` ([Astro 7 upgrade guide](https://docs.astro.build/en/guides/upgrade-to/v7/)). The view-transitions guide says browser-native cross-document transitions "can be used in Astro to animate the navigation between documents" and that `<ClientRouter />` "will increasingly become unnecessary" ([Astro view transitions](https://docs.astro.build/en/guides/view-transitions/)). For a single page there is no navigation to transition, so skip `<ClientRouter />`; without it, bundled module scripts simply run once on load and none of the `astro:page-load` re-initialisation concerns apply.
- Neither motion.dev nor gsap.com has an Astro-specific documentation page (searches returned only third-party guides and forum threads).

## Sources

- npm registry manifests and publish times: [motion](https://registry.npmjs.org/motion/latest), [motion-plus](https://registry.npmjs.org/motion-plus), [gsap](https://registry.npmjs.org/gsap/latest), [animejs](https://registry.npmjs.org/animejs/latest), [lenis](https://registry.npmjs.org/lenis/latest), [@formkit/auto-animate](https://registry.npmjs.org/@formkit%2Fauto-animate/latest) (dates via `npm view <pkg> time`).
- Motion docs: [quick start](https://motion.dev/docs/quick-start), [animate](https://motion.dev/docs/animate), [inView](https://motion.dev/docs/inview), [stagger](https://motion.dev/docs/stagger), [scroll](https://motion.dev/docs/scroll), [scopeMotion](https://motion.dev/docs/scope-motion), [splitText (Motion+)](https://motion.dev/docs/split-text), [React accessibility](https://motion.dev/docs/react-accessibility), [CHANGELOG](https://github.com/motiondivision/motion/blob/main/CHANGELOG.md), [GitHub](https://github.com/motiondivision/motion).
- GSAP: [3.13 release post](https://gsap.com/blog/3-13/), [3.15 release post](https://gsap.com/blog/3-15/), [pricing](https://gsap.com/pricing/), [Installation](https://gsap.com/docs/v3/Installation/), [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [ScrollTrigger.batch](https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.batch()/), [SplitText](https://gsap.com/docs/v3/Plugins/SplitText/), [gsap.matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/), [GitHub](https://github.com/greensock/GSAP), [repo root listing](https://api.github.com/repos/greensock/GSAP/contents), [Standard "No Charge" GSAP License text (ScanCode LicenseDB mirror)](https://scancode-licensedb.aboutcode.org/gsap-standard-no-charge-2025.html).
- Anime.js: [homepage](https://animejs.com/), [documentation](https://animejs.com/documentation/), [splitText](https://animejs.com/documentation/text/splittext), [accessible](https://animejs.com/documentation/text/splittext/textsplitter-settings/accessible), [ScrollObserver settings](https://animejs.com/documentation/events/onscroll/scrollobserver-settings/), [repeat](https://animejs.com/documentation/events/onscroll/scrollobserver-settings/repeat), [sync: method names](https://animejs.com/documentation/events/onscroll/scrollobserver-synchronisation-modes/method-names), [sync: playback progress](https://animejs.com/documentation/events/onscroll/scrollobserver-synchronisation-modes/playback-progress), [scope mediaQueries](https://animejs.com/documentation/scope/scope-parameters/mediaqueries), [GitHub](https://github.com/juliangarnier/anime), [releases](https://github.com/juliangarnier/anime/releases).
- Lenis: [GitHub README](https://github.com/darkroomengineering/lenis), [lenis.dev](https://lenis.dev/), [lenis@1.1.18 CSS](https://unpkg.com/lenis@1.1.18/dist/lenis.css), [lenis@1.3.27 README](https://unpkg.com/lenis@1.3.27/README.md).
- AutoAnimate: [docs](https://auto-animate.formkit.com/), [src/index.ts](https://raw.githubusercontent.com/formkit/auto-animate/master/src/index.ts), [GitHub](https://github.com/formkit/auto-animate).
- Platform: [MDN animation-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline), [caniuse animation-timeline](https://caniuse.com/mdn-css_properties_animation-timeline), [WebKit Features in Safari 26.0](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/), [WebKit scroll-driven guide](https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/), [MDN Firefox 159 release notes](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/159), [Chrome scroll-driven animations](https://developer.chrome.com/docs/css-ui/scroll-driven-animations), [MDN interpolate-size](https://developer.mozilla.org/en-US/docs/Web/CSS/interpolate-size), [caniuse interpolate-size](https://caniuse.com/mdn-css_properties_interpolate-size), [MDN @starting-style](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style), [caniuse @starting-style](https://caniuse.com/mdn-css_at-rules_starting-style), [MDN ::details-content](https://developer.mozilla.org/en-US/docs/Web/CSS/::details-content), [caniuse ::details-content](https://caniuse.com/mdn-css_selectors_details-content), [MDN View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API), [caniuse view-transitions](https://caniuse.com/view-transitions), [caniuse @view-transition](https://caniuse.com/mdn-css_at-rules_view-transition), [MDN Element.animate](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate), [caniuse Web Animations](https://caniuse.com/web-animation).
- Astro: [client-side scripts](https://docs.astro.build/en/guides/client-side-scripts/), [view transitions / ClientRouter](https://docs.astro.build/en/guides/view-transitions/), [upgrade to v7](https://docs.astro.build/en/guides/upgrade-to/v7/).
- Local measurements: esbuild 0.x bundles of `motion@14.6.0`, `gsap@3.15.0`, `animejs@4.5.0`, `lenis@1.3.27`, `@formkit/auto-animate@0.10.0` in `C:\Users\Alp\AppData\Local\Temp\claude\C--Users-Alp-Documents-Projekt-Leaf-LandingPage\2b0e7937-10c9-4435-813f-02796ae2bfa1\scratchpad\sizes` (entries in `entries/`, outputs in `out/`).
