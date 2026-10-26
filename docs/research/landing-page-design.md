# Landing-page design research for the Leaf page

Researched 2026-10-26. Scope: what published UX research, standards, and well-regarded B2B product sites say about product landing pages, applied to the Leaf page (loan management system for banks, goal = book a 45-minute live demo).

Source quality legend: **[primary]** = first-party research/standard/live page. **[secondary]** = a third party quoting a primary source I could not open. **[unverified]** = could not be confirmed; treat as a lead. **[vendor]** = first-party data from a company selling the thing it measures. **[judgement]** = my inference, not a citation.

Fetched exemplar sites: Linear, Stripe, Mercury, Ramp, Attio, Notion, Loom, Vercel (Resend served an `llms.txt` to the fetcher, so its rendered page is unverified).

---

## A. Recommendations for the Leaf page (prioritised)

1. **Put the product on the page. Above the fold, a real Leaf screen of the single loan record.** The headline's whole claim is "on one record"; nothing currently shows a record. Eye-tracking shows users fixate on task-relevant product images and skip decorative ones ([NN/g photos](https://www.nngroup.com/articles/photos-as-web-content/)), and 57% of viewing time is above the fold, 81% within three screenfuls ([NN/g scrolling](https://www.nngroup.com/articles/scrolling-and-attention/)). Every fetched product exemplar that sells to teams (Linear, Attio, Notion, Loom) puts product UI in or immediately after the hero. Use a static screenshot or a short silent looping clip of the record with the lifecycle timeline visible; no carousel ([NN/g carousels](https://www.nngroup.com/articles/designing-effective-carousels/)). Treatment for light UI on the dark page: see §D.

2. **Kill the two placeholder stats. Never ship invented numbers.** Fabricated or untestable claims are a credibility hazard in every trust framework ([NN/g trustworthy design](https://www.nngroup.com/articles/trustworthy-design/), [Stanford credibility guidelines](https://credibility.stanford.edu/guidelines/index.html)), and small/weak social-proof numbers actively backfire ([NN/g social proof](https://www.nngroup.com/articles/social-proof-ux/)). Keep "25% less time per loan" only if it is a measured pilot figure and you can say where it came from ("measured across N loans at [bank], Q3 2026"). Replace the other two tiles with **verifiable capability facts** that function as proof for a compliance buyer: e.g. "Every approval stored with approver, limit and timestamp", "Full loan history exportable for audit", "Role-based limits per product". When you have a real customer, swap back to outcome numbers.

3. **Add a credibility strip directly under the hero, built from what iA actually has.** With few customers, lean on the other three trust factors NN/g identifies: design quality, upfront disclosure, and comprehensive/correct content ([NN/g](https://www.nngroup.com/articles/trustworthy-design/)); and Stanford's "prove the organization is real" and "put real people forward". Concretely: "Built by iA (Inter Adria), Prishtina, since [year]" with a link, the named pilot/launch bank if permitted, a named product lead with photo, hosting/data-residency statement, and standards you can truthfully claim (ISO 27001, CBK reporting formats, etc.). Do not use third-party security seals unless a real audit backs them; Baymard shows seals trade on brand recognition, not technical meaning ([Baymard site seals](https://baymard.com/blog/site-seal-trust)).

4. **Reorder the page** so value, proof and product land in the first three screenfuls, objections are handled before the ask, and the CTA repeats:
   `Nav → Hero (headline + lede + "Book a 45-minute demo" + product screenshot) → Credibility strip → Lifecycle (6 steps, each with a screenshot, tabs on desktop / accordion on mobile) → Controls & compliance (approval limits, audit trail, roles; add integrations: core banking, credit bureau, document store) → Borrowers → Proof (pilot result or named quote) → "What the demo covers" + form → FAQ (implementation time, hosting, integration, pricing model) → Footer (address, company registration, contact)`.
   Rationale: B2B buyers need integration/compliance detail and a sense of price before they contact sales ([NN/g B2B vs B2C](https://www.nngroup.com/articles/b2b-vs-b2c/)); hidden pricing and "contact us for basics" erode trust ([NN/g](https://www.nngroup.com/articles/trustworthy-design/)); 67% of B2B buyers prefer a rep-free experience ([Gartner, Mar 2026 press release](https://www.gartner.com/en/newsroom/press-releases/2026-03-09-gartner-sales-survey-finds-67-percent-of-b2b-buyers-prefer-a-rep-free-experience), title and sample verified via search snippet; body returned 403).

5. **Sharpen the hero copy.** Current h1 "From application to collection, on one record." is outcome-oriented but does not say what Leaf *is*. NN/g: headlines must stand alone, be specific, front-loaded, no cleverness ([NN/g microcontent](https://www.nngroup.com/articles/microcontent-how-to-write-headlines-page-titles-and-subject-lines/)); MECLABS-family tests repeatedly find plain clarity beats clever persuasion ([MarketingSherpa](https://sherpablog.marketingsherpa.com/website-and-landing-page-design/clarity-trumps-persuasion-on-landing-pages/), [NextAfter test, +44.7%](https://www.nextafter.com/?p=13619)). Candidates:
   - "The loan management system banks run from application to collection."
   - "Every loan, every step, one record." + lede that names the category.
   - Keep current h1, change lede to: "Leaf is a loan management system for banks. Application, scoring, approval, disbursement, monitoring and collection on one record, with the audit trail your regulator expects."
   Primary CTA: **"Book a 45-minute demo"** (specific, sincere, substantial, succinct per [NN/g 4S](https://www.nngroup.com/articles/better-link-labels/)). Secondary: "See the product" anchored to the lifecycle section, not "How it works"/"Learn more".

6. **Fix the dark-theme legibility problems** (details in §E). Body copy in a light (300) weight on #0a0a0b will fail practical contrast even when the hex passes: WCAG warns thin strokes render fainter than their nominal colour ([WCAG 1.4.3 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)); NN/g's literature review finds light-on-dark reads worse for normal vision, especially small text ([NN/g dark mode](https://www.nngroup.com/articles/dark-mode/)). Use weight 400 for anything under ~32px, 300 only for display sizes; off-white (#ededed-ish) not #fff; secondary text no darker than ~#9a9a9a on #0a0a0b. The accent #c8463f on #0a0a0b computes to ~4.1:1 (my calculation, verify with a checker): OK for large text and UI edges (3:1), **fails 4.5:1 for small red text or red links**. White on the red button is ~4.8:1, fine.

7. **Keep the form at 3–4 single-line fields, drop or free-text the role dropdown, and tell people what happens next.** HubSpot's 40k-page analysis: single-line text fields barely dent conversion; dropdowns and textareas do ([HubSpot](https://blog.hubspot.com/blog/tabid/6307/bid/6746/which-types-of-form-fields-lower-landing-page-conversions.aspx)). Add under the button: "45 minutes, on a live Leaf instance, with the product lead. We reply within one business day. No marketing emails." ([NN/g form guidelines](https://www.nngroup.com/articles/web-form-design/): state expectations; [NN/g trust](https://www.nngroup.com/articles/trustworthy-design/): upfront disclosure). On submit, offer an instant calendar slot: Chili Piper's 4M-submission dataset reports 66.7% of qualified submissions booking when scheduling is instant vs a ~30% baseline ([Chili Piper](https://www.chilipiper.com/post/form-conversion-rate-benchmark-report), **[vendor]**).

8. **Repeat the CTA** at hero, after Lifecycle, after Proof, and in the closing block (every exemplar repeats; Stripe, Linear, Attio, Mercury, Ramp all close with a CTA block). On mobile add a small, opaque, partially-persistent bottom bar "Book a demo" that appears once the hero scrolls out ([NN/g sticky headers](https://www.nngroup.com/articles/sticky-headers/) on keeping persistent chrome small and opaque).

9. **Make the lifecycle accordion a tab strip on desktop and jump-link accordion on mobile**, with one screenshot per step and the step's role label. NN/g: accordions work as a mini-IA on mobile, but keep headings sticky/persistent and avoid disorienting scroll on expand ([NN/g mobile accordions](https://www.nngroup.com/articles/mobile-accordions/)); on desktop they hide content users came for ([NN/g low-contrast article aside](https://www.nngroup.com/articles/low-contrast/)).

10. **Add an FAQ/objections block** before the footer (implementation time, hosting on-prem vs cloud, integrations, data migration, pricing model e.g. "per active loan, annual licence"). NN/g: B2B sites should show at least representative pricing/ranges and compatibility details; missing integration info is "a major pain point" ([NN/g B2B](https://www.nngroup.com/articles/b2b-vs-b2c/)).

11. **Motion: restraint.** Scroll-reveal everything is decorative; NN/g: give every animation a job and keep durations 100–500 ms ([NN/g animation duration](https://www.nngroup.com/articles/animation-duration/), [NN/g animation purpose](https://www.nngroup.com/articles/animation-purpose-ux/)). Use one subtle hero entrance (200–300 ms), accordion/tab transitions (150–250 ms), and honour `prefers-reduced-motion` ([WCAG 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)).

12. **Consider a light "paper" section** (off-white background) for Proof + Demo form, or a full light variant via `prefers-color-scheme`. **[judgement]** Among the fetched finance-adjacent sites, Stripe, Mercury and Ramp are light; the dark ones (Linear, Vercel) sell to engineers. NN/g recommends honouring the OS colour-scheme preference ([NN/g dark mode](https://www.nngroup.com/articles/dark-mode/)).

---

## B. Q1: Structure and narrative

**What the attention data says**
- 57% of page-viewing time is above the fold; 74% in the first two screenfuls; 81% in the first three; "the closer a piece of information is to the top of the page, the higher the chance that it will be read." 130k fixations, 120 participants, 2018. [NN/g Scrolling and Attention](https://www.nngroup.com/articles/scrolling-and-attention/) **[primary]**
- The 100 px just above the fold are viewed 102% more than the 100 px just below. Users scroll "when there is reason to", so the top must preview what follows. Avoid "false floors". [NN/g Page Fold Manifesto](https://www.nngroup.com/articles/page-fold-manifesto/) **[primary]**
- Illusion of completeness: in one test "six out of eight users did not realize they could scroll down". Fix: don't make the hero full-screen; let the next section peek above the fold; be careful with wide gaps and horizontal rules reading as "the end". [NN/g Illusion of Completeness](https://www.nngroup.com/articles/illusion-of-completeness/) **[primary]**. *Leaf note: lots of whitespace + hairline rules is exactly the false-floor recipe; make sure the stats/credibility strip visibly starts inside the first viewport.*

**Section order the research supports** (hero value prop → proof → how it works → objections → CTA):
- NN/g B2B: buyers need educational content, evaluation criteria, compatibility/integration/compliance details, representative pricing, and content for both "users" (daily experience, support) and "choosers" (cost, reliability, ROI). [NN/g B2B vs B2C](https://www.nngroup.com/articles/b2b-vs-b2c/) **[primary]**
- NN/g trust factors: design quality, **upfront disclosure** (costs, process, contact), comprehensive/correct/current content, connection to the rest of the web. "Asking for information before providing any value is a breach of trust." [NN/g Trustworthy Design](https://www.nngroup.com/articles/trustworthy-design/) **[primary]**
- Exemplars converge on: hero → logos/proof → product sections with screenshots → testimonials/stats → closing CTA (see §I). Mercury and Ramp add an explicit security/trust section near the end; Stripe puts a stats row ("99.999% uptime") after the product grid.

**Page length for considered B2B vs simple products**
- Unbounce 2024 benchmark (41k pages, 464M visitors; mostly paid-traffic lead-gen pages, so not a perfect proxy for a vendor homepage): all-industry median conversion 6.6%; SaaS 3.8%; financial services 8.3% (credit & lending 8.8%). Word-count sweet spots: SaaS 250–725 words, finance 195–715, professional services 275–745. Difficult words correlate −24.3% with conversion; 5th–7th-grade copy converts best in every industry (SaaS 12.9% vs 2.1% at professional level). [Unbounce overview](https://unbounce.com/conversion-benchmark-report/), [SaaS](https://unbounce.com/conversion-benchmark-report/saas-conversion-rate/), [Finance](https://unbounce.com/conversion-benchmark-report/finance-insurance-conversion-rate/), [Professional services](https://unbounce.com/conversion-benchmark-report/professional-services-conversion-rate/) **[primary]**
- NN/g on reading level for educated B2B audiences: write "several steps below" the audience's education level; ~12th grade is often right. [NN/g Legibility, Readability, Comprehension](https://www.nngroup.com/articles/legibility-readability-comprehension/) **[primary]**
- Reconciliation **[judgement]**: a 500–750-word page that is scannable, plus an FAQ and links to deeper pages, fits both datasets. Leaf's considered purchase needs the *objection content* to exist, but not all on the first screen.

**B2B buying context**
- 67% of 646 surveyed B2B buyers prefer a rep-free experience (Gartner survey Aug–Sep 2025). [Gartner press release, 2026-03-09](https://www.gartner.com/en/newsroom/press-releases/2026-03-09-gartner-sales-survey-finds-67-percent-of-b2b-buyers-prefer-a-rep-free-experience) **[primary title/sample via search snippet; body 403]**
- "17% of buying time with suppliers" and "77% say purchase was very complex" are widely attributed to Gartner but I could not open a Gartner primary. **[secondary]**
- NN/g's 2006 B2B study: B2B users succeeded 58% of the time vs 66% on consumer sites; the 3rd-edition report emphasises content for each stage and for both "users" and "choosers". [NN/g B2B usability](https://www.nngroup.com/articles/b2b-usability/), [report](https://www.nngroup.com/reports/b2b-websites-usability/) **[primary, old]**

---

## C. Q2: Hero

**Headline formulas**
- NN/g: headlines must "stand on its own", be specific and front-loaded, "no puns, and no 'cute' or 'clever' wordings"; shorter is easier to scan. [NN/g Microcontent](https://www.nngroup.com/articles/microcontent-how-to-write-headlines-page-titles-and-subject-lines/) **[primary]**
- Clarity over persuasion (MECLABS maxim). Tests: plain CTA headline "Get the Guide" beat a value-prop headline by 44.7% (99.5% confidence); a clear travel-insurance page produced 330% more conversions. [NextAfter](https://www.nextafter.com/?p=13619), [MarketingSherpa](https://sherpablog.marketingsherpa.com/website-and-landing-page-design/clarity-trumps-persuasion-on-landing-pages/) **[primary single tests, not meta-analysis]**
- What exemplars do: category-plus-audience (Linear "The product development system for teams and agents"; Stripe "Financial infrastructure to grow your revenue"), or short outcome line with a category lede (Ramp "Time is money. Save both." + "Cards, expenses, bill payments, and banking"; Mercury "Radically different banking"). Nobody leads with a feature list. **[primary, live pages]**
- Implication for Leaf: benefit headline is fine *if* the lede names the category and buyer ("loan management system for banks") in the first sentence. A headline alone that could describe a CRM or a spreadsheet fails the "stand on its own" test.

**Sub-headline role**: carry the category, the scope (six lifecycle stages), and the one differentiator (single record + audit trail). Keep ≤ 2 sentences; Unbounce's reading-level data argues for short words.

**CTA wording**
- NN/g 4S: Specific, Sincere, Substantial, Succinct. "Learn more" is the anti-pattern; a button that promises details but opens a contact form "frustrated" users. [NN/g Better Link Labels](https://www.nngroup.com/articles/better-link-labels/) **[primary]**
- "Book a 45-minute demo" / "Book a live demo" satisfies all four; "See it in action" is less sincere unless it literally plays a demo. Exemplars use "Request a demo" (Notion), "Send me a demo"/"Talk to sales" (Attio), "See a demo"/"View Demo" (Ramp), "Launch demo" (Mercury, an interactive sandbox), "Contact sales" (Stripe, Linear). **[primary, live pages]**

**Single vs dual CTA**
- No primary research isolating one vs two CTAs was found; Unbounce's industry pages give no CTA-count data. **[unverified]** Claims that "one link converts better" circulate from older Unbounce reports but I could not open them.
- Exemplar practice: most have one primary + one secondary (Notion "Get Notion free" + "Request a demo"; Vercel "Deploy now" + "Talk to sales"; Loom single "Get Loom for free"). Attio runs three. For Leaf, one primary (demo) + one in-page secondary (see product) is consistent with practice and with NN/g's "reason to scroll".

**Product visual in the hero**
- Eye-tracking: users fixate on images that carry task-relevant information (product photos, real staff) and skip filler; on Amazon only 18% of viewing time went to thumbnails, but detail-page product photos were "studied intensely". [NN/g Photos as Web Content](https://www.nngroup.com/articles/photos-as-web-content/) **[primary]**
- Carousels: users "often immediately scroll past these large images"; a static hero "is less likely to distract"; animated ad-like content is looked at only 27% of the time. [NN/g Carousels](https://www.nngroup.com/articles/designing-effective-carousels/) **[primary]**
- No controlled study found on screenshot vs abstract illustration in heroes. **[unverified]** Practice: Linear and Attio put product UI directly in/after the hero; Stripe and Ramp use logos; Mercury uses an animated background plus a separate "Launch demo". A Lazyweb roundup of 488 hero A/B tests notes headline work dominates (57%) and screenshots are tested in 9%. [Lazyweb](https://labs.lazyweb.com/research/can-i-measure-hero-media-mix-from-this-data.md) **[secondary]**

---

## D. Q3 and Q4: Social proof, trust, and showing the product

**Credibility signals (NN/g, Stanford)**
- Nielsen's four trust factors (design quality, upfront disclosure, comprehensive/correct/current content, connection to the rest of the web) held across cultures and 20+ years. "People trust testimonials from external sites more than those listed on the website itself." Avoid typos, vague labels, hidden pricing, login walls, asking for too much too soon, and self-published-only testimonials. [NN/g Trustworthy Design](https://www.nngroup.com/articles/trustworthy-design/) **[primary]**
- Stanford's 10 guidelines: enable fact-checking; prove the organisation is real (address, photos); showcase expertise; put real people forward; easy contact; suitable visual design; usable; current; restrained promotion; no mistakes. [Stanford Web Credibility](https://credibility.stanford.edu/guidelines/index.html) **[primary]**
- Aesthetic-usability effect: attractive design is perceived as more usable and buys patience for minor issues, but "at its strongest when the aesthetics support and enhance the content". [NN/g](https://www.nngroup.com/articles/aesthetic-usability-effect/) **[primary]**

**Social proof mechanics**
- Large adoption numbers reduce uncertainty; **low numbers backfire** (a participant judged an article unpopular because of few shares); named, familiar people are stronger than anonymous approval; social widgets slow pages. [NN/g Social Proof](https://www.nngroup.com/articles/social-proof-ux/) **[primary]**
- Security seals: users choose by brand recognition (Norton 36%, McAfee 23% in a 2013 Baymard survey); perceived security beats technical security. [Baymard](https://baymard.com/blog/site-seal-trust) **[primary, e-commerce]** For a bank vendor the analogue is real audits/standards named in text, not badges.

**What to do with few customers (Leaf)**
- Substitute verifiable facts for outcome stats (see rec. 2); use a named pilot bank and a named iA person; show a real address/registration in the footer (Stanford #2, #5); put the product itself on the page as proof (NN/g: "photos of the actual service process", content images get fixations).
- If one customer quote exists, use name + role + bank + a concrete number or situation; exemplars all attribute quotes (Mercury: "Karri Saarinen, Founder, Linear"; Notion: "Michael Truell, Cursor"; Attio: "Margaret Shen, Head of Business Operations, Modal").
- Stats bands in exemplars mix scale and reliability facts: Stripe "99.999% historical uptime", "$1.9T volume"; Mercury "$20B+ monthly volume", "Up to $5M FDIC insurance"; Attio "2.6B API requests/month". Reliability/compliance facts are usable before you have scale.

**Screenshot vs video vs interactive demo vs illustration**
- Video: "no guarantee that someone will watch"; show length and topic; no autoplay with sound; include transcript and keep essential info as text. [NN/g Video Usability](https://www.nngroup.com/articles/video-usability/) **[primary]**
- A silent autoplaying UI loop is treated by users like an animated image; NN/g's carousel data says ad-like animation is ignored, so keep it plainly a product screen, not a motion-graphics piece. **[judgement from the above]**
- Interactive demos (Mercury "Launch demo", Ramp "View Demo") appear on the fetched finance sites; no independent effectiveness data found. **[unverified]**
- Illustration: no evidence it outperforms UI for software; NN/g's data on filler imagery argues against it.

**Presenting light enterprise UI on a dark page**
- Material and web.dev dark-theme guidance: avoid pure white on dark (it "vibrates"), desaturate images/accents, use lighter surfaces for elevation. [web.dev prefers-color-scheme](https://web.dev/articles/prefers-color-scheme), [Material dark-theme codelab](https://codelabs.developers.google.com/codelabs/design-material-darktheme/) **[primary]**
- Practical pattern **[judgement, consistent with the above and with Linear's dark-on-dark screenshots]**: frame the light screenshot in a 1px #2a2a2a border with 12–16 px radius, a soft large-blur shadow, and either (a) a slightly dimmed screenshot (brightness 0.92–0.95, `filter: grayscale(10–20%)`), or (b) a dark-chrome variant of Leaf if a dark theme exists. Keep the screenshot's own type at ≥ 13 px rendered so it is legible, not a texture.

---

## E. Q5: Dark, minimal aesthetic

**Readability research**
- NN/g literature review: with normal vision "light mode won across all dimensions" in Piepenbrock et al. 2013; smaller fonts suffer more in dark mode; at night light mode still performed better for small text (Dobres 2017). Dark mode helps some low-vision users (cataracts). Recommendation: offer dark as an option via the OS API, not as the only mode. [NN/g Dark Mode](https://www.nngroup.com/articles/dark-mode/) **[primary review]**
- Low-contrast text is "illegible, undiscoverable, and inaccessible", worst on mobile in glare; reduce prominence via density/size/position instead. [NN/g Low-Contrast Text](https://www.nngroup.com/articles/low-contrast/) **[primary]**

**WCAG 2.2 numbers**
- 1.4.3 (AA): 4.5:1 for text; 3:1 for large text (≥ 24 px regular or ≥ ~18.7 px bold). Thresholds are exact ("4.499:1 would not meet"). Explicit warning: fonts with "extraordinarily thin strokes" render fainter than their nominal colour; pick thicker strokes or exceed the minimum. [Understanding 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) **[primary]**
- 1.4.6 (AAA): 7:1. **[primary]**
- 1.4.11 (AA): 3:1 for UI component boundaries/states and meaningful graphics; decorative dividers exempt; thin lines antialias fainter, so avoid very thin lines or exceed the ratio. [Understanding 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) **[primary]** *Leaf: hairline section rules are fine if decorative; input borders and the accordion chevrons are not.*

**Dark-theme colour guidance**
- Material: base surface #121212; text opacities 87% / 60% / 38% (high/medium/disabled); pure white and saturated colours "vibrate". [Material codelab](https://codelabs.developers.google.com/codelabs/design-material-darktheme/) **[primary]**
- web.dev: use rgb(250,250,250)-ish instead of #fff; halve brand saturation in dark; keep ~40–50 lightness points between text and surface. [web.dev prefers-color-scheme](https://web.dev/articles/prefers-color-scheme), [web.dev building a color scheme](https://web.dev/articles/building/a-color-scheme) **[primary]**

**Applied to Leaf's palette** (my WCAG-formula calculations; verify with a checker)
- #fff on #0a0a0b ≈ 19.8:1; #ededed ≈ 17:1; #a3a3a3 ≈ 7.9:1; #8a8a8a ≈ 5.8:1; #6b6b6b ≈ 3.6:1 (**fails** body text).
- Accent #c8463f on #0a0a0b ≈ 4.1:1: passes 3:1 (large text, borders, icons), **fails 4.5:1** for small red text/links. White on #c8463f ≈ 4.8:1: button passes AA.
- Outfit 300 at 16–18 px is the "thin stroke" case WCAG warns about. Use 400 for body, 500 for labels, 300 only ≥ 32 px display. Refactoring UI makes the same point: weights under 400 "are too hard to read at smaller sizes"; de-emphasise with colour or size, not weight. [Refactoring UI, "7 practical tips"](https://medium.com/refactoring-ui/7-practical-tips-for-cheating-at-design-40c736799886) **[secondary; page returned 403, quoted via search summary]**

**When dark minimal reads "crypto/dev-tool" vs "bank vendor"** **[judgement; no primary study found]**
- Observation from fetched pages: dark = Linear, Vercel (dev/product tooling); light = Stripe, Mercury, Ramp (money). Mercury and Ramp also carry explicit regulatory disclosure blocks (FDIC partner banks, "not a bank") and a security section; that *content*, more than the palette, is what reads "financial".
- NN/g trust factors are palette-agnostic; what hurts trust is low information density, hidden process/pricing, and missing real-world anchors. A dark Leaf page can read as a serious vendor if it has: real product screens, named people/company facts, compliance/audit specifics, and legible type at ≥ 4.5:1. Without those, dark + thin + whitespace reads as a template.

---

## F. Q6: Demo-request form

**Field count**
- HubSpot, 40k+ landing pages: conversion falls as fields increase but "not as steeply as expected"; multiple textareas have "a powerful depressing effect"; multiple dropdowns lower conversion; extra single-line text fields cause "very little decrease". [HubSpot](https://blog.hubspot.com/blog/tabid/6307/bid/6746/which-types-of-form-fields-lower-landing-page-conversions.aspx) **[primary analysis, charts only]**
- Baymard (checkout): field count "impacts overall usability far more than the number of steps"; most sites need 8 fields where the average has 11.3; 17% abandoned over complexity. [Baymard](https://baymard.com/blog/checkout-flow-average-form-fields) **[primary, e-commerce]**
- CXL's "should you really reduce form fields?" argues fewer fields is not universally better (lead quality); page returned 403. [CXL](https://cxl.com/blog/reduce-form-fields/) **[unverified]** The often-quoted Expedia "$12M from removing Company name" is **[unverified]**.
- Unbounce "3 fields 10.1% vs 9 fields 3.6%" circulates from a 2026 report I could not open. **[secondary/unverified]**
- Leaf: name, bank, role, work email = 4 single-line fields, which HubSpot's data says is fine. Make role optional or free text (dropdowns hurt); consider replacing "bank" with the email domain and asking bank name on the booking step.

**Form design (NN/g)**
- Remove fields that can be derived, collected later, or omitted; 1–2 optional fields max, labelled optional; single column; labels above fields on mobile; no placeholder-only labels; state format requirements up front; specific, visible errors; no Reset. [NN/g Web Form Design](https://www.nngroup.com/articles/web-form-design/) **[primary]**

**Placement**: inline on the page (Mercury, Ramp put an email capture in the hero; Linear/Stripe link to sales pages). No primary research on inline vs modal vs separate page for demo forms found. **[unverified]** Given NN/g's attention data, inline with a hero CTA that scrolls to it is the lowest-friction verified option.

**Friction reducers**: upfront disclosure of what happens next, time commitment and who you meet ([NN/g trust](https://www.nngroup.com/articles/trustworthy-design/)); set expectations the label will immediately meet ([NN/g 4S](https://www.nngroup.com/articles/better-link-labels/)); plain privacy line (Ramp shows an AI/privacy disclosure next to its form; Mercury shows an opt-out checkbox).

**Calendar scheduler vs form** **[vendor data]**
- Chili Piper, ~4M submissions (2024): 14.1% of fills disqualified; 66.7% of qualified fills booked a meeting with instant scheduling vs an "industry average of just 30%"; live-call option 69.2%; only 8% of top B2B SaaS sites offer scheduling at form fill; removing a "double form fill" raised conversion ~50% for some customers. [Chili Piper](https://www.chilipiper.com/post/form-conversion-rate-benchmark-report) **[vendor]**
- Recommendation: short form first (qualifies the lead, captures the email even if they abandon the calendar), then an embedded slot picker on the success state. Mark booking confirmation and the "what to prepare: nothing" line.

**Speed**: a 31% LCP improvement produced +8% sales and +15% lead-to-visit in a Vodafone A/B test. [web.dev case study](https://web.dev/case-studies/vodafone) **[primary]** Astro static output is already good; keep the hero screenshot sized/preloaded.

---

## G. Q7: Typography, spacing, rhythm, motion

**Type**
- Line length: 50–75 characters per line; WCAG 1.4.8 (AAA) caps at 80; implement with `max-width: ~70ch`. [Baymard Line Length](https://baymard.com/blog/line-length-readability) **[primary]** *Leaf lede and lifecycle body: enforce `max-width: 60–65ch`.*
- Contrast and weight: see §E. NN/g legibility: "reasonably large default font size", "high contrast between characters and background", plain background. [NN/g](https://www.nngroup.com/articles/legibility-readability-comprehension/) **[primary]**
- Refactoring UI (secondary): hierarchy via size + colour + weight; normal 400/500, emphasis 600/700; "don't use grey text on colored backgrounds", pick a tint of the background hue with reduced contrast instead; "start with too much white space, then remove". **[secondary]**
- Practical scale **[judgement]**: body 17–18 px/1.6; small 14–15 px (≥ 4.5:1 only); h2 32–40 px; hero h1 48–72 px with clamp(). Keep hero h1 ≤ 3 lines on mobile.

**Spacing and rhythm**: NN/g's false-floor warnings mean section gaps should not exceed roughly one viewport-quarter and rules should not look like page ends; keep a visible next-section heading within the first viewport. **[judgement from NN/g primary]**

**Motion**
- NN/g: 100–500 ms, most 100–400; ~100 ms for toggles, 200–300 ms for modals, >500 ms "a real drag"; entrances slightly longer than exits; "far more common for animations to be too long than too short". [NN/g Animation Duration](https://www.nngroup.com/articles/animation-duration/) **[primary]**
- NN/g: every animation needs a job (feedback, state change, orientation, signifier); "surface-level delight ... quickly sours"; stacked simultaneous animations cancel each other. [NN/g Animation for Attention and Comprehension](https://www.nngroup.com/articles/animation-purpose-ux/) **[primary]**
- Material 3 tokens: short 50–200 ms, medium 250–400, long 450–600, extra-long 700–1000; standard/emphasized easing `cubic-bezier(0.2, 0, 0, 1)`, emphasized-decelerate `cubic-bezier(0.05, 0.7, 0.1, 1)`. [material-web token source](https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-sys-motion.scss) **[primary]**
- Apple HIG Motion: "Add motion purposefully", "Don't add motion for the sake of adding motion. Gratuitous or excessive animation can distract people", honour Reduce Motion by minimising/eliminating animation. [Apple HIG Motion](https://developer.apple.com/design/human-interface-guidelines/motion) **[primary; page is JS-rendered, lines quoted via search snippet]**
- WCAG 2.3.3 (AAA): interaction-triggered motion must be disableable; `prefers-reduced-motion` is a sufficient technique. [Understanding 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) **[primary]**
- Leaf budget **[judgement]**: hero text/screenshot fade-up 250–300 ms once; tab/accordion content 150–200 ms; hover 100 ms; no parallax; no per-section scroll reveals beyond a single opacity fade ≤ 200 ms; all gated by `@media (prefers-reduced-motion: reduce)`.

---

## H. Q8: Mobile

- Unbounce: ~83% of landing-page visits are mobile; desktop converts 8% better overall, 40% better in professional services, but finance pages convert *better* on mobile (11.5% vs 9%). [Unbounce overview](https://unbounce.com/conversion-benchmark-report/), [Professional services](https://unbounce.com/conversion-benchmark-report/professional-services-conversion-rate/), [Finance](https://unbounce.com/conversion-benchmark-report/finance-insurance-conversion-rate/) **[primary]**
- Tap targets: WCAG 2.5.8 (AA) ≥ 24×24 CSS px with spacing exceptions; 2.5.5 (AAA) ≥ 44×44. [2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [2.5.5](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html) **[primary]** NN/g: ≥ 1 cm × 1 cm physical, ~2 mm spacing, larger for primary CTAs. [NN/g Touch Targets](https://www.nngroup.com/articles/touch-target-size/) **[primary]** *Leaf: accordion headers and the demo button should be ≥ 44 px tall; the "How it works" text link needs padding.*
- Accordions on mobile: good as a mini table of contents; keep headings persistent/sticky, treat as jump links, don't scroll the page disorientingly on expand, avoid unfamiliar control labels; expanding the first item by default hid page structure in testing. [NN/g Accordions on Mobile](https://www.nngroup.com/articles/mobile-accordions/) **[primary]**
- Sticky/persistent chrome: keeps CTAs reachable but costs space; keep it small, opaque, high-contrast, no drifting animation; partially-persistent (reappears on scroll-up) suits mobile, slide-in ~300–400 ms. [NN/g Sticky Headers](https://www.nngroup.com/articles/sticky-headers/) **[primary]** No NN/g research on sticky CTAs specifically; vendor A/B tests report lifts (+55% clicks, +16% CR) but are single-site e-commerce results. [Speero discussion](https://speero.com/post/are-sticky-ctas-really-that-sticky-that-was-the-next-question-tacked-in-our-series-it-depends) **[secondary]**
- Dark mode on mobile in sunlight: NN/g's low-contrast and dark-mode articles both flag glare; another reason for ≥ 4.5:1 and weight 400.

---

## I. Exemplar pages (fetched 2026-10-26, text extraction; visual details where the text made them explicit)

| Site | Theme | Hero | Proof placement | Product shown | CTA pattern |
|---|---|---|---|---|---|
| [Linear](https://linear.app/) | dark | "The product development system for teams and agents" + 2-line lede | Logo grid immediately under hero; later testimonials (OpenAI, Ramp, Opendoor) + "over 40,000 product teams" | Two product images right after hero text; each of 4 feature sections has a screenshot | Nav "Sign up"; closing block with 4 buttons incl. "Contact sales" |
| [Stripe](https://stripe.com/) | light | "Financial infrastructure to grow your revenue." + lede | Logos in hero; stats row (135+ currencies, $1.9T, 99.999% uptime); enterprise case studies with metrics | Bento product cards, mock billing visual | "Get started" + "Sign up with Google"; nav "Contact sales"; closing "Ready to get started?" + "See what you'll pay" |
| [Mercury](https://mercury.com/) | light | "Radically different banking" + "Apply online in 10 minutes" | Named testimonials (Founder, Linear etc.); stats band; **security section** ($5M FDIC, passkeys, approval controls); press logos; regulatory disclaimers | "Launch demo" interactive demo; illustrated feature cards | Email + "Open account" in hero, ~6 repeats; "Contact sales" at bottom |
| [Ramp](https://ramp.com/) | light | "Time is money. Save both." + one-line lede | "Join 85,000 companies..." under hero; logo strip with "$1M+ saved"; named testimonials; wall of ~15 quotes | "View Demo" repeated; video | Email + "Get started for free"; nav "See a demo"; trust.ramp.com link; FDIC disclosures |
| [Attio](https://attio.com/) | light | "Welcome to agentic revenue." + lede | Logos directly under hero CTAs; scale metrics; "Trusted by 30,000+"; case study "83% faster lead triage" | Product demo panel in hero; 5-tab walkthrough with UI mockups | 3 CTAs: "Start for free", "Talk to sales", "Send me a demo"; repeated at close |
| [Notion](https://www.notion.com/) | light | "Where teams and agents Think together." + lede | Logo strip directly below hero; named testimonials; stats band (62% of Fortune 100) | Animated hero visual; 3 feature blocks with screenshots | "Get Notion free" + "Request a demo" |
| [Loom](https://www.loom.com/) | light | "One video is worth a thousand words" | "Millions of people across 400,000 companies" + ~27 logos directly under hero | Video-player mockup section | Single "Get Loom for free", repeated at close |
| [Vercel](https://vercel.com/) | dark (unverified from text) | "Agentic Infrastructure." + 3 bullets | One-line customer stats inside each feature section (Notion, Zapier, Mintlify) | Not evident in text | "Deploy now" + "Talk to sales" |
| Resend | — | **unverified** (server returned llms.txt) | — | — | — |

Pattern across all: hero (headline + 1–2 sentence lede + 1–2 CTAs) → proof within the first scroll → product shown concretely → named testimonials/metrics → closing CTA block. Finance exemplars (Stripe, Mercury, Ramp) add reliability stats and an explicit security/regulatory section; Mercury's section headings ("Standard protection stops short. Mercury goes further.") are a good model for a Leaf "Controls & compliance" section.

---

## J. Sources that could not be opened

- NN/g `accordions-on-mobile`, `website-forms-usability` (404; replaced by the working slugs above).
- CXL social proof and form-field articles (403). Material 2/3 motion and dark-theme pages, Apple HIG motion/typography (JS-rendered; tokens taken from the material-web source file, HIG lines from search snippets). Gartner press-release body (403). Refactoring UI Medium post (403). Unbounce "financial-services" and "business-services" slugs (404; correct slugs used).
